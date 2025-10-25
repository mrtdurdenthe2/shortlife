import { NodeContext, NodeRuntime, NodeTerminal } from "@effect/platform-node";
import { Duration, Effect, Layer, Schedule } from "effect";
import { createElement } from "react";

import { fileCheck } from "./initial";
import { calcBirthday, updateTimers } from "./utils";
import { render } from "@opentui/react";
import { App } from "./ui";
const platform = Layer.mergeAll(NodeContext.layer, NodeTerminal.layer);

const setup = Effect.gen(function* () {
  // check if the dob file exists if not make one
  yield* fileCheck;
  yield* calcBirthday;
});

const main = Effect.gen(function* () {
  yield* setup;
  render(createElement(App));
  yield* Effect.repeat(updateTimers, Schedule.fixed(Duration.millis(100)));
}).pipe(Effect.provide(platform));

NodeRuntime.runMain(main);
