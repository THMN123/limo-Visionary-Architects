# LIMO Pipeline-Register Data Model Specification (Milestone M2)

**Course:** CS3520 Computer Organisation and Architecture · AY 2026/2027  
**Department:** Mathematics and Computer Science · Faculty of Science and Technology · National University of Lesotho  
**Team:** Visionary Architects  
**Milestone:** M2 – Simulator Design: Pipeline-Register Data Model  
**Release Tag:** `m2`

---

## 1. Overview of Inter-Stage Pipeline Registers

In a synchronous 5-stage pipeline, state between stages is isolated and preserved by four inter-stage pipeline registers:
1. **`IF/ID`**: Separates Instruction Fetch and Instruction Decode
2. **`ID/EX`**: Separates Instruction Decode and Execute
3. **`EX/MEM`**: Separates Execute and Memory Access
4. **`MEM/WB`**: Separates Memory Access and Write-Back

Each register latches inputs on the rising edge of the master clock (`clk`). On hazard detection, registers can be frozen (`WriteEn = 0`) to stall, or cleared (`Flush = 1`) to inject bubbles (NOPs).

---

## 2. Register-by-Register Data Model

### 2.1 IF/ID Pipeline Register (Fetch → Decode)

| Field Name | Type / Width | Reset Value | Description |
| :--- | :---: | :---: | :--- |
| `valid` | 1 bit (bool) | `false` | Indicates whether the register holds a valid instruction (false = stall/bubble). |
| `pc` | 32 bits (uint32) | `0x00400000` | Program counter of the fetched instruction. |
| `instruction` | 32 bits (uint32) | `0x00000013` | Raw 32-bit machine code word fetched from IMEM (default: NOP = `khh r0, r0, 0`). |
| `rawAssembly` | string | `""` | Human-readable assembly text for UI visualization. |
| `lineNum` | uint32 | `0` | Source code line number in editor buffer. |

#### Bit Allocation:
- Total Storage: $1 + 32 + 32 = 65$ bits + simulator metadata.

---

### 2.2 ID/EX Pipeline Register (Decode → Execute)

| Field Name | Type / Width | Reset Value | Description |
| :--- | :---: | :---: | :--- |
| **Control Signals** | | | |
| `valid` | 1 bit (bool) | `false` | Valid instruction flag (cleared to 0 on stall/flush). |
| `regWrite` | 1 bit (bool) | `false` | Enables write-back to destination register `rd` in WB. |
| `memRead` | 1 bit (bool) | `false` | Enables Data Memory read in MEM stage (`lt`). |
| `memWrite` | 1 bit (bool) | `false` | Enables Data Memory write in MEM stage (`blk`). |
| `branch` | 1 bit (bool) | `false` | Indicates conditional branch instruction (`hlk`, `hft`). |
| `branchCondition` | string | `null` | Branch comparator mode: `'EQ'` (`hlk`) or `'GT'` (`hft`). |
| `aluSrc` | 1 bit (bool) | `false` | Selects ALU Operand 2: `0` = Register `rs2_val`, `1` = `imm`. |
| `aluOp` | 4 bits (string) | `'ADD'` | Decoded ALU operation (`'ADD'`, `'SUB'`, `'AND'`, `'OR'`, `'SLL'`, `'CMP'`). |
| `memToReg` | 1 bit (bool) | `false` | Write-back multiplexer selector: `0` = ALU result, `1` = Memory read data. |
| **Data Fields** | | | |
| `pc` | 32 bits (uint32) | `0x00000000` | PC of instruction entering execution stage. |
| `rs1_val` | 32 bits (int32) | `0` | Value read from source register 1 (`R[rs1]`). |
| `rs2_val` | 32 bits (int32) | `0` | Value read from source register 2 (`R[rs2]`). |
| `imm` | 32 bits (int32) | `0` | Sign-extended 32-bit immediate (from I, S, or B formats). |
| `rs1` | 5 bits (uint8) | `0` | Source register 1 address (0–31). Used by Forwarding Unit. |
| `rs2` | 5 bits (uint8) | `0` | Source register 2 address (0–31). Used by Forwarding Unit. |
| `rd` | 5 bits (uint8) | `0` | Destination register address (0–31). |
| `funct3` | 3 bits (string) | `'000'` | Instruction funct3 field for ALU control. |
| `funct7` | 7 bits (string) | `'0000000'` | Instruction funct7 field for ALU control. |
| `opcode` | 7 bits (string) | `'0000000'` | 7-bit opcode. |
| `mnemonic` | string | `""` | Sesotho mnemonic (e.g. `'kop'`, `'khh'`). |
| `rawAssembly` | string | `""` | Formatted assembly string. |

#### Bit Allocation:
- Control Signals: $1 + 1 + 1 + 1 + 1 + 1 + 1 + 4 = 11$ bits.
- Datapath: $32 + 32 + 32 + 32 + 5 + 5 + 5 + 3 + 7 + 7 = 160$ bits.
- Total Hardware Storage: $171$ bits.

---

### 2.3 EX/MEM Pipeline Register (Execute → Memory Access)

