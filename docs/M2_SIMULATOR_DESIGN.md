# LIMO Processor Simulator Design & Architecture Specification (Milestone M2)

**Course:** CS3520 Computer Organisation and Architecture · AY 2026/2027  
**Department:** Mathematics and Computer Science · Faculty of Science and Technology · National University of Lesotho  
**Team:** Visionary Architects  
**Milestone:** M2 – Simulator Design: Architecture & Block Diagram, Pipeline-Register Data Model, Interface Wireframes, Working Assembler with Unit Tests  
**Release Tag:** `m2`

---

## 1. Executive Summary & Architectural Overview

The **LIMO (Lesotho Instruction Machine Architecture)** is a 32-bit load-store processor derived from **RISC-V (RV32I)**, featuring an assembly language specified in **Sesotho** using standard Lesotho orthography.

For **Milestone 2 (M2)**, this document specifies the complete microarchitectural simulator design for the LIMO core, centered on a classical **5-stage synchronous pipeline**:
1. **IF (Instruction Fetch):** Fetches 32-bit instructions from Instruction Memory addressed by the Program Counter (`PC`).
2. **ID (Instruction Decode & Register Fetch):** Decodes opcode, register specifiers (`rd`, `rs1`, `rs2`), extracts immediate values, and fetches operands from the 32-register architectural file.
3. **EX (Execute & Address Calculation):** Computes arithmetic/logic operations in the ALU, evaluates branch conditions directly without condition flags, and calculates branch target addresses.
4. **MEM (Memory Access):** Reads from or writes to Data Memory for load (`lt`) and store (`blk`) instructions.
5. **WB (Write-Back):** Writes computed ALU results or memory load data back into the destination register `rd`.

---

## 2. Processor Parameters & Specifications

| Parameter | Specification | Microarchitectural Detail |
| :--- | :--- | :--- |
| **Word Size** | 32 bits | All GPRs, internal buses, ALUs, and memory words are 32 bits wide. |
| **Instruction Length** | Fixed 32 bits | All instructions are strictly 4 bytes (aligned to 4-byte boundaries). |
| **Byte Ordering** | Little-Endian | Least Significant Byte (LSB) stored at lower address. |
| **Memory Model** | Harvard Architecture (Simulated) | Separate Instruction Memory (IMEM) and Data Memory (DMEM). |
| **Architectural Registers** | 32 registers (`r0`–`r31`) | `r0` is hardwired to zero; writes to `r0` are discarded. |
| **Branch Resolution Stage** | EX (Execute Stage) | Branch outcome evaluated in EX; 2-cycle penalty on taken branches (2 flushes). |
| **Zero-Flag Architecture** | Flag-less (Direct Compare) | No NZCV status register. Conditionals compare registers directly (`hlk`, `hft`). |
| **Hazard Resolution** | Forwarding + 1-cycle Stall | Full EX-to-EX and MEM-to-EX forwarding. 1-cycle stall bubble for Load-Use hazards. |

---

## 3. Five-Stage Pipeline Block Diagram

The complete datapath and control flow of the LIMO processor is illustrated below:

