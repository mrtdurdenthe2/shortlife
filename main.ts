import { createCliRenderer, TextRenderable, Text } from "@opentui/core";
import { format, parse } from "@formkit/tempo";
import { Init } from "./initial";
const renderer = await createCliRenderer();
let currdate = format(new Date(), "full");

// Construct/Component (VNode)
const greeting2 = Text({
  content: currdate,
  fg: "#00FF00",
  position: "absolute",
  left: 10,
  top: 5,
});

renderer.root.add(greeting2);

while (true) {}
