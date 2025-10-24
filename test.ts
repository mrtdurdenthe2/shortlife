import { NodeContext, NodeRuntime, NodeTerminal } from "@effect/platform-node";
import { Duration, Effect, Layer, Schedule } from "effect";
import { createElement } from "react";

import { validateDateString } from "./src/initial";


const platform = Layer.mergeAll(NodeContext.layer, NodeTerminal.layer);


const main = Effect.gen(function* () {
  yield* validateDateString("29/01/2009")
}).pipe(Effect.provide(platform));

NodeRuntime.runMain(main);


// find diff in months and years
// get the yearDiff(floor) and subtract it away from the months
// do the same for (week, days ), (hours, mins), etc.

