import { NodeContext, NodeRuntime, NodeTerminal } from "@effect/platform-node";
import { Duration, Effect, Layer, Schedule } from "effect";
import { createElement } from "react";
import { diffMilliseconds, diffSeconds, diffMinutes, diffMonths, diffYears, date, parse, diffWeeks} from "@formkit/tempo";
import { validateDateString } from "./src/initial";
import { floor } from "effect/BigDecimal";


const platform = Layer.mergeAll(NodeContext.layer, NodeTerminal.layer);


// const main = Effect.gen(function* () {
//   yield* validateDateString("29/01/2009")
// }).pipe(Effect.provide(platform));

// NodeRuntime.runMain(main);


// find diff from one date to another in months and years
// get the yearDiff(floor) and subtract it away from the months
// do the same for (week, days ), (hours, mins), etc.

const date1 = new Date()
const date2 = parse("21/01/2030", "DD/MM/YYYY")

function calcTimeLeft(startdate: Date, enddate: Date) {
  let yearsLeft = diffYears(startdate, enddate)
  let monthsLeft =  (diffMonths(startdate, enddate) - (diffYears(startdate, enddate) * 12))
  let weeksLeft =  (diffWeeks(startdate, enddate) - (monthsLeft * 4))
  console.log(monthsLeft, weeksLeft)
  
  return monthsLeft
  
}
calcTimeLeft(date2,date1)  
