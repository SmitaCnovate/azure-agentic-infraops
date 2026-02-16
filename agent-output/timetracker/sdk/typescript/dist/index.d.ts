/**
 * Time Tracker API SDK
 *
 * JavaScript/TypeScript client library for the Time Tracker REST API.
 *
 * @example
 * ```typescript
 * import { TimeTrackerApiClient } from '@timetracker/api-sdk';
 *
 * const client = new TimeTrackerApiClient('http://localhost:5000', authToken);
 *
 * // Get all time entries
 * const entries = await client.getTimeEntries(1, 50);
 *
 * // Create a new time entry
 * const newEntry = await client.createTimeEntry({
 *   description: 'Worked on feature X',
 *   hours: 8,
 *   entryDate: new Date(),
 * });
 * ```
 */
export * from './api';
export * from './models';
//# sourceMappingURL=index.d.ts.map