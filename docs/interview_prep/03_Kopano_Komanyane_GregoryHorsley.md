# LIMO Interview Preparation Pack: Kopano Komanyane (`@GregoryHorsley`)

- **Student Name:** Kopano Komanyane  
- **Student ID:** 202321320  
- **GitHub Username:** `@GregoryHorsley` (Email: `kopanobenedict@gmail.com`)  
- **Assigned Roles:** Pipeline Lead (Week 7: M1), Assembler Lead (Week 8: M2), ISA Lead (Week 9: M3), Scrum Lead (Week 10: M4), Test Lead (Week 11: M5)  
- **Core Specialties:** Instruction Set Architecture (ISA) Specification, Fixed 32-Bit Instruction Formats (R, I, S, B), Binary Field Encodings, Immediate Sign-Extension Logic (12-bit & 13-bit branch), Milestone Documentation.

---

## 1. Fast Overview of the 15-Minute Interview

| Minutes | Segment | Target & Marking | What You Must Do |
| :--- | :--- | :--- | :--- |
| **0–2** | **Opening** | 10 marks (Group) | If picked, deliver the crisp 2-minute summary of what we built, what works, and honestly state what does not work. |
| **2–6** | **Submissions (M1/M2)** | 25 marks (Individual) | Deeply explain the 4 instruction formats (R, I, S, B), opcode / funct3 / funct7 assignments, and sign extension. |
| **6–10** | **Mini Code Review** | 25 marks (Individual) | Trace `encodeLimoInstruction()` and instruction field extraction in `app.js` (Lines 400–650 & 1400–1450). |
| **10–14** | **Core Architecture** | 25 marks (Individual) | Answer direct questions on instruction decoding, immediate generation, and branch offset calculation in 1–3 sentences. |
| **14–15** | **Closing Contribution** | 15 marks (Group / Git) | Recite your exact one-sentence contribution and show your repository commits to earn Area E marks. |

---

## 2. Your 1-Sentence Closing Statement (14–15 min)

> *"I led the ISA binary encoding specification for all 10 Sesotho instructions, defining the fixed 32-bit R, I, S, and B instruction formats and immediate sign-extension rules."*

---

## 3. Your Git Proof & Evidence (Area E: Git & Teamwork — 15 Marks)

*If the examiner asks: "Show me your commits in the repository," run this command in terminal:*

