// Dev endpoints
// export const morph_endpoint = 'https://dev.pyaar.ai/morph';
// export const morph_upload_endpoint = 'http://173.255.217.39:8001/morph/upload';
// export const morph_status_endpoint = 'https://dev.pyaar.ai/morph/status';
// export const morph_status_webpage = 'https://dev.pyaar.ai/mymorph';
// export const mymorphs_endpoint = 'https://dev.pyaar.ai/morph/mymorphs';
// export const morph_user_endpoint = 'https://dev.pyaar.ai/morph/user_data';
// export const morph_exchange_authcode_endpoint = 'https://dev.pyaar.ai/morph/exchange_auth_code';
// export const morph_delete_account_endpoint = 'https://dev.pyaar.ai/morph/delete_account';
// export const morph_refresh_token_endpoint = 'https://dev.pyaar.ai/morph/refresh_token';

// Prod endpoints
export const morph_endpoint = 'https://pyaar.ai/morph'
export const morph_upload_endpoint = 'https://pyaar.ai/morph/upload'
export const morph_status_endpoint = 'https://pyaar.ai/morph/status';
export const morph_status_webpage = 'https://pyaar.ai/facemorphs';
export const mymorphs_endpoint = 'https://pyaar.ai/morph/mymorphs';
export const morph_user_endpoint = 'https://pyaar.ai/morph/user_data';
export const morph_exchange_authcode_endpoint = 'https://pyaar.ai/morph/exchange_auth_code';
export const morph_delete_account_endpoint = 'https://pyaar.ai/morph/delete_account';
export const morph_refresh_token_endpoint = 'https://pyaar.ai/morph/refresh_token';

export const ID_TOKEN_KEY = 'id_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const QUALITY_PRESETS = [
  { label: 'Fast', stepSize: 20 },
  { label: 'Standard', stepSize: 10 },
  { label: 'Smooth', stepSize: 5 },
];

export const SPEED_PRESETS = [
  { label: 'Slow', duration: 400 },
  { label: 'Normal', duration: 250 },
  { label: 'Fast', duration: 125 },
];

export const DEFAULT_MORPH_SETTINGS = {
  quality: 'Standard',
  speed: 'Normal',
};
