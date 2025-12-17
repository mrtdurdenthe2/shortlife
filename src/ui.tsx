//vibecoded

// If your types don't include <ascii-font>, keep this tiny shim:
declare namespace JSX {
  interface IntrinsicElements {
    "ascii-font": any;
  }
}

import { useState, useEffect } from "react";
import { useTerminalDimensions } from "@opentui/react";
import { addYear } from "@formkit/tempo";

// Shared state that can be set from outside
export let sharedDoB: Date = new Date();
export let sharedAge: number = 80;

export function setSharedData(dob: Date, age: number) {
  sharedDoB = dob;
  sharedAge = age;
}

// Average year in milliseconds (365.25 days to account for leap years)
const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

function calcDecimalYears(from: Date, to: Date): number {
  const diffMs = to.getTime() - from.getTime();
  return diffMs / YEAR_MS;
}

export function TUI() {
  const { width: tw, height: th } = useTerminalDimensions();
  const asciiFont = "block";
  
  const [yearsLabel, setYearsLabel] = useState("0.00000000");

  useEffect(() => {
    const interval = setInterval(() => {
      const birthday = addYear(sharedDoB, sharedAge);
      const now = new Date();
      const years = calcDecimalYears(now, birthday);
      
      setYearsLabel(years.toFixed(8));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <box
      style={{
        width: tw,
        height: th,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ascii-font text={yearsLabel} font={asciiFont} />
    </box>
  );
}
