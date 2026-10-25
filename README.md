# LIMO Studio — Visionary Architects

> **CS3520 Computer Organisation and Architecture — AY 2026/2027**  
> **National University of Lesotho**  
> **Architecture:** LIMO (32-bit RV32I-derived load-store processor with Sesotho orthography)  
> **Live Site (GitHub Pages):** [https://matseliso20.github.io/limo-Visionary-Architects/](https://matseliso20.github.io/limo-Visionary-Architects/)

---

## 🚀 Milestone 2 (M2) — Simulator Design & Working Assembler

This repository contains the complete implementation for **Milestone 2 (M2)**:
* **Architecture & Block Diagram:** 5-stage pipelined Harvard datapath (IF, ID, EX, MEM, WB) documented in [`docs/M2_SIMULATOR_DESIGN.md`](docs/M2_SIMULATOR_DESIGN.md) and interactively rendered as an interactive SVG block diagram with clickable datapath components.
* **Pipeline-Register Data Model:** Bit-accurate pipeline register specifications (IF/ID [65b], ID/EX [171b], EX/MEM [139b], MEM/WB [136b]), latch conditions, bubble/flush signals, and TypeScript/JS interfaces in [`docs/PIPELINE_REGISTER_DATA_MODEL.md`](docs/PIPELINE_REGISTER_DATA_MODEL.md).
* **Interface Wireframes:** Comprehensive UI/UX blueprints for the Primary IDE, 5-Stage Visualizer, Datapath Explorer, and Unit Test Runner documented in [`docs/WIREFRAMES.md`](docs/WIREFRAMES.md) and accessible via interactive modals on the site.
* **Working Assembler with Unit Tests:** 29 automated test cases verifying all 10 Sesotho instructions, R/I/S/B encodings, M1 hand-encoded benchmarks, 32 register aliases, and signed immediate range bounds:
  - CLI execution via Python: `python tests/test_assembler.py` (29 passed, 0 failed).
  - CLI execution via Node.js: `node tests/assembler.test.js`.
  - In-browser interactive test runner with category filtering, real-time metrics, and JSON report export (`F8` shortcut).
* **GitHub Pages CI/CD:** Automated workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml) deploying the application directly to GitHub Pages.
* **Release Tag:** Tagged `m2`.

---

## 🧪 Running the Unit Tests

