/**
 * Time Tracker API Client
 *
 * RESTful API for time tracking and entry management with workflow support
 */
export declare class TimeTrackerApiClient {
    private httpClient;
    private baseURL;
    constructor(baseURL?: string, token?: string);
    /**
     * Set or update the authorization token
     */
    setAuthToken(token: string): void;
    /**
     * Health check endpoint
     */
    health(): Promise<any>;
    login(username: string, password: string): Promise<any>;
    logout(): Promise<void>;
    refreshToken(): Promise<any>;
    getUsers(pageNumber?: number, pageSize?: number): Promise<any>;
    getUserById(id: string): Promise<any>;
    createUser(userData: any): Promise<any>;
    updateUser(id: string, userData: any): Promise<any>;
    deleteUser(id: string): Promise<void>;
    getTimeEntries(pageNumber?: number, pageSize?: number, status?: string): Promise<any>;
    getTimeEntryById(id: string): Promise<any>;
    createTimeEntry(entryData: any): Promise<any>;
    updateTimeEntry(id: string, entryData: any): Promise<any>;
    deleteTimeEntry(id: string): Promise<void>;
    submitTimeEntry(id: string): Promise<any>;
    approveTimeEntry(id: string): Promise<any>;
    rejectTimeEntry(id: string, reason: string): Promise<any>;
    getProjects(pageNumber?: number, pageSize?: number): Promise<any>;
    getProjectById(id: string): Promise<any>;
    createProject(projectData: any): Promise<any>;
    updateProject(id: string, projectData: any): Promise<any>;
    deleteProject(id: string): Promise<void>;
    getTasks(pageNumber?: number, pageSize?: number): Promise<any>;
    getTaskById(id: string): Promise<any>;
    createTask(taskData: any): Promise<any>;
    updateTask(id: string, taskData: any): Promise<any>;
    deleteTask(id: string): Promise<void>;
    getTimeEntryReport(startDate: string, endDate: string, userId?: string): Promise<any>;
    getProjectReport(startDate: string, endDate: string): Promise<any>;
}
export default TimeTrackerApiClient;
//# sourceMappingURL=TimeTrackerApiClient.d.ts.map