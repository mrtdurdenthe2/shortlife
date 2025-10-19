import { Effect } from "effect";
import { FileSystem, Terminal } from "@effect/platform";
import { NodeContext, NodeRuntime, NodeTerminal } from "@effect/platform-node";
import { parse } from "@formkit/tempo";
import { writeFile } from "node:fs/promises";

export const filePath = "topsecret.txt"; // should make this into an .env
const makeDoBFile = Effect.gen(function* () {
  yield* Effect.tryPromise(() => writeFile("./topsecret.txt", "", "utf8"));
});

function newDoB(fs: FileSystem.FileSystem) {
  return Effect.gen(function* () {
    const terminal = yield* Terminal.Terminal;
    yield* terminal.display("Enter a guess: \n");
    const input = yield* terminal.readLine;
    yield* fs.writeFileString(filePath, input);
    const contents = yield* fs.readFileString(filePath);
    validateContents(fs, contents);
  });
}

export function validateContents(fs: FileSystem.FileSystem, contents: string) {
  return Effect.gen(function* () {
    yield* Effect.orElse(
      Effect.try(() => parse(contents, "DD-MM-YYYY")),
      () => newDoB(fs),
    );
  });
}

const fileCheck = Effect.gen(function* () {
  // gens will short circuit whenever there is an err, we will handle
  const fs = yield* FileSystem.FileSystem;

  // .exists() method returns a True/False when we need an Effect
  yield* fs
    .exists(filePath)
    .pipe(
      Effect.flatMap((exists) =>
        exists
          ? Effect.succeed(undefined)
          : Effect.all([makeDoBFile, newDoB(fs)]).pipe(Effect.map(() => {})),
      ),
    );
  const contents = yield* fs.readFileString(filePath);
  yield* validateContents(fs, contents);

  // console.log(isThere, contents)
});

export function Init() {
  NodeRuntime.runMain(fileCheck.pipe(Effect.provide(NodeContext.layer)));
}

Init();
