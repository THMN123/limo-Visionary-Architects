# LIMO Interview Preparation Pack: Matseliso Kheola (`@Matseliso20`)

- **Student Name:** Matseliso Kheola  
- **Student ID:** 202202304  
- **GitHub Username:** `@Matseliso20` (Email: `matshidisokheola3@gmail.com`)  
- **Assigned Roles:** Interface Lead (Week 7: M1), Hazard Lead (Week 8: M2), Pipeline Lead (Week 9: M3), Assembler Lead (Week 10: M4), ISA Lead (Week 11: M5)  
- **Core Specialties:** Milestone 2 Simulator Architecture, Pipeline-Register Bit-Level Data Model (65b, 171b, 139b, 136b), Hazard Detection & Forwarding Specifications, 29-Test Automated Assembler Test Suite.

---

## 1. Fast Overview of the 15-Minute Interview

| Minutes | Segment | Target & Marking | What You Must Do |
| :--- | :--- | :--- | :--- |
| **0–2** | **Opening** | 10 marks (Group) | If picked, deliver the crisp 2-minute summary of what we built, what works, and honestly state what does not work. |
| **2–6** | **Submissions (M1/M2)** | 25 marks (Individual) | Deeply justify the 4 pipeline registers, exact bit widths, control signals, and M2 architectural specification. |
| **6–10** | **Mini Code Review** | 25 marks (Individual) | Trace pipeline register structures and bubble factories in `app.js` (Lines 160–250) and tests in `tests/assembler.test.js`. |
| **10–14** | **Core Architecture** | 25 marks (Individual) | Answer direct questions on register bit-budgeting, clock-edge latching, RAW hazards, and pipeline stalls in 1–3 sentences. |
| **14–15** | **Closing Contribution** | 15 marks (Group / Git) | Recite your exact one-sentence contribution and show your repository commits to earn Area E marks. |

---

## 2. Your 1-Sentence Closing Statement (14–15 min)

> *"I authored the Milestone 2 simulator architecture and bit-level pipeline register specifications—IF/ID, ID/EX, EX/MEM, and MEM/WB—and built the 29-case automated assembler test suite."*

---

## 3. Your Git Proof & Evidence (Area E: Git & Teamwork — 15 Marks)

*If the examiner asks: "Show me your commits in the repository," run this command in terminal:*

