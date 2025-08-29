// Core classification + formatting logic for /bfhl

function isIntegerString(s) {
  return typeof s === "string" && /^-?\d+$/.test(s.trim());
}

function isAlphabeticString(s) {
  return typeof s === "string" && /^[A-Za-z]+$/.test(s.trim());
}

function alternatingCapsFromReversedChars(chars) {
  // chars: array of single characters in encounter order (alphabetic only)
  const rev = [...chars].reverse();
  return rev
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

function classifyData(inputArray) {
  const odd_numbers = [];
  const even_numbers = [];
  const alphabets = [];
  const special_characters = [];
  const alphaCharsForConcat = [];

  let sum = 0;

  for (const raw of inputArray) {
    const token = String(raw); // treat everything as string

    if (isIntegerString(token)) {
      const n = parseInt(token, 10);
      // keep original string in output arrays
      if (Math.abs(n) % 2 === 0) {
        even_numbers.push(token);
      } else {
        odd_numbers.push(token);
      }
      sum += n;
      continue;
    }

    if (isAlphabeticString(token)) {
      // push uppercased word to alphabets
      alphabets.push(token.toUpperCase());
      // collect original chars for concat_string (only from alphabetic tokens)
      for (const ch of token) alphaCharsForConcat.push(ch);
      continue;
    }

    // everything else is a special character/string token
    special_characters.push(token);
  }

  const concat_string = alternatingCapsFromReversedChars(alphaCharsForConcat);

  return {
    odd_numbers,
    even_numbers,
    alphabets,
    special_characters,
    sum: String(sum),
    concat_string
  };
}

function makeUserId(fullName, dob_ddmmyyyy) {
  return `${String(fullName || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")}_${String(dob_ddmmyyyy || "").trim()}`;
}

module.exports = {
  classifyData,
  makeUserId
};
