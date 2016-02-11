/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../init.ts"/>
import { RegExpSpell, Word } from "../init";

describe("getCorrectWords with empty list", function() {
    it("null string returns nothing", function() {
        let spell = new RegExpSpell();
        var words = spell.getCorrectWords(null);
        expect(words).toEqual(new Array<Word>());
    });

    it("undefined returns nothing", function() {
        let spell = new RegExpSpell();
        var words = spell.getCorrectWords(undefined);
        expect(words).toEqual(new Array<Word>());
    });

    it("single word returns nothing", function() {
        let spell = new RegExpSpell();
        var words = spell.getCorrectWords("I");
        expect(words).toEqual(new Array<Word>());
    });

    it("triple word returns three", function() {
        let spell = new RegExpSpell();
        var words = spell.getCorrectWords("I like cheese.");
        expect(words).toEqual(new Array<Word>());
    });

    it("triple with newline returns three", function() {
        let spell = new RegExpSpell();
        var words = spell.getCorrectWords("I\nlike\ncheese.");
        expect(words).toEqual(new Array<Word>());
    });
});

describe("getCorrectWords with simple match", function() {
    it("single word returns one", function() {
        let spell = new RegExpSpell([/\w+/]);
        var words = spell.getCorrectWords("I");
        expect(words).toEqual([
            { start: 0, end: 1, word: "I" }
        ]);
    });

    it("triple word returns three", function() {
        let spell = new RegExpSpell([/\w+/]);
        var words = spell.getCorrectWords("I like cheese.");
        expect(words).toEqual([
            { start: 0, end: 1, word: "I" },
            { start: 2, end: 6, word: "like" },
            { start: 7, end: 13, word: "cheese" }
        ]);
    });

    it("triple with newline returns three", function() {
        let spell = new RegExpSpell([/\w+/]);
        var words = spell.getCorrectWords("I\nlike\ncheese.");
        expect(words).toEqual([
            { start: 0, end: 1, word: "I" },
            { start: 2, end: 6, word: "like" },
            { start: 7, end: 13, word: "cheese" }
        ]);
    });
});


describe("getCorrectWords with simple list", function() {
    it("single word returns none", function() {
        let spell = new RegExpSpell([/eat/, /like/, /store/]);
        var words = spell.getCorrectWords("I");
        expect(words).toEqual([]);
    });

    it("triple word returns one", function() {
        let spell = new RegExpSpell([/eat/, /like/, /store/]);
        var words = spell.getCorrectWords("I like cheese.");
        expect(words).toEqual([
            { start: 2, end: 6, word: "like" }
        ]);
    });

    it("triple with newline returns one", function() {
        let spell = new RegExpSpell([/eat/, /like/, /store/]);
        var words = spell.getCorrectWords("I\nlike\ncheese.");
        expect(words).toEqual([
            { start: 2, end: 6, word: "like" }
        ]);
    });
});
