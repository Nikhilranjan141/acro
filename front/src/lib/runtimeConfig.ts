type RuntimeConfig = {
  apiBaseUrl: string;
  defaultCity: string;
  mapEmbedUrl?: string;
  mapApiToken?: string;
  routingApiToken?: string;
  aiPublicKey?: string;
};

const apiBaseUrl = import.meta.env.VITE_DASHBOARD_API_URL || 'http://localhost:3001';
const defaultCity = import.meta.env.VITE_DASHBOARD_CITY || 'Indore';

export const runtimeConfig: RuntimeConfig = {
  apiBaseUrl,
  defaultCity,
  mapEmbedUrl: import.meta.env.VITE_MAP_EMBED_URL,
  mapApiToken: import.meta.env.VITE_MAP_API_TOKEN,
  routingApiToken: import.meta.env.VITE_ROUTING_API_TOKEN,
  aiPublicKey: import.meta.env.VITE_AI_PUBLIC_KEY,
};

export const getConfiguredMapUrl = (fallbackUrl: string, city?: string) => {
  const configured = runtimeConfig.mapEmbedUrl;
  if (!configured) {
    return fallbackUrl;
  }

  if (!/^https?:\/\//i.test(configured)) {
    return fallbackUrl;
  }

  let resolvedUrl = configured;

  if (runtimeConfig.mapApiToken && resolvedUrl.includes('{token}')) {
    resolvedUrl = resolvedUrl.replace('{token}', runtimeConfig.mapApiToken);
  }

  if (city && resolvedUrl.includes('{city}')) {
    resolvedUrl = resolvedUrl.replace('{city}', encodeURIComponent(city));
  }

  return resolvedUrl;
};
