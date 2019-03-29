export = hypher;
declare class hypher {
  constructor(language: any);
  trie: any;
  leftMin: any;
  rightMin: any;
  exceptions: any;
  createTrie(patternObject: any): any;
  hyphenate(word: any): any;
  hyphenateText(str: any, minLength?: any): any;
}
