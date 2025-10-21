import { Effect } from "effect";
import { parse } from "@formkit/tempo";
import { newDoB } from "./initial.ts";

// const ParseDate = Effect.gen(function* () {
//   return yield* Effect.try(() => parse("06-06-2006", "DD-MM-YYYY")).pipe(
//     Effect.catchAll(() => newDoB()),
//   );
// });

// const validateContents = Effect.gen(function* () {
//   return yield* Effect.orElse(ParseDate, () => newDoB());
// });

// ParseDate.pipe(Effect.catchAllCause(Effect.logError));

const ParseDate = Effect.try(() => parse("06-06-2006", "DD-MM-YYYY"));

const validateContents = Effect.orElse(ParseDate, () => newDoB());

validateContents;
