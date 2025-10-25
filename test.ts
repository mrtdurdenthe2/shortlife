import { parse } from "@formkit/tempo";

// find diff from one date to another in months and years
// get the yearDiff(floor) and subtract it away from the months
// do the same for (week, days), (hours, mins), etc.

type Breakdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function clampNonNegative(n: number) {
  return n < 0 ? 0 : Math.floor(n);
}

export function breakdownDiff(from: Date, to: Date): Breakdown {
  // Ensure we always count forward in time
  let start = new Date(from.getTime());
  let end = new Date(to.getTime());
  if (end.getTime() < start.getTime()) {
    const tmp = start;
    start = end;
    end = tmp;
  }

  let remainingMs = end.getTime() - start.getTime();

  const secondMs = 1000;
  const minuteMs = 60 * secondMs;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  const d = Math.floor(remainingMs / dayMs);
  remainingMs -= d * dayMs;

  const h = Math.floor(remainingMs / hourMs);
  remainingMs -= h * hourMs;

  const min = Math.floor(remainingMs / minuteMs);
  remainingMs -= min * minuteMs;

  const s = Math.floor(remainingMs / secondMs);

  return {
    days: d,
    hours: h,
    minutes: min,
    seconds: s,
  };
}

export function formatBreakdown(b: Breakdown) {
  return `${b.days}D, ${b.hours}H, ${b.minutes}M, ${b.seconds}S`;
}

// Example: countdown to a target date
const target = parse("21/01/2030", "DD/MM/YYYY");

function tick() {
  const now = new Date();
  const b = breakdownDiff(now, target);
  const label = formatBreakdown(b);
  console.clear();
  console.log(`Until ${target.toLocaleDateString()}: ${label}`);
}

tick();
setInterval(tick, 1000);
