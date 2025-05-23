import * as fontkit from "fontkit";

function isCollection(font: fontkit.Font | fontkit.FontCollection): font is fontkit.FontCollection {
    return font.type === "TTC" || font.type === "DFont";
}

// -----------------
// API: fontkit.open
// -----------------
// @ts-expect-error Should expect error for v1 api usage with v2 types
const openV1 = fontkit.open("fonts/a-font.ttf", "postscriptName", () => {});
const openV2 = fontkit.open("fonts/a-font.ttf");
const openV2withPostscriptName = fontkit.open("fonts/a-font.ttf", "postscriptName");

// -----------------
// API: Font['OS/2']
// -----------------
openV2.then(font => {
    if (!isCollection(font)) {
        const { xAvgCharWidth, fsSelection } = font["OS/2"];
        const isNegative = fsSelection.negative;
        fsSelection.bold; // $ExpectType boolean
    }
});

// -----------------------
// API: Font.variationAxes
// -----------------------
openV2.then(font => {
    if (!isCollection(font)) {
        font.variationAxes.wght?.name; // $ExpectType string | undefined
        font.variationAxes.wght?.min; // $ExpectType number | undefined
        font.variationAxes.wght?.default; // $ExpectType number | undefined
        font.variationAxes.wght?.max; // $ExpectType number | undefined
    }
});

// ---------------------
// API: fontkit.openSync
// ---------------------
const f = fontkit.openSync("fonts/a-font.ttf");

// ----------------
// API: Font.layout
// ----------------
if (!isCollection(f)) {
    const { glyphs, positions } = f.layout("Hello World!");
    const res = [];
    for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        const pos = positions[i];
        let x = `${glyph.id}`;
        if (pos.xOffset || pos.yOffset) {
            x += `@${pos.xOffset},${pos.yOffset}`;
        }

        x += `+${pos.xAdvance}`;
        res.push(x);
    }

    res.join("|");

    const dims = [];
    for (const glyph of glyphs) {
        const bbox = glyph.bbox;
        let dim = `${glyph.id}`;
        dim += ` w:${bbox.width} h:${bbox.height}`;
        dims.push(dim);
    }
    dims.join("|");
}

// -----------------
// API: Font['hhea']
// -----------------
openV2.then(font => {
    if (!isCollection(font)) {
        font["hhea"].version; // $ExpectType number
        font.getGlyph; // $ExpectType (glyphId: number, codePoints?: number[] | undefined) => Glyph
        font.getGlyph(0); // $ExpectType Glyph
    }
});

// ------------------
// API: FontCollection
// -----------------
openV2.then(font => {
    if (isCollection(font)) {
        font.fonts; // $ExpectType Font[]
        font.getFont("hhe"); // $ExpectType Font | null
    }
});
