# LIMO Interview Preparation Pack: Thaane Moletsane (`@THMN123`)

- **Student Name:** Thaane Moletsane  
- **Student ID:** 202322687  
- **GitHub Username:** `@THMN123` (Email: `thaanemoletsane5@gmail.com`)  
- **Assigned Roles:** Scrum Lead (Week 7: M1), Test Lead (Week 8: M2), Interface Lead (Week 9: M3), Hazard Lead (Week 10: M4), Pipeline Lead (Week 11: M5)  
- **Core Specialties:** Master Integration, Synchronous Clock-Cycle Stepping Engine (`stepPipelineCycle`), Reverse-Stage Execution Ordering (WB $\to$ ID), Instruction Fetch (IF) Logic & PC Redirects, GitHub Pages Deployment, AI Disclosure (`docs/AI_USE.md`).

---

## 1. Fast Overview of the 15-Minute Interview

| Minutes | Segment | Target & Marking | What You Must Do |
| :--- | :--- | :--- | :--- |
| **0–2** | **Opening** | 10 marks (Group) | If picked, deliver the crisp 2-minute summary of what we built, what works, and honestly state what does not work. |
| **2–6** | **Submissions (M1/M2)** | 25 marks (Individual) | Explain overall project architecture, simulator execution flow, GitHub Pages setup, and AI disclosure principles. |
| **6–10** | **Mini Code Review** | 25 marks (Individual) | Trace `stepPipelineCycle()` (Lines 1266–1500) and `runSimulation()` (Lines 1584–1630) line-by-line. |
| **10–14** | **Core Architecture** | 25 marks (Individual) | Deeply explain why WB runs before ID, Program Counter incrementing ($PC + 4$), CPI metrics, and Git integration in 1–3 sentences. |
| **14–15** | **Closing Contribution** | 15 marks (Group / Git) | Recite your exact one-sentence contribution and show your repository commits to earn Area E marks. |

---

## 2. Your 1-Sentence Closing Statement (14–15 min)

> *"I served as integration and repository lead, implemented the synchronous clock-cycle stepping engine and instruction fetch stage, and managed our GitHub Pages deployment and AI disclosure."*

---

## 3. Your Git Proof & Evidence (Area E: Git & Teamwork — 15 Marks)

*If the examiner asks: "Show me your commits in the repository," run this command in terminal:*

```bash
git log --all --author="thaanemoletsane" --oneline
```
**Your Key Commits & Merges:**
- Commit `8080bc8`: `Add AI Disclosure Statement for LIMO Studio` ([`docs/AI_USE.md`](../AI_USE.md)).
- Commit `7ebeaa3`: Merged PR #31 `feature/m3-instruction-fetch` (Instruction Fetch and PC incrementing engine).
- Commit `e3e5e13`: `Draft on M3` (Pipeline core scaffold and execution runner).
- Commit `e9b21c5`: `Move index.html, style.css, and app.js from src/ to root directory` (enabled GitHub Pages static site hosting).
- Commits `4e8c9c6`, `d1e78de`, `f8b5ce3`, `bc1a9c8`, `bcc1911`: Integration commits, M3 milestone documentation updates, and merge coordination with PRs #33 and #35.

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

### Focus 1: Reverse-Stage Execution Ordering in `stepPipelineCycle()`
- **File:** `app.js` (Lines 1285–1505)
- **Order in Function:**
  1. `STAGE 5: WRITE-BACK (WB)` (Line 1286)
  2. `STAGE 4: MEMORY ACCESS (MEM)` (Line 1301)
  3. `STAGE 3: EXECUTE (EX)` (Line 1332)
  4. `STAGE 2: INSTRUCTION DECODE (ID)` (Line 1392)
  5. `STAGE 1: INSTRUCTION FETCH (IF)` (Line 1471)
  6. Register Latching (Lines 1502–1506)
- **Crucial Question: "Why does your software step backwards from Stage 5 to Stage 1?"**
- **Explanation:** In hardware, all 5 stages execute concurrently in parallel during the clock period. In single-threaded JavaScript, if we evaluated Stage 1 first, an instruction fetched in Stage 1 would immediately slip into Stage 2, Stage 3, and finish in a single cycle (cascading). By stepping backwards from WB down to IF, each stage only consumes state latched in the *previous* cycle. Furthermore, executing WB before ID resolves the classic **WB-to-ID same-cycle register hazard** (where instruction in WB writes on falling edge and instruction in ID reads on rising edge).

