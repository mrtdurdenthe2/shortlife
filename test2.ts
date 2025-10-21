import { parse } from "@formkit/tempo";
import { Data, Effect, Layer } from "effect";
import { newDoB } from "./initial.ts";
import { NodeContext, NodeRuntime, NodeTerminal } from "@effect/platform-node";

class MalformedDateStringError extends Data.TaggedError(
  "MalformedDateStringError",
)<{
  readonly dateString: string;
  readonly cause: unknown;
}> {}

const program = Effect.gen(function* () {
  const dateString = "06-06-2006";

  const parsedDate = yield* Effect.try({
    try: () => parse(dateString, "DD-MM-YYYY"),
    catch: (cause) => new MalformedDateStringError({ dateString, cause }),
  });

  yield* Effect.log(parsedDate);
});
