import { Effect } from "effect";
import { FileSystem } from "@effect/platform";
import { parse } from "@formkit/tempo";
import { filePath, validateContents } from "./initial";

const startDate = () => Date.now();

const GetDob = Effect.gen(function* () {
  yield* validateContents(filePath);
  const fs = yield* FileSystem.FileSystem;
  const dob = yield* fs.readFileString(filePath);
  const parsed = parse(dob);
  return parsed;
});

const tickrate = 10;

// function that get the time until you turn 25,
// then gets the current time, and calculates the difference at every tickrate,
// then formats this difference and displays it
