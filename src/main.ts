import { BunContext, BunRuntime, BunTerminal } from "@effect/platform-bun";
import { BunFileSystem } from "@effect/platform-bun";
import { Effect, Layer } from "effect";

import { cli } from "./cli";

const platform = Layer.mergeAll(BunContext.layer, BunTerminal.layer, BunFileSystem.layer);

BunRuntime.runMain(cli(process.argv).pipe(Effect.provide(platform)));
