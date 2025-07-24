export function formatOpeningDays(raw) {
    try {
        const obj = JSON.parse(raw);

        // If you already have weekdayDescriptions, just return it
        if (Array.isArray(obj.weekdayDescriptions)) {
            return obj.weekdayDescriptions;
        }

        // Otherwise build “Day: HH:MM AM – HH:MM PM” lines from periods
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return obj.periods.map(p => {
            const dayName = dayNames[p.open.day];
            const fmt = (h, m) => {
                const hour12 = h % 12 || 12;
                const ampm = h < 12 ? 'AM' : 'PM';
                const mm = String(m).padStart(2, '0');
                return `${hour12}:${mm} ${ampm}`;
            };
            const openAt = fmt(p.open.hour, p.open.minute);
            const closeAt = fmt(p.close.hour, p.close.minute);
            return `${dayName}: ${openAt} – ${closeAt}`;
        });
    } catch (_) {
        return ['No opening hours available'];
    }
}
