const TOKEN_KEY = "yingzi-mobile-token";

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setStoredToken(token: string) {
  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(init?.headers ?? {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
