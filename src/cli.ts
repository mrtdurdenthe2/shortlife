import { Console, Effect } from "effect";
import { Command, Options } from "@effect/cli";

import { fileCheck, Setup } from "./initial";
import { calcBirthday, startUI } from "./utils";

const date = Options.text("date").pipe(
  Options.withAlias("d"),
  Options.withDescription("Your date of birth (YYYY-MM-DD format)")
);
const age = Options.text("age").pipe(
  Options.withAlias("a"),
  Options.withDescription("Your expected lifespan in years"),
  Options.withDefault("25")
);

const setup = Command.make("setup", { date, age }, ({ date, age }) =>
  Effect.gen(function* () {
    yield* Setup(date, age);
    yield* Console.log("Setup complete! Run 'shortlife run' to start the timer.");
  })
).pipe(
  Command.withDescription("Configure your date of birth and expected lifespan")
);

const run = Command.make("run", {}, () =>
  Effect.gen(function* () {
    const data = yield* fileCheck;
    yield* calcBirthday(data);
    yield* startUI;
    // Keep the process alive
    return yield* Effect.never;
  })
).pipe(
  Command.withDescription("Display the life countdown timer")
);

const app = Command.make("shortlife").pipe(
  Command.withDescription("A memento mori CLI - visualize your remaining time"),
  Command.withSubcommands([setup, run])
);

export const cli = Command.run(app, {
  name: "shortlife",
  version: "1.0.2",
});
