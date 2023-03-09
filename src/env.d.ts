declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NG_APP_ENV: string;
    readonly NG_APP_COUNTRY_SERVICE_URL: string;
    readonly NG_APP_CAL_ENGINE_URL: string;
    readonly NG_APP_PMU_BASE_URL: string;
    readonly NG_APP_COUNTRY_WEB_URL: string;
    readonly NG_APP_API_KEY_1: string;
    readonly NG_APP_API_KEY_2: string;
  }
}
