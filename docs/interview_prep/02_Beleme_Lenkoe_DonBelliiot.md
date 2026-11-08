# LIMO Interview Preparation Pack: Beleme Lenkoe (`@DonBelliiot`)

- **Student Name:** Beleme Lenkoe  
- **Student ID:** 202322644  
- **GitHub Username:** `@DonBelliiot` (Email: `belemeelliott@gmail.com`)  
- **Assigned Roles:** Assembler Lead (Week 7: M1), ISA Lead (Week 8: M2), Scrum Lead (Week 9: M3), Test Lead (Week 10: M4), Interface Lead (Week 11: M5)  
- **Core Specialties:** Simulator UI & Visualization, Live Pipeline Stage Indicator Pills, Live Write-Back Register Glowing Pulse, Word-Aligned Memory Hex Viewer, Benchmark Programs (`boloka.s` & `kopanya.s`).

---

## 1. Fast Overview of the 15-Minute Interview

| Minutes | Segment | Target & Marking | What You Must Do |
| :--- | :--- | :--- | :--- |
| **0–2** | **Opening** | 10 marks (Group) | If picked, deliver the crisp 2-minute summary of what we built, what works, and honestly state what does not work. |
| **2–6** | **Submissions (M1/M2)** | 25 marks (Individual) | Explain UI wireframe design decisions (`WIREFRAMES.md`), interactive visualizer, and example programs. |
| **6–10** | **Mini Code Review** | 25 marks (Individual) | Trace visualizer and rendering functions in `app.js` (Lines 1510–1540 and 2050–2130) and memory/register views. |
| **10–14** | **Core Architecture** | 25 marks (Individual) | Answer direct questions on memory access, register file timing, pipeline visibility, and memory-mapped state in 1–3 sentences. |
| **14–15** | **Closing Contribution** | 15 marks (Group / Git) | Recite your exact one-sentence contribution and show your repository commits to earn Area E marks. |

---

## 2. Your 1-Sentence Closing Statement (14–15 min)

> *"I authored the benchmark example programs `boloka.s` and `kopanya.s`, and implemented the interactive simulator visualizations including live pipeline stage glowing pills, register commit pulses, and word-aligned memory hex dump."*

---

## 3. Your Git Proof & Evidence (Area E: Git & Teamwork — 15 Marks)

*If the examiner asks: "Show me your commits in the repository," run this command in terminal:*

