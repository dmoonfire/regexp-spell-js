/**
* Describes a single word or token within a given text.
*/
export interface Word {
    start: number;
    end: number;
    word: string;
}

/**
* Defines the common functionality for the various spelling managers.
*/
export abstract class SpellingManager {
}

/**
* A token-based spelling manager that uses non-processed list of words to provides
* correctness testing and suggestions. This has both case-sensitive and -insensitive
* methods along with suggestions that are capitalized based on the incorrect word.
*/
export class TokenSpellingManager extends SpellingManager {
    public sensitive: any = {};
    public insensitive: any = {};

    /**
    * Adds a word to the manager. If the word is in all lowercase, then it is added as
    * a case insensitive word, otherwise it is added as a case sensitive result.
    */
    public add(token: string): void {
        if (token && token.trim() !== "") {
            // If we have at least one uppercase character, we are considered
            // case sensitive. We don't test for lowercase because we want to
            // ignore things like single quotes for posessives or contractions.
            if (/[A-Z]/.test(token)) {
                this.addCaseSensitive(token);
            } else {
                this.addCaseInsensitive(token);
            }
        }
    }

    public addCaseSensitive(token: string): void {
        if (token && token.trim() !== "") {
            this.sensitive[token] = true;
        }
    }
    public addCaseInsensitive(token: string): void {
        if (token && token.trim() !== "") {
            this.insensitive[token] = true;
        }
    }

    public check(token: string): boolean {
        if (token in this.sensitive) return true;
        if (token.toLowerCase() in this.insensitive) return true;
        return false;
    }
}

/**
* Provides a regex-based spell-checker with the ablity to report both negative
* (incorrect) and positive (correct) spellings.
*/
export class RegExpSpell {
    private wordBoundaries: RegExp = /(\W+)/;
    private knownWords: RegExp[] = [];

    constructor(knownWords?: RegExp[]|string[]) {
        // If we don't have known words, then just set it.
        if (!knownWords) { return; }

        // Build up a list of regex based on the elements.
        let list: RegExp[] = [];

        for (let item of knownWords) {
            // Figure out what to do based on the type.
            let isRegex = typeof item === "object";

            if (isRegex) {
                list.push(<RegExp>item);
            } else {
                let r = this.createRegex(<string>item);
                list.push(r);
            }
        }

        // Set the list since we're done.
        this.knownWords = list;
    }

    /**
    * Retrieves a list of known valid words within the text. This does not
    * include word break characters as set by the `setWordBoundaries`.
    */
    public getCorrectWords(input: string): Word[] {
        // If there are no known words, then we can just skip everything.
        let ranges = new Array<Word>();

        if (this.knownWords.length === 0) { return ranges; }

        // Get the words in the input.
        let words = this.getWords(input);

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
        let words = new Array<Word>();

        if (input == null || input === "" || /^\s*$/.test(input)) {
            return words;
        }

        // Otherwise, split the text on the words. We also grab the separators
        // (ensured in the set method) so we can just build up the various
        // indexes based on their length.
        let parts = input.split(this.wordBoundaries);
        let index = 0;

        for (let part of parts) {
            // If we aren't matching a word boundary, then add it to the word
            // list. We check the length greater than zero to avoid the final
            // match if the string ends in a word boundary.
            if (part.length > 0 && !this.wordBoundaries.test(part)) {
                let word = {
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

    private createRegex(input: string): RegExp {
        // Anchor the pattern to fit the entire string.
        let pattern = `^${input}$`;
        let r = new RegExp(pattern);
        return r;
    }
}
