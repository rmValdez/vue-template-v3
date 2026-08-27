const ACCESS_TOKEN_KEY = 'vue_template_access_token';
const REFRESH_TOKEN_KEY = 'vue_template_refresh_token';

class TokenStorage {
  private inMemoryAccessToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.inMemoryAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    }
  }

  getAccessToken(): string | null {
    if (this.inMemoryAccessToken) return this.inMemoryAccessToken;
    if (typeof window !== 'undefined') {
      this.inMemoryAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return this.inMemoryAccessToken;
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    this.inMemoryAccessToken = accessToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  }

  clearTokens(): void {
    this.inMemoryAccessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  hasToken(): boolean {
    return !!this.getAccessToken();
  }
}

export const tokenStorage = new TokenStorage();
