export async function fetchChartData(chartName: string) {
  const response = await fetch(`/charts/${encodeURIComponent(chartName)}.json`)

  if (!response.ok) {
    throw new Error(`Chart data not found for ${chartName} (HTTP ${response.status})`)
  }

  return response.json()
}
