import { useCallback } from 'react'
import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
}

export const useApiCall = <T extends (...args: any[]) => Promise<any>>(
  apiFunction: T,
  onSuccess?: (data: any) => void,
  onError?: (error: AxiosError<ApiErrorResponse>) => void
) => {
  return useCallback(
    async (...args: Parameters<T>) => {
      try {
        const result = await apiFunction(...args)
        onSuccess?.(result)
        return result
      } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>
        const errorMessage = 
          axiosError.response?.data?.message || 
          'An error occurred. Please try again.'
        toast.error(errorMessage)
        onError?.(axiosError)
        throw error
      }
    },
    [apiFunction, onSuccess, onError]
  )
}

export const useApiMutation = <
  TData = any,
  TError = AxiosError<ApiErrorResponse>,
  TVariables = void
>(
  mutationFn: (variables: TVariables) => Promise<TData>
) => {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    onError: (error) => {
      const errorMessage = 
        error.response?.data?.message || 
        'An error occurred. Please try again.'
      toast.error(errorMessage)
    },
    onSuccess: (data) => {
      toast.success('Operation completed successfully')
    },
  })
}