```bash
git log --all --author="Matseliso20" --oneline
```
**Your Key Commits & Pull Requests:**
- Commit `08ed15b`: `feat(m2): complete simulator design, pipeline-register data model, interface wireframes, working assembler with 29 unit tests, and GitHub Pages setup` (PR #28).
- Documents authored: [`docs/M2_SIMULATOR_DESIGN.md`](../M2_SIMULATOR_DESIGN.md), [`docs/PIPELINE_REGISTER_DATA_MODEL.md`](../PIPELINE_REGISTER_DATA_MODEL.md), [`docs/WIREFRAMES.md`](../WIREFRAMES.md).
- Test file authored: `tests/assembler.test.js` (29 automated unit tests verifying all 10 Sesotho instructions).

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

### Focus 1: Bit-Level Pipeline Register Allocations
Be ready to recite the exact bit budgets from [`docs/PIPELINE_REGISTER_DATA_MODEL.md`](../PIPELINE_REGISTER_DATA_MODEL.md):

1. **`IF/ID` (65 bits total):**
   - $PC$ (32 bits) + Instruction (32 bits) + Valid bit (1 bit) = **65 bits**.
2. **`ID/EX` (171 bits total):**
   - Control signals (11 bits): `valid` (1b), `regWrite` (1b), `memRead` (1b), `memWrite` (1b), `branch` (1b), `aluSrc` (1b), `aluOp` (4b), `memToReg` (1b).
   - Datapath (160 bits): $PC$ (32b), `rs1_val` (32b), `rs2_val` (32b), `imm` (32b), `rs1` (5b), `rs2` (5b), `rd` (5b), `funct3` (3b), `funct7` (7b), `opcode` (7b).
   - Total: $11 + 160 = \mathbf{171\text{ bits}}$.
3. **`EX/MEM` (139 bits total):**
   - Control signals (6 bits): `valid` (1b), `regWrite` (1b), `memRead` (1b), `memWrite` (1b), `memToReg` (1b), `branchTaken` (1b).
   - Datapath (133 bits): $PC$ (32b), `aluResult` (32b), `storeData` (32b), `branchTarget` (32b), `rd` (5b).
   - Total: $6 + 133 = \mathbf{139\text{ bits}}$.
4. **`MEM/WB` (136 bits total):**
   - Control signals (3 bits): `valid` (1b), `regWrite` (1b), `memToReg` (1b).
   - Datapath (133 bits): $PC$ (32b), `memReadData` (32b), `aluResult` (32b), `writeBackData` (32b), `rd` (5b).
   - Total: $3 + 133 = \mathbf{136\text{ bits}}$.

### Focus 2: Bubble Factories in Code
- **File:** `app.js` (Lines 160–210)
- **Code:**
  ```javascript
  function createBubbleIF_ID() {
    return { valid: false, pc: 0x00400000, instruction: 0x00000013, hex: '0x00000013', rawAssembly: 'NOP', mnemonic: 'nop', tokens: ['nop'], lineNum: 0 };
  }
  function createBubbleID_EX() {
    return { valid: false, pc: 0, rs1: 0, rs2: 0, rd: 0, rs1_val: 0, rs2_val: 0, imm: 0, mnemonic: '', regWrite: false, memRead: false, memWrite: false, branch: false, branchCondition: null, aluSrc: false, aluOp: 'ADD', memToReg: false };
  }
  ```
- **Explanation:** When the pipeline flushes or stalls, these factory functions inject a bubble where `valid: false` and all control write enables (`regWrite`, `memWrite`) are zeroed out, preventing unwanted state side-effects.

---

## 6. Examiner Question & Answer Bank (Explain, Justify, Predict, Diagnose)

### Category 1: Explain (What does it do?)
**Q1: What is the purpose of an inter-stage pipeline register?**  
*Answer:* Pipeline registers isolate the combinational logic of adjacent stages so they can operate simultaneously on different instructions without electrical interference, latching results synchronously on the rising clock edge.

**Q2: Why does the ID/EX register store the source register numbers `rs1` and `rs2`?**  
*Answer:* The execution stage does not perform register file lookups, but `rs1` and `rs2` numbers are required by the Forwarding Unit to compare against `EX/MEM.rd` and `MEM/WB.rd` to detect data hazards.

### Category 2: Justify (Why this, and at what cost?)
**Q3: Why pass control signals through the pipeline registers rather than decoding them anew in each stage?**  
*Answer:* Decoding once in the ID stage eliminates redundant decoding logic in later stages and guarantees that the control signals stay perfectly synchronized with their associated instruction as it flows down the pipeline.

**Q4: Why does `EX/MEM` need both `aluResult` and `storeData`?**  
*Answer:* For a store instruction (`blk`), `aluResult` contains the calculated target memory address ($R[rs1] + \text{imm}$), while `storeData` holds the value from $R[rs2]$ to be written into data memory.

### Category 3: Predict (What happens if it changes?)
**Q5: What would happen if the `valid` bit in a pipeline register was omitted?**  
*Answer:* During pipeline fill, pipeline stalls, or branch flushes, empty slots containing uninitialized zeros would be treated as valid instructions (often decoding to ADD $r0, r0, r0$), causing false instruction retirement counts and incorrect CPU metrics.

**Q6: What happens if `ID/EX.rd` is propagated incorrectly as 0?**  
*Answer:* When the instruction reaches the Write-Back stage, `MEM_WB.rd` will be 0; the WB logic will treat the instruction as targeting the hardwired zero register, and the intended destination register will never receive its value.

### Category 4: Diagnose (Where would it fail, and how would you know?)
**Q7: If a load word instruction (`lt`) executes, but memory data is not written to register `rd`, where is the bug?**  
*Answer:* Check the `memToReg` control signal. If `memToReg` was decoded as 0 instead of 1, the WB stage multiplexer selects `aluResult` (the memory address) instead of `memReadData` (the data read from memory).

**Q8: If Test #9 in `pipeline.test.js` fails after a reset, what failed in the hardware model?**  
*Answer:* `resetPipeline()` did not set all 4 pipeline registers to `valid: false` bubbles, leaving dirty valid flags from the prior execution.

---

## 7. Core Concepts Checklist
- [x] **Pipeline Latency vs. Throughput:** Latency for 1 instruction is 5 clock cycles; peak throughput is 1 instruction retired per cycle ($CPI = 1.0$).
- [x] **Clock Period:** Governed by the slowest stage (typically MEM or EX), plus pipeline register setup/hold time.
- [x] **Control Propagation:** ID generates control bundle; each subsequent register carries only the control signals needed by downstream stages.
- [x] **Bubble vs. Stall:** A stall freezes upstream registers ($PC, IF/ID$); a bubble zeroes control signals downstream to prevent writes.