```text
+=======================================================================================================================================================+
|                                                      LIMO 5-STAGE PIPELINED PROCESSOR BLOCK DIAGRAM                                                   |
+=======================================================================================================================================================+

        +-------------------------------------------------------------------------------------------------------+
        |                                       FORWARDING UNIT & HAZARD DETECTION UNIT                         |
        |  - Detects Load-Use Hazards: Stalls IF/ID, Freezes PC, injects NOP into ID/EX                         |
        |  - Detects Branch Taken: Flushes IF/ID and ID/EX (2-cycle branch penalty)                             |
        |  - Resolves RAW Hazards via EX-to-EX and MEM-to-EX Forwarding Multiplexers                            |
        +---+-------------------+-------------------+-------------------+-------------------+-------------------+
            ^                   ^                   ^                   ^                   ^
            |                   |                   |                   |                   |
  +---------+---------+ +-------+---------+ +-------+---------+ +-------+---------+ +-------+---------+
  |                   | |                 | |                 | |                 | |                 |
  |      STAGE 1      | |     STAGE 2     | |     STAGE 3     | |     STAGE 4     | |     STAGE 5     |
  |                   | |                 | |                 | |                 | |                 |
  | INSTRUCTION FETCH | |  INSTRUCT DECODE| |     EXECUTE     | |  MEMORY ACCESS  | |   WRITE-BACK    |
  |       (IF)        | |  & REG FETCH(ID)| |      (EX)       | |      (MEM)      | |      (WB)       |
  |                   | |                 | |                 | |                 | |                 |
  +---------+---------+ +-------+---------+ +-------+---------+ +-------+---------+ +-------+---------+
            |                   |                   |                   |                   |
            |                   |                   |                   |                   |
     +------v------+            |            +------v------+            |                   |
     |   PC Mux    |<------------------------|Branch Target|            |                   |
     +------+------+   Branch Taken          +-------------+            |                   |
            |                                                           |                   |
     +------v------+                                                    |                   |
     | Program     |                                                    |                   |
     | Counter(PC) |                                                    |                   |
     +------+------+                                                    |                   |
            |                                                           |                   |
     +------v------+                                                    |                   |
     | Instruction |                                                    |                   |
     | Memory(IMEM)|                                                    |                   |
     +------+------+                                                    |                   |
            |                                                           |                   |
            v                                                           |                   |
   +=================+                                                 |                   |
   |  IF/ID REGISTER | [ PC | Instruction (32-bit) ]                   |                   |
   +=================+                                                 |                   |
            |                                                           |                   |
            +------------+----------------------+                       |                   |
            |            |                      |                       |                   |
            |     +------v------+        +------v------+                |                   |
            |     | Control     |        | 32-Register |                |                   |
            |     | Unit        |        | File (r0-31)|                |                   |
            |     +------+------+        | r0 = 0      |                |                   |
            |            |               +------+------+                |                   |
            |            |                      |                       |                   |
            |     +------v------+               | rs1_val, rs2_val      |                   |
            |     | Immediate   |               |                       |                   |
            |     | Generator   |               |                       |                   |
            |     +------+------+               |                       |                   |
            |            | imm                  |                       |                   |
            v            v                      v                       |                   |
   +===================================================+                |                   |
   |                  ID/EX REGISTER                   |                |                   |
   | [ PC | rs1_val | rs2_val | imm | rd | rs1 | rs2   |                |                   |
   |   funct3 | funct7 | opcode | Control Signals ]    |                |                   |
   +===================================================+                |                   |
                         |                      |                       |                   |
                         |                      | Forwarded Operands    |                   |
                         |               +------v------+                |                   |
                         |               | ALU In Muxes|<---------------+-------------------+
                         |               +------+------+   (From MEM & WB Stages)           |
                         |                      |                                           |
                         |               +------v------+                                    |
                         |               | 32-bit ALU  |                                    |
                         |               | & Comparator|                                    |
                         |               +------+------+                                    |
                         |                      |                                           |
                         |                      | alu_result                                |
                         v                      v                                           |
   +=============================================================+                          |
   |                       EX/MEM REGISTER                       |                          |
   | [ PC | alu_result | store_data | rd | Branch Outcome        |                          |
   |   Control Signals: RegWrite, MemRead, MemWrite, MemToReg ]  |                          |
   +=============================================================+                          |
                                                |                                           |
                                         +------v------+                                    |
                                         | Data Memory |                                    |
                                         |   (DMEM)    |                                    |
                                         | lt / blk    |                                    |
                                         +------+------+                                    |
                                                |                                           |
                                                | mem_read_data                             |
                                                v                                           |
   +===========================================================================+            |
   |                              MEM/WB REGISTER                              |            |
   | [ PC | mem_read_data | alu_result | rd | Control Signals: RegWrite, MemToReg]          |
   +===========================================================================+            |
                                                |                                           |
                                         +------v------+                                    |
                                         | MemToReg Mux|                                    |
                                         +------+------+                                    |
                                                | write_back_data                           |
                                                +-------------------------------------------+
                                                  (Written back to Register File at rd)
```

