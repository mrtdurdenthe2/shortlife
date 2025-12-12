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

type CountdownLabels = {
  ms: string;
  mins: string;
  hrs: string;
  days: string;
  years: string;
};

function breakdownDiffDHMS(from: Date, to: Date) {
  let start = new Date(from.getTime());
  let end = new Date(to.getTime());
  if (end.getTime() < start.getTime()) {
    const tmp = start;
    start = end;
    end = tmp;
  }

  let remainingMs = end.getTime() - start.getTime();

  const secondMs = 1000;
  const minuteMs = 60 * secondMs;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  const days = Math.floor(remainingMs / dayMs);
  remainingMs -= days * dayMs;

  const hours = Math.floor(remainingMs / hourMs);
  remainingMs -= hours * hourMs;

  const minutes = Math.floor(remainingMs / minuteMs);
  remainingMs -= minutes * minuteMs;

  const seconds = Math.floor(remainingMs / secondMs);

  return { days, hours, minutes, seconds };
}

export function TUI() {
  const { width: tw, height: th } = useTerminalDimensions();
  const asciiFont = "block";
  
  const [labels, setLabels] = useState<CountdownLabels>({
    ms: "0S",
    mins: "0M",
    hrs: "0H",
    days: "0D",
    years: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const birthday = addYear(sharedDoB, sharedAge);
      const now = new Date();
      const { days, hours, minutes, seconds } = breakdownDiffDHMS(now, birthday);
      
      setLabels({
        ms: `${seconds}S`,
        mins: `${minutes}M`,
        hrs: `${hours}H`,
        days: `${days}D`,
        years: "",
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Columns: exactly half/half
  const leftW = Math.floor(tw / 2);
  const rightW = tw - leftW;

  // Left column: 3 rows
  const lH = Math.floor(th / 3);
  const leftH1 = lH;
  const leftH2 = lH;
  const leftH3 = th - leftH1 - leftH2;

  // Right column: 2 rows
  const rightH1 = Math.floor(th / 2);
  const rightH2 = th - rightH1;

  return (
    <box
      style={{
        width: tw,
        height: th,
        backgroundColor: "#000000",
        flexDirection: "row",
      }}
    >
      {/* LEFT COLUMN (3 rows) */}
      <box style={{ width: leftW, height: th, flexDirection: "column" }}>
        <box
          style={{
            width: leftW,
            height: leftH1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ascii-font text={labels.ms} font={asciiFont} />
        </box>
        <box
          style={{
            width: leftW,
            height: leftH2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ascii-font text={labels.mins} font={asciiFont} />
        </box>
        <box
          style={{
            width: leftW,
            height: leftH3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ascii-font text={labels.hrs} font={asciiFont} />
        </box>
      </box>

      {/* RIGHT COLUMN (2 rows) */}
      <box style={{ width: rightW, height: th, flexDirection: "column" }}>
        <box
          style={{
            width: rightW,
            height: rightH1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ascii-font text={labels.days} font={asciiFont} />
        </box>
        <box
          style={{
            width: rightW,
            height: rightH2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ascii-font text={labels.years} font={asciiFont} />
        </box>
      </box>
    </box>
  );
}
