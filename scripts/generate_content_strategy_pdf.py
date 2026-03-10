from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "pdf"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_PATH = OUT_DIR / "awareness-paradox-content-strategy-report-2026-02-20.pdf"

PALETTE = {
    "obsidian": colors.HexColor("#0F1218"),
    "char": colors.HexColor("#1B2230"),
    "mist": colors.HexColor("#9FA9BA"),
    "bone": colors.HexColor("#EEF1F5"),
    "ink": colors.HexColor("#202631"),
    "copper": colors.HexColor("#C4894B"),
    "sand": colors.HexColor("#F7F4EF"),
}

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="CoverTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=34,
        leading=40,
        alignment=TA_CENTER,
        textColor=PALETTE["bone"],
    )
)
styles.add(
    ParagraphStyle(
        name="CoverSub",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=16,
        alignment=TA_CENTER,
        textColor=PALETTE["mist"],
    )
)
styles.add(
    ParagraphStyle(
        name="H1",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=26,
        textColor=PALETTE["ink"],
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="H2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=PALETTE["char"],
        spaceBefore=8,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        textColor=PALETTE["ink"],
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="BulletLine",
        parent=styles["Body"],
        leftIndent=14,
        bulletIndent=0,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="Cell",
        parent=styles["Body"],
        fontSize=9.2,
        leading=12,
        spaceAfter=0,
    )
)
styles.add(
    ParagraphStyle(
        name="CellBold",
        parent=styles["Cell"],
        fontName="Helvetica-Bold",
    )
)
styles.add(
    ParagraphStyle(
        name="CellHeader",
        parent=styles["CellBold"],
        textColor=PALETTE["bone"],
    )
)


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(PALETTE["copper"])
    canvas.setLineWidth(0.7)
    canvas.line(0.8 * inch, 10.55 * inch, 7.7 * inch, 10.55 * inch)
    canvas.setFillColor(PALETTE["mist"])
    canvas.setFont("Helvetica", 8)
    canvas.drawString(0.8 * inch, 10.62 * inch, "Awareness Paradox | Content Strategy Report")
    canvas.drawRightString(7.7 * inch, 0.55 * inch, f"Page {doc.page}")
    canvas.restoreState()


def cover_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PALETTE["obsidian"])
    canvas.rect(0, 0, LETTER[0], LETTER[1], stroke=0, fill=1)

    canvas.setStrokeColor(PALETTE["copper"])
    canvas.setLineWidth(1.2)
    canvas.line(1.0 * inch, 1.3 * inch, 7.5 * inch, 1.3 * inch)

    canvas.setFillColor(PALETTE["mist"])
    canvas.setFont("Helvetica", 10)
    canvas.drawString(1.0 * inch, 1.05 * inch, "Prepared February 20, 2026")
    canvas.drawRightString(7.5 * inch, 1.05 * inch, "Website + Instagram + X + TikTok + Substack")
    canvas.restoreState()


def bullet(text):
    return Paragraph(text, styles["BulletLine"], bulletText="-")


def cell(text, bold=False, header=False):
    if header:
        return Paragraph(text, styles["CellHeader"])
    return Paragraph(text, styles["CellBold" if bold else "Cell"])


story = []

story.append(Spacer(1, 2.4 * inch))
story.append(Paragraph("Awareness Paradox", styles["CoverTitle"]))
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph("Content Strategy and Publishing Automation Report", styles["CoverSub"]))
story.append(Spacer(1, 0.35 * inch))
story.append(
    Paragraph(
        "From brand presence to compounding audience growth", styles["CoverSub"]
    )
)
story.append(PageBreak())

story.append(Paragraph("Executive Summary", styles["H1"]))
story.append(
    Paragraph(
        "Awareness Paradox has a clear market edge: a unified ecosystem of alchemy, tarot, astrology, sacred geometry, and Hermetic philosophy. The growth unlock is to systemize publishing across channels while increasing owned audience conversion.",
        styles["Body"],
    )
)
summary_table = Table(
    [
        ["Priority", "Decision"],
        [cell("Audience engine"), cell("Launch Substack and funnel site + social traffic to owned email.")],
        [cell("Content model"), cell("One weekly flagship thesis, repurposed to each platform.")],
        [cell("Search moat"), cell("Publish evergreen educational pillar content each week.")],
    ],
    colWidths=[1.75 * inch, 4.95 * inch],
)
summary_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), PALETTE["char"]),
            ("TEXTCOLOR", (0, 0), (-1, 0), PALETTE["bone"]),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 9.5),
            ("BACKGROUND", (0, 1), (-1, -1), PALETTE["sand"]),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#D6DCE5")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
    )
)
story.append(summary_table)
story.append(Spacer(1, 0.15 * inch))

story.append(Paragraph("Assessment: Strengths and Gaps", styles["H2"]))
for item in [
    "Strong multi-disciplinary positioning compared with single-modality competitors.",
    "Premium visual identity and narrative depth already aligned with brand promise.",
    "Major gap is owned audience capture: no robust newsletter funnel yet.",
    "Major growth gap is SEO depth: searchable educational content needs higher velocity.",
]:
    story.append(bullet(item))

