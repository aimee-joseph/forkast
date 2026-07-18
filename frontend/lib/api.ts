const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function previewCSV(
  file: File
): Promise<{ columns: string[]; preview: Record<string, any>[] }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/upload/preview`, {
    method: "POST",
    body: form,
  });
  return handleResponse(res);
}

export async function processCSV(
  file: File,
  columnMap: Record<string, string>,
  userId: string
): Promise<any> {
  const form = new FormData();
  form.append("file", file);
  form.append("column_map", JSON.stringify(columnMap));
  form.append("user_id", userId);
  const res = await fetch(`${BASE_URL}/upload/process`, {
    method: "POST",
    body: form,
  });
  return handleResponse(res);
}

export async function getReports(userId: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/analytics/reports/${userId}`);
  return handleResponse(res);
}

export async function getReport(reportId: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/analytics/report/${reportId}`);
  return handleResponse(res);
}

export async function getSummary(
  userId: string
): Promise<{
  total_reports: number;
  total_orders_analysed: number;
  most_recent_report_date: string | null;
}> {
  const res = await fetch(`${BASE_URL}/analytics/reports/${userId}/summary`);
  return handleResponse(res);
}

export async function generateInsights(
  reportId: string,
  userId: string
): Promise<{ report_id: string; bullets: string[] }> {
  const res = await fetch(`${BASE_URL}/insights/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report_id: reportId, user_id: userId }),
  });
  return handleResponse(res);
}

export async function getInsights(
  reportId: string
): Promise<{
  report_id: string;
  bullets: string[] | null;
  generated_at?: string;
}> {
  const res = await fetch(`${BASE_URL}/insights/${reportId}`);
  return handleResponse(res);
}

export async function deleteReport(
  reportId: string
): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/analytics/report/${reportId}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
