export function convertMsToDate(ms: number) {
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

export function convertTime(seconds: number) {
  if (seconds < 0) {
    return '00:00:00';
  } else {
    let hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);
    const newSeconds = Math.floor(seconds - hours * 3600 - minutes * 60);

    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(newSeconds)}`;
  }
}
