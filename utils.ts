import { Effect } from "effect";
import { FileSystem } from "@effect/platform";
import { parse } from "@formkit/tempo";
import { filePath, validateContents } from "./initial";

const asd1 = validateContents("12-03-2023");

var startDate = Date.now();

//const test = validateContents("12-03-2023");
// function differance(DoB: Date, Current: Date): Date { }
//console.log(`${startDate}`);
