import { Effect, Console} from "effect";
import { Args, Command, Options } from "@effect/cli";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { atLeast } from "@effect/cli/Options";
// no args = view age
// --set == set age
// --bd == set birthday
//
// > shortlife
// Your current set birthday is {}


const Idate = Options.text("date").pipe(Options.withAlias("d"))

const Iage = Options.text("age").pipe(Options.withAlias("a"))

const setup = Command.make("date", { Idate, Iage}, ({ Idate, Iage }) =>
 Console.log("TEST") 
);
