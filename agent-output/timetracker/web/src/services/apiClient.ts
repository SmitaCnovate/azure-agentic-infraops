import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { IPublicClientApplication } from '@azure/msal-browser'
import { apiScopes } from '@/config/authConfig'

let msalInstance: IPublicClientApplication | null = null

export const setMsalInstance = (instance: IPublicClientApplication) => {
  msalInstance = instance
}

export class ApiClient {
  private axiosInstance: AxiosInstance
  private accessToken: string | null = null

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://app-timetracker-api-prod.azurewebsites.net',
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor - Add auth token
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (msalInstance) {
          try {
            const response = await msalInstance.acquireTokenSilent({
              scopes: apiScopes.scopes,
              account: msalInstance.getActiveAccount() || undefined,
            })
            config.headers.Authorization = `Bearer ${response.accessToken}`
          } catch (error) {
            console.error('Error acquiring token:', error)
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - Handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - redirect to login
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }

  public async get<T>(url: string, config?: any) {
    return this.axiosInstance.get<T>(url, config)
  }

  public async post<T>(url: string, data?: any, config?: any) {
    return this.axiosInstance.post<T>(url, data, config)
  }

  public async put<T>(url: string, data?: any, config?: any) {
    return this.axiosInstance.put<T>(url, data, config)
  }

  public async patch<T>(url: string, data?: any, config?: any) {
    return this.axiosInstance.patch<T>(url, data, config)
  }

  public async delete<T>(url: string, config?: any) {
    return this.axiosInstance.delete<T>(url, config)
  }
}

export const apiClient = new ApiClient()
