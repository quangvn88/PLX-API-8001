// ---------------------------------------------------------------------------
// excelWorksheetToHtml — renders a single ExcelJS worksheet to an HTML <table>
// string, preserving fill/font/border/alignment/merges. Self-contained: only
// needs ExcelJS's Worksheet object (already loaded) and 'moment' for dates.
// ---------------------------------------------------------------------------
const moment = require("moment");

function excelWorksheetToHtml(worksheet) {
    // ---- 1. Escaping -------------------------------------------------------
    const escapeHtml = (value) =>
        String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    // ---- 2. Color resolution (argb only; theme/indexed degrade to "no color")
    // ExcelJS color objects come in 3 shapes:
    //   { argb: 'AARRGGBB' }   -> fully resolvable, we use it
    //   { theme: n, tint: t }  -> refers to the workbook's theme1.xml palette,
    //                             which ExcelJS does not expose/resolve for us
    //   { indexed: n }         -> refers to the legacy 56-color OOXML palette,
    //                             also not exposed by ExcelJS
    // For the latter two we deliberately return null rather than guessing, so
    // we never emit a CSS color value that could be wrong, and never emit
    // something like "background-color: [object Object]" (invalid CSS).
    const resolveArgbColor = (colorObj) => {
        if (!colorObj || typeof colorObj !== "object") return null;
        if (typeof colorObj.argb === "string" && /^[0-9A-Fa-f]{8}$/.test(colorObj.argb)) {
            const alphaHex = colorObj.argb.slice(0, 2);
            const rgbHex = colorObj.argb.slice(2);
            const alpha = parseInt(alphaHex, 16);
            if (alpha === 0) return null; // fully transparent fill -> no visible bg
            return `#${rgbHex}`;
        }
        // { theme, tint } or { indexed } or malformed -> not resolvable here
        return null;
    };

    // ---- 3. Border style mapping --------------------------------------------
    const BORDER_STYLE_MAP = {
        hair: "1px solid",
        thin: "1px solid",
        dotted: "1px dotted",
        dashed: "1px dashed",
        dashDot: "1px dashed",
        dashDotDot: "1px dashed",
        mediumDashed: "2px dashed",
        mediumDashDot: "2px dashed",
        mediumDashDotDot: "2px dashed",
        slantDashDot: "2px dashed",
        medium: "2px solid",
        thick: "3px solid",
        double: "3px double",
    };

    const buildBorderSideCss = (side) => {
        if (!side || !side.style) return null;
        const widthStyle = BORDER_STYLE_MAP[side.style] || "1px solid";
        const color = resolveArgbColor(side.color);
        // If the color isn't resolvable, omit it: the browser falls back to
        // currentColor (the cell's text color / black), which still draws a
        // visible border instead of us emitting an invalid/empty color value.
        return color ? `${widthStyle} ${color}` : widthStyle;
    };

    // ---- 4. Alignment mapping ------------------------------------------------
    const H_ALIGN_MAP = {
        left: "left",
        center: "center",
        right: "right",
        fill: "left",
        justify: "justify",
        centerContinuous: "center",
        distributed: "center",
    };
    const V_ALIGN_MAP = {
        top: "top",
        middle: "middle",
        bottom: "bottom",
        distributed: "middle",
        justify: "middle",
    };

    // ---- 5. Cell text (dates special-cased via moment) -----------------------
    const getCellDisplayText = (cell) => {
        const value = cell.value;
        if (value === null || value === undefined) return "";

        if (value instanceof Date) {
            const fmt = (cell.numFmt || "").toLowerCase();
            const fmtLooksLikeTime = /h|:|am\/pm/.test(fmt);
            const dateHasTimeComponent =
                value.getUTCHours() !== 0 ||
                value.getUTCMinutes() !== 0 ||
                value.getUTCSeconds() !== 0;
            const hasTime = fmtLooksLikeTime || dateHasTimeComponent;
            return moment(value).format(hasTime ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY");
        }

        // cell.text is ExcelJS's formatted display value: it already handles
        // formulas (shows the result), rich text (joins runs), numbers with
        // numFmt applied, hyperlinks, etc. Use it whenever it's meaningful.
        if (cell.text !== undefined && cell.text !== null && cell.text !== "") {
            return String(cell.text);
        }

        if (typeof value === "object") {
            if (value.richText) return value.richText.map((run) => run.text).join("");
            if (value.result !== undefined) return String(value.result);
            if (value.text !== undefined) return String(value.text);
            return "";
        }

        return String(value);
    };

    // ---- 6. Per-cell inline style -------------------------------------------
    const buildCellStyle = (cell) => {
        const decls = [];

        // Background fill
        if (cell.fill && cell.fill.fgColor) {
            const bg = resolveArgbColor(cell.fill.fgColor);
            if (bg) decls.push(`background-color:${bg}`);
        }

        // Font
        if (cell.font) {
            const f = cell.font;
            if (f.bold) decls.push("font-weight:bold");
            if (f.italic) decls.push("font-style:italic");
            const decoParts = [];
            if (f.underline) decoParts.push("underline");
            if (f.strike) decoParts.push("line-through");
            if (decoParts.length) decls.push(`text-decoration:${decoParts.join(" ")}`);
            if (f.size) decls.push(`font-size:${f.size}pt`);
            const fontColor = resolveArgbColor(f.color);
            if (fontColor) decls.push(`color:${fontColor}`);
        }

        // Borders
        if (cell.border) {
            const top = buildBorderSideCss(cell.border.top);
            const left = buildBorderSideCss(cell.border.left);
            const bottom = buildBorderSideCss(cell.border.bottom);
            const right = buildBorderSideCss(cell.border.right);
            if (top) decls.push(`border-top:${top}`);
            if (left) decls.push(`border-left:${left}`);
            if (bottom) decls.push(`border-bottom:${bottom}`);
            if (right) decls.push(`border-right:${right}`);
        }

        // Alignment
        if (cell.alignment) {
            const a = cell.alignment;
            if (a.horizontal && H_ALIGN_MAP[a.horizontal]) {
                decls.push(`text-align:${H_ALIGN_MAP[a.horizontal]}`);
            }
            if (a.vertical && V_ALIGN_MAP[a.vertical]) {
                decls.push(`vertical-align:${V_ALIGN_MAP[a.vertical]}`);
            }
            if (a.wrapText) {
                decls.push("white-space:normal", "word-break:break-word");
            } else {
                decls.push("white-space:nowrap");
            }
        }

        return decls.join(";");
    };

    // ---- 7. Merge parsing: 'A1:B2' -> row/col ranges -------------------------
    // Only the top-left cell of a merge gets colspan/rowspan; every other cell
    // in that range must be dropped from the output entirely (not rendered as
    // an empty <td>), otherwise the column count of that <tr> would exceed the
    // other rows and the whole table would visually misalign from that row on.
    const colLettersToNumber = (letters) => {
        let col = 0;
        for (let i = 0; i < letters.length; i++) {
            col = col * 26 + (letters.charCodeAt(i) - 64);
        }
        return col;
    };

    const parseCellRef = (ref) => {
        const match = /^([A-Za-z]+)(\d+)$/.exec(ref);
        if (!match) return null;
        return { row: parseInt(match[2], 10), col: colLettersToNumber(match[1].toUpperCase()) };
    };

    const spanMap = new Map(); // "row,col" (top-left) -> { rowspan, colspan }
    const skipSet = new Set(); // "row,col" (every other cell in the merge)

    const merges = (worksheet.model && worksheet.model.merges) || [];
    merges.forEach((rangeStr) => {
        const [startRef, endRef] = String(rangeStr).split(":");
        const start = parseCellRef(startRef);
        const end = parseCellRef(endRef || startRef);
        if (!start || !end) return;

        const rowspan = end.row - start.row + 1;
        const colspan = end.col - start.col + 1;
        if (rowspan > 1 || colspan > 1) {
            spanMap.set(`${start.row},${start.col}`, { rowspan, colspan });
        }
        for (let r = start.row; r <= end.row; r++) {
            for (let c = start.col; c <= end.col; c++) {
                if (r === start.row && c === start.col) continue;
                skipSet.add(`${r},${c}`);
            }
        }
    });

    // ---- 8. Render rows/cells -------------------------------------------------
    const maxRow = worksheet.rowCount || 0;
    const maxCol = worksheet.columnCount || 0;

    let bodyHtml = "";
    for (let r = 1; r <= maxRow; r++) {
        const row = worksheet.getRow(r);
        let rowHtml = "";

        for (let c = 1; c <= maxCol; c++) {
            const key = `${r},${c}`;
            if (skipSet.has(key)) continue; // interior of a merge -> emit nothing

            const cell = row.getCell(c);
            const span = spanMap.get(key);
            const spanAttrs = span
                ? ` rowspan="${span.rowspan}" colspan="${span.colspan}"`
                : "";
            const style = buildCellStyle(cell);
            const styleAttr = style ? ` style="${style}"` : "";
            const text = escapeHtml(getCellDisplayText(cell));

            rowHtml += `<td${spanAttrs}${styleAttr}>${text}</td>`;
        }

        bodyHtml += `<tr>${rowHtml}</tr>`;
    }

    return `<table style="border-collapse:collapse;font-family:Arial,sans-serif;">${bodyHtml}</table>`;
}

module.exports = { excelWorksheetToHtml };
