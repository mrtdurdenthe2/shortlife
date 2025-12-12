import { Effect, Data, Schema } from "effect";
import { FileSystem } from "@effect/platform";
import { parse } from "@formkit/tempo";
export const filePath = "secrets.csv";

class MalformedDateStringError extends Data.TaggedError(
  // Credit to Maxwell Brown for this
  "MalformedDateStringError",
)<{
  readonly dateString: string;
  readonly cause: unknown;
}> {}

export const Deets = Schema.Struct({
  DoB: Schema.DateFromString,
  Age: Schema.NumberFromString,
}); 

// Extract keys from Deets schema programmatically
const deetsKeys = Object.keys(Deets.fields) as (keyof typeof Deets.fields)[];
const expectedHeader = deetsKeys.join(",");

// Schema to validate CSV header matches Deets keys
const CSVHeaderSchema = Schema.String.pipe(
  Schema.filter((header) => header === expectedHeader, {
    message: () => `Header must be "${expectedHeader}"`,
  })
);

// Schema to parse and validate a single CSV data row
const CSVRowSchema = Schema.transform(
  Schema.TemplateLiteralParser(
    Schema.String,
    Schema.Literal(","),
    Schema.String
  ),
  Deets,
  {
    strict: true,
    decode: (tuple) => {
      // tuple is [value0, ",", value1] - extract values at even indices
      const values = tuple.filter((_, i) => i % 2 === 0) as string[];
      return Object.fromEntries(
        deetsKeys.map((key, i) => [key, values[i]])
      ) as Schema.Schema.Encoded<typeof Deets>;
    },
    encode: (obj) => {
      const values = deetsKeys.map((key) => obj[key]);
      // Interleave values with commas: [v0, ",", v1]
      return values.flatMap((v, i) => (i === 0 ? [v] : [",", v])) as [string, ",", string];
    },
  }
);

// Combined CSV Schema for full file validation
const CSVSchema = Schema.Struct({
  header: CSVHeaderSchema,
  rows: Schema.Array(CSVRowSchema),
})

function cleanDateInput(input: string) {
  return input.replace(/[^0-9/-]/g, ``);
}

export function validateDateString(contents: string) {
  // make the user input a date again if the date is incorrect
  return Effect.gen(function* () {
    console.log("validateDateString");
    contents = cleanDateInput(contents);
    console.log(`cleaned input: ${contents}`);
    yield* Effect.try({
      try: () => console.log(parse(contents, "DD/MM/YYYY")),
      catch: (cause) =>
        new MalformedDateStringError({ dateString: contents, cause }),
    });
  });
}

export const Setup = Effect.fn("newDoBCli")(function* (
  DoB: string,
  Age: string,
) {
  const fs = yield* FileSystem.FileSystem;
  // Build CSV row string from inputs
  const rowString = `${cleanDateInput(DoB)},${cleanDateInput(Age)}`;
  // Validate using CSVRowSchema
  yield* Schema.decodeUnknown(CSVRowSchema)(rowString);
  // Write as CSV with header
  const csvContent = `${expectedHeader}\n${rowString}`;
  yield* Effect.tryPromise(() => Bun.write(filePath, csvContent));
});

export const fileCheck = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const exists = yield* fs.exists(filePath);
  if (!exists) {
    yield* Effect.fail(new Error(`Config file not found. Run 'shortlife setup -d "YYYY-MM-DD" -a "age"' first.`));
  }
  const contents = yield* fs.readFileString(filePath);
  const lines = contents.trim().split("\n");
  
  // Validate header
  yield* Schema.decodeUnknown(CSVHeaderSchema)(lines[0]);
  
  // Validate and parse data row using CSVRowSchema
  const data = yield* Schema.decodeUnknown(CSVRowSchema)(lines[1]);
  
  return data;
});
