export const securityService = {
  /**
   * Санитизация HTML
   */
  sanitizeHtml(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Проверка на XSS
   */
  containsXSS(input: string): boolean {
    const patterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /onerror=/gi,
      /onload=/gi,
      /onclick=/gi,
    ];

    return patterns.some(pattern => pattern.test(input));
  },

  /**
   * Экранирование HTML
   */
  escapeHtml(input: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return input.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
  },

  /**
   * Проверка токена
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  /**
   * Получение CSRF токена
   */
  getCsrfToken(): string {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.getAttribute('content') || '';
  },

  /**
   * Безопасное хранение токена
   */
  setSecureToken(token: string): void {
    if (window.isSecureContext) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  },

  /**
   * Очистка всех данных
   */
  clearAllData(): void {
    localStorage.clear();
    sessionStorage.clear();
  },
};
