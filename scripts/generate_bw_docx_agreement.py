import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def set_table_borders(table, color="000000", sz="6"):
    tblPr = table._tbl.tblPr
    tblBorders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>
        </w:tblBorders>
    ''')
    tblPr.append(tblBorders)

def build_bw_agreement():
    doc = Document()

    # Standard A4 Margins for printing (0.75 in / 1.9 cm)
    for s in doc.sections:
        s.top_margin = Inches(0.75)
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.8)
        s.right_margin = Inches(0.8)

    BLACK = RGBColor(0, 0, 0)
    DARK_GRAY = RGBColor(60, 60, 60)

    # Header Section
    p_top = doc.add_paragraph()
    p_top.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_top.paragraph_format.space_before = Pt(0)
    p_top.paragraph_format.space_after = Pt(2)
    r_top = p_top.add_run("SERVICE AGREEMENT")
    r_top.font.name = "Arial"
    r_top.font.size = Pt(11)
    r_top.font.bold = True
    r_top.font.color.rgb = DARK_GRAY

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("WEBSITE DEVELOPMENT, CLOUD INFRASTRUCTURE &\nMAINTENANCE AGREEMENT")
    r_title.font.name = "Arial"
    r_title.font.size = Pt(14)
    r_title.font.bold = True
    r_title.font.color.rgb = BLACK

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Duration: 3 (Three) Consecutive Years (36 Months)  |  Total Consideration: Rs. 2,500/-")
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(10)
    r_sub.font.bold = True
    r_sub.font.color.rgb = BLACK

    # Divider line
    p_line = doc.add_paragraph()
    p_line.paragraph_format.space_after = Pt(10)
    p_line.paragraph_format.space_before = Pt(0)
    r_line = p_line.add_run("―" * 68)
    r_line.font.name = "Arial"
    r_line.font.size = Pt(10)
    r_line.font.color.rgb = BLACK

    # Preamble text
    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.space_after = Pt(10)
    p_intro.paragraph_format.line_spacing = 1.2
    r_intro = p_intro.add_run(
        "This Website Development, Cloud Infrastructure & Maintenance Agreement (\"Agreement\") "
        "is executed on this 17th day of September, 2026 (\"Effective Date\") at Bengaluru, Karnataka, by and between:"
    )
    r_intro.font.name = "Arial"
    r_intro.font.size = Pt(10)
    r_intro.font.color.rgb = BLACK

    # Parties Table (High Contrast Black & White Box)
    parties_table = doc.add_table(rows=1, cols=2)
    parties_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    parties_table.autofit = False
    parties_table.columns[0].width = Inches(3.4)
    parties_table.columns[1].width = Inches(3.4)
    set_table_borders(parties_table, color="000000", sz="8")

    c1 = parties_table.cell(0, 0)
    c2 = parties_table.cell(0, 1)
    set_cell_background(c1, "FFFFFF")
    set_cell_background(c2, "FFFFFF")
    set_cell_margins(c1, top=160, bottom=160, left=160, right=160)
    set_cell_margins(c2, top=160, bottom=160, left=160, right=160)

    # Party 1 Box
    p1 = c1.paragraphs[0]
    p1.paragraph_format.space_after = Pt(4)
    r1_h = p1.add_run("FIRST PARTY (SERVICE PROVIDER):")
    r1_h.font.name = "Arial"
    r1_h.font.size = Pt(10)
    r1_h.font.bold = True
    r1_h.font.color.rgb = BLACK

    p1_body = c1.add_paragraph()
    p1_body.paragraph_format.space_after = Pt(0)
    p1_body.paragraph_format.line_spacing = 1.3
    r = p1_body.add_run(
        "Name / Agency: ___________________________\n"
        "Represented by: __________________________\n"
        "Designation: Full-Stack Web Engineer\n"
        "Contact Phone: ___________________________\n"
        "Email: ___________________________________\n"
        "Address: _________________________________\n"
        "(Hereinafter referred to as 'Service Provider')"
    )
    r.font.name = "Arial"
    r.font.size = Pt(9.5)
    r.font.color.rgb = BLACK

    # Party 2 Box
    p2 = c2.paragraphs[0]
    p2.paragraph_format.space_after = Pt(4)
    r2_h = p2.add_run("SECOND PARTY (CLIENT / OWNER):")
    r2_h.font.name = "Arial"
    r2_h.font.size = Pt(10)
    r2_h.font.bold = True
    r2_h.font.color.rgb = BLACK

    p2_body = c2.add_paragraph()
    p2_body.paragraph_format.space_after = Pt(0)
    p2_body.paragraph_format.line_spacing = 1.3
    r = p2_body.add_run(
        "Business Name: INDIAN TWO AND FOUR\n"
        "WHEELER ALIGNMENT AND REPAIR\n"
        "Proprietor: ______________________________\n"
        "Workshop: 60/1, Nehru Road, Opp. NKGSB Bank,\n"
        "Kammanahalli, Bengaluru, Karnataka – 560084\n"
        "Contact: 086605 20385 / +91 86605 20385\n"
        "(Hereinafter referred to as 'Client')"
    )
    r.font.name = "Arial"
    r.font.size = Pt(9.5)
    r.font.color.rgb = BLACK

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # Key Terms Summary Table (Black Border, Pure White Background)
    terms_table = doc.add_table(rows=1, cols=1)
    terms_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    terms_table.autofit = False
    terms_table.columns[0].width = Inches(6.8)
    set_table_borders(terms_table, color="000000", sz="10")
    tc = terms_table.cell(0, 0)
    set_cell_background(tc, "FFFFFF")
    set_cell_margins(tc, top=140, bottom=140, left=180, right=180)

    tp = tc.paragraphs[0]
    tp.paragraph_format.space_after = Pt(0)
    tp.paragraph_format.line_spacing = 1.3
    tr = tp.add_run(
        "KEY COMMERCIAL & OPERATIONAL HIGHLIGHTS:\n"
        "1. AGREEMENT DURATION: 3 (Three) Consecutive Years (17-Sep-2026 to 16-Sep-2029)\n"
        "2. TOTAL CONTRACT VALUE: Rs. 2,500/- (Rupees Two Thousand Five Hundred Only) All-Inclusive\n"
        "3. ZERO RECURRING FEES: Covers all cloud hosting, Supabase PostgreSQL database, and technical maintenance.\n"
        "4. WORKSHOP FACILITY: Exclusively configured for Kammanahalli Main (Nehru Rd) Workshop."
    )
    tr.font.name = "Arial"
    tr.font.size = Pt(9.5)
    tr.font.bold = True
    tr.font.color.rgb = BLACK

    # Helper for Section Titles
    def add_bw_heading(num_str, title_str):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(f"{num_str}. {title_str.upper()}")
        r.font.name = "Arial"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = BLACK
        return p

    def add_bw_bullet(prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.2
        if prefix:
            rb = p.add_run(prefix)
            rb.font.name = "Arial"
            rb.font.size = Pt(9.5)
            rb.font.bold = True
            rb.font.color.rgb = BLACK
        rt = p.add_run(text)
        rt.font.name = "Arial"
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = BLACK
        return p

    # Section 1
    add_bw_heading("1", "Scope of Deliverables & System Architecture")
    add_bw_bullet("Public Website & Booking Experience: ", "High-performance Next.js 14 web application with responsive layout for mobile and desktop, interactive vehicle selection, service directory, and direct WhatsApp / call buttons.")
    add_bw_bullet("Cloud Database (Supabase PostgreSQL): ", "Managed PostgreSQL database storing customer intake entries, payment statuses, and vehicle brands with multi-device realtime push synchronization.")
    add_bw_bullet("Shop Floor Worker Terminal (/worker): ", "Dedicated 10-digit PIN-protected interface (PIN: 1234567890) for workshop technicians to log cars and motorcycles, service works, and generate instant floor receipts.")
    add_bw_bullet("Executive Admin Dashboard (/admin): ", "10-digit PIN-protected management portal (PIN: 9876543210) calculating daily earnings, monthly accumulated revenue, yearly archives, and CSV transaction export.")
    add_bw_bullet("24-Hour Midnight Rollover System: ", "Daily automated intake cycle at 11:59:59 PM resetting the morning counter to Rs. 0 while permanently retaining all records in database archives.")
    add_bw_bullet("Search Engine Optimization (SEO): ", "Google Schema.org (AutoRepair) rich snippets, dynamic sitemap.xml, robots.txt, and complete privacy protection on internal portal paths.")

    # Section 2
    add_bw_heading("2", "Service Level Agreement (SLA) & Technical Maintenance")
    add_bw_bullet("Platform Uptime: ", "The Service Provider shall maintain cloud deployment with an annual target uptime of 99.5%.")
    add_bw_bullet("Critical Support: ", "Any platform downtime, database disconnection, or submission failure will be investigated and restored within 12 to 24 hours of notification.")
    add_bw_bullet("Routine Revisions: ", "Up to four (4) content, pricing, or photograph revisions per calendar year are included at zero additional charge.")
    add_bw_bullet("Database Integrity: ", "Zero-demo data protection is enforced so no artificial test records pollute the Client's genuine accounts.")

    # Section 3
    add_bw_heading("3", "Data Ownership & Confidentiality")
    add_bw_bullet("100% Client Ownership: ", "The Client retains exclusive ownership of all customer phone numbers, vehicle records, billing data, business imagery, and brand identity.")
    add_bw_bullet("Strict Confidentiality: ", "The Service Provider shall never share, sell, or disclose the Client's customer records or portal access passwords to any third party.")

    # Section 4
    add_bw_heading("4", "Payment Confirmation & Commercial Terms")
    p_pay = doc.add_paragraph()
    p_pay.paragraph_format.space_before = Pt(2)
    p_pay.paragraph_format.space_after = Pt(4)
    p_pay.paragraph_format.line_spacing = 1.25
    r_p = p_pay.add_run(
        "• Total Agreed Amount: Rs. 2,500/- (Rupees Two Thousand Five Hundred Only) for 36 Months.\n"
        "• Payment Mode: [  ] Cash      [  ] UPI / GPay / PhonePe      [  ] Bank Transfer (NEFT/IMPS)\n"
        "• Payment Reference / UTR No.: ___________________________________   Date: _____________________\n"
        "• Payment Status: [  ] Full Payment Received      [  ] Balance Outstanding: Rs. ____________"
    )
    r_p.font.name = "Arial"
    r_p.font.size = Pt(9.5)
    r_p.font.color.rgb = BLACK

    # Section 5: Signatures
    add_bw_heading("5", "Signatures & Acceptance")
    p_s_intro = doc.add_paragraph()
    p_s_intro.paragraph_format.space_after = Pt(6)
    r_si = p_s_intro.add_run("IN WITNESS WHEREOF, the Parties have executed this Agreement on the Effective Date written above:")
    r_si.font.name = "Arial"
    r_si.font.size = Pt(9.5)

    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False
    sig_table.columns[0].width = Inches(3.4)
    sig_table.columns[1].width = Inches(3.4)
    set_table_borders(sig_table, color="000000", sz="8")

    sc1 = sig_table.cell(0, 0)
    sc2 = sig_table.cell(0, 1)
    set_cell_background(sc1, "FFFFFF")
    set_cell_background(sc2, "FFFFFF")
    set_cell_margins(sc1, top=140, bottom=140, left=140, right=140)
    set_cell_margins(sc2, top=140, bottom=140, left=140, right=140)

    # Provider Signature
    sp1 = sc1.paragraphs[0]
    sp1.paragraph_format.space_after = Pt(4)
    r = sp1.add_run("FOR SERVICE PROVIDER / DEVELOPER:")
    r.font.name = "Arial"
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = BLACK

    sp1_b = sc1.add_paragraph()
    sp1_b.paragraph_format.space_after = Pt(0)
    sp1_b.paragraph_format.line_spacing = 1.35
    r = sp1_b.add_run(
        "Name: ____________________________________\n"
        "Designation: Full-Stack Web Engineer\n\n\n"
        "Authorized Signature: ______________________\n"
        "Date: 17th September 2026\n"
        "Place: Bengaluru, Karnataka"
    )
    r.font.name = "Arial"
    r.font.size = Pt(9)
    r.font.color.rgb = BLACK

    # Client Signature
    sp2 = sc2.paragraphs[0]
    sp2.paragraph_format.space_after = Pt(4)
    r = sp2.add_run("FOR CLIENT / WORKSHOP OWNER:")
    r.font.name = "Arial"
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = BLACK

    sp2_b = sc2.add_paragraph()
    sp2_b.paragraph_format.space_after = Pt(0)
    sp2_b.paragraph_format.line_spacing = 1.35
    r = sp2_b.add_run(
        "Business: Indian Two & Four Wheeler Alignment\n"
        "Proprietor: _______________________________\n\n"
        "Signature: _________________________________\n"
        "Workshop Stamp: [                         ]\n"
        "Date: 17th September 2026 | Kammanahalli, BLR"
    )
    r.font.name = "Arial"
    r.font.size = Pt(9)
    r.font.color.rgb = BLACK

    # Witnesses Section
    p_wit = doc.add_paragraph()
    p_wit.paragraph_format.space_before = Pt(10)
    p_wit.paragraph_format.space_after = Pt(4)
    rw = p_wit.add_run("Witness Signatures:")
    rw.font.name = "Arial"
    rw.font.size = Pt(9.5)
    rw.font.bold = True
    rw.font.color.rgb = BLACK

    wit_table = doc.add_table(rows=1, cols=2)
    wit_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    wit_table.autofit = False
    wit_table.columns[0].width = Inches(3.4)
    wit_table.columns[1].width = Inches(3.4)
    set_table_borders(wit_table, color="000000", sz="6")

    wc1 = wit_table.cell(0, 0)
    wc2 = wit_table.cell(0, 1)
    set_cell_background(wc1, "FFFFFF")
    set_cell_background(wc2, "FFFFFF")
    set_cell_margins(wc1, top=100, bottom=100, left=120, right=120)
    set_cell_margins(wc2, top=100, bottom=100, left=120, right=120)

    wp1 = wc1.paragraphs[0]
    wp1.paragraph_format.line_spacing = 1.25
    r = wp1.add_run("1. Witness Name: _________________________\n"
                    "   Address: ______________________________\n"
                    "   Signature: ____________________________")
    r.font.name = "Arial"
    r.font.size = Pt(8.5)
    r.font.color.rgb = BLACK

    wp2 = wc2.paragraphs[0]
    wp2.paragraph_format.line_spacing = 1.25
    r = wp2.add_run("2. Witness Name: _________________________\n"
                    "   Address: ______________________________\n"
                    "   Signature: ____________________________")
    r.font.name = "Arial"
    r.font.size = Pt(8.5)
    r.font.color.rgb = BLACK

    # Output file paths
    bw_output_path = os.path.abspath("WEBSITE_SERVICE_AGREEMENT_PRINTABLE_BW.docx")
    doc.save(bw_output_path)
    print(f"Successfully generated B&W DOCX at: {bw_output_path}")

    # Also overwrite the primary WEBSITE_SERVICE_AGREEMENT.docx so the main file is also cleanly printable in B&W
    main_output_path = os.path.abspath("WEBSITE_SERVICE_AGREEMENT.docx")
    doc.save(main_output_path)
    print(f"Successfully updated main DOCX at: {main_output_path}")

if __name__ == "__main__":
    build_bw_agreement()
