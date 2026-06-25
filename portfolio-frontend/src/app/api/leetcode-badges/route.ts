import { NextResponse } from 'next/server';

function unixToYMD(unix: string | number): string {
  const date = new Date(Number(unix) * 1000);
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    // Fetch both stats and badges in parallel
    const [statsRes, badgesRes, calendarRes] = await Promise.all([
      fetch('https://leetcode-stats-api.herokuapp.com/brijeshsingh'),
      fetch('https://alfa-leetcode-api.onrender.com/brijeshsingh/Badges'),
      fetch('https://alfa-leetcode-api.onrender.com/brijeshsingh/calendar')
    ]);
    if (!statsRes.ok || !badgesRes.ok || !calendarRes.ok) {
      throw new Error('One or more APIs failed');
    }
    const stats = await statsRes.json();
    const badges = await badgesRes.json();
    const calendarRaw = await calendarRes.json();

    // Find the submissionCalendar (may be stringified JSON)
    let submissionCalendar = {};
    if (typeof calendarRaw.submissionCalendar === 'string') {
      submissionCalendar = JSON.parse(calendarRaw.submissionCalendar);
    } else if (typeof calendarRaw.submissionCalendar === 'object') {
      submissionCalendar = calendarRaw.submissionCalendar;
    } else if (calendarRaw.calendar && typeof calendarRaw.calendar.submissionCalendar === 'string') {
      submissionCalendar = JSON.parse(calendarRaw.calendar.submissionCalendar);
    }

    // Convert to { 'YYYY-MM-DD': count }
    const calendar: Record<string, number> = {};
    for (const [unix, count] of Object.entries(submissionCalendar)) {
      calendar[unixToYMD(unix)] = count as number;
    }

    // Combine stats and badges in one response
    return NextResponse.json({ ...stats, badges: badges.badges || badges, calendar });
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    return NextResponse.json({ error: 'Failed to fetch LeetCode data' }, { status: 500 });
  }
} 