import R from 'ramda';
import type { Corpus, GeneratedText, Prefix, Suffixes } from '../types';
import { splitString } from './helpers/splitString';
const { floor, random } = Math;

/*
 * Takes in the corpus of prefix/suffix-pairs and generates a chain of words
 * based on it as an Array of strings.
 */
type WalkChainParams = {
  corpus: Corpus;
  chain: Suffixes;
  wordLimit?: number;
};

export function walkChain({
  corpus,
  chain,
  wordLimit,
}: WalkChainParams): Suffixes {
  // End chain if limit is reached (default value is 50 words)
  if (chain.length >= (wordLimit || 50)) return chain;

  const currentPrefix = `${chain[chain.length - 2]} ${chain[chain.length - 1]}`;
  const suffixValues = corpus.get(currentPrefix);

  // Fallback for an invalid prefix
  if (!suffixValues) return chain;

  const suffix = suffixValues[floor(random() * suffixValues.length)];

  return walkChain({ corpus, chain: [...chain, suffix], wordLimit });
}

/*
 * Exposed function for text generation. Takes in a corpus-Map and a startingPrefix
 * to generate a string.
 */
type GenerateTextParams = {
  corpus: Corpus;
  startingPrefix: Prefix;
  wordLimit?: number;
};

export function generateText({
  corpus,
  startingPrefix,
  wordLimit,
}: GenerateTextParams): GeneratedText {
  // Validate corpus
  if (!R.is(Map, corpus)) {
    console.error('Invalid corpus value.');
    return startingPrefix;
  }

  if (corpus.size === 0) {
    console.error('Corpus is empty.');
    return startingPrefix;
  }

  // Validate startingPrefix
  if (!R.is(String, startingPrefix)) {
    console.error('Prefix is not a string.');
    return '';
  }

  if (startingPrefix.split(' ').length < 2) {
    console.error('Prefix has to be at least two words seperated by a space.');
    return startingPrefix;
  }

  // Validate wordLimit
  if (wordLimit !== undefined && !R.is(Number, wordLimit)) {
    console.error('Invalid wordLimit-value - has to be a number or undefined.');
    return startingPrefix;
  }

  if (R.is(Number, wordLimit) && wordLimit < 3) {
    console.error('Invalid wordLimit - must be 3 or higher.');
    return startingPrefix;
  }

  // Replace line-breaks with spaces and turn text into a words-array
  const chain = splitString(startingPrefix);

  return walkChain({
    corpus,
    chain,
    wordLimit,
  }).join(' ');
}
