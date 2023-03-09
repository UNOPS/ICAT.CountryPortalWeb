export const environment = {
  production: true,
  baseUrlAPI: process.env.NG_APP_COUNTRY_SERVICE_URL,
  baseUrlAPIDocdownloadAPI:
    process.env.NG_APP_COUNTRY_SERVICE_URL + '/document/downloadDocument',
  baseUrlAPIDocUploadAPI:
    process.env.NG_APP_COUNTRY_SERVICE_URL + '/document/upload2',
  baseUrlAPIDocUploadAnonymousAPI:
    process.env.NG_APP_COUNTRY_SERVICE_URL + '/document/uploadFileAnonymous',
  baseUrlJsonFile: process.env.NG_APP_CAL_ENGINE_URL + '/filename',
  baseUrlMac: process.env.NG_APP_CAL_ENGINE_URL + '/mac',
  baseUrlExcelUpload:
    process.env.NG_APP_COUNTRY_SERVICE_URL + '/parameter/upload',
  baseUrlAPIDocReportChartDownloadAPI:
    process.env.NG_APP_COUNTRY_SERVICE_URL + '/report/chartDataImage',
  baseUrlPMU: process.env.NG_APP_PMU_BASE_URL,
  baseUrlCountryWeb: process.env.NG_APP_COUNTRY_WEB_URL,
  apiKey1: process.env.NG_APP_API_KEY_1,
  apiKey2: process.env.NG_APP_API_KEY_2,
};
