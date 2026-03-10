from __future__ import annotations

import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, Paragraph, Preformatted, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "content" / "2026-02-20-awareness-paradox-cross-platform-script-pack.md"
OUT_DIR = ROOT / "output" / "pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
OUT_DIR.mkdir(parents=True, exist_ok=True)
TMP_DIR.mkdir(parents=True, exist_ok=True)
OUT = OUT_DIR / "awareness-paradox-cross-platform-script-pack-2026-02-20.pdf"

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="TitleStyle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#1E2430"),
        spaceAfter=14,
    )
)
styles.add(
    ParagraphStyle(
        name="H2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=20,
        textColor=colors.HexColor("#1E2430"),
        spaceBefore=10,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="H3",
        parent=styles["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#2A3342"),
        spaceBefore=8,
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor("#202631"),
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="MdBullet",
        parent=styles["Body"],
        leftIndent=14,
        bulletIndent=2,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="MdCode",
        parent=styles["Body"],
        fontName="Courier",
        fontSize=9.2,
        leading=12,
        backColor=colors.HexColor("#F3F5F8"),
        borderColor=colors.HexColor("#D8DEE8"),
        borderWidth=0.4,
        borderPadding=6,
    )
)

BOLD_RE = re.compile(r"\*\*(.+?)\*\*")
ITALIC_RE = re.compile(r"\*(.+?)\*")
CODE_RE = re.compile(r"`([^`]+)`")
NUM_RE = re.compile(r"^(\d+)\.\s+(.*)$")


def inline_md_to_para(text: str) -> str:
    out = html.escape(text)
    out = CODE_RE.sub(r"<font name='Courier'>\1</font>", out)
    out = BOLD_RE.sub(r"<b>\1</b>", out)
    out = ITALIC_RE.sub(r"<i>\1</i>", out)
    return out


def flush_paragraph(story: list, lines: list[str]) -> None:
    if not lines:
        return
    parts: list[str] = []
    for raw in lines:
        hard_break = raw.endswith("  ")
        core = raw.rstrip()
        if not core:
            continue
        frag = inline_md_to_para(core)
        if hard_break:
            parts.append(f"{frag}<br/>")
        else:
            parts.append(frag)
    text = " ".join(parts).replace("<br/> ", "<br/>")
    if text:
        story.append(Paragraph(text, styles["Body"]))
    lines.clear()


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#C4894B"))
    canvas.setLineWidth(0.6)
    canvas.line(0.75 * inch, 10.55 * inch, 7.75 * inch, 10.55 * inch)
    canvas.setFillColor(colors.HexColor("#9AA6B8"))
    canvas.setFont("Helvetica", 8)
    canvas.drawString(0.75 * inch, 10.62 * inch, "Awareness Paradox | Cross-Platform Script Pack")
    canvas.drawRightString(7.75 * inch, 0.5 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build() -> None:
    story: list = []
    paragraph_buffer: list[str] = []
    in_code = False
    code_lines: list[str] = []

    for line in SRC.read_text(encoding="utf-8").splitlines():
        if line.strip().startswith("```"):
            flush_paragraph(story, paragraph_buffer)
            in_code = not in_code
            if not in_code and code_lines:
                story.append(Preformatted("\n".join(code_lines), styles["MdCode"]))
                story.append(Spacer(1, 0.08 * inch))
                code_lines.clear()
            continue

        if in_code:
            code_lines.append(line)
            continue

        stripped = line.strip()

        if not stripped:
            flush_paragraph(story, paragraph_buffer)
            continue

        if stripped == "---":
            flush_paragraph(story, paragraph_buffer)
            story.append(
                HRFlowable(
                    width="100%",
                    color=colors.HexColor("#D8DEE8"),
                    thickness=0.7,
                    spaceBefore=6,
                    spaceAfter=8,
                )
            )
            continue

        if line.startswith("# "):
            flush_paragraph(story, paragraph_buffer)
            story.append(Paragraph(inline_md_to_para(line[2:].strip()), styles["TitleStyle"]))
            continue

        if line.startswith("## "):
            flush_paragraph(story, paragraph_buffer)
            story.append(Paragraph(inline_md_to_para(line[3:].strip()), styles["H2"]))
            continue

        if line.startswith("### "):
            flush_paragraph(story, paragraph_buffer)
            story.append(Paragraph(inline_md_to_para(line[4:].strip()), styles["H3"]))
            continue

        if line.startswith("- "):
            flush_paragraph(story, paragraph_buffer)
            story.append(
                Paragraph(inline_md_to_para(line[2:].strip()), styles["MdBullet"], bulletText="-")
            )
            continue

        num_match = NUM_RE.match(stripped)
        if num_match:
            flush_paragraph(story, paragraph_buffer)
            idx, content = num_match.groups()
            story.append(
                Paragraph(inline_md_to_para(content), styles["MdBullet"], bulletText=f"{idx}.")
            )
            continue

        paragraph_buffer.append(line)

    flush_paragraph(story, paragraph_buffer)

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=LETTER,
        title="Awareness Paradox Cross-Platform Script Pack",
        author="Awareness Paradox",
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.95 * inch,
        bottomMargin=0.65 * inch,
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(OUT)


if __name__ == "__main__":
    build()