story.append(Paragraph("90 Day Objectives and KPI Targets", styles["H1"]))
kpi_table = Table(
    [
        ["KPI", "90 Day Target"],
        [cell("Net new email subscribers"), cell("150 to 400")],
        [cell("Visitor to email conversion"), cell("3% to 5%")],
        [cell("Flagship long-form publishing"), cell("1 per week")],
        [cell("Repurposed social output"), cell("4 to 6 posts per week")],
    ],
    colWidths=[3.2 * inch, 3.5 * inch],
)
kpi_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), PALETTE["char"]),
            ("TEXTCOLOR", (0, 0), (-1, 0), PALETTE["bone"]),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 9.5),
            ("BACKGROUND", (0, 1), (-1, -1), colors.white),
            ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D6DCE5")),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
    )
)
story.append(kpi_table)
story.append(Spacer(1, 0.1 * inch))

story.append(Paragraph("Content Pillars", styles["H2"]))
for item in [
    "Hermetic principles in daily life",
    "The Great Work (applied alchemy)",
    "Tarot as reflective method",
    "Astrology as pattern and timing",
    "Sacred geometry and perception",
]:
    story.append(bullet(item))

story.append(PageBreak())

story.append(Paragraph("Channel Strategy", styles["H1"]))
channel_table = Table(
    [
        [cell("Channel", True, True), cell("Role", True, True), cell("Primary Output", True, True)],
        [cell("Website"), cell("Search and conversion hub"), cell("Weekly evergreen article + newsletter capture")],
        [cell("Instagram"), cell("Visual education"), cell("6-8 slide carousel and short reel")],
        [cell("TikTok"), cell("Top funnel discovery"), cell("30-60 second myth/reframe video")],
        [cell("X"), cell("Thesis testing"), cell("8-15 post source-backed thread")],
        [cell("Substack"), cell("Owned retention"), cell("Weekly flagship letter")],
    ],
    colWidths=[1.2 * inch, 2.2 * inch, 3.3 * inch],
)
channel_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), PALETTE["char"]),
            ("TEXTCOLOR", (0, 0), (-1, 0), PALETTE["bone"]),
            ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D6DCE5")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
    )
)
story.append(channel_table)

story.append(Spacer(1, 0.12 * inch))
story.append(Paragraph("Editorial Flywheel", styles["H2"]))
for item in [
    "Publish one flagship thesis each week (site or Substack).",
    "Repurpose into one Instagram carousel, one TikTok video, and one X thread.",
    "Push all social traffic to one owned CTA each week.",
    "Measure conversion from channel to page to subscriber.",
]:
    story.append(bullet(item))

story.append(Paragraph("Automation Feasibility", styles["H1"]))
story.append(
    Paragraph(
        "Automation can cover most drafting, scheduling, formatting, and analytics. A human approval checkpoint should remain before final publish to preserve voice quality.",
        styles["Body"],
    )
)
auto_table = Table(
    [
        [cell("Platform", True, True), cell("Automation Status", True, True), cell("Notes", True, True)],
        [cell("Instagram"), cell("Supported"), cell("Meta Graph API supports media creation and publishing for eligible professional accounts.")],
        [cell("X"), cell("Supported"), cell("X API supports managed post publishing via authenticated apps.")],
        [cell("TikTok"), cell("Supported with constraints"), cell("Content Posting API available with policy and account limitations.")],
        [cell("Substack"), cell("Partial"), cell("Scheduling is native but no public API for full post publishing.")],
    ],
    colWidths=[1.1 * inch, 1.6 * inch, 4.0 * inch],
)
auto_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), PALETTE["char"]),
            ("TEXTCOLOR", (0, 0), (-1, 0), PALETTE["bone"]),
            ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D6DCE5")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
    )
)
story.append(auto_table)

story.append(Spacer(1, 0.12 * inch))
story.append(Paragraph("Recommended Automation Stack", styles["H2"]))
for item in [
    "Airtable or Notion as content source of truth.",
    "n8n or Make for orchestration and approvals.",
    "Buffer or Hootsuite for cross-platform scheduling where API setup is heavy.",
    "Substack draft creation and reminder automation, with final schedule in Substack UI.",
]:
    story.append(bullet(item))

story.append(Paragraph("14 Day Action Plan", styles["H1"]))
roadmap_table = Table(
    [
        [cell("Week", True, True), cell("Actions", True, True)],
        [cell("Week 1"), cell("Launch Substack, create first 3 issue outlines, add homepage and footer email capture blocks.")],
        [cell("Week 2"), cell("Publish canonical positioning piece, ship 1 full repurposed content cycle, enable KPI dashboard.")],
    ],
    colWidths=[1.15 * inch, 5.55 * inch],
)
roadmap_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), PALETTE["char"]),
            ("TEXTCOLOR", (0, 0), (-1, 0), PALETTE["bone"]),
            ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D6DCE5")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
    )
)
story.append(roadmap_table)
story.append(Spacer(1, 0.2 * inch))

story.append(Paragraph("Prepared Assets", styles["H2"]))
for item in [
    "Content strategy document in docs/strategy.",
    "Slide-ready deck outline in docs/presentations.",
    "This PDF report for shareable executive review.",
]:
    story.append(bullet(item))

story.append(Spacer(1, 0.2 * inch))
story.append(
    Paragraph(
        "Primary recommendation: prioritize owned audience growth as the top decision filter for all publishing and automation choices.",
        styles["Body"],
    )
)


doc = SimpleDocTemplate(
    str(OUT_PATH),
    pagesize=LETTER,
    leftMargin=0.8 * inch,
    rightMargin=0.8 * inch,
    topMargin=0.95 * inch,
    bottomMargin=0.75 * inch,
    title="Awareness Paradox Content Strategy and Automation Report",
    author="Codex",
)

doc.build(story, onFirstPage=cover_page, onLaterPages=header_footer)
print(OUT_PATH)
