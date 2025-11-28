import { Effect, Data, JSONSchema } from "effect";
import { FileSystem, Terminal } from "@effect/platform";
import { parse } from "@formkit/tempo";
import { Deets } from "./cli";
export const filePath = "topsecret.txt"; // should make this into an .env
class MalformedDateStringError extends Data.TaggedError(
  // Credit to Maxwell Brown for this
  "MalformedDateStringError",
)<{
  readonly dateString: string;
  readonly cause: unknown;
}> {}

const makeDoBFile = Effect.gen(function* () {
  console.log("makeDoBFile");
  yield* Effect.tryPromise(() => Bun.write("secret.json", ""));
});

function cleanDateInput(input: string) {
  return input.replace(/[^0-9/-]/g, ``);
}

export function validateDateString(contents: string) {
  // make the user input a date again if the date is incorrect
  return Effect.gen(function* () {
    console.log("validateDateString");
    contents = cleanDateInput(contents);
    console.log(`cleaned input: ${contents}`);
    yield* Effect.try({
        try: () => console.log(parse(contents, "DD/MM/YYYY")),
        catch: (cause) =>
          new MalformedDateStringError({ dateString: contents, cause }),
    });

  });
}

export const newDoB = Effect.gen(function* () {
  console.log("newDoB");
  const fs = yield* FileSystem.FileSystem;
  const terminal = yield* Terminal.Terminal;
  yield* terminal.display("Enter your DoB in a YYYY-MM-DD format \n");
  let input = yield* terminal.readLine;
  input = cleanDateInput(input);
  validateDateString(input);
  yield* fs.writeFileString(filePath, input);
});


export const Setup = Effect.fn("newDoBCli")(function* (DoB: string, Age: string) {
  const fs = yield* FileSystem.FileSystem;
  let input = cleanDateInput(DoB);
  validateDateString(input);
  const jsonobj = JSONSchema.make(Deets)
  yield* Effect.tryPromise(() =>Bun.write("secrets.json", JSON.stringify(jsonobj, DoB, Age)))
});

export const fileCheck = Effect.gen(function* () {
  console.log("fileCheck");
  // gens will short circuit whenever there is an err
  const fs = yield* FileSystem.FileSystem;

  // .exists() method returns a True/False when we need an Effect
  yield* fs
    .exists(filePath)
    .pipe(
      Effect.flatMap((exists) =>
        exists
          ? Effect.succeed(undefined)
          : Effect.all([makeDoBFile, newDoB]).pipe(Effect.map(() => {})),
      ),
    );
  const contents = yield* fs.readFileString(filePath);
  yield* validateDateString(contents);
});
