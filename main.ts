import { createCliRenderer, TextRenderable, Text } from "@opentui/core";
import { format } from "@formkit/tempo";
import { NodeContext, NodeRuntime, NodeTerminal } from "@effect/platform-node";
import { Data, Effect, Layer } from "effect";

const renderer = await createCliRenderer();
let currdate = format(new Date(), "full");

const date1 = Text({
  content: currdate,
  fg: "#00FF00",
  position: "absolute",
  left: 10,
  top: 5,
});
const platform = Layer.mergeAll(NodeContext.layer, NodeTerminal.layer);

const main = program.pipe(
  Effect.catchAll(() => newDoB()),
  Effect.provide(platform), // now R = never
);

NodeRuntime.runMain(main);
renderer.root.add(date1);
