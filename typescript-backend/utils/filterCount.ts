import { ICafeFilters } from '../src/interfaces/filters.interface';

export function getFilterCount(filter: ICafeFilters): number {
    let count = 0;
    if (filter.rating !== undefined && filter.rating !== null) count++;
    if (filter.date) count++;
    if (
        filter.latitude !== undefined && filter.latitude !== null &&
        filter.longitude !== undefined && filter.longitude !== null &&
        filter.radius !== undefined && filter.radius !== null
    ) count++;
    return count;
}