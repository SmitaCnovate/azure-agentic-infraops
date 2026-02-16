import { apiClient } from './apiClient'
import {
  TimeEntry,
  CreateTimeEntryRequest,
  UpdateTimeEntryRequest,
  BulkTimeEntryRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types'

export const timeEntryService = {
  // Fetch all time entries with pagination
  getTimeEntries: async (
    pageNumber = 1,
    pageSize = 10,
    startDate?: string,
    endDate?: string,
    projectId?: string,
    status?: string
  ) => {
    const params = {
      pageNumber,
      pageSize,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(projectId && { projectId }),
      ...(status && { status }),
    }
    const response = await apiClient.get<PaginatedResponse<TimeEntry>>(
      '/api/TimeEntries',
      { params }
    )
    return response.data
  },

  // Get single time entry
  getTimeEntry: async (id: string) => {
    const response = await apiClient.get<TimeEntry>(`/api/TimeEntries/${id}`)
    return response.data
  },

  // Create new time entry
  createTimeEntry: async (data: CreateTimeEntryRequest) => {
    const response = await apiClient.post<TimeEntry>('/api/TimeEntries', data)
    return response.data
  },

  // Update time entry
  updateTimeEntry: async (id: string, data: Partial<CreateTimeEntryRequest>) => {
    const response = await apiClient.put<TimeEntry>(`/api/TimeEntries/${id}`, data)
    return response.data
  },

  // Delete time entry
  deleteTimeEntry: async (id: string) => {
    const response = await apiClient.delete<void>(`/api/TimeEntries/${id}`)
    return response.data
  },

  // Submit time entries for approval
  submitTimeEntries: async (id: string) => {
    const response = await apiClient.post<TimeEntry>(
      `/api/TimeEntries/${id}/submit`,
      {}
    )
    return response.data
  },

  // Approve time entry
  approveTimeEntry: async (id: string, notes?: string) => {
    const response = await apiClient.post<TimeEntry>(
      `/api/TimeEntries/${id}/approve`,
      { notes }
    )
    return response.data
  },

  // Reject time entry
  rejectTimeEntry: async (id: string, notes?: string) => {
    const response = await apiClient.post<TimeEntry>(
      `/api/TimeEntries/${id}/reject`,
      { notes }
    )
    return response.data
  },

  // Bulk operations
  bulkSubmit: async (ids: string[]) => {
    const response = await apiClient.post<void>(
      '/api/TimeEntries/bulk/submit',
      { ids }
    )
    return response.data
  },

  bulkApprove: async (ids: string[], notes?: string) => {
    const response = await apiClient.post<void>(
      '/api/TimeEntries/bulk/approve',
      { ids, notes }
    )
    return response.data
  },
}

export default timeEntryService