```bash
git log --all --author="GregoryHorsley" --oneline
```
**Your Key Commits & Pull Requests:**
- Commit `c7b754e`: `pdf for submission` (M1 ISA specification document deliverable).
- Commit `9eaf1a5`: `commit 3` (instruction set and documentation synchronization).
- Commit `c3b33e5`: `Update README.md` (PR #21 `GregoryHorsley-patch-1`).
- Commit `505d8c2`: `update files in main` (PR #20 `feature/kopano`).

---

## 4. The 2-Minute Opening Script (If the Examiner Calls on YOU)

*(Deliver calmly, confidently, without hesitation in ~90 seconds)*

> "In the LIMO Studio project, our team built a complete 32-bit load-store processor derived from RISC-V RV32I with an assembly language using Sesotho orthography.
> 
> **For Milestone 1 and 2**, we established the frozen ISA specification with 10 core instructions, a 32-register architectural file, an interactive Harvard datapath architecture, and a working web/CLI assembler validated with 29 automated unit tests.
> 
> **For Milestone 3**, we implemented the 5-stage synchronous pipeline core—Fetch, Decode, Execute, Memory, and Write-Back—separated by four bit-accurate inter-stage registers, driven by a dedicated hardwired Control Unit decoding Table 5 signals. Programs execute with single-cycle stepping, continuous run, hardware reset, live register glowing, and a word-aligned memory hex dump.
> 
> **Where we stopped and what does not work yet:** While our data forwarding paths and load-use hazard interlocks are fully designed in our Milestone 2 specification, they are not yet wired into the active runtime execution path. Therefore, our core currently requires hazard-free instruction scheduling—meaning RAW data dependencies require two intervening instructions or NOPs. Furthermore, branch prediction is static predict-not-taken, incurring a 2-cycle flush in the EX stage, and hardware interrupts are not implemented."

---

## 5. Mini Code Review Walkthrough (6–10 min)

### Focus 1: The 4 Instruction Formats & Field Positions
Explain this exact 32-bit layout to the examiner:

```text
R-format: [ funct7 (7b: 31-25) | rs2 (5b: 24-20) | rs1 (5b: 19-15) | funct3 (3b: 14-12) | rd (5b: 11-7) | opcode (7b: 6-0) ]
I-format: [ immediate (12b: 31-20)               | rs1 (5b: 19-15) | funct3 (3b: 14-12) | rd (5b: 11-7) | opcode (7b: 6-0) ]
S-format: [ imm[11:5] (7b)     | rs2 (5b: 24-20) | rs1 (5b: 19-15) | funct3 (3b: 14-12) | imm[4:0] (5b) | opcode (7b: 6-0) ]
B-format: [ imm[12|10:5] (7b)  | rs2 (5b: 24-20) | rs1 (5b: 19-15) | funct3 (3b: 14-12) | imm[4:1|11](5b)| opcode (7b: 6-0) ]
```

### Focus 2: The 10 Sesotho Instructions Mapping Table
| Mnemonic | English Meaning | Format | Opcode | Funct3 | Funct7 | Operation |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `kop` | *kopanya* (add) | R | `0110011` | `000` | `0000000` | $R[rd] = R[rs1] + R[rs2]$ |
| `ts` | *tlosa* (subtract) | R | `0110011` | `000` | `0100000` | $R[rd] = R[rs1] - R[rs2]$ |
| `khh` | *kopanya hang-hang* (addi) | I | `0010011` | `000` | N/A | $R[rd] = R[rs1] + \text{imm}_{12}$ |
| `le` | *le* (and) | R | `0110011` | `111` | `0000000` | $R[rd] = R[rs1] \ \& \ R[rs2]$ |
| `kp` | *kapa* (or) | R | `0110011` | `110` | `0000000` | $R[rd] = R[rs1] \ \| \ R[rs2]$ |
| `ng` | *ngatafala* (shift left) | R | `0110011` | `001` | `0000000` | $R[rd] = R[rs1] \ll R[rs2]$ |
| `lt` | *lata* (load word) | I | `0000011` | `010` | N/A | $R[rd] = \text{Mem}[R[rs1] + \text{imm}_{12}]$ |
| `blk` | *boloka* (store word) | S | `0100011` | `010` | N/A | $\text{Mem}[R[rs1] + \text{imm}_{12}] = R[rs2]$ |
| `hlk` | *ha e lekana* (branch equal) | B | `1100011` | `000` | N/A | if $R[rs1] == R[rs2]: PC += \text{offset}$ |
| `hft` | *ha e feta* (branch greater) | B | `1100011` | `101` | N/A | if $R[rs1] > R[rs2]: PC += \text{offset}$ |

### Focus 3: Immediate Sign Extension
- **File:** `app.js` / `tests/test_assembler.py`
- **Code:**
  - **I-type:** 12-bit signed immediate ($-2048$ to $+2047$). Sign bit is bit 31.
  - **S-type:** Split 12-bit immediate: bits $[31:25]$ hold `imm[11:5]`, bits $[11:7]$ hold `imm[4:0]`.
  - **B-type:** 13-bit signed immediate with bit 0 implicitly 0 (halfword/word aligned branch targets).

---

## 6. Examiner Question & Answer Bank (Explain, Justify, Predict, Diagnose)

### Category 1: Explain (What does it do?)
**Q1: Why does S-type format (`blk`) split the 12-bit immediate into two separate fields?**  
*Answer:* Splitting the immediate allows the source register specifiers `rs1` (bits 19–15) and `rs2` (bits 24–20) to remain in identical bit positions as in R-type format, simplifying register file decode hardware.

**Q2: Why does B-type format have an implicit zero at bit 0?**  
*Answer:* Instructions in LIMO are 32-bit (4-byte) aligned; therefore branch target addresses are always multiples of 2 (or 4) bytes, making the least significant bit always zero.

### Category 2: Justify (Why this, and at what cost?)
**Q3: Why derive LIMO from RV32I instead of creating a completely novel custom ISA?**  
*Answer:* Deriving from RV32I leverages a proven, elegant RISC load-store architecture with fixed 32-bit instruction lengths, making hardware decoding simple and allowing direct mapping to standard microarchitectural principles taught in CS3520.

**Q4: Why does `hft` (*ha e feta*) use funct3 `101`?**  
*Answer:* In standard RISC-V, funct3 `101` corresponds to `BGE` (branch if greater than or equal, signed). In LIMO, we assigned `101` to represent signed strict greater-than (`BGT`), matching our Sesotho specification without creating new opcode classes.

### Category 3: Predict (What happens if it changes?)
**Q5: What happens if an instruction is fetched from an address not divisible by 4?**  
*Answer:* Because all LIMO instructions are strictly fixed 32-bit (4 bytes) wide, fetching from a non-aligned address would cross instruction boundaries, causing an instruction address misaligned exception.

**Q6: What would happen if we used variable-length instructions (e.g. 16-bit and 32-bit)?**  
*Answer:* Variable-length encoding requires multi-stage fetch or pre-decoding hardware to know instruction boundaries, significantly complicating the simple 5-stage pipeline and increasing critical path delay in the IF stage.

### Category 4: Diagnose (Where would it fail, and how would you know?)
**Q7: If `kop r8, r6, r7` outputs subtraction instead of addition, where is the encoding bug?**  
*Answer:* Check bit 30 (`funct7`). Both `kop` (ADD) and `ts` (SUB) share opcode `0110011` and funct3 `000`; subtraction is distinguished solely by bit 30 being `1` (`0100000`). If funct7 was emitted with bit 30 high, the ALU executes SUB.

**Q8: If a branch to label `loop` jumps to the wrong memory location, how do you diagnose it?**  
*Answer:* Inspect the calculated branch immediate: B-type immediate represents a **PC-relative byte offset** (`targetAddress - currentPC`), NOT an absolute address. If the assembler calculated absolute PC rather than delta PC, the jump will land in uninitialized space.

---

## 7. Core Concepts Checklist
- [x] **Load-Store Architecture:** Only `lt` and `blk` access data memory; all arithmetic/logic operates strictly on registers.
- [x] **Fixed 32-Bit Length:** Every instruction is exactly 4 bytes; $PC$ advances by $+4$ each sequential cycle.
- [x] **Little-Endian:** Byte 0 is the least significant byte stored at the lower memory address.
- [x] **Instruction Formats:** R (Register-Register), I (Immediate/Load), S (Store), B (Branch).
