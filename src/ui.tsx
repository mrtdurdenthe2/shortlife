//vibecoded

// If your types don't include <ascii-font>, keep this tiny shim:
declare namespace JSX {
  interface IntrinsicElements {
    "ascii-font": any;
  }
}

import { render, useTerminalDimensions } from "@opentui/react";

export const countdownLabels = {
  ms: "1ms",
  mins: "1m",
  hrs: "1h",
  months: "1M",
  years: "1Y",
};


await render(<TUI />, {
  // Optional renderer configuration
  exitOnCtrlC: true,
});

export function TUI() {
  const { width: tw, height: th } = useTerminalDimensions();
  const asciiFont = "block";
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
          <ascii-font text={countdownLabels.ms} font={asciiFont} />
        </box>
        <box
          style={{
            width: leftW,
            height: leftH2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ascii-font text={countdownLabels.mins} font={asciiFont} />
        </box>
        <box
          style={{
            width: leftW,
            height: leftH3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ascii-font text={countdownLabels.hrs} font={asciiFont} />
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
          <ascii-font text={countdownLabels.months} font={asciiFont} />
        </box>
        <box
          style={{
            width: rightW,
            height: rightH2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ascii-font text={countdownLabels.years} font={asciiFont} />
        </box>
      </box>
    </box>
  );
}


