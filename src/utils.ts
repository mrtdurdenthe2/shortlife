import { Effect } from "effect";
import { createElement } from "react";
import { TUI, setSharedData } from "./ui";
import { render } from "@opentui/react";

const App = createElement(TUI);

export const calcBirthday = (data: { DoB: Date; Age: number }) =>
  Effect.sync(() => {
    setSharedData(data.DoB, data.Age);
    return data.DoB;
  });

export const startUI = Effect.sync(() => {
  render(App, { exitOnCtrlC: true });
});
