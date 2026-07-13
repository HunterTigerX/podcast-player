export function convertMsToDate(ms) {
    const date = new Date(ms);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const dayOfWeek = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return {
        date: `${dayOfWeek}, ${day} ${month} ${year}`,
    };
}
//# sourceMappingURL=convertDate.js.map