```bash
git log --all --author="belemeelliott" --oneline
```
**Your Key Commits & Pull Requests:**
- Commit `7e9fb2b`: `Improve and verify simulator interface and visualization` (PR #33 `feature/m3-interface`).
- Commit `aea6f9c` & `b693eab`: `feat: add examples boloka.s and kopanya.s` (PR #18 `feature/limo-instructions`).
- Pull Request #33 merged into `main` by team lead.

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

### Focus 1: Stage Pill Glowing Visualizer
- **File:** `app.js` (Lines 1515–1535)
- **Code:**
  ```javascript
  ['IF', 'ID', 'EX', 'MEM', 'WB'].forEach(stage => {
    const pill = document.getElementById(`stage-pill-${stage.toLowerCase()}`);
    const reg = state.pipeline[getRegisterForStage(stage)];
    if (pill) {
      if (reg && reg.valid) {
        pill.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/40', 'animate-pulse');
        pill.textContent = `${stage}: ${reg.mnemonic || 'BUSY'}`;
      } else {
        pill.classList.remove('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/40', 'animate-pulse');
        pill.textContent = `${stage}: BUBBLE`;
      }
    }
  });
  ```
- **Explanation:** In every clock cycle, this function inspects the `valid` bit of each inter-stage register (`IF_ID`, `ID_EX`, `EX_MEM`, `MEM_WB`). If valid, the pill glows green and displays the active instruction mnemonic; if invalid (a bubble or flushed slot), it displays `BUBBLE` in subdued gray.

### Focus 2: Register Write-Back Commit Glowing Pulse
- **File:** `app.js` (Lines 1291–1293 and 2080–2095)
- **Code:**
  ```javascript
  state.pipeline.lastWrittenReg = state.pipeline.MEM_WB.rd;
  // in renderRegisters():
  if (state.pipeline.lastWrittenReg === reg.num) {
    row.classList.add('bg-emerald-500/30', 'ring-1', 'ring-emerald-400');
  }
  ```
- **Explanation:** Whenever an instruction commits in the WB stage (`RegWrite == 1` and `rd != 0`), `lastWrittenReg` stores `rd`. During rendering, that register's table row flashes with an emerald ring, visually proving to students exactly when a value enters the architectural register file.

### Focus 3: Memory Hex Dump & Write Highlight
- **File:** `app.js` (Lines 1312–1314 and memory view renderers)
- **Code:**
  ```javascript
  if (state.pipeline.EX_MEM.memWrite) {
    state.simulatedMemory[state.pipeline.EX_MEM.aluResult] = state.pipeline.EX_MEM.storeData | 0;
    state.pipeline.lastWrittenMem = state.pipeline.EX_MEM.aluResult;
  }
  ```
- **Explanation:** Stores (`blk`) commit in the MEM stage. The destination address is highlighted in the memory hex table, and users can jump to any address using the `memJumpInput` field.

---

## 6. Examiner Question & Answer Bank (Explain, Justify, Predict, Diagnose)

### Category 1: Explain (What does it do?)
**Q1: What happens in the UI when the user presses <kbd>F10</kbd> (Step)?**  
*Answer:* <kbd>F10</kbd> invokes `stepPipelineCycle()`, which advances the entire processor datapath by exactly one clock cycle, updates all four pipeline registers simultaneously, renders register/memory changes, and pulses the stage visualizer pills.

**Q2: How does the memory hex view represent data?**  
*Answer:* The memory viewer displays data as 32-bit word-aligned words in hexadecimal format. Each row displays the base byte address (incrementing by 16 bytes/4 words), followed by four 32-bit hex values and their ASCII interpretations.

### Category 2: Justify (Why this, and at what cost?)
**Q3: Why did you implement visual "bubbles" in the UI pipeline stage view?**  
*Answer:* Showing explicit bubbles (NOPs) lets users visually observe pipeline stalls, branch flushes, and pipeline filling at startup. The cost is minor UI rendering overhead and additional DOM state management in `renderPipeline()`.

**Q4: Why does `blk` (store word) highlight memory in the MEM stage rather than WB?**  
*Answer:* In a standard 5-stage pipeline, data memory writes occur physically during the MEM stage (Stage 4) using `storeData` (`rs2_val`). Highlighting it in MEM accurately represents the exact clock cycle when memory state changes.

### Category 3: Predict (What happens if it changes?)
**Q5: What would happen if the UI refreshed before `stepPipelineCycle()` finished?**  
*Answer:* The UI would render inconsistent, partially updated pipeline state, where some stages reflect cycle $T$ and others reflect cycle $T+1$, breaking the visual illusion of atomic clock-edge latching.

**Q6: What would happen if an unaligned memory address (e.g., `0x10000001`) is accessed by `lt` or `blk`?**  
*Answer:* LIMO mandates 32-bit word alignment (addresses ending in `0x0`, `0x4`, `0x8`, `0xC`). An unaligned access either truncates the lower two bits (`addr & ~3`) or triggers an address alignment exception in hardware.

### Category 4: Diagnose (Where would it fail, and how would you know?)
**Q7: If a user clicks Run (<kbd>F5</kbd>) and the simulator freezes in an infinite loop, how would you diagnose it?**  
*Answer:* Check if a backward branch (`hlk` or `hft`) condition never becomes false due to missing loop counter decrementing, and verify whether the `runSimulation()` safety iteration limit ($10,000$ cycles) aborts the loop.

**Q8: If memory inspector shows `0x00000000` after a `blk` store instruction, where did it fail?**  
*Answer:* Check whether `EX_MEM.memWrite` was true (Table 5 control signal), verify whether `EX_MEM.aluResult` contains the expected target address, and confirm the store instruction has reached Stage 4 (MEM).

---

## 7. Core Concepts Checklist
- [x] **Pipeline Visualizer:** Displays concurrent activity of 5 stages simultaneously.
- [x] **Store Timing:** `blk` writes to DMEM in Stage 4 (MEM); `storeData` is sourced from `rs2`.
- [x] **Load Timing:** `lt` reads from DMEM in Stage 4 (MEM); data arrives at register file in Stage 5 (WB).
- [x] **Memory Alignment:** All memory accesses are 32-bit word-aligned (multiples of 4 bytes).
