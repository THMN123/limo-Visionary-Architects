# LIMO 5-Stage Pipeline Core Architecture & Specification (Milestone M3)

**Course:** CS3520 Computer Organisation and Architecture · AY 2026/2027  
**Department:** Mathematics and Computer Science · Faculty of Science and Technology · National University of Lesotho  
**Team:** Visionary Architects  
**Milestone:** M3 – Pipeline Core: Five Stages, Pipeline Registers, Control Unit, Step/Run/Reset, Register & Memory Views, Hazard-Free Execution  
**Release Tag:** `m3`  

---

## 1. Executive Summary & Architectural Scope

The **LIMO (Lesotho Instruction Machine Architecture)** is a 32-bit load-store processor derived from **RISC-V (RV32I)**, featuring an assembly language specified in **Sesotho** using standard Lesotho orthography.

For **Milestone 3 (M3)**, this document specifies the complete, working implementation of the **5-Stage Synchronous Pipeline Core**:
1. **Five Pipeline Stages:** Instruction Fetch (`IF`), Instruction Decode & Register Fetch (`ID`), Execute & Address Calculation (`EX`), Memory Access (`MEM`), and Write-Back (`WB`).
2. **Four Inter-Stage Pipeline Registers:** `IF/ID` (65 bits), `ID/EX` (171 bits), `EX_MEM` (139 bits), and `MEM/WB` (136 bits) holding data values and decoded control signals.
3. **Dedicated Hardwired Control Unit:** Fully decodes all 10 Sesotho instructions according to the specification truth table, generating nine control signals (`RegWrite`, `ALUSrc`, `ALUOp`, `MemRead`, `MemWrite`, `Branch`, `BranchCondition`, `MemToReg`).
4. **Execution Dynamics (Step / Run / Reset):** Single-cycle clock stepping through all stages concurrently, automated continuous execution, and clean reset to initial architectural state.
5. **Architectural Views:** Live 32-register inspector with Sesotho naming and change highlights, 32-bit word-aligned memory hex dump, and live pipeline register inspector.
6. **Hazard-Free Execution:** Programs structured without RAW data hazards execute with 100% architectural accuracy.
7. **Automated Unit Testing:** 25 automated pipeline test cases verifying control signals, stage transitions, memory accesses, branch penalties, and hazard-free benchmarks.

---

## 2. 5-Stage Pipeline Core Datapath

The complete synchronous datapath operates on a single master clock (`clk`):

```text
+=======================================================================================================================+
|                                        LIMO 5-STAGE PIPELINED CORE DATAPATH                                           |
+=======================================================================================================================+

        STAGE 1: IF              STAGE 2: ID             STAGE 3: EX              STAGE 4: MEM             STAGE 5: WB
     Instruction Fetch        Decode & Reg Fetch           Execution              Memory Access             Write-Back
  +----------------------+ +----------------------+ +----------------------+ +----------------------+ +----------------------+
  |                      | |                      | |                      | |                      | |                      |
  |  +----------------+  | |  +----------------+  | |  +----------------+  | |  +----------------+  | |  +----------------+  |
  |  | Program Counter|  | |  |  Control Unit  |  | |  | 32-bit ALU     |  | |  | Data Memory    |  | |  |  MemToReg Mux  |  |
  |  | (PC = PC + 4)  |  | |  | (Truth Table)  |  | |  | (kop, ts, khh, |  | |  | (DMEM)         |  | |  | [aluRes|memData|  |
  |  +-------+--------+  | |  +-------+--------+  | |  |  le, kp, ng)   |  | |  | lt (read)      |  | |  +-------+--------+  |
  |          |           | |          |           | |  +-------+--------+  | |  | blk (write)    |  | |          |           |
  |  +-------v--------+  | |  +-------v--------+  | |          |           | |  +-------+--------+  | |  +-------v--------+  |
  |  | Instruction    |  | |  | 32-Reg File    |  | |  +-------v--------+  | |          |           | |  | R[rd] Commit   |  |
  |  | Memory (IMEM)  |  | |  | (r0 = Letho =0)|  | |  | Zero-Flag      |  | |          |           | |  | (r0 protected) |  |
  |  +-------+--------+  | |  | r0..r31        |  | |  | Branch Compare |  | |          |           | |  +----------------+  |
  |          |           | |  +-------+--------+  | |  | (hlk ==, hft >)|  | |          |           | |                      |
  +----------+-----------+ +----------+-----------+ +----------+-----------+ +----------+-----------+ +----------------------+
             |                        |                        |                        |                        ^
             v                        v                        v                        v                        |
     +===============+        +===============+        +===============+        +===============+                |
     | IF/ID Register|        | ID/EX Register|        |EX/MEM Register|        |MEM/WB Register|                |
     | [65 bits]     |        | [171 bits]    |        | [139 bits]    |        | [136 bits]    |                |
     +===============+        +===============+        +===============+        +===============+                |
             |                        |                        |                        |                        |
             +------------------------+------------------------+------------------------+------------------------+
                                           Write-Back Loop back to Register File (R[rd])
```

---

## 3. Dedicated Hardwired Control Unit

