import { Effect } from "effect";
import { FileSystem } from "@effect/platform";
import { parse, addYear, diffDays, diffMonths, diffYears, diffHours, diffMinutes, diffSeconds, diffMilliseconds } from "@formkit/tempo";
import { filePath } from "./initial";
import { countdownLabels } from "./ui";

export let DoB: Date = new Date();
export let Birthday: Date = new Date();

export const calcBirthday = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const dob = yield* fs.readFileString(filePath);
  const parsed = yield* Effect.try(() => parse(dob, "DD/MM/YYYY"));
  DoB = parsed;
  Birthday = addYear(DoB, 25);
  return DoB;
});

export const updateTimers = Effect.gen(function* () {
  const dob = DoB;
  const birthday = Birthday;
  countdownLabels.years = `${diffYears(birthday, new Date())}Y`;
});

// diff in years, floor it, pass remainder/diff down to months and do the same
// this way we get the cascading coundown effect


// months = Yeardiff - startYear(Yeardiff)
// weeks = months = startMonth(motnhs)
