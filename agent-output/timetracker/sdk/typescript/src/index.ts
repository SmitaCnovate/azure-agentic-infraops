/**
 * TimeTracker API SDK
 * TypeScript client library for the TimeTracker API
 */

import axios from 'axios';

export interface ApiConfig {
  baseURL: string;
  apiKey?: string;
}

export class TimeTrackerClient {
  private baseURL: string;
  private apiKey?: string;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.apiKey = config.apiKey;
  }

  /**
   * Get API health status
   */
  async health(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Get API version
   */
  getVersion(): string {
    return '1.0.0';
  }
}

export default TimeTrackerClient;