The Control Unit decodes incoming instruction mnemonics in the **ID (Instruction Decode)** stage and generates the control bundle propagated through subsequent inter-stage registers:

### 3.1 Control Signals Truth Table

| Instruction | Class | Format | RegWrite | ALUSrc | ALUOp | MemRead | MemWrite | Branch | BranchCondition | MemToReg |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `kop` | Arithmetic | R | **1** | 0 (Reg) | `'ADD'` | 0 | 0 | 0 | `null` | 0 (ALU) |
| `ts` | Arithmetic | R | **1** | 0 (Reg) | `'SUB'` | 0 | 0 | 0 | `null` | 0 (ALU) |
| `khh` | Arithmetic | I | **1** | **1 (Imm)** | `'ADD'` | 0 | 0 | 0 | `null` | 0 (ALU) |
| `le` | Logic | R | **1** | 0 (Reg) | `'AND'` | 0 | 0 | 0 | `null` | 0 (ALU) |
| `kp` | Logic | R | **1** | 0 (Reg) | `'OR'` | 0 | 0 | 0 | `null` | 0 (ALU) |
| `ng` | Logic | R | **1** | 0 (Reg) | `'SLL'` | 0 | 0 | 0 | `null` | 0 (ALU) |
| `lt` | Memory | I | **1** | **1 (Imm)** | `'ADD'` | **1** | 0 | 0 | `null` | **1 (MEM)** |
| `blk` | Memory | S | 0 | **1 (Imm)** | `'ADD'` | 0 | **1** | 0 | `null` | 0 |
| `hlk` | Branch | B | 0 | 0 (Reg) | `'SUB'` | 0 | 0 | **1** | `'EQ'` | 0 |
| `hft` | Branch | B | 0 | 0 (Reg) | `'SUB'` | 0 | 0 | **1** | `'GT'` | 0 |

---

## 4. Pipeline Register Specifications

State between clock cycles is fully isolated by four pipeline registers:

### 4.1 IF/ID Pipeline Register (Fetch → Decode)
- **Data fields:** `pc` (32b), `instruction` (32b), `hex` (string), `rawAssembly` (string), `mnemonic` (string), `tokens` (array), `lineNum` (uint32).
- **Status:** `valid` (1b). When false, the register acts as a NOP bubble.

### 4.2 ID/EX Pipeline Register (Decode → Execute)
- **Data fields:** `pc` (32b), `rs1` (5b), `rs2` (5b), `rd` (5b), `rs1_val` (32b), `rs2_val` (32b), `imm` (32b signed), `mnemonic` (string), `rawAssembly` (string).
- **Control signals:** `regWrite` (1b), `memRead` (1b), `memWrite` (1b), `branch` (1b), `branchCondition` (string), `aluSrc` (1b), `aluOp` (4b), `memToReg` (1b), `valid` (1b).

### 4.3 EX/MEM Pipeline Register (Execute → Memory Access)
- **Data fields:** `pc` (32b), `aluResult` (32b), `storeData` (32b), `branchTarget` (32b), `branchTaken` (1b), `rd` (5b), `mnemonic` (string), `rawAssembly` (string).
- **Control signals:** `regWrite` (1b), `memRead` (1b), `memWrite` (1b), `memToReg` (1b), `valid` (1b).

### 4.4 MEM/WB Pipeline Register (Memory Access → Write-Back)
- **Data fields:** `pc` (32b), `memReadData` (32b), `aluResult` (32b), `writeBackData` (32b), `rd` (5b), `mnemonic` (string), `rawAssembly` (string).
- **Control signals:** `regWrite` (1b), `memToReg` (1b), `valid` (1b).

---

## 5. Execution Dynamics: Step / Run / Reset

### 5.1 Clock-Cycle Step (`stepPipelineCycle`)
A single clock cycle performs the following concurrent operations:
1. **WB Stage:** Commits `MEM_WB.writeBackData` to register `rd` if `MEM_WB.regWrite == 1` and `rd != 0`. `r0` remains zero.
2. **MEM Stage:** Reads from or writes to `simulatedMemory[EX_MEM.aluResult]`. Passes data to `MEM_WB`.
3. **EX Stage:** Computes ALU result (`opA` and `opB`). Evaluates zero-flag branch direct comparison. If taken, calculates `branchTarget` and asserts flush. Passes data to `EX_MEM`.
4. **ID Stage:** Decodes instruction from `IF_ID` using Control Unit, reads operands `rs1_val` and `rs2_val` from Register File, and passes data to `ID_EX`.
5. **IF Stage:** Fetches instruction at `PC` from Instruction Memory and increments `PC += 4`. If branch was taken in EX, redirects `PC = branchTarget` and flushes `IF_ID` and `ID_EX`.
6. **Clock Edge:** Latches all pipeline registers synchronously and increments `cycle`.

### 5.2 Continuous Run (`runSimulation`)
Executes clock cycles continuously until all pipeline registers become invalid bubbles (`isDrained() == true`), a user breakpoint is reached, or the safety limit is exceeded. Displays cycle counts, retired instructions, and Cycles Per Instruction (CPI).

