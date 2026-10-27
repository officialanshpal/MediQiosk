/**
 * Frontend API Service Client with Interceptors
 */

const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.sessionId = localStorage.getItem('mediQiosk_sessionId') || null;
  }

  setSessionId(id) {
    this.sessionId = id;
    if (id) {
      localStorage.setItem('mediQiosk_sessionId', id);
    } else {
      localStorage.removeItem('mediQiosk_sessionId');
    }
  }

  // Request Interceptor
  _getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.sessionId) {
      headers['X-Session-ID'] = this.sessionId;
    }
    return headers;
  }

  // Response Interceptor & Error handling
  async _handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP Error ${response.status}`);
      error.status = response.status;
      error.code = errorData.errorCode;
      throw error;
    }
    return await response.json();
  }

  async post(endpoint, body = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(body)
    });
    return this._handleResponse(res);
  }

  async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: this._getHeaders()
    });
    return this._handleResponse(res);
  }
}

export const api = new ApiClient();