### Focus 2: Instruction Fetch (IF) Logic & Program Counter
- **File:** `app.js` (Lines 1471–1499)
- **Code:**
  ```javascript
  if (branchTaken) {
    state.pc = branchTarget;
    next_IF_ID = createBubbleIF_ID();
    next_ID_EX = createBubbleID_EX();
    state.pipeline.flushed = true;
  } else {
    const instIdx = Math.floor((state.pc - 0x00400000) / 4);
    if (instIdx >= 0 && instIdx < instructions.length) {
      const current = instructions[instIdx];
      const enc = encodeLimoInstruction(current.rawText);
      next_IF_ID = { valid: true, pc: state.pc, instruction: parseInt(enc.hexEncoding, 16), ... };
      state.pc += 4;
    }
  }
  ```
- **Explanation:** The IF stage reads from Instruction Memory indexed by `(state.pc - 0x00400000) / 4`, advances $PC$ sequentially by $+4$, and latches the instruction into `next_IF_ID`. If a branch was taken in EX, $PC$ is overwritten by `branchTarget` instead.

### Focus 3: Continuous Run & CPI Calculation
- **File:** `app.js` (Lines 1584–1630)
- **Explanation:** `runSimulation()` loops `stepPipelineCycle()` until all pipeline registers become bubbles (`isDrained() == true`), displaying cycles elapsed, retired instructions, and Cycles Per Instruction:
  $$\text{CPI} = \frac{\text{Cycles Elapsed}}{\text{Instructions Retired}}$$

---

## 6. Examiner Question & Answer Bank (Explain, Justify, Predict, Diagnose)

### Category 1: Explain (What does it do?)
**Q1: How does your pipeline resolve the write-after-read hazard between WB and ID in the same cycle?**  
*Answer:* In hardware, the register file writes on the first half of the cycle (or falling edge) and reads on the second half. In software, we simulate this by executing the WB stage before the ID stage, ensuring ID reads the newly committed register value.

**Q2: What is CPI and what is the theoretical peak CPI of our 5-stage pipeline?**  
*Answer:* Cycles Per Instruction (CPI) measures how many clock cycles are needed per instruction on average. In an ideal 5-stage pipeline with no stalls or branch penalties, the theoretical peak CPI is $1.0$.

### Category 2: Justify (Why this, and at what cost?)
**Q3: Why host the simulator on GitHub Pages with client-side JavaScript instead of a backend server?**  
*Answer:* Client-side JavaScript provides zero-latency interactive stepping, runs entirely offline in any modern browser without server provisioning, and makes grading and verification instant for both students and examiners.

**Q4: Why did your team provide an explicit AI Disclosure Statement (`AI_USE.md`)?**  
*Answer:* Academic integrity requires transparent disclosure of AI assistance for frontend boilerplate and test scaffolding, while asserting that all core hardware architecture principles and validation were designed and owned by the student authors.

### Category 3: Predict (What happens if it changes?)
**Q5: What would happen if `state.pc += 4` was executed on a branch taken cycle?**  
*Answer:* The branch target address would be skipped or incremented by 4, jumping to `branchTarget + 4` and causing the first instruction of the branch target subroutine to be missed.

**Q6: What happens to CPI when a loop with frequent branches executes?**  
*Answer:* Because every taken branch incurs a 2-cycle flush penalty, pipeline bubbles are inserted with zero instructions retired, driving the observed CPI above $1.0$ (typically around $1.4$ to $1.8$).

### Category 4: Diagnose (Where would it fail, and how would you know?)
**Q7: If instructions retire but the instruction counter in the UI never increases, where is the bug?**  
*Answer:* In the WB stage, `state.pipeline.instructionsRetired++` is gated inside `if (state.pipeline.MEM_WB.valid)`. If `MEM_WB.valid` was accidentally set to false, retirement is never counted.

**Q8: If `isDrained()` returns true prematurely while code is still executing, how do you diagnose it?**  
*Answer:* Inspect `isDrained()`: it checks whether `IF_ID.valid`, `ID_EX.valid`, `EX_MEM.valid`, and `MEM_WB.valid` are all false. If an inter-stage register dropped its `valid` bit before data propagated, the engine falsely concludes execution has ended.

---

## 7. Core Concepts Checklist
- [x] **Clock-Cycle Concurrency:** All five stages execute within a single clock cycle; inter-stage registers isolate stage outputs.
- [x] **WB-before-ID Evaluation:** Emulates falling-edge write / rising-edge read semantics of physical register files.
- [x] **Branch Penalty:** 2 cycles for taken branches; flushed instructions become bubbles.
- [x] **CPI Calculation:** $\text{CPI} = \text{Total Cycles} / \text{Instructions Retired}$.