---

## 4. Pipeline Stages Specification

### 4.1 Stage 1: Instruction Fetch (IF)
- **Functions:**
  - Reads the 32-bit instruction word from Instruction Memory at `PC`.
  - Computes sequential Next PC: `PC_seq = PC + 4`.
  - Multiplexer selects next PC between `PC_seq` and `Branch_Target` computed in EX.
  - Latches `PC` and `Instruction` into the `IF/ID` pipeline register at the rising clock edge.
- **Stall & Flush Controls:**
  - On **Load-Use hazard**: `IF/ID_Write = 0` (freeze IF/ID), `PC_Write = 0` (freeze PC).
  - On **Branch taken**: `IF/ID_Flush = 1` (clears IF/ID to a NOP).

### 4.2 Stage 2: Instruction Decode & Register Fetch (ID)
- **Functions:**
  - Extracts instruction fields:
    * `opcode = Instruction[6:0]`
    * `rd = Instruction[11:7]`
    * `funct3 = Instruction[14:12]`
    * `rs1 = Instruction[19:15]`
    * `rs2 = Instruction[24:20]`
    * `funct7 = Instruction[31:25]`
  - Accesses Register File: reads `rs1_val = R[rs1]` and `rs2_val = R[rs2]`.
  - **Immediate Generator:**
    * **I-type (`khh`, `lt`):** `imm = sign_extend(Instruction[31:20])` (12 bits)
    * **S-type (`blk`):** `imm = sign_extend({Instruction[31:25], Instruction[11:7]})` (12 bits)
    * **B-type (`hlk`, `hft`):** `imm = sign_extend({Instruction[31], Instruction[7], Instruction[30:25], Instruction[11:8], 1'b0})` (13 bits)
- **Control Unit Signals Generated:**
  - `RegWrite`: Enables writing to `rd` in WB stage.
  - `MemRead`: Enables DMEM read in MEM stage (`lt`).
  - `MemWrite`: Enables DMEM write in MEM stage (`blk`).
  - `Branch`: Indicates conditional branch instruction (`hlk`, `hft`).
  - `ALUSrc`: Selects ALU second operand (0 = `rs2_val`, 1 = `imm`).
  - `MemToReg`: Selects WB source (0 = `alu_result`, 1 = `mem_read_data`).
  - `ALUOp`: Encodes operation for ALU Control unit.

### 4.3 Stage 3: Execution & Address Calculation (EX)
- **Functions:**
  - Selects ALU inputs using Forwarding Multiplexers (`ForwardA`, `ForwardB`).
  - Performs 32-bit ALU operation:
    * `kop` (ADD): `alu_result = A + B`
    * `ts` (SUB): `alu_result = A - B`
    * `khh` (ADDI): `alu_result = A + imm`
    * `le` (AND): `alu_result = A & B`
    * `kp` (OR): `alu_result = A | B`
    * `ng` (SLL): `alu_result = A << (B & 0x1F)`
    * `lt` / `blk` (Address): `alu_result = rs1_val + imm`
  - **Branch Evaluation (Section 3e Zero-Flag Architecture):**
    * `hlk` (BEQ): condition met if `A == B`
    * `hft` (BGT): condition met if `(int32_t)A > (int32_t)B`
    * `Branch_Target = PC + imm`
    * If branch condition is met, signals PC multiplexer to redirect to `Branch_Target` and triggers flush of `IF/ID` and `ID/EX`.

### 4.4 Stage 4: Memory Access (MEM)
- **Functions:**
  - If `MemWrite == 1` (`blk`): Writes `store_data` (forwarded `rs2_val`) to `DMEM[alu_result]`.
  - If `MemRead == 1` (`lt`): Reads 32-bit word from `DMEM[alu_result]` into `mem_read_data`.
  - Pass-through of `alu_result`, `rd`, and control signals to `MEM/WB`.

