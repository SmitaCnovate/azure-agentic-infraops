import axios from 'axios';
/**
 * Time Tracker API Client
 *
 * RESTful API for time tracking and entry management with workflow support
 */
export class TimeTrackerApiClient {
    constructor(baseURL = 'http://localhost:5000', token) {
        this.baseURL = baseURL;
        this.httpClient = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add authorization header if token provided
        if (token) {
            this.setAuthToken(token);
        }
        // Add response interceptor for error handling
        this.httpClient.interceptors.response.use(response => response, error => {
            if (error.response?.status === 401) {
                console.error('Unauthorized: Token may be expired');
            }
            throw error;
        });
    }
    /**
     * Set or update the authorization token
     */
    setAuthToken(token) {
        this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    /**
     * Health check endpoint
     */
    async health() {
        const response = await this.httpClient.get('/health');
        return response.data;
    }
    // ========== Authentication ==========
    async login(username, password) {
        const response = await this.httpClient.post('/api/auth/login', {
            username,
            password,
        });
        return response.data;
    }
    async logout() {
        await this.httpClient.post('/api/auth/logout');
    }
    async refreshToken() {
        const response = await this.httpClient.post('/api/auth/refresh-token');
        return response.data;
    }
    // ========== Users ==========
    async getUsers(pageNumber, pageSize) {
        const response = await this.httpClient.get('/api/users', {
            params: { pageNumber, pageSize },
        });
        return response.data;
    }
    async getUserById(id) {
        const response = await this.httpClient.get(`/api/users/${id}`);
        return response.data;
    }
    async createUser(userData) {
        const response = await this.httpClient.post('/api/users', userData);
        return response.data;
    }
    async updateUser(id, userData) {
        const response = await this.httpClient.put(`/api/users/${id}`, userData);
        return response.data;
    }
    async deleteUser(id) {
        await this.httpClient.delete(`/api/users/${id}`);
    }
    // ========== Time Entries ==========
    async getTimeEntries(pageNumber, pageSize, status) {
        const response = await this.httpClient.get('/api/time-entries', {
            params: { pageNumber, pageSize, status },
        });
        return response.data;
    }
    async getTimeEntryById(id) {
        const response = await this.httpClient.get(`/api/time-entries/${id}`);
        return response.data;
    }
    async createTimeEntry(entryData) {
        const response = await this.httpClient.post('/api/time-entries', entryData);
        return response.data;
    }
    async updateTimeEntry(id, entryData) {
        const response = await this.httpClient.put(`/api/time-entries/${id}`, entryData);
        return response.data;
    }
    async deleteTimeEntry(id) {
        await this.httpClient.delete(`/api/time-entries/${id}`);
    }
    async submitTimeEntry(id) {
        const response = await this.httpClient.post(`/api/time-entries/${id}/submit`, {});
        return response.data;
    }
    async approveTimeEntry(id) {
        const response = await this.httpClient.post(`/api/time-entries/${id}/approve`, {});
        return response.data;
    }
    async rejectTimeEntry(id, reason) {
        const response = await this.httpClient.post(`/api/time-entries/${id}/reject`, { reason });
        return response.data;
    }
    // ========== Projects ==========
    async getProjects(pageNumber, pageSize) {
        const response = await this.httpClient.get('/api/projects', {
            params: { pageNumber, pageSize },
        });
        return response.data;
    }
    async getProjectById(id) {
        const response = await this.httpClient.get(`/api/projects/${id}`);
        return response.data;
    }
    async createProject(projectData) {
        const response = await this.httpClient.post('/api/projects', projectData);
        return response.data;
    }
    async updateProject(id, projectData) {
        const response = await this.httpClient.put(`/api/projects/${id}`, projectData);
        return response.data;
    }
    async deleteProject(id) {
        await this.httpClient.delete(`/api/projects/${id}`);
    }
    // ========== Tasks ==========
    async getTasks(pageNumber, pageSize) {
        const response = await this.httpClient.get('/api/tasks', {
            params: { pageNumber, pageSize },
        });
        return response.data;
    }
    async getTaskById(id) {
        const response = await this.httpClient.get(`/api/tasks/${id}`);
        return response.data;
    }
    async createTask(taskData) {
        const response = await this.httpClient.post('/api/tasks', taskData);
        return response.data;
    }
    async updateTask(id, taskData) {
        const response = await this.httpClient.put(`/api/tasks/${id}`, taskData);
        return response.data;
    }
    async deleteTask(id) {
        await this.httpClient.delete(`/api/tasks/${id}`);
    }
    // ========== Reports ==========
    async getTimeEntryReport(startDate, endDate, userId) {
        const response = await this.httpClient.get('/api/reports/time-entries', {
            params: { startDate, endDate, userId },
        });
        return response.data;
    }
    async getProjectReport(startDate, endDate) {
        const response = await this.httpClient.get('/api/reports/projects', {
            params: { startDate, endDate },
        });
        return response.data;
    }
}
export default TimeTrackerApiClient;
//# sourceMappingURL=TimeTrackerApiClient.js.map