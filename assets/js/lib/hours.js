// Opening-hours helpers. Pure functions, always evaluated in the clinic's
// timezone (e.g. Asia/Kolkata) so visitors abroad see correct times.

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const pad = (n) => String(n).padStart(2, '0');
const fromMin = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;

export function format12(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${pad(m)} ${suffix}`;
}

// Current day / minute-of-day / date string in the given timezone.
export function zonedNow(date, tz) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      .formatToParts(date).map(p => [p.type, p.value])
  );
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  return { day, minutes: Number(parts.hour) * 60 + Number(parts.minute), ymd: `${parts.year}-${parts.month}-${parts.day}` };
}

export function dayOfWeek(ymd) {
  return new Date(`${ymd}T12:00:00Z`).getUTCDay();
}

export function hoursForDay(day, hours) {
  return hours.find(h => h.days.includes(day)) || null;
}

// { open: boolean, label: string } e.g. "Open now · closes 8:00 PM"
export function openStatus(date, hours, tz) {
  const { day, minutes } = zonedNow(date, tz);
  const today = hoursForDay(day, hours);
  if (today && minutes >= toMin(today.open) && minutes < toMin(today.close)) {
    return { open: true, label: `Open now · closes ${format12(today.close)}` };
  }
  if (today && minutes < toMin(today.open)) {
    return { open: false, label: `Closed · opens ${format12(today.open)} today` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const h = hoursForDay(d, hours);
    if (h) return { open: false, label: `Closed · opens ${format12(h.open)} ${i === 1 ? 'tomorrow' : DAY_NAMES[d]}` };
  }
  return { open: false, label: 'Closed' };
}

// Bookable start times for a date ("YYYY-MM-DD"); past times are dropped
// when the date is today in the clinic's timezone.
export function timeSlots(ymd, hours, slotMinutes, now, tz) {
  const h = hoursForDay(dayOfWeek(ymd), hours);
  if (!h) return [];
  const z = zonedNow(now, tz);
  const earliest = ymd === z.ymd ? z.minutes + 30 : -1; // at least 30 min notice
  if (ymd < z.ymd) return [];
  const slots = [];
  for (let m = toMin(h.open); m + slotMinutes <= toMin(h.close); m += slotMinutes) {
    if (m >= earliest) slots.push(fromMin(m));
  }
  return slots;
}

export function todayInZone(now, tz) {
  return zonedNow(now, tz).ymd;
}
