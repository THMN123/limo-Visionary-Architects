# LIMO Interview Preparation Pack: Morapeli Seboka (`@Dahraps`)

- **Student Name:** Morapeli Seboka  
- **Student ID:** 202401651  
- **GitHub Username:** `@Dahraps` (Email: `darapsseboka@gmail.com`)  
- **Assigned Roles:** ISA Lead (Week 7: M1), Scrum Lead (Week 8: M2), Test Lead (Week 9: M3)  
- **Core Specialties:** ISA Specification, Hardware Invariants ($r0 \equiv 0$ & Stack Pointer Reset), Arithmetic & Immediate Range Testing (-2048 to +2047), Automated Test Suite Verification.

---

## 1. Fast Overview of the 15-Minute Interview

| Minutes | Segment | Target & Marking | What You Must Do |
| :--- | :--- | :--- | :--- |
| **0–2** | **Opening** | 10 marks (Group) | If picked, deliver the crisp 2-minute summary of what we built, what works, and honestly state what does not work. |
| **2–6** | **Submissions (M1/M2)** | 25 marks (Individual) | Explain & justify LIMO ISA (RV32I-derived, Sesotho names, 32 registers, Section 3e flag-less branches). |
| **6–10** | **Mini Code Review** | 25 marks (Individual) | Trace code live on screen (`app.js`, `tests/pipeline.test.js`, `tests/assembler.test.js`). Explain lines, variables, logic. |
| **10–14** | **Core Architecture** | 25 marks (Individual) | Answer direct questions on pipelining, hazards, forwarding, stalls, and control signals in 1–3 sentences. |
| **14–15** | **Closing Contribution** | 15 marks (Group / Git) | Recite your exact one-sentence contribution and show your repository commits to earn Area E marks. |

> **Marking Rule:** 3 = Correct & reasoned; 2 = Correct but shallow; 1 = Partly correct; 0 = Incorrect/no answer.  
> **Emergency Rule:** If you don't know an answer, NEVER guess or stay silent. Say: *"I don't know the exact detail, but I would reason like this: in our 5-stage pipeline..."* (Earns 1 to 2 marks instead of 0).

---

## 2. Your 1-Sentence Closing Statement (14–15 min)

> *"I led the ISA specification design and automated testing verification for hardware invariants, register write protections, and boundary conditions across all 54 unit tests."*

---

## 3. Your Git Proof & Evidence (Area E: Git & Teamwork — 15 Marks)

*If the examiner asks: "Show me your commits in the repository," run this command in terminal:*

```bash
git log --all --author="darapsseboka" --oneline
```
**Your Key Commits & Branches:**
- Commit `a03f913`: `Updated the file structure to current structure` (restructured repository layout to support modular documentation and tests).
- Role as **ISA Lead (Wk 7)**: Verification of Table 2.2 Register definitions and Table 2.4 instruction mapping.
- Role as **Test Lead (Wk 9)**: Validation of automated test suites (`tests/assembler.test.js` & `tests/pipeline.test.js`) guaranteeing 54 passing tests (100% pass rate).

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

### Focus 1: Hardware Invariant — Register $r0$ (`Letho`) Protection
- **File:** `app.js` (Lines 1289–1295)
- **Code:**
  ```javascript
  if (state.pipeline.MEM_WB.regWrite && state.pipeline.MEM_WB.rd !== 0) {
    state.registers[state.pipeline.MEM_WB.rd] = state.pipeline.MEM_WB.writeBackData | 0;
    state.pipeline.lastWrittenReg = state.pipeline.MEM_WB.rd;
  }
  state.registers[0] = 0; // Letho invariant: hardwired zero
  ```
- **Explanation:** In the WB stage, register write-back is gated by `state.pipeline.MEM_WB.rd !== 0`. Even if machine code attempts to write to `r0`, `state.registers[0]` is explicitly reset to 0 every clock cycle. This guarantees $r0 \equiv 0$ at all times, matching RISC-V architectural specifications.

### Focus 2: Reset State & Stack Pointer Initialization
- **File:** `app.js` (Lines 1248–1264)
- **Code:**
  ```javascript
  function resetCpu() {
    state.registers = new Array(32).fill(0);
    state.registers[2] = 0x7FFFFFF0; // Tshupo (sp) stack pointer top of user stack
    state.pc = 0x00400000;
    state.pipeline = resetPipeline();
  }
  ```
