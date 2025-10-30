import { Effect } from "effect";
import { FileSystem } from "@effect/platform";
import { parse, addYear } from "@formkit/tempo";
import { filePath } from "./initial";
import { countdownLabels } from "./ui";

import { createElement } from "react";
import { TUI } from "./ui";
import { render } from "@opentui/react";

const App = createElement(TUI)

export let DoB: Date = new Date();
export let Birthday: Date = new Date();



// diff in years, floor it, pass remainder/diff down to months and do the same
// this way we get the cascading coundown effect

// months = Yeardiff - startYear(Yeardiff)
// weeks = months = startMonth(motnhs)


export const calcBirthday = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const dob = yield* fs.readFileString(filePath);
  const parsed = yield* Effect.try(() => parse(dob, "DD/MM/YYYY"));
  DoB = parsed;
  Birthday = addYear(DoB, 25);
  return DoB;
});

// Days/Hours/Minutes/Seconds breakdown of time difference
export type breakdownDHMS = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function breakdownDiffDHMS(from: Date, to: Date): breakdownDHMS {
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

  const days = Math.floor(remainingMs / dayMs);
  remainingMs -= days * dayMs;

  const hours = Math.floor(remainingMs / hourMs);
  remainingMs -= hours * hourMs;

  const minutes = Math.floor(remainingMs / minuteMs);
  remainingMs -= minutes * minuteMs;

  const seconds = Math.floor(remainingMs / secondMs);

  return { days, hours, minutes, seconds };
}

export const updateTimers = Effect.gen(function* () {
  const target = Birthday;
  const now = new Date();
  const { days, hours, minutes, seconds } = breakdownDiffDHMS(now, target);

  // Map DHMS into existing UI labels
  countdownLabels.months = `${days}D`;
  countdownLabels.years = ""; // leave empty for now
  countdownLabels.hrs = `${hours}H`;
  countdownLabels.mins = `${minutes}M`;
  countdownLabels.ms = `${seconds}S`;

  render(App, {exitOnCtrlC: true,});
});
