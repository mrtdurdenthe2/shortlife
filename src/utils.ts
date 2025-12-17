import { Effect } from "effect";
import { createElement } from "react";
import { TUI, setSharedData } from "./ui";
import { createRoot } from "@opentui/react";
import { createCliRenderer } from "@opentui/core";

const App = createElement(TUI);

export const calcBirthday = (data: { DoB: Date; Age: number }) =>
  Effect.sync(() => {
    setSharedData(data.DoB, data.Age);
    return data.DoB;
  });

export const startUI = Effect.tryPromise(async () => {
  const renderer = await createCliRenderer();
  const root = createRoot(renderer);
  root.render(App);
});
