export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'Stable' | 'Warning' | 'Critical';
}

export interface ResourceItem {
  total: number;
  used?: number;
  available?: number;
}

export interface ResourceStatus {
  hospital_id: string;
  icu: ResourceItem;
  ventilators: ResourceItem;
  doctors: ResourceItem;
  ambulances: ResourceItem;
  oxygen_pct: number;
  updated_at: string;
}

export interface Ambulance {
  id: string;
  code: string;
  lat: number;
  lng: number;
  status: 'Available' | 'In Transit' | 'Responding';
  updated_at: string;
}

export interface Emergency {
  id: string;
  severity: string;
  lat: number;
  lng: number;
  status: 'Active' | 'Resolved';
  created_at: string;
}

export interface Transfer {
  id: string;
  patient_code: string;
  from_hospital: string;
  to_hospital: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'IN_TRANSIT' | 'COMPLETED';
  eta_min: number;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'teal' | 'red' | 'purple';
  created_at: string;
  meta_json?: any;
}

export interface DashboardSummaryData {
  kpis: {
    activeEmergencies: number;
    ambulancesActive: number;
    icuAvailable: number;
    doctorsAvailable: number;
    oxygenAvg: number;
  };
  resources: ResourceStatus[];
  hospitals: Hospital[];
  ambulances: Ambulance[];
}
