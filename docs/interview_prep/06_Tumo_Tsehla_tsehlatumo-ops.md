# LIMO Interview Preparation Pack: Tumo Ts'ehla (`@tsehlatumo-ops`)

- **Student Name:** Tumo Ts'ehla  
- **Student ID:** 202400550  
- **GitHub Username:** `@tsehlatumo-ops` (Email: `tsehlatumo@gmail.com`)  
- **Assigned Roles:** Test Lead (Week 7: M1), Interface Lead (Week 8: M2), Hazard Lead (Week 9: M3), Pipeline Lead (Week 10: M4), Assembler Lead (Week 11: M5)  
- **Core Specialties:** Hardwired Control Unit Design, Table 5 Control Signal Truth Table, Instruction Decoding in ID Stage, Section 3(e) Zero-Flag Direct Branch Evaluation, Control Hazard Flushes & 2-Cycle Penalty.

---

## 1. Fast Overview of the 15-Minute Interview

| Minutes | Segment | Target & Marking | What You Must Do |
| :--- | :--- | :--- | :--- |
| **0–2** | **Opening** | 10 marks (Group) | If picked, deliver the crisp 2-minute summary of what we built, what works, and honestly state what does not work. |
| **2–6** | **Submissions (M1/M2)** | 25 marks (Individual) | Deeply justify Table 5 Control Unit signals, hardwired vs microprogrammed, and Section 3(e) flag-less branch design. |
| **6–10** | **Mini Code Review** | 25 marks (Individual) | Trace `ControlUnit.decode()` (Lines 339–380) and Branch Evaluation (Lines 1364–1371) in `app.js`. |
| **10–14** | **Core Architecture** | 25 marks (Individual) | Answer direct questions on control signals, branch penalties, comparator datapath, and flushes in 1–3 sentences. |
| **14–15** | **Closing Contribution** | 15 marks (Group / Git) | Recite your exact one-sentence contribution and show your repository commits to earn Area E marks. |

---

## 2. Your 1-Sentence Closing Statement (14–15 min)

> *"I designed and implemented the hardwired Control Unit decoding Table 5 signals, and built the Section 3(e) direct-comparison branch evaluation unit in the EX stage."*

---

## 3. Your Git Proof & Evidence (Area E: Git & Teamwork — 15 Marks)

*If the examiner asks: "Show me your commits in the repository," run this command in terminal:*

