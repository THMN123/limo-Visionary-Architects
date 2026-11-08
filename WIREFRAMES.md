# LIMO Studio Interface Wireframes & UI/UX Specification (Milestone M2)

**Course:** CS3520 Computer Organisation and Architecture · AY 2026/2027  
**Department:** Mathematics and Computer Science · Faculty of Science and Technology · National University of Lesotho  
**Team:** Visionary Architects  
**Milestone:** M2 – Simulator Design: Interface Wireframes  
**Release Tag:** `m2`

---

## 1. Design Overview & Principles

LIMO Studio is designed as a **modern, web-based integrated development environment (IDE)** tailored for learning computer architecture and executing Sesotho RV32I assembly.

### Key UI/UX Goals:
1. **Immediate Feedback:** Single-step execution with synchronized register updates and line highlighting.
2. **Visual Pipeline Understanding:** Clear, accessible visualization of the 5-stage pipeline, datapath block diagram, and inter-stage registers.
3. **Accessibility:** Responsive layout supporting high-resolution desktop displays, tablets, and small screen debugging.
4. **Pedagogical Clarity:** Sesotho register naming (`Letho`, `Tshupo`, `Thuso0`, etc.) paired with standard RISC-V equivalents.

---

## 2. Wireframe 1: Primary IDE Workspace

This wireframe details the standard operational screen of LIMO Studio:

