import { Console, Effect } from "effect";
import { Command, Options } from "@effect/cli";

import { fileCheck, Setup } from "./initial";
import { calcBirthday, startUI } from "./utils";

const date = Options.text("date").pipe(Options.withAlias("d"));
const age = Options.text("age").pipe(Options.withAlias("a"));

const setup = Command.make("setup", { date, age }, ({ date, age }) =>
  Effect.gen(function* () {
    yield* Setup(date, age);
    yield* Console.log("Setup complete! Run 'shortlife run' to start the timer.");
  })
);

const run = Command.make("run", {}, () =>
  Effect.gen(function* () {
    const data = yield* fileCheck;
    yield* calcBirthday(data);
    yield* startUI;
    // Keep the process alive
    return yield* Effect.never;
  })
);

const app = Command.make("shortlife").pipe(
  Command.withSubcommands([setup, run])
);

export const cli = Command.run(app, {
  name: "shortlife",
  version: "1.0.2",
});