### 5.3 Hardware Reset (`resetCpu`)
Restores the processor to its reset state:
- All 32 architectural registers cleared to 0 (except `r2` / `Tshupo` stack pointer initialized to `0x7FFFFFF0`).
- Data Memory cleared to baseline.
- `PC` reset to `0x00400000`.
- All pipeline registers set to invalid bubbles (`valid: false`).
- Cycle counter and instructions retired counter reset to 0.

---

## 6. Hazard-Free Execution Model

In Milestone M3, programs structured without Read-After-Write (RAW) data hazards execute with complete architectural precision:
- **RAW Hazard Elimination:** An instruction that writes to register `rd` retires and updates the register file in the **WB stage** at Cycle $T + 4$. A subsequent dependent instruction entering the **ID stage** at or after Cycle $T + 4$ reads the updated register value directly from the register file.
- **Intervening Instructions:** Separating producer and consumer instructions with 2 independent instructions (or NOPs) eliminates any need for forwarding hardware while preserving pure synchronous pipeline behavior.
- **Section 3(e) Direct Conditionals:** Branches (`hlk`, `hft`) compare registers directly in the EX stage without status flags, eliminating secondary write ports and pipeline flag dependencies. Taken branches incur a deterministic 2-cycle penalty by flushing `IF_ID` and `ID_EX`.

---

## 7. Verification & Automated Unit Test Suite

The 5-stage pipeline core is validated by **25 automated unit tests** (`tests/pipeline.test.js` and `tests/test_pipeline.py`):

| Test ID | Category | Test Target | Verification Criteria | Status |
| :---: | :--- | :--- | :--- | :---: |
| #1 | Control Unit | `kop` (ADD) | `RegWrite=1, ALUSrc=0, ALUOp=ADD, MemToReg=0` | **PASS** |
| #2 | Control Unit | `ts` (SUB) | `RegWrite=1, ALUSrc=0, ALUOp=SUB, MemToReg=0` | **PASS** |
| #3 | Control Unit | `khh` (ADDI) | `RegWrite=1, ALUSrc=1, ALUOp=ADD, MemToReg=0` | **PASS** |
| #4 | Control Unit | `le` & `kp` | `RegWrite=1, ALUOp=AND` / `ALUOp=OR` | **PASS** |
| #5 | Control Unit | `ng` (SLL) | `RegWrite=1, ALUSrc=0, ALUOp=SLL` | **PASS** |
| #6 | Control Unit | `lt` (LW) | `RegWrite=1, ALUSrc=1, MemRead=1, MemToReg=1` | **PASS** |
| #7 | Control Unit | `blk` (SW) | `RegWrite=0, ALUSrc=1, MemWrite=1` | **PASS** |
| #8 | Control Unit | `hlk` & `hft` | `Branch=1, BranchCondition=EQ/GT, RegWrite=0` | **PASS** |
| #9 | Pipeline Registers | Initial Reset | All 4 registers valid=false bubbles; SP=0x7FFFFFF0 | **PASS** |
| #10 | Stage 1 (IF) | Cycle 1 Fetch | IF/ID latches instruction; PC advances +4 | **PASS** |
| #11 | Stage 2 (ID) | Cycle 2 Decode | ID/EX latches operands, immediate, control signals | **PASS** |
| #12 | Stage 3 (EX) | Cycle 3 Execute | EX/MEM latches ALU result; registers unchanged | **PASS** |
| #13 | Stage 4 (MEM) | Cycle 4 Memory | MEM/WB latches computed/read data; registers unchanged | **PASS** |
| #14 | Stage 5 (WB) | Cycle 5 Write-Back| Register committed with writeBackData; retired=1 | **PASS** |
| #15 | Hardware Invariant | Zero Register | Writes to `r0` (`Letho`) ignored; remains 0 | **PASS** |
| #16 | Hazard-Free Core | Arithmetic Add | `khh` + `khh` + NOPs + `kop` → `r8 = 37` | **PASS** |
| #17 | Hazard-Free Core | Arithmetic Sub | `khh` + `khh` + NOPs + `ts` → `r8 = 32` | **PASS** |
| #18 | Hazard-Free Core | Bitwise Logic | `le` AND (4) and `kp` OR (13) verified | **PASS** |
| #19 | Hazard-Free Core | Shift Left | `ng` shift logical left (40) verified | **PASS** |
| #20 | Hazard-Free Core | Memory Store/Load | `blk` to DMEM[1004] and `lt` readback → 777 | **PASS** |
| #21 | Control Hazards | Branch Taken | 2 speculative slots flushed; branch target executed | **PASS** |
| #22 | Control Hazards | Branch Not Taken | Sequential fall-through without pipeline flushes | **PASS** |
| #23 | Control Hazards | Branch Greater | `hft` direct comparison evaluates `rs1 > rs2` | **PASS** |
| #24 | Full ISA Benchmark | Average Midpoint | Multi-instruction hazard-free program execution | **PASS** |
| #25 | System Dynamics | Reset Transition | Clean state restoration to Cycle 0 & PC 0x00400000 | **PASS** |

---

*Submitted by Team **Visionary Architects***  
*Department of Mathematics and Computer Science · National University of Lesotho*