### Option A: Via Browser UI
1. Open the [Live Web Application](https://matseliso20.github.io/limo-Visionary-Architects/) (or open `index.html` locally).
2. Click **Tests (F8)** in the top header or press <kbd>F8</kbd>.
3. The interactive runner executes all 29 verification tests in real time, displaying pass/fail badges, hex encodings, category breakdowns, and JSON export.

### Option B: Via Command Line (Python)
```bash
python tests/test_assembler.py
```

### Option C: Via Command Line (Node.js)
```bash
node tests/assembler.test.js
```

---

## 📌 1. Project Overview (M1 & M2 Foundation)

**LIMO** is a 32-bit load-store processor derived from **RISC-V (RV32I)**, featuring an assembly language written in **Sesotho** using Lesotho orthography.

* **ISA Specification:** Defining fixed 32-bit instruction formats ($R$, $I$, $S$, $B$), register file mappings with Sesotho names (e.g., `Ha ho letho` / `Letho` for $r0$), and assembly mnemonics (`kop`, `ts`, `khh`, `le`, `kp`, `ng`, `lt`, `blk`, `hlk`, `hft`).
* **Design-Decision Log:** Documenting trade-off analyses on register count (32 registers), zero-flag-less branch evaluation in EX stage (Section 3e), and load-use hazard interlocks.
* **Initial Programs:** Three benchmark Sesotho assembly programs (`examples/01_sum_first_n.s`, `examples/02_factorial.s`, `examples/03_average.s`).

---

## 👥 2. Team Members

The project is designed and developed by Visionary Architects for CS3520:

| Member | GitHub Username | Student Numbers | Role Context |
| :--- | :--- | :--- | :--- |
| **Morapeli Seboka** | `@Dahraps` | 202401651 | Student Collaborator |
| **Beleme Lenkoe** | `@DonBelliiot` | 202322644 | Student Collaborator |
| **Kopano Komanyane** | `@GregoryHorsley` | 202321320 | Student Collaborator |
| **Khobatha Setetemela** | `@khobatha` | - | Course Coordinator & Project Advisor |
| **Liposo Ranoka** | `@Liposo-Ranoka` | 202400088 | Student Collaborator |
| **Matseliso Kheola** | `@Matseliso20` | 202202304 | Student Collaborator |
| **Tumo Ts'ehla** | `@tsehlatumo-ops` | 202400550 | Student Collaborator |
| **Thaane Moletsane** | `@THMN123` | 202322687 | Student Collaborator |

---

## 3. Team Roles & Weekly Rotation Schedule

### Multi-Week Rotation 

| Week & Dates | Milestone Goal | Role Assignments |
| :---: | :--- | :--- |
| **Wk 7**<br>(28 Sep – 04 Oct) | **M1:** ISA Spec & Sample Programs | **ISA Lead:** Dahraps <br> **Assembler Lead:** DonBelliiot <br> **Pipeline Lead:** GregoryHorsley <br> **Hazard Lead:** Liposo-Ranoka <br> **Interface Lead:** Matseliso20 <br> **Test Lead:** tsehlatumo-ops <br> **Scrum Lead:** Thaane Moletsane |
| **Wk 8**<br>(05 Oct – 11 Oct) | **M2:** Simulator Design & Assembler | **ISA Lead:** DonBelliiot <br> **Assembler Lead:** GregoryHorsley <br> **Pipeline Lead:** Liposo-Ranoka <br> **Hazard Lead:** Matseliso20 <br> **Interface Lead:** tsehlatumo-ops <br> **Test Lead:** Thaane Moletsane <br> **Scrum Lead:** Dahraps |
| **Wk 9**<br>(12 Oct – 18 Oct) | **M3:** 5-Stage Core Pipeline | **ISA Lead:** GregoryHorsley <br> **Assembler Lead:** Liposo-Ranoka <br> **Pipeline Lead:** Matseliso20 <br> **Hazard Lead:** tsehlatumo-ops <br> **Interface Lead:** Thaane Moletsane <br> **Test Lead:** Dahraps <br> **Scrum Lead:** DonBelliiot |
| **Wk 10**<br>(19 Oct – 25 Oct) | **M4:** Hazards & Live Visuals | **ISA Lead:** Liposo-Ranoka <br> **Assembler Lead:** Matseliso20 <br> **Pipeline Lead:** tsehlatumo-ops <br> **Hazard Lead:** Thaane Moletsane <br> **Interface Lead:** Dahraps <br> **Test Lead:** DonBelliiot <br> **Scrum Lead:** GregoryHorsley |
| **Wk 11**<br>(26 Oct – 01 Nov) | **M5:** Final Release v1.0 & Report | **ISA Lead:** Matseliso20 <br> **Assembler Lead:** tsehlatumo-ops <br> **Pipeline Lead:** Thaane Moletsane <br> **Hazard Lead:** Dahraps <br> **Interface Lead:** DonBelliiot <br> **Test Lead:** GregoryHorsley <br> **Scrum Lead:** Liposo-Ranoka |

---

## 📁 4. Repository Structure

```text
limo-Visionary-Architects/
├── .github/
│   └── workflows/
│       └── pages.yml              # GitHub Pages Automated Deployment
├── docs/
│   ├── M2_SIMULATOR_DESIGN.md     # Architecture & 5-Stage Datapath Block Diagram
│   ├── PIPELINE_REGISTER_DATA_MODEL.md # Bit-Level Pipeline Register Specs
│   └── WIREFRAMES.md              # UI/UX Wireframe Blueprints
├── examples/                      # Benchmark Sesotho Assembly Programs
│   ├── 01_sum_first_n.s
│   ├── 02_factorial.s
│   └── 03_average.s
├── tests/
│   ├── assembler.test.js          # 29 Automated Unit Tests (JS / Browser / Node)
│   └── test_assembler.py          # Python Unit Test Suite
├── app.js                         # Core Simulator & Assembler Engine
├── index.html                     # Web IDE, Block Diagram & Visualizer
├── style.css                      # Custom Styles & Theme Overrides
├── AI_USE.md                      # AI Transparency & Ethics Log
└── README.md                      # Project Documentation
```

