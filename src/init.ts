/**
* Describes a single word or token within a given text.
*/
export interface Word {
    start: number;
    end: number;
    word: string;
}

/**
* Provides a regex-based spell-checker with the ablity to report both negative
* (incorrect) and positive (correct) spellings.
*/
export class RegExpSpell {
    private wordBoundaries: RegExp = /(\W+)/;
    private knownWords: RegExp[] = [];

    constructor(knownWords?: RegExp[]) {
        if (knownWords) { this.knownWords = knownWords; }
    }

    /**
    * Retrieves a list of known valid words within the text. This does not
    * include word break characters as set by the `setWordBoundaries`.
    */
    public getCorrectWords(input: string): Word[] {
        // If there are no known words, then we can just skip everything.
        var ranges = new Array<Word>();

        if (this.knownWords.length === 0) { return ranges; }

        // Get the words in the input.
        var words = this.getWords(input);

        // If there are no words in the input, then we won't have any input.
        if (words.length === 0) { return ranges; }

        // When we have both words in the input and a list of known words, we
        // can go through and see if any match. Once we find one, then add it
        // to the list and move to the next word.
        for (let word of words) {
            let found = false;
            for (let knownWord of this.knownWords) {
                if (knownWord.test(word.word)) {
                    found = true;
                    ranges.push(word);
                    break;
                }
            }
            if (found) { continue; }
        }

        // Return the resulting list of correct words.
        return ranges;
    }

    public getWords(input: string): Word[] {
        // If we have an empty string, then we have no ranges. We do this just
        // to avoid processing text if we don't have to.
        var words = new Array<Word>();

        if (input == null || input === "" || /^\s*$/.test(input)) {
            return words;
        }

        // Otherwise, split the text on the words. We also grab the separators
        // (ensured in the set method) so we can just build up the various
        // indexes based on their length.
        var parts = input.split(this.wordBoundaries);
        var index = 0;

        for (var part of parts) {
            // If we aren't matching a word boundary, then add it to the word
            // list. We check the length greater than zero to avoid the final
            // match if the string ends in a word boundary.
            if (part.length > 0 && !this.wordBoundaries.test(part)) {
                var word = {
                    start: index,
                    end: index + part.length,
                    word: part
                };
                words.push(word);
            }

            // Shift the character index to handle this part.
            index += part.length;
        }

        // Return the resulting non-boundary words.
        return words;
    }
}
