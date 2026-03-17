import { NextRequest, NextResponse } from 'next/server';

type LiveContextResponse = {
  source: 'open-meteo' | 'fallback';
  city: string;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  current: {
    temperatureC: number;
    humidityPct: number;
    windKph: number;
    precipitationMm: number;
    weatherCode: number;
    observedAt: string;
  };
  operationsNote: string;
};

const CITY_COORDS: Record<string, { latitude: number; longitude: number }> = {
  Indore: { latitude: 22.7196, longitude: 75.8577 },
  Bhopal: { latitude: 23.2599, longitude: 77.4126 },
  Ujjain: { latitude: 23.1765, longitude: 75.7885 },
};

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function getOpsNote(payload: LiveContextResponse['current']) {
  if (payload.precipitationMm > 2) {
    return 'Rain conditions may slow ambulance movement. Keep alternate route plans active.';
  }
  if (payload.temperatureC >= 36) {
    return 'High temperature alert: verify cooling and hydration readiness in triage and transit teams.';
  }
  if (payload.windKph >= 28) {
    return 'Strong wind expected: review field transfer risk and keep backup ambulance assignment ready.';
  }
  return 'Conditions are stable for routine emergency transfer operations.';
}

async function geocodeCity(city: string) {
  const fallback = CITY_COORDS[city] || CITY_COORDS.Indore;

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as {
      results?: Array<{ latitude?: number; longitude?: number }>;
    };

    const top = payload.results?.[0];
    if (!top) {
      return fallback;
    }

    return {
      latitude: toNumber(top.latitude, fallback.latitude),
      longitude: toNumber(top.longitude, fallback.longitude),
    };
  } catch {
    return fallback;
  }
}

function buildFallback(city: string, latitude: number, longitude: number): LiveContextResponse {
  const current: LiveContextResponse['current'] = {
    temperatureC: 31,
    humidityPct: 56,
    windKph: 14,
    precipitationMm: 0,
    weatherCode: 1,
    observedAt: new Date().toISOString(),
  };

  return {
    source: 'fallback',
    city,
    location: {
      latitude,
      longitude,
      timezone: 'Asia/Kolkata',
    },
    current,
    operationsNote: getOpsNote(current),
  };
}

export async function GET(request: NextRequest) {
  try {
    const city = request.nextUrl.searchParams.get('city') || 'Indore';
    const { latitude, longitude } = await geocodeCity(city);

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=auto`;
    const response = await fetch(weatherUrl, { cache: 'no-store' });

    if (!response.ok) {
      return NextResponse.json(buildFallback(city, latitude, longitude));
    }

    const payload = (await response.json()) as {
      timezone?: string;
      current?: {
        time?: string;
        temperature_2m?: number;
        relative_humidity_2m?: number;
        precipitation?: number;
        wind_speed_10m?: number;
        weather_code?: number;
      };
    };

    const current: LiveContextResponse['current'] = {
      temperatureC: toNumber(payload.current?.temperature_2m, 30),
      humidityPct: toNumber(payload.current?.relative_humidity_2m, 55),
      precipitationMm: toNumber(payload.current?.precipitation, 0),
      windKph: toNumber(payload.current?.wind_speed_10m, 12),
      weatherCode: toNumber(payload.current?.weather_code, 1),
      observedAt: payload.current?.time || new Date().toISOString(),
    };

    const result: LiveContextResponse = {
      source: 'open-meteo',
      city,
      location: {
        latitude,
        longitude,
        timezone: payload.timezone || 'Asia/Kolkata',
      },
      current,
      operationsNote: getOpsNote(current),
    };

    return NextResponse.json(result);
  } catch {
    const city = request.nextUrl.searchParams.get('city') || 'Indore';
    const fallbackCoords = CITY_COORDS[city] || CITY_COORDS.Indore;
    return NextResponse.json(buildFallback(city, fallbackCoords.latitude, fallbackCoords.longitude));
  }
}