```text
+-----------------------------------------------------------------------------------------------------------------------------------+
|  [LIMO Studio]  File  Edit  View  Run  M2-Simulator  Tests            [Command Palette ⌘P]  [Step F10]  [Assemble & Run F5]       |
+----+-----------------------+---------------------------------------------------------+--------------------------------------------+
| A  | SIDEBAR PANEL         | TAB BAR: [addition.limo x] [store.limo] [+]             | CPU REGISTERS & MEMORY INSPECTOR           |
| C  |                       +---------------------------------------------------------+--------------------------------------------+
| T  | [Explorer] [Search]   | Quick Action Bar: [Step] [Run] | PC: 0x00400000 | Active: kop r8, r6, r7                             |
| I  | [Debug] [M2 Design]   +---+-----------------------------------------------------+--------------------------------------------+
| V  | [Unit Tests]          | L | 1 | # Addition Program                               | 32 REGISTERS (SESOTHO)          [HEX/DEC]  |
| I  |                       | N | 2 | khh r6, r0, 12   # r6 = 12                      +--------------------+-----------------------+
| T  | WORKSPACE FILES:      |   | 3 | khh r7, r0, 25   # r7 = 25                      | r0 (Letho):   0x0  | r1 (Khutlisa): 0x0    |
| Y  | > addition.limo       | B | 4 | kop r8, r6, r7   # r8 = 37  <-- ACTIVE LINE     | r2 (Tshupo):  0x7F | r3 (Sebali):   0x0    |
|    | > store.limo          | P | 5 |                                                 | r6 (Thuso0):  0xC  | r7 (Thuso1):   0x19   |
| B  | > average.limo        |   | 6 |                                                 | r8 (Nakoana0):0x25 | r9 (Nakoana1): 0x0    |
| A  | > tests/assembler.js  |   | 7 |                                                 | ... [r10 - r31]    | ...                   |
| R  |                       |   |   |                                                 +--------------------+-----------------------+
|    |                       |   |   |                                                 | MEMORY HEX VIEWER (32-bit Word)            |
| [ ]|                       |   |   |                                                 | 0x000003EC: 2A 00 00 00 (val: 42)  STORE   |
| [ ]|                       |   |   |                                                 | 0x000003F0: 63 00 00 00 (val: 99)          |
| [ ]|                       |   |   |                                                 | (bytes in memory order, little-endian)     |
+----+-----------------------+---+-----------------------------------------------------+--------------------------------------------+
| TERMINAL DRAWER (Resizable): [Terminal Tabs: Output | Bash CLI | Assembler Log]                     [-] [Clear] [Maximize] [x]    |
| student@limo-box:~/limo-workspace$ run                                                                                            |
| [Assemble & Run: addition_kopanya.limo] Assembling RV32I LIMO Session...                                                         |
| [0x00400008] kop r8, r6, r7 => r8 (Nakoana0) = 37                                                                                |
| [Execution Success] Sum in r8 (Nakoana0 / a0) = 37                                                                                |
| $ _                                                                                                                               |
+-----------------------------------------------------------------------------------------------------------------------------------+
|  [● LIMO Simulator Online]                      Ln 4, Col 1  ·  UTF-8  ·  Spaces: 4  ·  [LIMO RV32I SESOTHO]                      |
+-----------------------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Wireframe 2: 5-Stage Pipeline Registers Visualizer

Accessible from the sidebar and workbench to inspect instructions progressing through stages:

```text
+-----------------------------------------------------------------------------------------------------------------------------------+
|                                            LIMO 5-STAGE PIPELINE REGISTERS INSPECTOR                                              |
+------------------+------------------+-------------------+-------------------+-------------------+---------------------------------+
| Cycle: 0004      | Stall Bubble: NO | Branch Flush: NO  | PC: 0x00400008    | Clock State: HIGH | Mode: Single-Step Debug         |
+------------------+------------------+-------------------+-------------------+-------------------+---------------------------------+
|  STAGE 1: IF     |  STAGE 2: ID     |  STAGE 3: EX      |  STAGE 4: MEM     |  STAGE 5: WB      | PIPELINE REGISTER DETAILS       |
|                  |                  |                   |                   |                   |                                 |
|  [ Fetching ]    |  [ Decoding ]    |  [ Executing ]    |  [ Memory Access ]|  [ Write-Back ]   | Register: ID/EX                 |
|  PC: 0x0040000C  |  PC: 0x00400008  |  PC: 0x00400004   |  PC: 0x00400000   |  PC: 0x003FFFFC   | Instruction: kop r8, r6, r7     |
|  Inst: blk r8    |  Inst: kop r8    |  Inst: khh r7     |  Inst: khh r6     |  Inst: nop        | Control Signals:                |
|                  |                  |                   |                   |                   |  - RegWrite: 1                  |
|  +------------+  |  +------------+  |  +-------------+  |  +-------------+  |  +-------------+  |  - ALUSrc:   0 (Reg)            |
|  |   IF/ID    |==>  |   ID/EX    |==>  |   EX/MEM    |==>  |   MEM/WB    |==>  | Register    |  |  - ALUOp:    ADD                |
|  |  Register  |  |  |  Register  |  |  |  Register   |  |  |  Register   |  |  | File (r8)   |  |  - MemRead:  0                  |
|  +------------+  |  +------------+  |  +-------------+  |  +-------------+  |  +-------------+  |  - MemWrite: 0                  |
|  IR: 0x00712223  |  rs1: r6 (12)    |  alu_res: 25      |  mem_data: --     |  written: 12      |  - MemToReg: 0                  |
|  valid: true     |  rs2: r7 (25)    |  store_data: --   |  alu_res: 12      |  dest: r6         | Forwarding: None (RFile)        |
+------------------+------------------+-------------------+-------------------+-------------------+---------------------------------+
```

---

## 3.1 M3 update: what the pipeline view shows now

The Pipeline tab of the inspector was extended for M3. Everything below is read from the real pipeline state, never drawn from canned data.

```text
+--------------------------------------------------------------------+
| Pipeline Status:                                          Cycle 5  |
| [1. IF (kop)] [2. ID (khh)] [3. EX (khh)] [4. MEM (khh)] [5. WB (r6)]
|   Retired: 1 inst        CPI: 5.00                                 |
|   [Stall: NO] [Flush: NO] [No RAW hazard]                          |
+--------------------------------------------------------------------+
| Pipeline Chart                       (branch flush) (x = squashed) |
| Cycle ->             1    2    3    4    5    6                    |
| khh r6, r0, 12      IF   ID   EX  MEM   WB                         |
| khh r7, r0, 25           IF   ID   EX  MEM   WB                    |
| kop r8, r6, r7                IF   ID   EX  MEM                    |
+--------------------------------------------------------------------+
```

| Element | Rule |
|---|---|
| Stage pills | Show the instruction each stage worked on **this** cycle. Text carries the meaning (`(kop)`, bare name for a bubble, a cross when squashed); colour only reinforces it. Hover shows the full instruction and its source line. |
| WB pill | The instruction that **retired** this cycle, so `WB (r6)` appears in the cycle the register is actually written. |
| Pipeline Chart | One row per fetched instruction, one column per clock cycle, last 12 cycles. A taken branch marks its cycle with a flush symbol and shows the squashed instruction as `ID` with a cross. |
| RAW hazard badge | Amber `RAW hazard: rN` plus a sentence naming the two instructions and how many NOPs separate them safely. The M3 core has no forwarding, so this means a stale register value. |
| Step / Run / Reset | **Step** = one clock cycle (F10). **Run** (F5) becomes **Continue** while a run is part-way or parked on a breakpoint. **Reset** (F9) is in the toolbar, the Run menu, the Debugger tab and the palette. |
| Program changes | Editing the program or switching to another file while a run is part-way resets the CPU, so two programs are never mixed in one pipeline. |
| Memory viewer | Starts empty. Lists only words the program stored, in memory order (little-endian). **Jump** shows an 8-word window marked `VIEW` and never writes to memory. `STORE` marks the word written this cycle. |

---

## 4. Wireframe 3: Simulator Architecture & Block Diagram View

Interactive visual block diagram view in the IDE:

```text
+-----------------------------------------------------------------------------------------------------------------------------------+
|  LIMO SIMULATOR ARCHITECTURE & BLOCK DIAGRAM (M2 DELIVERABLE)                                       [Zoom In +] [Zoom Out -] [Reset] |
+-----------------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                                   |
|    +-------------------+      +-------------------+      +-------------------+      +-------------------+                         |
|    |  Program Counter  | ===> |  Instruction MEM  | ===> |   IF/ID Register  | ===> | 32 Register File  |---+                     |
|    |      (PC Mux)     |      |    (32-bit Word)  |      |  [PC | Inst Word] |      |   (r0 = Letho)    |   |                     |
|    +-------------------+      +-------------------+      +-------------------+      +-------------------+   |                     |
|              ^                                                                                | rs1, rs2    |                     |
|              | Branch Target                                                                  v             |                     |
|              +-------------------------------------------+                          +-------------------+   |                     |
|                                                          |                          |   ID/EX Register  |   |                     |
|                                                          |                          +-------------------+   |                     |
|                                                          |                                    |             |                     |
|                                                          |                                    v             |                     |
|                                                          |                          +-------------------+   |                     |
|                                                          |                          |   32-bit ALU &    |   |                     |
|                                                          +--------------------------| Branch Comparator |   |                     |
|                                                                                     +-------------------+   |                     |
|                                                                                               |             |                     |
|                                                                                               v             |                     |
|                                                                                     +-------------------+   |                     |
|                                                                                     |  EX/MEM Register  |   |                     |
|                                                                                     +-------------------+   |                     |
|                                                                                               |             |                     |
|                                                                                               v             |                     |
|                                                                                     +-------------------+   |                     |
|                                                                                     |    Data Memory    |   |                     |
|                                                                                     |    (lt / blk)     |   |                     |
|                                                                                     +-------------------+   |                     |
|                                                                                               |             |                     |
|                                                                                               v             |                     |
|                                                                                     +-------------------+   |                     |
|                                                                                     |  MEM/WB Register  |   |                     |
|                                                                                     +-------------------+   |                     |
|                                                                                               |             |                     |
|                                                                                               v             |                     |
|                                                                                     +-------------------+   |                     |
|                                                                                     | Write-Back (Mux)  |==>+ (R[rd] = Result)    |
|                                                                                     +-------------------+                         |
+-----------------------------------------------------------------------------------------------------------------------------------+
```

---

## 5. Wireframe 4: Working Assembler Unit Test Runner

Dedicated UI tab and modal for validating the assembler engine with real-time test execution:

```text
+-----------------------------------------------------------------------------------------------------------------------------------+
|  LIMO ASSEMBLER TEST SUITE & VERIFICATION RUNNER                                   [Run All Tests (F8)]  [Export Test Report JSON]|
+-----------------------------------------------------------------------------------------------------------------------------------+
|  TEST RESULTS SUMMARY:                                                                                                            |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+                                   |
|  |  TOTAL TESTS:  36  |  |  PASSED:  36  (✓)  |  |  FAILED:   0  (✗)  |  |  EXEC TIME: 12ms   |                                   |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+                                   |
|  Progress: [========================================================================================] 100% Passed                 |
|                                                                                                                                   |
|  CATEGORIES: [All (36)] [R-Type (8)] [I-Type (8)] [S-Type (4)] [B-Type (6)] [M1 Benchmarks (4)] [Errors (6)]                      |
+-----------------------------------------------------------------------------------------------------------------------------------+
|  INDIVIDUAL TEST CASES:                                                                                                           |
|  [✓ PASS] Test 1: R-Format kop (add) - kop r8, r6, r7                                          Expected: 0x00730433 | Got: 0x00730433 |
|  [✓ PASS] Test 2: R-Format ts (sub) - ts r10, r8, r9                                           Expected: 0x40940533 | Got: 0x40940533 |
|  [✓ PASS] Test 3: I-Format khh (addi) - khh r8, r6, 15                                         Expected: 0x00F30413 | Got: 0x00F30413 |
|  [✓ PASS] Test 4: S-Format blk (sw) - blk r7, 4(r2)                                            Expected: 0x00712223 | Got: 0x00712223 |
|  [✓ PASS] Test 5: B-Format hlk (beq) - hlk r6, r7, 16                                          Expected: 0x00730863 | Got: 0x00730863 |
|  [✓ PASS] Test 6: B-Format hft (bgt) - hft r6, r7, 8                                           Expected: 0x00735463 | Got: 0x00735463 |
|  [✓ PASS] Test 7: Register Names (Sesotho alias) - kop Nakoana0, Thuso0, Thuso1                Expected: 0x00730433 | Got: 0x00730433 |
|  [✓ PASS] Test 8: Immediate Range Upper Bound - khh r1, r0, 2047                               Expected: 0x7FF00093 | Got: 0x7FF00093 |
|  [✓ PASS] Test 9: Immediate Range Lower Bound - khh r1, r0, -2048                              Expected: 0x80000093 | Got: 0x80000093 |
|  [✓ PASS] Test 10: Error Handling - Out of range immediate (2048)                              Correctly threw RangeError          |
|  [✓ PASS] Test 11: Error Handling - Invalid register token "r99"                               Correctly rejected invalid register |
|  [✓ PASS] Test 12: Error Handling - Unknown mnemonic "foo"                                     Correctly reported unknown mnemonic |
+-----------------------------------------------------------------------------------------------------------------------------------+
```

---

## 6. Responsive Breakpoint Strategy

- **Large Desktop (≥ 1280px):** Full 3-column view (Sidebar + Center Editor + Right CPU Inspector).
- **Medium Screen / Laptop (1024px – 1279px):** Collapsible sidebar, responsive register cards, tabbed bottom drawer.
- **Tablet (768px – 1023px):** Right inspector slides out as an overlay drawer, editor takes full width.
- **Mobile (< 768px):** Activity dock collapses into bottom bar, single active pane with swipeable tabs.
