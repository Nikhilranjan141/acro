import { supabase } from './supabase';
import { Server as ServerIO } from 'socket.io';

let simulatorInterval: NodeJS.Timeout | null = null;
let ioInstance: ServerIO | null = null;

export const setSimulatorSocket = (io: ServerIO) => {
  ioInstance = io;
};

export const startSimulator = () => {
  if (simulatorInterval) return;

  console.log('Starting MedLink Simulator loop...');

  simulatorInterval = setInterval(async () => {
    try {
      if (!ioInstance) return;

      // 1. Randomly update oxygen for a hospital
      const { data: hospitals } = await supabase.from('hospitals').select('id');
      if (hospitals && hospitals.length > 0) {
        const randomHosp = hospitals[Math.floor(Math.random() * hospitals.length)];
        // Get current stats
        const { data: currentStat } = await supabase
          .from('resource_status')
          .select('oxygen_pct, icu, ambulances')
          .eq('hospital_id', randomHosp.id)
          .single();
        
        if (currentStat) {
          // fluctuate oxygen by -2 to +2
          let newOx = Number(currentStat.oxygen_pct) + (Math.floor(Math.random() * 5) - 2);
          if (newOx > 100) newOx = 100;
          if (newOx < 0) newOx = 0;

          await supabase
            .from('resource_status')
            .update({ oxygen_pct: newOx })
            .eq('hospital_id', randomHosp.id);

          // Emit the update via socket
          ioInstance.emit('resources:update', {
            hospital_id: randomHosp.id,
            oxygen_pct: newOx,
          });
        }
      }

      // 2. Randomly jitter ambulance locations
      const { data: ambulances } = await supabase.from('ambulances').select('id, lat, lng');
      if (ambulances) {
        for (const amb of ambulances) {
          // small position jitter (approx 10-50 meters)
          const newLat = Number(amb.lat) + (Math.random() * 0.001 - 0.0005);
          const newLng = Number(amb.lng) + (Math.random() * 0.001 - 0.0005);
          
          await supabase.from('ambulances').update({ lat: newLat, lng: newLng }).eq('id', amb.id);
        }
        
        // Broadcast all ambulances
        const { data: allAmbs } = await supabase.from('ambulances').select('*');
        ioInstance.emit('ambulances:update', allAmbs);
      }

      // 3. Random Audit event occasionally (10% chance per tick)
      if (Math.random() > 0.9) {
        const severities = ['info', 'warning', 'teal'];
        const randomSev = severities[Math.floor(Math.random() * severities.length)];
        
        const { data: logEntry } = await supabase.from('audit_log').insert({
          type: 'SYSTEM',
          message: `Simulated network update ping received at ${new Date().toISOString()}`,
          severity: randomSev
        }).select().single();

        if (logEntry) {
           ioInstance.emit('activity:new', logEntry);
        }
      }

    } catch (err) {
      console.error('Simulator loop error:', err);
    }
  }, 5000); // run every 5s
};

export const stopSimulator = () => {
    if (simulatorInterval) {
        clearInterval(simulatorInterval);
        simulatorInterval = null;
        console.log('MedLink Simulator stopped.');
    }
};
