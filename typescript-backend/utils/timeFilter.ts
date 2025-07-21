import dayjs from 'dayjs';

export function isCafeOpenAt(date: string, rows) {

    const target = dayjs(date)
    const day = target.day(); 
    const hour = target.hour();
    const minute = target.minute();

    return rows.filter(cafe => {
        try {
            const opening = JSON.parse(cafe.openingDays);
            const period = opening.periods.find((p: any) => p.open.day === day);
            if (!period) return false;
            const openMinutes = period.open.hour * 60 + period.open.minute;
            const closeMinutes = period.close.hour * 60 + period.close.minute;
            const nowMinutes = hour * 60 + minute;
            return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
        } catch (e) {
            return false;
        }
    });
} 