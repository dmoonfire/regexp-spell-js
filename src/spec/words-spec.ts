/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../init.ts"/>
import { RegExpSpell, Word } from "../init";

describe("getWords", function() {
    it("null string returns nothing", function() {
        let spell = new RegExpSpell();
        var words = spell.getWords(null);
        expect(words).toEqual(new Array<Word>());
    });

    it("undefined returns nothing", function() {
        let spell = new RegExpSpell();
        var words = spell.getWords(undefined);
        expect(words).toEqual(new Array<Word>());
    });

    it("single word returns one", function() {
        let spell = new RegExpSpell();
        var words = spell.getWords("I");
        expect(words).toEqual([
            { start: 0, end: 1, word: "I" }
        ]);
    });

    it("triple word returns three", function() {
        let spell = new RegExpSpell();
        var words = spell.getWords("I like cheese.");
        expect(words).toEqual([
            { start: 0, end: 1, word: "I" },
            { start: 2, end: 6, word: "like" },
            { start: 7, end: 13, word: "cheese" }
        ]);
    });

    it("triple with newline returns three", function() {
        let spell = new RegExpSpell();
        var words = spell.getWords("I\nlike\ncheese.");
        expect(words).toEqual([
            { start: 0, end: 1, word: "I" },
            { start: 2, end: 6, word: "like" },
            { start: 7, end: 13, word: "cheese" }
        ]);
    });
});
