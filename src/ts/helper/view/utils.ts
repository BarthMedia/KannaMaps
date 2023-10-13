// + Imports +

// Custom
import * as config from '../../config';

// + Functions +

// Returns true if it is a DOM element
export function isElement(o: any) {
  return typeof HTMLElement === 'object'
    ? o instanceof HTMLElement // DOM2
    : o &&
        typeof o === 'object' &&
        o !== null &&
        o.nodeType === 1 &&
        typeof o.nodeName === 'string';
}

// Capitialie every word
export function capitalizeEveryWord(inputString: string, onlyFirst = false) {
  // Split the input string into an array of words using space or hyphen as separators
  const words = inputString.split(/[\s-]+/);

  // Capitalize the first letter of each word and preserve original punctuation
  let capitalized = false;
  const capitalizedWords = words.map(word => {
    if (word.length > 0 && (!capitalized || !onlyFirst)) {
      const firstChar = word.charAt(0);
      const restOfWord = word.slice(1);
      capitalized = true;
      return firstChar.toUpperCase() + restOfWord;
    } else {
      return word; // Keep empty strings as they are
    }
  });

  // Join the capitalized words back into a string with original punctuation
  const capitalizedString = inputString
    .split(/\b/)
    .map((part, index) => {
      if (part.match(/[A-Za-z]/)) {
        return capitalizedWords.shift();
      } else {
        return part;
      }
    })
    .join('');

  return capitalizedString;
}