### 4.5 Stage 5: Write-Back (WB)
- **Functions:**
  - Multiplexer selects write-back data:
    `write_data = (MemToReg == 1) ? mem_read_data : alu_result;`
  - If `RegWrite == 1` and `rd != 0`, writes `write_data` to `R[rd]`.
  - Write to `r0` (`Letho`) is explicitly ignored to preserve constant zero.

---

## 5. Control Signals Truth Table

| Instruction | Format | RegWrite | ALUSrc | ALUOp | MemRead | MemWrite | Branch | MemToReg |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `kop` (ADD) | R | 1 | 0 (Reg) | ADD | 0 | 0 | 0 | 0 (ALU) |
| `ts` (SUB) | R | 1 | 0 (Reg) | SUB | 0 | 0 | 0 | 0 (ALU) |
| `khh` (ADDI) | I | 1 | 1 (Imm) | ADD | 0 | 0 | 0 | 0 (ALU) |
| `le` (AND) | R | 1 | 0 (Reg) | AND | 0 | 0 | 0 | 0 (ALU) |
| `kp` (OR) | R | 1 | 0 (Reg) | OR | 0 | 0 | 0 | 0 (ALU) |
| `ng` (SLL) | R | 1 | 0 (Reg) | SLL | 0 | 0 | 0 | 0 (ALU) |
| `lt` (LW) | I | 1 | 1 (Imm) | ADD | 1 | 0 | 0 | 1 (MEM) |
| `blk` (SW) | S | 0 | 1 (Imm) | ADD | 0 | 1 | 0 | X |
| `hlk` (BEQ) | B | 0 | 0 (Reg) | CMP_EQ | 0 | 0 | 1 | X |
| `hft` (BGT) | B | 0 | 0 (Reg) | CMP_GT | 0 | 0 | 1 | X |

---

## 6. Hazard Detection & Forwarding Logic

### 6.1 Data Hazards (RAW) & Forwarding Unit
Data forwarding eliminates pipeline stalls for back-to-back arithmetic instructions:

```text
ForwardA Logic:
  if (EX/MEM.RegWrite and EX/MEM.rd != 0 and EX/MEM.rd == ID/EX.rs1)
      ForwardA = 2'b10 (Forward from EX/MEM stage)
  else if (MEM/WB.RegWrite and MEM/WB.rd != 0 and MEM/WB.rd == ID/EX.rs1)
      ForwardA = 2'b01 (Forward from MEM/WB stage)
  else
      ForwardA = 2'b00 (No forwarding, use Register File output)

ForwardB Logic:
  if (EX/MEM.RegWrite and EX/MEM.rd != 0 and EX/MEM.rd == ID/EX.rs2)
      ForwardB = 2'b10 (Forward from EX/MEM stage)
  else if (MEM/WB.RegWrite and MEM/WB.rd != 0 and MEM/WB.rd == ID/EX.rs2)
      ForwardB = 2'b01 (Forward from MEM/WB stage)
  else
      ForwardB = 2'b00 (No forwarding, use Register File output)
```

### 6.2 Load-Use Hazard Detection
Because memory read occurs in the MEM stage, a dependent instruction in EX cannot receive the loaded value via forwarding without stalling 1 cycle:

```text
Load-Use Condition:
  if (ID/EX.MemRead and (ID/EX.rd == IF/ID.rs1 or ID/EX.rd == IF/ID.rs2)) {
      // 1. Freeze Program Counter
      PC_Write = 0
      // 2. Freeze IF/ID Register
      IF/ID_Write = 0
      // 3. Inject NOP (bubble) into ID/EX
      ID/EX_Control = 0 (Flush ID/EX control signals)
  }
```

### 6.3 Control Hazards (Branch Penalty)
Branches are resolved in the **EX stage**:
- When a branch condition is met (`hlk` equal or `hft` greater than):
  * `PC = Branch_Target`
  * `IF/ID_Flush = 1` (discards instruction fetched in IF)
  * `ID/EX_Flush = 1` (discards instruction decoded in ID)
- Cost: **2 penalty cycles** per taken branch.
