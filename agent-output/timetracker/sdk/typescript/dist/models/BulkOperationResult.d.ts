/**
 * BulkOperationResult
 */
import { BulkOperationError } from './BulkOperationError';
export interface BulkOperationResult {
    successCount?: number;
    failureCount?: number;
    failures?: BulkOperationError[];
}
//# sourceMappingURL=BulkOperationResult.d.ts.map