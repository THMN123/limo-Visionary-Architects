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
| [ ]|                       |   |   |                                                 | 0x000003EC: 00 00 00 14 (val: 20)          |
| [ ]|                       |   |   |                                                 | 0x00402000: 4C 49 4D 4F (LIMO)             |
| [⚙]|                       |   |   |                                                 | 0x7FFFFFF0: 00 00 00 00 (SP Top)           |
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
