import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

async function fetchAuthenticatedBlob(http: HttpClient, url: string): Promise<Blob> {
  const blob = await http.get(url, { responseType: 'blob' }).toPromise();

  if (!blob) {
    throw new Error('Download returned empty response');
  }

  if (blob.type === 'application/json') {
    const errorText = await blob.text();
    throw new Error(errorText || 'Failed to download file');
  }

  return blob;
}

async function openBlobInNewTab(blob: Blob): Promise<void> {
  const objectUrl = URL.createObjectURL(blob);
  const opened = window.open(objectUrl, '_blank');
  if (!opened) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Failed to open file. Please allow pop-ups for this site.');
  }

  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export async function openAuthenticatedUrl(
  http: HttpClient,
  url: string,
): Promise<void> {
  const blob = await fetchAuthenticatedBlob(http, url);
  await openBlobInNewTab(blob);
}

export async function openAuthenticatedDocumentById(
  http: HttpClient,
  baseUrl: string,
  documentId: number,
  state = 'inline',
): Promise<void> {
  const url = `${baseUrl}/document/downloadDocument/${encodeURIComponent(state)}/${encodeURIComponent(String(documentId))}`;
  await openAuthenticatedUrl(http, url);
}

export async function openAuthenticatedReportByName(
  http: HttpClient,
  baseUrl: string,
  reportName: string,
): Promise<void> {
  const url = `${baseUrl}/document/downloadReport/${encodeURIComponent(reportName)}`;
  await openAuthenticatedUrl(http, url);
}

export async function openAuthenticatedChartImage(
  http: HttpClient,
  baseUrl: string,
  imageName: string,
): Promise<void> {
  const url = `${baseUrl}/report/chartDataImage/${encodeURIComponent(imageName)}`;
  await openAuthenticatedUrl(http, url);
}

export function isProtectedApiUrl(
  url: string,
  apiBaseUrl: string = environment.baseUrlAPI,
): boolean {
  if (!url) {
    return false;
  }

  return (
    url.startsWith(apiBaseUrl) ||
    url.includes('/document/downloadDocument') ||
    url.includes('/document/downloadReport') ||
    url.includes('/report/chartDataImage')
  );
}

export async function openStoredResourceUrl(
  http: HttpClient,
  url: string,
  apiBaseUrl: string = environment.baseUrlAPI,
): Promise<void> {
  if (!url) {
    throw new Error('No URL provided');
  }

  if (isProtectedApiUrl(url, apiBaseUrl)) {
    await openAuthenticatedUrl(http, url);
    return;
  }

  window.open(url, '_blank');
}