- **Explanation:** `r2` (`Tshupo` / `sp`) is initialized to `0x7FFFFFF0` to provide space for downwards stack growth without colliding with code memory at `0x00400000`.

### Focus 3: Automated Invariant Test
- **File:** `tests/pipeline.test.js` (Test #15)
- **Trace:** Test executes `khh r0, r0, 99` (attempting to load 99 into `r0`). After 5 clock cycles, the test asserts `state.registers[0] === 0`.

---

## 6. Examiner Question & Answer Bank (Explain, Justify, Predict, Diagnose)

### Category 1: Explain (What does it do?)
**Q1: What is the purpose of the register $r0$ (`Letho`) in LIMO?**  
*Answer:* $r0$ is hardwired to constant zero. It acts as a zero source for pseudo-instructions—such as loading constants (`khh rd, r0, imm`) or register copies—and serves as a discard destination for operations whose results are not needed.

**Q2: How does the test suite verify that the assembler rejects invalid immediate values?**  
*Answer:* In `tests/assembler.test.js` (Tests #25 and #26), we feed values of 2048 ($2^{11}$) and -2049 ($-2^{11}-1$) to `khh`. The assembler detects that they exceed 12-bit signed two's-complement limits and throws descriptive assembly errors.

### Category 2: Justify (Why this, and at what cost?)
**Q3: Why does LIMO use 32 architectural registers instead of 16?**  
*Answer:* 32 registers minimize memory traffic by allowing more compiler variables and function arguments to remain in fast registers. The cost is a 5-bit register specifier field in every instruction format ($3 \times 5 = 15$ bits total for R-type), leaving fewer bits for opcodes and immediates.

**Q4: Why does `resetCpu()` set the Program Counter to `0x00400000` rather than `0x00000000`?**  
*Answer:* Following standard MIPS/RISC-V conventions, address `0x00000000` is reserved for null pointer trap detection and low-memory OS vectors, whereas user text/code space begins cleanly at `0x00400000`.

### Category 3: Predict (What happens if it changes?)
**Q5: What would happen if we removed the check `MEM_WB.rd !== 0` in the Write-Back stage?**  
*Answer:* Any instruction targeting $r0$ would overwrite the zero register for one cycle until `state.registers[0] = 0` is executed, creating transient corruption for any concurrent instruction reading $r0$ in the ID stage.

**Q6: What would happen if an instruction wrote an immediate of 4096 into an I-type instruction?**  
*Answer:* A 12-bit immediate field can only encode values from $-2048$ to $+2047$. 4096 would overflow the field, resulting in either silent bit truncation to 0 or an assembler boundary error.

### Category 4: Diagnose (Where would it fail, and how would you know?)
**Q7: Suppose a student runs a loop and register `r8` never updates. Where would you diagnose the fault?**  
*Answer:* First, check if the producer instruction has reached the WB stage (`cycle >= 5`). Second, inspect the `ID/EX.regWrite` and `MEM/WB.regWrite` control signals to ensure write-enable is asserted. Third, verify `MEM_WB.rd` is indeed 8 and not 0.

**Q8: If `npm test` fails on Test #15 (`r0` invariant), what part of the pipeline broke?**  
*Answer:* The Write-Back stage logic in `stepPipelineCycle()` failed to enforce `MEM_WB.rd !== 0` or omitted the post-commit zeroing assignment `state.registers[0] = 0`.

---

## 7. Core Concepts Checklist
- [x] **5-Stage Order:** IF (Fetch) $\to$ ID (Decode/RegRead) $\to$ EX (ALU/Branch) $\to$ MEM (Data Memory) $\to$ WB (RegWrite).
- [x] **Harvard Datapath:** Separate Instruction Memory (`IMEM`) at `0x00400000` and Data Memory (`DMEM`) at `0x10000000` / dynamic offsets.
- [x] **Clocking:** Master clock ticks once per cycle; all 4 inter-stage registers latch simultaneously on the rising edge.
- [x] **Hazard-Free Requirement:** Producer must reach WB before consumer reads in ID, requiring 2 intervening NOPs without forwarding hardware.