```bash
git log --all --author="tsehlatumo" --oneline
```
**Your Key Commits & Pull Requests:**
- Commit `da07624`: `Improve and verify instruction decoding and hardwired control` (PR #32 `feature/m3-control-unit`).
- Commit `ae67fcc`: `added grade averages example` (`examples/05_grade_average.s`, PR #17).
- Commit `6adcc0e`: `Remove accidentally committed diplicate project folder` (PR #19).
- Pull Request #32 merged into `feature/m3` on Nov 3, 2026.

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

### Focus 1: Hardwired Control Unit (`ControlUnit.decode()`)
- **File:** `app.js` (Lines 339–380)
- **Code:**
  ```javascript
  const ControlUnit = {
    decode(mnemonic) {
      const m = mnemonic.toLowerCase().trim();
      switch (m) {
        case 'kop': return { valid: true, regWrite: true,  aluSrc: false, aluOp: 'ADD', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };
        case 'ts':  return { valid: true, regWrite: true,  aluSrc: false, aluOp: 'SUB', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };
        case 'khh': return { valid: true, regWrite: true,  aluSrc: true,  aluOp: 'ADD', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };
        case 'le':  return { valid: true, regWrite: true,  aluSrc: false, aluOp: 'AND', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };
        case 'kp':  return { valid: true, regWrite: true,  aluSrc: false, aluOp: 'OR',  memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };
        case 'ng':  return { valid: true, regWrite: true,  aluSrc: false, aluOp: 'SLL', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };
        case 'lt':  return { valid: true, regWrite: true,  aluSrc: true,  aluOp: 'ADD', memRead: true,  memWrite: false, branch: false, branchCondition: null, memToReg: true  };
        case 'blk': return { valid: true, regWrite: false, aluSrc: true,  aluOp: 'ADD', memRead: false, memWrite: true,  branch: false, branchCondition: null, memToReg: false };
        case 'hlk': return { valid: true, regWrite: false, aluSrc: false, aluOp: 'SUB', memRead: false, memWrite: false, branch: true,  branchCondition: 'EQ', memToReg: false };
        case 'hft': return { valid: true, regWrite: false, aluSrc: false, aluOp: 'SUB', memRead: false, memWrite: false, branch: true,  branchCondition: 'GT', memToReg: false };
      }
    }
  };
  ```
- **Explanation:** In the ID stage, `ControlUnit.decode()` acts as a single-cycle combinational truth table, generating the 9 hardware control lines required by the downstream datapath multiplexers.

### Focus 2: Section 3(e) Direct Branch Comparison (EX Stage)
- **File:** `app.js` (Lines 1364–1371)
- **Code:**
  ```javascript
  if (state.pipeline.ID_EX.branch) {
    if (state.pipeline.ID_EX.branchCondition === 'EQ') {
      branchTaken = (state.pipeline.ID_EX.rs1_val === state.pipeline.ID_EX.rs2_val);
    } else if (state.pipeline.ID_EX.branchCondition === 'GT') {
      branchTaken = ((state.pipeline.ID_EX.rs1_val | 0) > (state.pipeline.ID_EX.rs2_val | 0));
    }
    branchTarget = (state.pipeline.ID_EX.pc + state.pipeline.ID_EX.imm) | 0;
  }
  ```
- **Explanation:** In Section 3(e) Zero-Flag Architecture, LIMO evaluates branch conditions directly by comparing register values inside the EX stage (`EQ` for `hlk`, signed `GT` for `hft`) without reading or setting status flags (NZCV).

### Focus 3: Control Hazard Flushing (2-Cycle Penalty)
- **File:** `app.js` (Lines 1475–1480)
- **Code:**
  ```javascript
  if (branchTaken) {
    state.pc = branchTarget;
    next_IF_ID = createBubbleIF_ID(); // Flush speculative instruction in IF/ID
    next_ID_EX = createBubbleID_EX(); // Flush speculative instruction in ID/EX
    state.pipeline.flushed = true;
  }
  ```
- **Explanation:** Because branches resolve in EX, the two instructions fetched behind the branch (in IF and ID) are speculative. When `branchTaken == true`, both slots are overwritten with bubbles, incurring a deterministic 2-cycle branch penalty.

---

## 6. Examiner Question & Answer Bank (Explain, Justify, Predict, Diagnose)

### Category 1: Explain (What does it do?)
**Q1: What does the control signal `ALUSrc` control in the datapath?**  
*Answer:* `ALUSrc` controls the multiplexer selecting the second operand of the ALU: when `0`, it selects register value `rs2_val` (for R-type and branch); when `1`, it selects the sign-extended `imm` (for `khh`, `lt`, and `blk`).

**Q2: What is Section 3(e) Zero-Flag Architecture in LIMO?**  
*Answer:* Section 3(e) specifies that conditional branches do not use condition code registers (flags like N, Z, C, V). Instead, the branch instruction directly compares operands `rs1` and `rs2` in the EX stage, eliminating status register hazards and dependencies.

### Category 2: Justify (Why this, and at what cost?)
**Q3: Why resolve branches in the EX stage rather than moving branch resolution to the ID stage?**  
*Answer:* Resolving in EX reuses the existing ALU comparator and avoids adding extra 32-bit comparators and forwarding paths in ID. The cost is a 2-cycle branch penalty on taken branches instead of 1 cycle.

**Q4: Why use a hardwired control unit instead of a microprogrammed control unit?**  
*Answer:* RISC ISAs feature simple, fixed-format instructions that decode in a single cycle. A hardwired combinational control unit is significantly faster and occupies less chip area than microcode ROM.

### Category 3: Predict (What happens if it changes?)
**Q5: What happens if `RegWrite` is accidentally asserted on `blk` (store word)?**  
*Answer:* In the WB stage, the processor would attempt to write `storeData` back into register `rd`. Because S-type format does not have an `rd` field (bits 11–7 encode `imm[4:0]`), it would corrupt an arbitrary register.

**Q6: What happens if the branch penalty flush only cleared `IF/ID` but forgot to clear `ID/EX`?**  
*Answer:* The instruction that was in the ID stage during branch evaluation would continue into the EX stage and execute illegally, corrupting architectural state with wrong-path execution.

### Category 4: Diagnose (Where would it fail, and how would you know?)
**Q7: If `hft r6, r7, offset` takes the branch when $r6 = -5$ and $r7 = 2$, where is the bug?**  
*Answer:* The comparison was performed as an **unsigned** integer rather than signed. In unsigned comparison, $-5$ (`0xFFFFFFFB`) is larger than $2$, so it wrongly evaluates as true. Enforcing `(val | 0)` restores signed two's-complement comparison.

**Q8: If memory instructions (`lt` and `blk`) calculate the wrong effective address, what signal failed?**  
*Answer:* Check `ALUOp` and `ALUSrc`. Effective address computation requires `ALUOp = 'ADD'` and `ALUSrc = 1` to compute $R[rs1] + \text{imm}$. If `ALUSrc` was 0, it added $R[rs2]$ instead of immediate.

---

## 7. Core Concepts Checklist
- [x] **Hardwired Truth Table:** 9 control signals generated strictly from opcode/mnemonic in ID stage.
- [x] **Branch Penalty:** Deterministic 2 cycles on taken branch; 0 penalty cycles on not-taken fall-through.
- [x] **Flushing Logic:** Synchronously replaces pipeline register contents with NOP bubbles (`valid: false`, `regWrite: false`, `memWrite: false`).
- [x] **Direct Branch Compare:** `hlk` evaluates $A == B$; `hft` evaluates $(int32)A > (int32)B$.
