import { Corpus, GeneratedText, Prefix, Suffixes } from '../types';
const { floor, random } = Math;

/*
 * Randomly returns a boolean. The chance to hit true starts at the min value
 * and progressively increases until it reaches 100% at the max value.
 */
type IsEndingParams = {
  currentIndex: number;
  min: number;
  max: number;
};

export function isEnding({ currentIndex, min, max }: IsEndingParams) {
  if (currentIndex < min) return false;
  const scale = 100 / (max - min);
  if (random() * 100 < (currentIndex - min) * scale) return true;
  return false;
}

/*
 * Takes in the corpus of prefix/suffix-pairs and generates a chain of words
 * based on it as an Array of strings.
 */
type WalkChainParams = {
  corpus: Corpus;
  chain: Suffixes;
};

export function walkChain({ corpus, chain }: WalkChainParams): Suffixes {
  // Check if the chain is ending (currently hard-coded randomizer)
  if (isEnding({ currentIndex: chain.length, min: 50, max: 70 })) return chain;

  const currentPrefix = `${chain[chain.length - 2]} ${chain[chain.length - 1]}`;
  const suffixValues = corpus.get(currentPrefix);

  // Fallback for an invalid prefix
  if (!suffixValues) return chain;

  const suffix = suffixValues[floor(random() * suffixValues.length)];

  return walkChain({ corpus, chain: [...chain, suffix] });
}

/*
 * Exposed function for text generation. Takes in a corpus-Map and a startingPrefix
 * to generate a string.
 */
type GenerateTextParams = {
  corpus: Corpus;
  startingPrefix: Prefix;
};

export function generateText({
  corpus,
  startingPrefix,
}: GenerateTextParams): GeneratedText {
  // Replace line-breaks with spaces and turn text into a words-array
  const chain = startingPrefix.replace(/(\r\n|\n|\r)/gm, ' ').split(' ');

  return walkChain({
    corpus,
    chain,
  }).join(' ');
}
