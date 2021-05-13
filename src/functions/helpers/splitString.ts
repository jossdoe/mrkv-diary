export function splitString(text: string): string[] {
  // Replace line-breaks with spaces and turn text into a words-array
  return text.replace(/(\r\n|\n|\r)/gm, ' ').split(' ');
}
