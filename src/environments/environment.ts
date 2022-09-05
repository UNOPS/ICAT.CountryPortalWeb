// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrlAPI: 'http://localhost:7080',
  // baseUrlAPI: 'https://icat-ca-tool.climatesi.com/web-api',
  baseUrlAPIDocUploadAPI: 'http://localhost:7080/document/upload2',
  baseUrlAPIDocUploadAnonymousAPI: 'http://localhost:7080/document/uploadFileAnonymous',
  baseUrlAPIDocdownloadAPI: 'http://localhost:7080/document/downloadDocument',
  baseUrlAPIDocReportChartDownloadAPI: 'http://localhost:7080/report/chartDataImage',
//  baseUrlJsonFile: 'http://localhost:3600/filename',
  baseUrlExcelUpload: 'http://localhost:7080/parameter/upload',
  baseUrlMac: 'https://icat-ca-tool.climatesi.com/cal-engine/mac',
  baseUrlJsonFile: 'https://icat-ca-tool.climatesi.com/cal-engine/filename',
  // baseUrlMac: 'https://icat-ca-tool.climatesi.com/cal-engine/mac',
};


// baseUrlAPI: 'http://3.110.188.89:7080',
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI .
