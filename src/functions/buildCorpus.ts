import type { Corpus, Source } from 'types';

/*
 * Takes a text and turns it into a Map of prefixes (key) with their corresponding
 * suffixes as an array of strings (value).
 */
export function buildCorpus(textInput: Source): Corpus {
  const wordsArray = textInput.split(' ');

  return wordsArray.reduce((acc, currentValue, currentIndex) => {
    // Stop creating pairs, once we run out of sufficent words for a prefix/suffix pair
    if (currentIndex > wordsArray.length - 3) return acc;

    const prefix = `${currentValue} ${wordsArray[currentIndex + 1]}`;
    const suffix = wordsArray[currentIndex + 2];

    // Check if prefix already has an entry and push to its suffixes-array
    if (acc.get(prefix)) {
      acc.get(prefix).push(suffix);
      return acc;
    }

    // Create new prefix entry
    acc.set(prefix, [suffix]);
    return acc;
  }, new Map());
}
