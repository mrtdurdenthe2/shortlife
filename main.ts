import { NodeContext, NodeRuntime, NodeTerminal } from "@effect/platform-node";
import { Data, Effect, Layer } from "effect";

import { fileCheck, newDoB } from "./initial";
import { calcBirthday } from "./utils";

const platform = Layer.mergeAll(NodeContext.layer, NodeTerminal.layer);

const setup = Effect.gen(function* () {
  // check if the dob file exists if not make one
  yield* fileCheck;
  yield* newDoB;
  yield* calcBirthday;
});

// const main = program.pipe(
//   Effect.catchAll(() => newDoB),
//   Effect.provide(platform), // now R = never
// );

// NodeRuntime.runMain(main);
// renderer.root.add(date1);
