import { Effect } from "effect";
import { FileSystem } from "@effect/platform";
import { parse, addYear } from "@formkit/tempo";
import { filePath, validateContents } from "./initial";

export let DoB: Date = new Date();
export let Birthday: Date = new Date();

export const calcBirthday = Effect.gen(function* () {
  yield* validateContents(filePath);
  const fs = yield* FileSystem.FileSystem;
  const dob = yield* fs.readFileString(filePath);
  const parsed = yield* Effect.try(() => parse(dob));
  DoB = parsed;
  Birthday = addYear(DoB, 25);
  return DoB;
});

// function that get the time until you turn 25,
// then gets the current time, and calculates the difference at every tickrate,
// then formats this difference and displays it
