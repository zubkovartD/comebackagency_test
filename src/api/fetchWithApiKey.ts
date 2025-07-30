export async function fetchWithApiKey(endpoint: string, options?: RequestInit) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing");
  }

  const url = `${endpoint}&appid=${apiKey}`;

  const res = await fetch(url, options);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Fetch failed: ${res.status} ${errorText}`);
  }

  return res.json();
}
