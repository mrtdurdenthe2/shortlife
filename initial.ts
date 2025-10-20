import { Effect } from "effect";
import { FileSystem, Terminal } from "@effect/platform";
import { NodeContext, NodeRuntime, NodeTerminal } from "@effect/platform-node";
import { parse } from "@formkit/tempo";
import { writeFile } from "node:fs/promises";

export const filePath = "topsecret.txt"; // should make this into an .env
const makeDoBFile = Effect.gen(function* () {
  yield* Effect.tryPromise(() => writeFile("./topsecret.txt", "", "utf8"));
});

function newDoB() {
  return Effect.gen(function* () {
    // console.log("making new dob");
    const fs = yield* FileSystem.FileSystem;
    const terminal = yield* Terminal.Terminal;
    yield* terminal.display("Enter your DoB in a DD-MM-YYYY format \n");
    const input = yield* terminal.readLine;
    yield* fs.writeFileString(filePath, input);
    const contents = yield* fs.readFileString(filePath);
    validateContents(contents);
  });
}

export function validateContents(contents: string) {
  return Effect.gen(function* () {
    yield* Effect.orElse(
      // when the contents are invalid, it throws an Error example: "error: Date (hthdtrh) does not match format (DD-MM-YYYY)"
      // yet for some reason, when the contents are valid (tested separately), it still resorts to the else
      Effect.try(() => parse(contents, "DD-MM-YYYY")),
      () => newDoB(),
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
          : Effect.all([makeDoBFile, newDoB()]).pipe(Effect.map(() => {})),
      ),
    );
  const contents = yield* fs.readFileString(filePath);
  yield* validateContents(contents);
});

export function Init() {
  NodeRuntime.runMain(fileCheck.pipe(Effect.provide(NodeContext.layer)));
}

Init();
