import { BunContext, BunRuntime, BunTerminal } from "@effect/platform-bun";
import { Duration, Effect, Layer, Schedule } from "effect";


import { fileCheck } from "./initial";
import { calcBirthday, updateTimers } from "./utils";

const platform = Layer.mergeAll(BunContext.layer, BunTerminal.layer);

const setup = Effect.gen(function* () {
  // check if the dob file exists if not make one
  yield* fileCheck;
  yield* calcBirthday;
});

const main = Effect.gen(function* () {
  yield* setup;
  yield* Effect.repeat(updateTimers, Schedule.spaced(Duration.millis(50)));
}).pipe(Effect.provide(platform));

BunRuntime.runMain(main);
