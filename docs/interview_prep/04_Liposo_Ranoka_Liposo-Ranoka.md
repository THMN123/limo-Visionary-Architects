# LIMO Interview Preparation Pack: Liposo Ranoka (`@Liposo-Ranoka`)

- **Student Name:** Liposo Ranoka  
- **Student ID:** 202400088  
- **GitHub Username:** `@Liposo-Ranoka` (Email: `ranokaliposo@gmail.com`)  
- **Assigned Roles:** Hazard Lead (Week 7: M1), Pipeline Lead (Week 8: M2), Assembler Lead (Week 9: M3), ISA Lead (Week 10: M4), Scrum Lead (Week 11: M5)  
- **Core Specialties:** Assembler Parsing Engine, `.limo` and `.s` File Compatibility, Label Resolution & Symbol Table Mapping, Editor Scrolling/Cursor Synchronization, Merge Conflict Resolution in Shared Datapath Code.

---

## 1. Fast Overview of the 15-Minute Interview

| Minutes | Segment | Target & Marking | What You Must Do |
| :--- | :--- | :--- | :--- |
| **0–2** | **Opening** | 10 marks (Group) | If picked, deliver the crisp 2-minute summary of what we built, what works, and honestly state what does not work. |
| **2–6** | **Submissions (M1/M2)** | 25 marks (Individual) | Explain the assembler parsing pipeline, label resolution, comment stripping, and tokenization. |
| **6–10** | **Mini Code Review** | 25 marks (Individual) | Trace `parseExecutableProgram()` (Lines 260–330 in `app.js`), label mapping, and conflict resolution in PR #33. |
| **10–14** | **Core Architecture** | 25 marks (Individual) | Answer direct questions on symbol resolution, two-pass assembly, branch label offsets, and editor-simulator sync in 1–3 sentences. |
| **14–15** | **Closing Contribution** | 15 marks (Group / Git) | Recite your exact one-sentence contribution and show your repository commits to earn Area E marks. |

---

## 2. Your 1-Sentence Closing Statement (14–15 min)

> *"I implemented the assembler parsing engine supporting native `.limo` assembly files and two-pass label resolution, fixed editor synchronization, and resolved core datapath merge conflicts."*

---

## 3. Your Git Proof & Evidence (Area E: Git & Teamwork — 15 Marks)

*If the examiner asks: "Show me your commits in the repository," run this command in terminal:*

