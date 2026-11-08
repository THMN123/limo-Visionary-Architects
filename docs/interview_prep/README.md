# LIMO Visionary Architects — Group Interview Preparation Hub

> **CS3520 Computer Organisation and Architecture · AY 2026/2027 · Semester A**  
> **National University of Lesotho · Department of Mathematics and Computer Science**  
> **Group Interview Date:** Monday 9 November 2026 (11:00–17:00)  
> **Format:** 15-minute group interview with individual questioning.  
> **Weight:** 100 marks total (15% of CS3520 final grade).  
> **Live Site:** [https://thmn123.github.io/limo-Visionary-Architects/](https://thmn123.github.io/limo-Visionary-Architects/)

---

## 👥 1. Individual Member Interview Packs

Every member must study their personal preparation pack. Each pack includes:
- **1-Sentence Contribution** (for Area E & Close)
- **Exact Git Commits & Terminal Commands** (to prove your work)
- **The 2-Minute Opening Script** (if the examiner picks you)
- **Mini Code Review Tracing Guide** (exact lines in `app.js` and tests)
- **Targeted Question & Answer Bank** (Explain, Justify, Predict, Diagnose)

| # | Team Member | Student ID | GitHub Username | Role Specialization | Individual Prep File |
| :-: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Morapeli Seboka** | 202401651 | `@Dahraps` | ISA Spec & Hardware Invariants ($r0 \equiv 0$) | [01_Morapeli_Seboka_Dahraps.md](01_Morapeli_Seboka_Dahraps.md) |
| **2** | **Beleme Lenkoe** | 202322644 | `@DonBelliiot` | Simulator UI, Visualizer Pills & Memory View | [02_Beleme_Lenkoe_DonBelliiot.md](02_Beleme_Lenkoe_DonBelliiot.md) |
| **3** | **Kopano Komanyane** | 202321320 | `@GregoryHorsley` | Instruction Formats (R/I/S/B) & Binary Encodings | [03_Kopano_Komanyane_GregoryHorsley.md](03_Kopano_Komanyane_GregoryHorsley.md) |
| **4** | **Liposo Ranoka** | 202400088 | `@Liposo-Ranoka` | Assembler Parser, `.limo` Files & Git Conflict Resolving | [04_Liposo_Ranoka_Liposo-Ranoka.md](04_Liposo_Ranoka_Liposo-Ranoka.md) |
| **5** | **Matseliso Kheola** | 202202304 | `@Matseliso20` | M2 Architecture, 4 Pipeline Registers & 29 Unit Tests | [05_Matseliso_Kheola_Matseliso20.md](05_Matseliso_Kheola_Matseliso20.md) |
| **6** | **Tumo Ts'ehla** | 202400550 | `@tsehlatumo-ops` | Table 5 Hardwired Control Unit & Direct Branch Eval | [06_Tumo_Tsehla_tsehlatumo-ops.md](06_Tumo_Tsehla_tsehlatumo-ops.md) |
| **7** | **Thaane Moletsane** | 202322687 | `@THMN123` | Integration, Cycle Stepping Engine & GitHub Pages | [07_Thaane_Moletsane_THMN123.md](07_Thaane_Moletsane_THMN123.md) |

---

## ⏱️ 2. The 15 Minutes Breakdown & Marking Scheme

| Minutes | Segment | Description | Marks | Evaluation Basis |
| :---: | :--- | :--- | :---: | :---: |
| **0–2** | **Opening** | One member chosen by the examiner summarizes what you built and where you stopped (including what does not work). | **10** | **Group** |
| **2–6** | **Submissions** | Questions on M1 ISA and M2 design decisions (any member, any section). | **25** | **Individual** |
| **6–10** | **Mini Code Review** | Tracing and explaining code, files, commits, predicting behavior, and finding faults. | **25** | **Individual** |
| **10–14** | **Core Concepts** | Short, direct questions on computer architecture behind the project. | **25** | **Individual** |
| **14–15** | **Close** | Each member states their own main contribution in one sentence. | **15** | **Group \*** |
| **Total** | | | **100** | |

*\* Note: A member who cannot show any of their own work in the repository scores zero for Area E.*

### Scoring Rubric Per Question:
- **3:** Correct and reasoned.
- **2:** Correct but shallow.
- **1:** Partly correct.
- **0:** Incorrect or no answer.

---

## 🏛️ 3. Master Technical Architecture Cheat Sheet

### 3.1 The 10 Sesotho Instructions (Table 2.4)
- **`kop`** (*kopanya* / add): R-type, opcode `0110011`, funct3 `000`, funct7 `0000000` $\to R[rd] = R[rs1] + R[rs2]$
- **`ts`** (*tlosa* / sub): R-type, opcode `0110011`, funct3 `000`, funct7 `0100000` $\to R[rd] = R[rs1] - R[rs2]$
- **`khh`** (*kopanya hang-hang* / addi): I-type, opcode `0010011`, funct3 `000` $\to R[rd] = R[rs1] + \text{imm}_{12}$
- **`le`** (*le* / and): R-type, opcode `0110011`, funct3 `111`, funct7 `0000000` $\to R[rd] = R[rs1] \ \& \ R[rs2]$
- **`kp`** (*kapa* / or): R-type, opcode `0110011`, funct3 `110`, funct7 `0000000` $\to R[rd] = R[rs1] \ \| \ R[rs2]$
- **`ng`** (*ngatafala* / sll): R-type, opcode `0110011`, funct3 `001`, funct7 `0000000` $\to R[rd] = R[rs1] \ll R[rs2]$
- **`lt`** (*lata* / lw): I-type, opcode `0000011`, funct3 `010` $\to R[rd] = \text{Mem}[R[rs1] + \text{imm}_{12}]$
- **`blk`** (*boloka* / sw): S-type, opcode `0100011`, funct3 `010` $\to \text{Mem}[R[rs1] + \text{imm}_{12}] = R[rs2]$
- **`hlk`** (*ha e lekana* / beq): B-type, opcode `1100011`, funct3 `000` $\to \text{if } R[rs1] == R[rs2]: PC += \text{offset}$
- **`hft`** (*ha e feta* / bgt): B-type, opcode `1100011`, funct3 `101` $\to \text{if } R[rs1] > R[rs2]: PC += \text{offset}$

### 3.2 The 4 Inter-Stage Pipeline Registers
- **`IF/ID` (65 bits):** $PC$ (32b), Instruction (32b), Valid (1b).
- **`ID/EX` (171 bits):** Control signals (11b), $PC$ (32b), $rs1\_val$ (32b), $rs2\_val$ (32b), $imm$ (32b), $rs1$ (5b), $rs2$ (5b), $rd$ (5b), funct3 (3b), funct7 (7b), opcode (7b).
- **`EX/MEM` (139 bits):** Control signals (6b), $PC$ (32b), $aluResult$ (32b), $storeData$ (32b), $branchTarget$ (32b), $rd$ (5b).
- **`MEM/WB` (136 bits):** Control signals (3b), $PC$ (32b), $memReadData$ (32b), $aluResult$ (32b), $writeBackData$ (32b), $rd$ (5b).

### 3.3 Table 5 Control Signals
| Instruction | Format | RegWrite | ALUSrc | ALUOp | MemRead | MemWrite | Branch | MemToReg |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `kop` | R | 1 | 0 | ADD | 0 | 0 | 0 | 0 |
| `ts` | R | 1 | 0 | SUB | 0 | 0 | 0 | 0 |
| `khh` | I | 1 | 1 | ADD | 0 | 0 | 0 | 0 |
| `le` | R | 1 | 0 | AND | 0 | 0 | 0 | 0 |
| `kp` | R | 1 | 0 | OR | 0 | 0 | 0 | 0 |
| `ng` | R | 1 | 0 | SLL | 0 | 0 | 0 | 0 |
| `lt` | I | 1 | 1 | ADD | 1 | 0 | 0 | 1 |
| `blk` | S | 0 | 1 | ADD | 0 | 1 | 0 | X |
| `hlk` | B | 0 | 0 | CMP_EQ| 0 | 0 | 1 | X |
| `hft` | B | 0 | 0 | CMP_GT| 0 | 0 | 1 | X |

---

## 🛑 4. What Does NOT Work / Where We Stopped (Mandatory for Area A — 10 Marks)

When asked about incomplete features:
1. **Hardware Forwarding Unit & Load-Use Stalling**: Designed and documented in [`docs/M2_SIMULATOR_DESIGN.md`](../M2_SIMULATOR_DESIGN.md) (Section 6), but not yet wired into the active runtime execution path. Programs require **2 intervening NOPs or independent instructions** between RAW dependencies.
2. **Dynamic Branch Prediction**: Uses static predict-not-taken; taken branches incur a deterministic **2-cycle penalty** by flushing `IF/ID` and `ID/EX`.
3. **Interrupts & Exceptions**: Hardware interrupts and trap handlers are not implemented.

---

## 💡 5. Universal Emergency Strategy
If the examiner asks a question you do not know the answer to, **DO NOT GUESS AND DO NOT REMAIN SILENT**. Use this formula:

> *"I don't know the exact detail offhand, but I would reason like this: in our 5-stage pipeline, because [mention IF/ID/EX/MEM/WB or register latching], the state would have to..."*

This reasoning structure earns **1 to 2 marks** under the rubric, whereas a wild guess or silence earns **0 marks**.
