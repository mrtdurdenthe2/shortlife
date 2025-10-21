import { Effect, Data } from "effect";
import { FileSystem, Terminal } from "@effect/platform";
import { parse } from "@formkit/tempo";
import { writeFile } from "node:fs/promises";

export const filePath = "topsecret.txt"; // should make this into an .env

const makeDoBFile = Effect.gen(function* () {
  yield* Effect.tryPromise(() => writeFile("./topsecret.txt", "", "utf8"));
});

class MalformedDateStringError extends Data.TaggedError(
  "MalformedDateStringError",
)<{
  readonly dateString: string;
  readonly cause: unknown;
}> {}

function validateContents(contents: string) {
  return Effect.gen(function* () {
    const dateString = "06-06-2006";
    const parsedDate = yield* Effect.try({
      try: () => parse(dateString, "DD-MM-YYYY"),
      catch: (cause) => new MalformedDateStringError({ dateString, cause }),
    });

    yield* Effect.log(parsedDate);
  });
}

export function newDoB() {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const terminal = yield* Terminal.Terminal;
    yield* terminal.display("Enter your DoB in a DD-MM-YYYY format \n");
    const input = yield* terminal.readLine;
    yield* fs.writeFileString(filePath, input);
    const contents = yield* fs.readFileString(filePath);
    // validateContents(contents);
  });
}

const fileCheck = Effect.gen(function* () {
  // gens will short circuit whenever there is an err, weS will handle
  const fs = yield* FileSystem.FileSystem;

  // .exists() method returns a True/False when we need an Effect
  yield* fs
    .exists(filePath)
    .pipe(
      Effect.flatMap((exists) =>
        exists
          ? Effect.succeed(undefined)
          : Effect.all([makeDoBFile, newDoB()]).pipe(Effect.map(() => {})),
      ),
    );
  const contents = yield* fs.readFileString(filePath);
  yield* validateContents(contents);
});