| Field Name | Type / Width | Reset Value | Description |
| :--- | :---: | :---: | :--- |
| **Control Signals** | | | |
| `valid` | 1 bit (bool) | `false` | Valid instruction flag. |
| `regWrite` | 1 bit (bool) | `false` | Propagated WB register write enable. |
| `memRead` | 1 bit (bool) | `false` | Data Memory read enable signal. |
| `memWrite` | 1 bit (bool) | `false` | Data Memory write enable signal. |
| `memToReg` | 1 bit (bool) | `false` | Propagated write-back data selector. |
| `branchTaken` | 1 bit (bool) | `false` | True if branch condition was evaluated as taken in EX. |
| **Data Fields** | | | |
| `pc` | 32 bits (uint32) | `0x00000000` | PC of active instruction. |
| `aluResult` | 32 bits (int32) | `0` | Output from ALU (arithmetic result or memory address). |
| `storeData` | 32 bits (int32) | `0` | Forwarded data word to be stored into DMEM (`rs2_val`). |
| `branchTarget` | 32 bits (uint32) | `0` | Calculated branch target address (`PC + imm`). |
| `rd` | 5 bits (uint8) | `0` | Destination register specifier for WB stage. |
| `mnemonic` | string | `""` | Instruction mnemonic. |

#### Bit Allocation:
- Control Signals: $6$ bits.
- Datapath: $32 + 32 + 32 + 32 + 5 = 133$ bits.
- Total Hardware Storage: $139$ bits.

---

### 2.4 MEM/WB Pipeline Register (Memory Access → Write-Back)

| Field Name | Type / Width | Reset Value | Description |
| :--- | :---: | :---: | :--- |
| **Control Signals** | | | |
| `valid` | 1 bit (bool) | `false` | Valid instruction flag. |
| `regWrite` | 1 bit (bool) | `false` | Controls Register File write enable in WB. |
| `memToReg` | 1 bit (bool) | `false` | Multiplexer selector (`0` = `aluResult`, `1` = `memReadData`). |
| **Data Fields** | | | |
| `pc` | 32 bits (uint32) | `0x00000000` | PC of active instruction. |
| `memReadData` | 32 bits (int32) | `0` | 32-bit data read from Data Memory at `aluResult` (for `lt`). |
| `aluResult` | 32 bits (int32) | `0` | Computed ALU result passed from EX/MEM stage. |
| `writeBackData`| 32 bits (int32) | `0` | Final value selected by `memToReg` mux to write to `R[rd]`. |
| `rd` | 5 bits (uint8) | `0` | Destination register specifier (0–31). |
| `mnemonic` | string | `""` | Instruction mnemonic. |

#### Bit Allocation:
- Control Signals: $3$ bits.
- Datapath: $32 + 32 + 32 + 32 + 5 = 133$ bits.
- Total Hardware Storage: $136$ bits.

---

## 3. JavaScript / TypeScript Data Model Definition

In the LIMO Studio Simulator runtime (`app.js`), the pipeline registers are represented as a structured reactive object:

```typescript
export interface IF_ID_Register {
  valid: boolean;
  pc: number;
  instruction: number;
  instructionHex: string;
  rawAssembly: string;
  lineNum: number;
}

export interface ID_EX_Register {
  valid: boolean;
  pc: number;
  rs1: number;
  rs2: number;
  rd: number;
  rs1_val: number;
  rs2_val: number;
  imm: number;
  funct3: string;
  funct7: string;
  opcode: string;
  mnemonic: string;
  rawAssembly: string;
  // Control Signals
  regWrite: boolean;
  memRead: boolean;
  memWrite: boolean;
  branch: boolean;
  branchCondition: 'EQ' | 'GT' | null;
  aluSrc: boolean;
  aluOp: string;
  memToReg: boolean;
}

export interface EX_MEM_Register {
  valid: boolean;
  pc: number;
  aluResult: number;
  storeData: number;
  branchTarget: number;
  branchTaken: boolean;
  rd: number;
  mnemonic: string;
  rawAssembly: string;
  // Control Signals
  regWrite: boolean;
  memRead: boolean;
  memWrite: boolean;
  memToReg: boolean;
}

export interface MEM_WB_Register {
  valid: boolean;
  pc: number;
  memReadData: number;
  aluResult: number;
  writeBackData: number;
  rd: number;
  mnemonic: string;
  rawAssembly: string;
  // Control Signals
  regWrite: boolean;
  memToReg: boolean;
}

export interface LimoPipelineModel {
  IF_ID: IF_ID_Register;
  ID_EX: ID_EX_Register;
  EX_MEM: EX_MEM_Register;
  MEM_WB: MEM_WB_Register;
  cycle: number;
  stalled: boolean;
  flushed: boolean;
}
```

---

## 4. Clock Cycle Transitions & Hazard Latching Rules

```text
Clock Edge (posedge clk):
  if (HazardUnit.stallLoadUse) {
      // 1. Freeze IF/ID: do not overwrite with new fetch
      IF_ID <= IF_ID;
      // 2. Bubble injected into ID/EX:
      ID_EX <= NOP_BUBBLE(valid = false, regWrite = false, memRead = false, memWrite = false);
      // 3. Normal propagation downstream:
      EX_MEM <= Compute_EX_Stage(ID_EX);
      MEM_WB <= Compute_MEM_Stage(EX_MEM);
  }
  else if (HazardUnit.branchTaken) {
      // Flush both speculative instructions
      IF_ID <= NOP_BUBBLE;
      ID_EX <= NOP_BUBBLE;
      // Branch instruction advances to MEM:
      EX_MEM <= Compute_EX_Stage(ID_EX);
      MEM_WB <= Compute_MEM_Stage(EX_MEM);
  }
  else {
      // Normal synchronous clock latch
      IF_ID <= Next_IF_Stage();
      ID_EX <= Compute_ID_Stage(IF_ID);
      EX_MEM <= Compute_EX_Stage(ID_EX);
      MEM_WB <= Compute_MEM_Stage(EX_MEM);
  }
```
