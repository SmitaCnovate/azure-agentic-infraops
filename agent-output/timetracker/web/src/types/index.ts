// User Types
export interface User {
  id: string
  objectId: string
  email: string
  displayName: string
  role: 'Admin' | 'Manager' | 'Employee'
  isActive: boolean
  department?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  timezone: string
  defaultProjectId?: string
  language: string
  emailNotifications: boolean
}

// Project Types
export interface Project {
  id: string
  name: string
  description?: string
  clientId: string
  client?: Client
  billable: boolean
  active: boolean
  code?: string
  budget?: number
  estimatedHours?: number
  actualHours?: number
  createdAt: string
  updatedAt: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
  clientId: string
  billable: boolean
  code?: string
  budget?: number
  estimatedHours?: number
}

// Client Types
export interface Client {
  id: string
  name: string
  description?: string
  email?: string
  phone?: string
  website?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateClientRequest {
  name: string
  description?: string
  email?: string
  phone?: string
  website?: string
}

// Task Types
export interface Task {
  id: string
  name: string
  description?: string
  projectId: string
  project?: Project
  status: 'Open' | 'InProgress' | 'Completed' | 'Cancelled'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  assigneeId?: string
  assignee?: User
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  name: string
  description?: string
  projectId: string
  assigneeId?: string
  dueDate?: string
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent'
}

// Time Entry Types
export interface TimeEntry {
  id: string
  userId: string
  user?: User
  projectId: string
  project?: Project
  taskId?: string
  task?: Task
  description: string
  startTime: string
  endTime: string
  durationMinutes: number
  duration: string // formatted HH:MM
  billable: boolean
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
  notes?: string
  approvedBy?: string
  approverNotes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTimeEntryRequest {
  projectId: string
  taskId?: string
  description: string
  startTime: string
  endTime: string
  billable: boolean
  notes?: string
}

export interface UpdateTimeEntryRequest extends CreateTimeEntryRequest {
  id: string
}

export interface TimeEntryApprovalRequest {
  id: string
  approve: boolean
  notes?: string
}

export interface BulkTimeEntryRequest {
  ids: string[]
  action: 'submit' | 'approve' | 'reject'
  notes?: string
}

// Report Types
export interface TimeEntrySummary {
  userId: string
  userName: string
  totalHours: number
  billableHours: number
  billableAmount: number
  weeklyHours: {
    week: number
    hours: number
  }[]
}

export interface ProjectTimeReport {
  projectId: string
  projectName: string
  clientName: string
  totalHours: number
  billableHours: number
  estimatedHours?: number
  actualCost: number
  teamMembers: {
    userId: string
    userName: string
    hours: number
  }[]
}

export interface BillableReport {
  period: string
  totalBillable: number
  totalBillableHours: number
  ratePerHour: number
  invoiceAmount: number
  projects: ProjectTimeReport[]
}

export interface ReportFilter {
  startDate: string
  endDate: string
  projectId?: string
  clientId?: string
  userId?: string
  status?: string
}

// Authentication Types
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: User
}

export interface TokenResponse {
  accessToken: string
  expiresIn: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

// Form Types
export interface TimeEntryFormData {
  projectId: string
  taskId: string
  description: string
  date: string
  startTime: string
  endTime: string
  duration: string
  billable: boolean
  notes: string
}

export interface ProjectFormData {
  name: string
  description: string
  clientId: string
  billable: boolean
  code: string
  budget: number
  estimatedHours: number
}

export interface ClientFormData {
  name: string
  description: string
  email: string
  phone: string
  website: string
}

// Error Types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: string
}

// Query Parameters
export interface QueryParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filter?: Record<string, unknown>
}
