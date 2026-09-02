/**
 * Vue 3 Token Storage (SessionStorage & In-Memory Isolation)
 * 
 * Modeled after Angular TokenService:
 * Stores short-lived Access Tokens and Refresh Tokens strictly in browser `sessionStorage`
 * and in-memory cache to prevent persistent cross-session token exposure.
 */

const ACCESS_TOKEN_KEY = 'vue_template_access_token';
const REFRESH_TOKEN_KEY = 'vue_template_refresh_token';

class TokenStorage {
  private inMemoryAccessToken: string | null = null;
  private inMemoryRefreshToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      this.inMemoryAccessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
      this.inMemoryRefreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    }
  }

  getAccessToken(): string | null {
    if (this.inMemoryAccessToken) return this.inMemoryAccessToken;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      this.inMemoryAccessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return this.inMemoryAccessToken;
  }

  getRefreshToken(): string | null {
    if (this.inMemoryRefreshToken) return this.inMemoryRefreshToken;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      this.inMemoryRefreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return this.inMemoryRefreshToken;
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    this.inMemoryAccessToken = accessToken;
    if (refreshToken) {
      this.inMemoryRefreshToken = refreshToken;
    }
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  }

  clearTokens(): void {
    this.inMemoryAccessToken = null;
    this.inMemoryRefreshToken = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  hasToken(): boolean {
    return !!this.getAccessToken();
  }
}

export const tokenStorage = new TokenStorage();