```bash
git log --all --author="ranokaliposo" --oneline
```
**Your Key Commits & Pull Requests:**
- Commit `9f7b5b0`: `feat(assembler): support .limo files, auto-reset on rerun, clean terminal tabs, and fix editor scrolling/cursor issues` (PR #26).
- Commit `2a23081`: `Merge origin/main into pr-33 and resolve conflicts in app.js and index.html` (critical merge coordination integrating UI visualizations with main branch).
- Commit `e068a8c`: Merged PR #32 (`feature/m3-control-unit`) into `feature/m3`.
- Commits `6f71c0e`, `6257e36`, `89f0bee`, `42844cd`, `8e88c77`: Project documentation, role rotation, and README restructuring.

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

### Focus 1: Two-Pass Program Parsing & Label Symbol Table
- **File:** `app.js` (Lines 265–310)
- **Code:**
  ```javascript
  function parseExecutableProgram(sourceText) {
    const lines = (sourceText || '').split(/\r?\n/);
    const instructions = [];
    const labelMap = new Map();

    // Pass 1: Filter comments, extract labels, and map addresses
    lines.forEach((line, index) => {
      const clean = line.replace(/#.*$/, '').replace(/;.*$/, '').trim();
      if (!clean) return;
      if (clean.endsWith(':')) {
        const label = clean.slice(0, -1).trim().toLowerCase();
        labelMap.set(label, instructions.length); // instructions.length = index in IMEM
        return;
      }
      // Tokenize instruction
      const tokens = clean.split(/[\s,()]+/).filter(Boolean);
      instructions.push({ lineNum: index + 1, rawText: clean, mnemonic: tokens[0].toLowerCase(), tokens });
    });
    return { instructions, labelMap };
  }
  ```
- **Explanation:** In Pass 1, lines are stripped of comments (`#` or `;`). When a label definition is encountered (e.g. `loop:`), its name and current instruction index are recorded in `labelMap`. In Pass 2, branch instructions look up the label in `labelMap` and compute the byte displacement: `imm = (targetIdx * 4 + 0x00400000) - currentPC`.

### Focus 2: Auto-Reset on Rerun & Terminal Cleanup
- **File:** `app.js` (Lines 1590–1610)
- **Explanation:** When the user clicks Run on an already executed program, the simulator automatically triggers `resetCpu()` before launching execution. This prevents accidental execution with residual register/memory values from previous runs.

### Focus 3: Resolving Complex Git Merge Conflicts in `app.js`
- **Context:** In commit `2a23081`, DonBelliiot's UI enhancements diverged from main's datapath refactoring.
- **Explanation to Examiner:** *"I conducted a 3-way merge, ensuring that the reactive DOM updates from the interface branch did not clobber the synchronous cycle-stepping state model in `stepPipelineCycle()`, preserving both visualizer glows and correct stage latches."*

---

## 6. Examiner Question & Answer Bank (Explain, Justify, Predict, Diagnose)

### Category 1: Explain (What does it do?)
**Q1: How does your assembler handle both commas and parentheses in memory syntax like `lt r9, 4(r2)`?**  
*Answer:* The tokenizer uses the regular expression `/[\s,()]+/`, which treats whitespace, commas, and parentheses as uniform delimiter boundaries, cleanly extracting tokens `['lt', 'r9', '4', 'r2']`.

**Q2: What is the purpose of `auto-reset on rerun` in the IDE?**  
*Answer:* Auto-reset clears PC to `0x00400000`, clears pipeline registers to invalid bubbles, and resets general-purpose registers so the program runs from a clean initial hardware state without carrying over dirty state.

### Category 2: Justify (Why this, and at what cost?)
**Q3: Why use a two-pass assembler instead of a single-pass assembler with backpatching?**  
*Answer:* A two-pass assembler is conceptually simpler and more robust for educational simulators: Pass 1 collects all label addresses into a symbol table, so Pass 2 can immediately resolve forward and backward branch offsets without complex relocation linked lists.

**Q4: Why support both `.limo` and `.s` file extensions?**  
*Answer:* `.limo` provides native branding for our Sesotho ISA, while `.s` ensures compatibility with standard assembly syntax highlighters and legacy project templates.

### Category 3: Predict (What happens if it changes?)
**Q5: What happens if a user writes a branch to a label that does not exist?**  
*Answer:* The `labelMap.has(targetToken)` lookup returns false; the assembler attempts to parse the token as a literal integer offset. If parsing fails, it falls back to 0 or throws an unresolved symbol error.

**Q6: What happens if two identical label names are defined in the same file?**  
*Answer:* In our `Map`, the second label definition overwrites the first label's address, causing all branch references to point to the second location, which would break early loop loops.

### Category 4: Diagnose (Where would it fail, and how would you know?)
**Q7: If an assembly program has comments at the end of lines and the assembler crashes, where is the bug?**  
*Answer:* The comment stripping regex failed to match. In `parseExecutableProgram()`, `line.replace(/#.*$/, '')` strips from `#` to end of line. If comments used `//` instead of `#`, the comment text would leak into the tokenizer as unknown operands.

**Q8: If a student types code into the editor and clicking Step executes old code, what failed?**  
*Answer:* The editor's input change listener failed to update `state.files[state.activeFile].content`, so `stepPipelineCycle()` re-parsed the previous cached file buffer.

---

## 7. Core Concepts Checklist
- [x] **Symbol Table:** Maps alphanumeric labels to absolute memory addresses or relative instruction offsets.
- [x] **PC-Relative Offsets:** Branch offsets are calculated as $(Target - PC)$ so code is position-independent.
- [x] **Tokenization:** Breaks raw text into `mnemonic`, `rd`, `rs1`, `rs2`, `imm` while discarding whitespace and comments.
- [x] **Git Workflow:** Feature branches (`feature/m3-*`), peer code review via PRs, clean conflict resolution.
