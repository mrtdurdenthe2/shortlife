function cleanDateInput (input: string) {
    return input.replace(/[^0-9-]/g, ``)
  } 