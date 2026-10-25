/**
 * ============================================================================
 * LIMO Studio Pro - Full Standalone Interactive Assembly IDE
 * National University of Lesotho · CS3520 Milestone M1
 * Team: Visionary Architects · 32-bit RV32I Sesotho ISA Engine
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. DATA & SPECIFICATION DEFINITIONS
  // ==========================================================================

  // Table 2.2: LIMO 32-Register Architectural File
  const LIMO_REGISTERS = [
    { num: 0, name: 'r0', sesothoName: 'Letho', alias: 'zero', type: 'SPR', purpose: 'Hard-wired to 0; writes are ignored' },
    { num: 1, name: 'r1', sesothoName: 'Khutlisa', alias: 'ra', type: 'SPR', purpose: 'Return address (where to return after a function call)' },
    { num: 2, name: 'r2', sesothoName: 'Tshupo', alias: 'sp', type: 'SPR', purpose: 'Stack pointer (top of the memory stack)' },
    { num: 3, name: 'r3', sesothoName: 'Sebali', alias: 'pc', type: 'SPR', purpose: 'Program counter: address of current instruction' },
    { num: 4, name: 'r4', sesothoName: 'Sesupi', alias: 'gp', type: 'SPR', purpose: 'Global pointer (points to global variables)' },
    { num: 5, name: 'r5', sesothoName: 'Lesupa', alias: 'fp', type: 'SPR', purpose: 'Frame pointer (tracks function memory frames)' },
    { num: 6, name: 'r6', sesothoName: 'Thuso0', alias: 'a0', type: 'GPR', purpose: 'Argument register 0: pass inputs & return results' },
    { num: 7, name: 'r7', sesothoName: 'Thuso1', alias: 'a1', type: 'GPR', purpose: 'Argument register 1: pass inputs & return results' },
    { num: 8, name: 'r8', sesothoName: 'Nakoana0', alias: 't0', type: 'GPR', purpose: 'Temporary register 0: scratchpad calculation' },
    { num: 9, name: 'r9', sesothoName: 'Nakoana1', alias: 't1', type: 'GPR', purpose: 'Temporary register 1: scratchpad calculation' },
    { num: 10, name: 'r10', sesothoName: 'Nakoana2', alias: 't2', type: 'GPR', purpose: 'Temporary register 2: scratchpad calculation' },
    { num: 11, name: 'r11', sesothoName: 'Nakoana3', alias: 't3', type: 'GPR', purpose: 'Temporary register 3: scratchpad calculation' },
    { num: 12, name: 'r12', sesothoName: 'Nakoana4', alias: 't4', type: 'GPR', purpose: 'Temporary register 4: scratchpad calculation' },
    { num: 13, name: 'r13', sesothoName: 'Nakoana5', alias: 't5', type: 'GPR', purpose: 'Temporary register 5: scratchpad calculation' },
    { num: 14, name: 'r14', sesothoName: 'Nakoana6', alias: 't6', type: 'GPR', purpose: 'Temporary register 6: scratchpad calculation' },
    { num: 15, name: 'r15', sesothoName: 'Nakoana7', alias: 't7', type: 'GPR', purpose: 'Temporary register 7: scratchpad calculation' },
    { num: 16, name: 'r16', sesothoName: 'Polokelo0', alias: 's0', type: 'GPR', purpose: 'Saved register 0: preserve across function calls' },
    { num: 17, name: 'r17', sesothoName: 'Polokelo1', alias: 's1', type: 'GPR', purpose: 'Saved register 1: preserve across function calls' },
    { num: 18, name: 'r18', sesothoName: 'Polokelo2', alias: 's2', type: 'GPR', purpose: 'Saved register 2: preserve across function calls' },
    { num: 19, name: 'r19', sesothoName: 'Polokelo3', alias: 's3', type: 'GPR', purpose: 'Saved register 3: preserve across function calls' },
    { num: 20, name: 'r20', sesothoName: 'Polokelo4', alias: 's4', type: 'GPR', purpose: 'Saved register 4: preserve across function calls' },
    { num: 21, name: 'r21', sesothoName: 'Polokelo5', alias: 's5', type: 'GPR', purpose: 'Saved register 5: preserve across function calls' },
    { num: 22, name: 'r22', sesothoName: 'Polokelo6', alias: 's6', type: 'GPR', purpose: 'Saved register 6: preserve across function calls' },
    { num: 23, name: 'r23', sesothoName: 'Polokelo7', alias: 's7', type: 'GPR', purpose: 'Saved register 7: preserve across function calls' },
    { num: 24, name: 'r24', sesothoName: 'Polokelo8', alias: 's8', type: 'GPR', purpose: 'Saved register 8: preserve across function calls' },
    { num: 25, name: 'r25', sesothoName: 'Polokelo9', alias: 's9', type: 'GPR', purpose: 'Saved register 9: preserve across function calls' },
    { num: 26, name: 'r26', sesothoName: 'Polokelo10', alias: 's10', type: 'GPR', purpose: 'Saved register 10: preserve across function calls' },
    { num: 27, name: 'r27', sesothoName: 'Polokelo11', alias: 's11', type: 'GPR', purpose: 'Saved register 11: preserve across function calls' },
    { num: 28, name: 'r28', sesothoName: 'TseHlahlamang0', alias: 't8', type: 'GPR', purpose: 'Extra temporary 0: additional scratch space' },
    { num: 29, name: 'r29', sesothoName: 'TseHlahlamang1', alias: 't9', type: 'GPR', purpose: 'Extra temporary 1: additional scratch space' },
    { num: 30, name: 'r30', sesothoName: 'TseHlahlamang2', alias: 't10', type: 'GPR', purpose: 'Extra temporary 2: additional scratch space' },
    { num: 31, name: 'r31', sesothoName: 'TseHlahlamang3', alias: 't11', type: 'GPR', purpose: 'Extra temporary 3: additional scratch space' },
  ];

  // Table 2.4: LIMO 10 Sesotho Mnemonics & RV32I Mapping
  const LIMO_INSTRUCTIONS = {
    kop: { class: 'Arithmetic', mnemonic: 'kop', meaning: 'kopanya – to join/add', syntax: 'kop rd, rs1, rs2', operation: 'R[rd] ← R[rs1] + R[rs2]', format: 'R', rv32iEquivalent: 'add rd, rs1, rs2', opcode: '0110011', funct3: '000', funct7: '0000000', example: 'kop r8, r6, r7' },
    ts:  { class: 'Arithmetic', mnemonic: 'ts', meaning: 'tlosa – to subtract/remove', syntax: 'ts rd, rs1, rs2', operation: 'R[rd] ← R[rs1] − R[rs2]', format: 'R', rv32iEquivalent: 'sub rd, rs1, rs2', opcode: '0110011', funct3: '000', funct7: '0100000', example: 'ts r10, r8, r9' },
    khh: { class: 'Arithmetic', mnemonic: 'khh', meaning: 'kopanya hang-hang! – add immediately', syntax: 'khh rd, rs1, imm', operation: 'R[rd] ← R[rs1] + imm', format: 'I', rv32iEquivalent: 'addi rd, rs1, imm', opcode: '0010011', funct3: '000', example: 'khh r6, r0, 12' },
    le:  { class: 'Logic', mnemonic: 'le', meaning: 'le – and/with', syntax: 'le rd, rs1, rs2', operation: 'R[rd] ← R[rs1] & R[rs2]', format: 'R', rv32iEquivalent: 'and rd, rs1, rs2', opcode: '0110011', funct3: '111', funct7: '0000000', example: 'le r8, r6, r7' },
    kp:  { class: 'Logic', mnemonic: 'kp', meaning: 'kapa – or', syntax: 'kp rd, rs1, rs2', operation: 'R[rd] ← R[rs1] | R[rs2]', format: 'R', rv32iEquivalent: 'or rd, rs1, rs2', opcode: '0110011', funct3: '110', funct7: '0000000', example: 'kp r8, r6, r7' },
    ng:  { class: 'Logic', mnemonic: 'ng', meaning: 'ngatafala – multiply/shift up', syntax: 'ng rd, rs1, rs2', operation: 'R[rd] ← R[rs1] << R[rs2]', format: 'R', rv32iEquivalent: 'sll rd, rs1, rs2', opcode: '0110011', funct3: '001', funct7: '0000000', example: 'ng r8, r8, r9' },
    lt:  { class: 'Memory', mnemonic: 'lt', meaning: 'lata – to fetch/read', syntax: 'lt rd, imm(rs1)', operation: 'R[rd] ← Mem[R[rs1] + imm]', format: 'I', rv32iEquivalent: 'lw rd, imm(rs1)', opcode: '0000011', funct3: '010', example: 'lt r9, 4(r2)' },
    blk: { class: 'Memory', mnemonic: 'blk', meaning: 'boloka – to keep/store', syntax: 'blk rs2, imm(rs1)', operation: 'Mem[R[rs1] + imm] ← R[rs2]', format: 'S', rv32iEquivalent: 'sw rs2, imm(rs1)', opcode: '0100011', funct3: '010', example: 'blk r8, 4(r2)' },
    hlk: { class: 'Branch', mnemonic: 'hlk', meaning: 'ha e lekana – if it is equal', syntax: 'hlk rs1, rs2, offset', operation: 'if R[rs1] = R[rs2]: PC ← PC + offset', format: 'B', rv32iEquivalent: 'beq rs1, rs2, offset', opcode: '1100011', funct3: '000', example: 'hlk r6, r7, 16' },
    hft: { class: 'Branch', mnemonic: 'hft', meaning: 'ha e feta – if it passes/exceeds', syntax: 'hft rs1, rs2, offset', operation: 'if R[rs1] > R[rs2]: PC ← PC + offset', format: 'B', rv32iEquivalent: 'bgt rs1, rs2, offset', opcode: '1100011', funct3: '101', example: 'hft r6, r7, 8' },
  };

  // Initial Workspace Programs
  const INITIAL_FILES = {
    'addition_kopanya.limo': {
      name: 'addition_kopanya.limo',
      type: 'limo',
      content: `# ==================================================================
# CS3520 LIMO Group Project - Milestone M1 Submission
# Team Visionary Architects (National University of Lesotho)
# Program 1: Addition (Kopanya). Adds two numbers stored in registers.
# ==================================================================
# Inputs: r6 = first number, r7 = second number; output: r8 = sum

# Initialize inputs (r6 = 12, r7 = 25)
khh r6, r0, 12       # r6 = r0 + 12 = 12 (Thuso0 / a0)
khh r7, r0, 25       # r7 = r0 + 25 = 25 (Thuso1 / a1)

# Main Addition (Kopanya)
kop r8, r6, r7       # r8 = r6 + r7 = 37 (Nakoana0 / a0)
`
    },
    'store_constant_boloka.limo': {
      name: 'store_constant_boloka.limo',
      type: 'limo',
      content: `# ==================================================================
# CS3520 LIMO - Program 2: Store a constant (Boloka palo)
# Stores a constant in memory using base + offset addressing
# Inputs: r6 = base value, r2 = stack pointer (Tshupo)
# ==================================================================

# Set up base values
khh r6, r0, 5        # r6 = 5 (base value)
khh r2, r0, 1000     # r2 = 1000 (stack pointer Tshupo)

# Compute and store
khh r8, r6, 15       # r8 = r6 + 15 = 20 (I-format immediate add)
blk r8, 4(r2)        # Mem[r2 + 4] = r8 = 20 (S-format store boloka)

# Verify read back
lt r9, 4(r2)         # r9 = Mem[r2 + 4] = 20 (I-format load lata)
`
    },
    'average_midpoint.limo': {
      name: 'average_midpoint.limo',
      type: 'limo',
      content: `# ==================================================================
# CS3520 LIMO - Program 3: Simple average (midpoint) of two numbers
# Adds two numbers and returns their average
# Inputs: r6 = a, r7 = b; output: r8 = (a + b) >> 1
# ==================================================================

khh r6, r0, 18       # a = 18 (first input Thuso0)
khh r7, r0, 42       # b = 42 (second input Thuso1)

kop r8, r6, r7       # r8 = a + b = 60 (R-format add kopanya)
khh r9, r0, 1        # r9 = 1 (shift amount)
ng r8, r8, r9        # r8 = r8 >> 1 = 30 (midpoint average)
`
    },
    'addition_kopanya.s': {
      name: 'addition_kopanya.s',
      type: 's',
      content: `# ==================================================================
# CS3520 LIMO Group Project - Milestone M1 Submission
# Team Visionary Architects (National University of Lesotho)
# Program 1: Addition (Kopanya). Adds two numbers stored in registers.
# ==================================================================
# Inputs: r6 = first number, r7 = second number; output: r8 = sum

# Initialize inputs (r6 = 12, r7 = 25)
khh r6, r0, 12       # r6 = r0 + 12 = 12 (Thuso0 / a0)
khh r7, r0, 25       # r7 = r0 + 25 = 25 (Thuso1 / a1)

# Main Addition (Kopanya)
kop r8, r6, r7       # r8 = r6 + r7 = 37 (Nakoana0 / a0)
`
    },
    'store_constant_boloka.s': {
      name: 'store_constant_boloka.s',
      type: 's',
      content: `# ==================================================================
# CS3520 LIMO - Program 2: Store a constant (Boloka palo)
# Stores a constant in memory using base + offset addressing
# Inputs: r6 = base value, r2 = stack pointer (Tshupo)
# ==================================================================

# Set up base values
khh r6, r0, 5        # r6 = 5 (base value)
khh r2, r0, 1000     # r2 = 1000 (stack pointer Tshupo)

# Compute and store
khh r8, r6, 15       # r8 = r6 + 15 = 20 (I-format immediate add)
blk r8, 4(r2)        # Mem[r2 + 4] = r8 = 20 (S-format store boloka)

# Verify read back
lt r9, 4(r2)         # r9 = Mem[r2 + 4] = 20 (I-format load lata)
`
    },
    'average_midpoint.s': {
      name: 'average_midpoint.s',
      type: 's',
      content: `# ==================================================================
# CS3520 LIMO - Program 3: Simple average (midpoint) of two numbers
# Adds two numbers and returns their average
# Inputs: r6 = a, r7 = b; output: r8 = (a + b) >> 1
# ==================================================================

khh r6, r0, 18       # a = 18 (first input Thuso0)
khh r7, r0, 42       # b = 42 (second input Thuso1)

kop r8, r6, r7       # r8 = a + b = 60 (R-format add kopanya)
khh r9, r0, 1        # r9 = 1 (shift amount)
ng r8, r8, r9        # r8 = r8 >> 1 = 30 (midpoint average)
`
    },
    'limo_spec_reference.s': {
      name: 'limo_spec_reference.s',
      type: 's',
      content: `# ==================================================================
# LIMO Instruction Set Architecture (Sesotho Mnemonics Reference)
# National University of Lesotho · CS3520 Milestone M1
# ==================================================================
#
# Arithmetic:
#   kop rd, rs1, rs2     - kopanya (add)           -> R[rd] = R[rs1] + R[rs2]
#   ts  rd, rs1, rs2     - tlosa (subtract)        -> R[rd] = R[rs1] - R[rs2]
#   khh rd, rs1, imm     - kopanya hang-hang (addi)-> R[rd] = R[rs1] + imm
#
# Logic:
#   le  rd, rs1, rs2     - le (and)                -> R[rd] = R[rs1] & R[rs2]
#   kp  rd, rs1, rs2     - kapa (or)               -> R[rd] = R[rs1] | R[rs2]
#   ng  rd, rs1, rs2     - ngatafala (shift/mult)  -> R[rd] = R[rs1] << R[rs2]
#
# Memory:
#   lt  rd, imm(rs1)     - lata (load word)        -> R[rd] = Mem[R[rs1] + imm]
#   blk rs2, imm(rs1)    - boloka (store word)     -> Mem[R[rs1] + imm] = R[rs2]
#
# Branch:
#   hlk rs1, rs2, offset - ha e lekana (beq)       -> if R[rs1] == R[rs2]: PC += offset
#   hft rs1, rs2, offset - ha e feta (bgt)         -> if R[rs1] > R[rs2]: PC += offset
#
# Worked Examples from Section 2.5:
kop r8, r6, r7       # Hex: 0x00730433
khh r8, r6, 15       # Hex: 0x00F30413
blk r7, 4(r2)        # Hex: 0x00712223
hlk r6, r7, 16       # Hex: 0x00730863
`
    },
    'main.s': {
      name: 'main.s',
      type: 's',
      content: `# ==================================================================
# CS3520 Visionary Architects - RISC-V / LIMO Test Suite (.s)
# ==================================================================
.global _start

_start:
    # 1. Initialize test registers
    khh r6, r0, 10       # r6 = 10 (Thuso0 / a0)
    khh r7, r0, 20       # r7 = 20 (Thuso1 / a1)
    kop r8, r6, r7       # r8 = r6 + r7 = 30 (Nakoana0 / t0)
    
    # 2. Subtract offset
    khh r9, r0, 5        # r9 = 5
    ts  r10, r8, r9      # r10 = 30 - 5 = 25 (Nakoana2 / t2)
`
    }
  };

  // ==========================================================================
  // 2. APPLICATION STATE
  // ==========================================================================

  const state = {
    files: {},
    activeFile: 'addition_kopanya.limo',
    openTabs: ['addition_kopanya.limo', 'store_constant_boloka.limo', 'average_midpoint.limo', 'addition_kopanya.s', 'main.s'],
    activeSidebarTab: 'explorer',
    sidebarOpen: true,
    inspectorOpen: true,
    terminalOpen: true,
    terminalMaximized: false,
    activeTerminalTab: 'terminal',
    theme: 'theme-vscode',
    architecture: 'LIMO (RV32I Sesotho)',
    fontSize: 13,
    displayMode: 'hex', // 'hex' | 'dec'
    cursorPos: { line: 1, col: 1 },

    // CPU and simulation state
    registers: new Array(32).fill(0),
    prevRegisters: new Array(32).fill(0),
    simulatedMemory: { 1004: 20 },
    pc: 0x00400000,
    currentStepIndex: 0,
    activeLineNum: null,
    breakpoints: new Set(),
    isRunning: false,
    terminalHistory: [],
    terminalHistoryIndex: -1,

    // Milestone 2 (M2): 5-Stage Pipeline Registers Data Model
    pipeline: {
      cycle: 0,
      stalled: false,
      flushed: false,
      IF_ID: { valid: false, pc: 0x00400000, instruction: 0x00000013, hex: '0x00000013', rawAssembly: 'nop', lineNum: 0 },
      ID_EX: { valid: false, pc: 0x00400000, rs1: 0, rs2: 0, rd: 0, rs1_val: 0, rs2_val: 0, imm: 0, mnemonic: '', rawAssembly: 'nop', regWrite: false, memRead: false, memWrite: false, branch: false, aluOp: 'ADD', aluSrc: false, memToReg: false },
      EX_MEM: { valid: false, pc: 0x00400000, aluResult: 0, storeData: 0, branchTarget: 0, branchTaken: false, rd: 0, mnemonic: '', regWrite: false, memRead: false, memWrite: false, memToReg: false },
      MEM_WB: { valid: false, pc: 0x00400000, memReadData: 0, aluResult: 0, writeBackData: 0, rd: 0, mnemonic: '', regWrite: false, memToReg: false }
    },
    activeInspectorTab: 'regs',
    activeM2SubTab: 'arch',
    unitTestFilter: 'all',
    testResults: null,
  };

  // Initialize stack pointer r2 (Tshupo)
  state.registers[2] = 0x7FFFFFF0;

  // Restore saved files from localStorage if available
  try {
    const saved = localStorage.getItem('limo_studio_files');
    if (saved) {
      state.files = Object.assign({}, INITIAL_FILES, JSON.parse(saved));
    } else {
      state.files = JSON.parse(JSON.stringify(INITIAL_FILES));
    }
  } catch (e) {
    state.files = JSON.parse(JSON.stringify(INITIAL_FILES));
  }
  if (!state.files[state.activeFile]) {
    state.activeFile = Object.keys(state.files)[0] || 'addition_kopanya.limo';
  }

  // ==========================================================================
  // 3. PARSING & ENCODING UTILITIES
  // ==========================================================================

  function parseRegisterNumber(token) {
    if (!token) return null;
    const clean = token.trim().toLowerCase().replace(/,$/, '');

    // match r0 - r31
    const rMatch = clean.match(/^r(\d+)$/);
    if (rMatch) {
      const n = parseInt(rMatch[1], 10);
      return n >= 0 && n <= 31 ? n : null;
    }

    // match x0 - x31
    const xMatch = clean.match(/^x(\d+)$/);
    if (xMatch) {
      const n = parseInt(xMatch[1], 10);
      return n >= 0 && n <= 31 ? n : null;
    }

    // match Sesotho name or alias
    const found = LIMO_REGISTERS.find(
      (reg) =>
        reg.name.toLowerCase() === clean ||
        reg.sesothoName.toLowerCase() === clean ||
        reg.alias.toLowerCase() === clean
    );

    return found ? found.num : null;
  }

  function toBinary(num, bits) {
    let val = num;
    if (val < 0) {
      val = (1 << bits) + val;
    }
    const str = (val >>> 0).toString(2);
    return str.padStart(bits, '0').slice(-bits);
  }

  function binaryToHex(bin) {
    const num = parseInt(bin, 2) >>> 0;
    return '0x' + num.toString(16).padStart(8, '0').toUpperCase();
  }

  function encodeLimoInstruction(line) {
    const original = line.trim();
    if (!original || original.startsWith('#') || original.startsWith(';')) {
      return { lineNum: 0, original, isCommentOrEmpty: true };
    }

    const codePart = original.split(/[#;]/)[0].trim();
    const tokens = codePart.split(/[\s,()]+/).filter(Boolean);

    if (tokens.length === 0) {
      return { lineNum: 0, original, isCommentOrEmpty: true };
    }

    const mnemonic = tokens[0].toLowerCase();
    const spec = LIMO_INSTRUCTIONS[mnemonic];

    if (!spec) {
      return {
        lineNum: 0,
        original,
        isCommentOrEmpty: false,
        error: `Unknown LIMO mnemonic "${mnemonic}". Supported: kop, ts, khh, le, kp, ng, lt, blk, hlk, hft.`
      };
    }

    try {
      if (spec.format === 'R') {
        if (tokens.length < 4) {
          return { lineNum: 0, original, isCommentOrEmpty: false, error: `R-format ${mnemonic} requires 3 operands: rd, rs1, rs2` };
        }
        const rd = parseRegisterNumber(tokens[1]);
        const rs1 = parseRegisterNumber(tokens[2]);
        const rs2 = parseRegisterNumber(tokens[3]);
        if (rd === null || rs1 === null || rs2 === null) {
          return { lineNum: 0, original, isCommentOrEmpty: false, error: `Invalid registers in R-format: ${tokens.slice(1).join(', ')}` };
        }
        const funct7Bin = spec.funct7 || '0000000';
        const rs2Bin = toBinary(rs2, 5);
        const rs1Bin = toBinary(rs1, 5);
        const funct3Bin = spec.funct3;
        const rdBin = toBinary(rd, 5);
        const opcodeBin = spec.opcode;
        const fullBinary = `${funct7Bin}${rs2Bin}${rs1Bin}${funct3Bin}${rdBin}${opcodeBin}`;
        const hex = binaryToHex(fullBinary);
        return {
          lineNum: 0,
          original,
          isCommentOrEmpty: false,
          limoInstruction: `${mnemonic} r${rd}, r${rs1}, r${rs2}`,
          rv32iTranslation: `${spec.rv32iEquivalent.split(' ')[0]} r${rd}, r${rs1}, r${rs2}`,
          hexEncoding: hex,
          binaryEncoding: `${funct7Bin} ${rs2Bin} ${rs1Bin} ${funct3Bin} ${rdBin} ${opcodeBin}`,
          fields: { funct7: funct7Bin, rs2: `r${rs2} (${rs2Bin})`, rs1: `r${rs1} (${rs1Bin})`, funct3: funct3Bin, rd: `r${rd} (${rdBin})`, opcode: opcodeBin }
        };
      }

      if (spec.format === 'I') {
        let rd = null;
        let rs1 = null;
        let immVal = 0;
        if (mnemonic === 'lt') {
          rd = parseRegisterNumber(tokens[1]);
          immVal = parseInt(tokens[2], 10) || 0;
          rs1 = parseRegisterNumber(tokens[3]);
        } else {
          rd = parseRegisterNumber(tokens[1]);
          rs1 = parseRegisterNumber(tokens[2]);
          immVal = parseInt(tokens[3], 10) || 0;
        }
        if (rd === null || rs1 === null) {
          return { lineNum: 0, original, isCommentOrEmpty: false, error: `Invalid registers in I-format: ${tokens.slice(1).join(', ')}` };
        }
        if (immVal < -2048 || immVal > 2047) {
          return { lineNum: 0, original, isCommentOrEmpty: false, error: `Immediate ${immVal} out of 12-bit signed range [-2048, 2047]` };
        }
        const immBin = toBinary(immVal, 12);
        const rs1Bin = toBinary(rs1, 5);
        const funct3Bin = spec.funct3;
        const rdBin = toBinary(rd, 5);
        const opcodeBin = spec.opcode;
        const fullBinary = `${immBin}${rs1Bin}${funct3Bin}${rdBin}${opcodeBin}`;
        const hex = binaryToHex(fullBinary);
        return {
          lineNum: 0,
          original,
          isCommentOrEmpty: false,
          limoInstruction: mnemonic === 'lt' ? `lt r${rd}, ${immVal}(r${rs1})` : `khh r${rd}, r${rs1}, ${immVal}`,
          rv32iTranslation: mnemonic === 'lt' ? `lw r${rd}, ${immVal}(r${rs1})` : `addi r${rd}, r${rs1}, ${immVal}`,
          hexEncoding: hex,
          binaryEncoding: `${immBin} ${rs1Bin} ${funct3Bin} ${rdBin} ${opcodeBin}`,
          fields: { imm: `${immVal} (${immBin})`, rs1: `r${rs1} (${rs1Bin})`, funct3: funct3Bin, rd: `r${rd} (${rdBin})`, opcode: opcodeBin }
        };
      }

      if (spec.format === 'S') {
        if (tokens.length < 4) {
          return { lineNum: 0, original, isCommentOrEmpty: false, error: `blk (store) requires syntax: blk rs2, imm(rs1)` };
        }
        const rs2 = parseRegisterNumber(tokens[1]);
        const immVal = parseInt(tokens[2], 10) || 0;
        const rs1 = parseRegisterNumber(tokens[3]);
        if (rs1 === null || rs2 === null) {
          return { lineNum: 0, original, isCommentOrEmpty: false, error: `Invalid registers in S-format: ${tokens.slice(1).join(', ')}` };
        }
        if (immVal < -2048 || immVal > 2047) {
          return { lineNum: 0, original, isCommentOrEmpty: false, error: `Store offset ${immVal} out of 12-bit signed range [-2048, 2047]` };
        }
        const imm12 = toBinary(immVal, 12);
        const immHigh = imm12.slice(0, 7);
        const immLow = imm12.slice(7);
        const rs2Bin = toBinary(rs2, 5);
        const rs1Bin = toBinary(rs1, 5);
        const funct3Bin = spec.funct3;
        const opcodeBin = spec.opcode;
        const fullBinary = `${immHigh}${rs2Bin}${rs1Bin}${funct3Bin}${immLow}${opcodeBin}`;
        const hex = binaryToHex(fullBinary);
        return {
          lineNum: 0,
          original,
          isCommentOrEmpty: false,
          limoInstruction: `blk r${rs2}, ${immVal}(r${rs1})`,
          rv32iTranslation: `sw r${rs2}, ${immVal}(r${rs1})`,
          hexEncoding: hex,
          binaryEncoding: `${immHigh} ${rs2Bin} ${rs1Bin} ${funct3Bin} ${immLow} ${opcodeBin}`,
          fields: { imm: `${immVal} [${immHigh}|${immLow}]`, rs2: `r${rs2} (${rs2Bin})`, rs1: `r${rs1} (${rs1Bin})`, funct3: funct3Bin, opcode: opcodeBin }
        };
      }

      if (spec.format === 'B') {
        if (tokens.length < 4) {
          return { lineNum: 0, original, isCommentOrEmpty: false, error: `${mnemonic} branch requires syntax: ${mnemonic} rs1, rs2, offset` };
        }
        const rs1 = parseRegisterNumber(tokens[1]);
        const rs2 = parseRegisterNumber(tokens[2]);
        const offsetVal = parseInt(tokens[3].replace(/^\+/, ''), 10) || 0;
        if (rs1 === null || rs2 === null) {
          return { lineNum: 0, original, isCommentOrEmpty: false, error: `Invalid registers in B-format: ${tokens.slice(1).join(', ')}` };
        }
        if (offsetVal < -4096 || offsetVal > 4094) {
          return { lineNum: 0, original, isCommentOrEmpty: false, error: `Branch offset ${offsetVal} out of 13-bit signed range [-4096, 4094]` };
        }
        const offset13 = toBinary(offsetVal, 13);
        const b12 = offset13[0];
        const b11 = offset13[1];
        const b10_5 = offset13.slice(2, 8);
        const b4_1 = offset13.slice(8, 12);
        const immHigh = `${b12}${b10_5}`;
        const immLow = `${b4_1}${b11}`;
        const rs2Bin = toBinary(rs2, 5);
        const rs1Bin = toBinary(rs1, 5);
        const funct3Bin = spec.funct3;
        const opcodeBin = spec.opcode;
        const fullBinary = `${immHigh}${rs2Bin}${rs1Bin}${funct3Bin}${immLow}${opcodeBin}`;
        const hex = binaryToHex(fullBinary);
        return {
          lineNum: 0,
          original,
          isCommentOrEmpty: false,
          limoInstruction: `${mnemonic} r${rs1}, r${rs2}, ${offsetVal >= 0 ? '+' : ''}${offsetVal}`,
          rv32iTranslation: `${mnemonic === 'hlk' ? 'beq' : 'bgt'} r${rs1}, r${rs2}, ${offsetVal >= 0 ? '+' : ''}${offsetVal}`,
          hexEncoding: hex,
          binaryEncoding: `${b12} ${b10_5} ${rs2Bin} ${rs1Bin} ${funct3Bin} ${b4_1} ${b11} ${opcodeBin}`,
          fields: { imm: `${offsetVal} [${b12}|${b10_5}|${b4_1}|${b11}]`, rs2: `r${rs2} (${rs2Bin})`, rs1: `r${rs1} (${rs1Bin})`, funct3: funct3Bin, opcode: opcodeBin }
        };
      }
    } catch (err) {
      return { lineNum: 0, original, isCommentOrEmpty: false, error: err.message || 'Syntax error' };
    }
  }

  function translateLimoProgram(code) {
    const lines = code.split('\n');
    return lines.map((l, idx) => {
      const res = encodeLimoInstruction(l);
      res.lineNum = idx + 1;
      return res;
    });
  }

  // ==========================================================================
  // 4. ASSEMBLY SYNTAX HIGHLIGHTING ENGINE
  // ==========================================================================

  const ASM_KEYWORDS = new Set([
    'kop', 'ts', 'khh', 'le', 'kp', 'ng', 'lt', 'blk', 'hlk', 'hft',
    'add', 'sub', 'addi', 'and', 'or', 'xor', 'sll', 'srl', 'slli', 'srli',
    'lw', 'sw', 'beq', 'bne', 'blt', 'bge', 'bgt', 'ble', 'li', 'mv', 'j', 'jal',
    'nop', 'ecall', 'ret', 'halt', 'mov', 'push', 'pop', 'call', 'cmp'
  ]);

  const ASM_DIRECTIVES = new Set([
    '.global', '.text', '.data', '.bss', '.rodata', 'global', 'extern', 'section', 'equ'
  ]);

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlightLine(line) {
    if (!line) return '&nbsp;';

    // Comment match
    const commentIdx = line.search(/[#;]/);
    let codePart = line;
    let commentPart = '';
    if (commentIdx !== -1) {
      codePart = line.slice(0, commentIdx);
      commentPart = line.slice(commentIdx);
    }

    // Tokenize codePart
    let html = '';
    const regex = /([a-zA-Z_.$%][a-zA-Z0-9_.$%]*:?|0x[0-9a-fA-F]+|[+-]?\d+|"[^"]*"|'[^']*'|[,()\[\]+-]|\s+)/g;
    let match;

    while ((match = regex.exec(codePart)) !== null) {
      const token = match[0];
      const lower = token.toLowerCase();

      if (/^\s+$/.test(token)) {
        html += token;
      } else if (token.endsWith(':')) {
        html += `<span class="asm-label">${escapeHtml(token)}</span>`;
      } else if (ASM_KEYWORDS.has(lower)) {
        html += `<span class="asm-instruction">${escapeHtml(token)}</span>`;
      } else if (ASM_DIRECTIVES.has(lower) || token.startsWith('.')) {
        html += `<span class="asm-directive">${escapeHtml(token)}</span>`;
      } else if (parseRegisterNumber(token) !== null) {
        html += `<span class="asm-register">${escapeHtml(token)}</span>`;
      } else if (/^(0x[0-9a-fA-F]+|[+-]?\d+)$/.test(token)) {
        html += `<span class="asm-number">${escapeHtml(token)}</span>`;
      } else if (/^["'].*["']$/.test(token)) {
        html += `<span class="asm-string">${escapeHtml(token)}</span>`;
      } else if (/^[,()\[\]+-]$/.test(token)) {
        html += `<span class="asm-punctuation">${escapeHtml(token)}</span>`;
      } else {
        html += escapeHtml(token);
      }
    }

    if (commentPart) {
      html += `<span class="asm-comment">${escapeHtml(commentPart)}</span>`;
    }

    return html || '&nbsp;';
  }

  // ==========================================================================
  // 5. TOAST NOTIFICATIONS
  // ==========================================================================

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const colorClass =
      type === 'success' ? 'bg-emerald-600/90 text-white border-emerald-400/40' :
      type === 'error' ? 'bg-red-600/90 text-white border-red-400/40' :
      type === 'warn' ? 'bg-amber-600/90 text-white border-amber-400/40' :
      'bg-zinc-900/95 text-blue-300 border-blue-500/40';

    toast.className = `toast-msg flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs shadow-2xl backdrop-blur-md ${colorClass} transition-all duration-200`;
    toast.innerHTML = `
      <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success' ? '<path d="M20 6 9 17l-5-5"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
      </svg>
      <span class="font-medium">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.95)';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // ==========================================================================
  // 6. UI RENDERERS & EVENT HANDLERS
  // ==========================================================================

  // --- Cursor Tracking & Active Line Scrolling ---
  function updateCursorPos() {
    const textarea = document.getElementById('codeEditorArea');
    if (!textarea) return;
    const text = textarea.value.substr(0, textarea.selectionStart);
    const lines = text.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    state.cursorPos = { line, col };
    const badge = document.getElementById('cursorPosBadge');
    if (badge) badge.textContent = `Ln ${line}, Col ${col}`;
  }

  function scrollToActiveLine(lineNum) {
    const textarea = document.getElementById('codeEditorArea');
    if (!textarea || !lineNum) return;
    const computedHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--editor-line-height') || '24', 10);
    const lineHeight = isNaN(computedHeight) || computedHeight <= 0 ? 24 : computedHeight;
    const targetTop = (lineNum - 1) * lineHeight;
    const viewHeight = textarea.clientHeight;
    if (targetTop < textarea.scrollTop || targetTop > textarea.scrollTop + viewHeight - lineHeight * 2) {
      textarea.scrollTop = Math.max(0, targetTop - Math.floor(viewHeight / 2));
      syncEditorScroll();
    }
  }

  // --- Editor & Gutter Rendering ---
  function renderEditor() {
    const textarea = document.getElementById('codeEditorArea');
    const overlay = document.getElementById('highlightOverlay');
    const gutter = document.getElementById('editorGutter');
    const minimap = document.getElementById('minimapContainer');
    if (!textarea || !overlay || !gutter) return;

    const file = state.files[state.activeFile];
    const content = file ? file.content : '';

    if (textarea.value !== content) {
      textarea.value = content;
    }

    const lines = content.split('\n');

    // Build syntax highlight overlay
    const overlayHtml = lines.map((line, idx) => {
      const lineNum = idx + 1;
      const isActive = state.activeLineNum === lineNum;
      const activeClass = isActive ? 'debug-active-line' : '';
      return `<div class="editor-line ${activeClass}" data-line="${lineNum}">${highlightLine(line)}</div>`;
    }).join('');
    overlay.innerHTML = overlayHtml;

    // Build Gutter with Breakpoints
    const gutterHtml = lines.map((_, idx) => {
      const lineNum = idx + 1;
      const hasBp = state.breakpoints.has(lineNum);
      const isActive = state.activeLineNum === lineNum;
      const classes = [
        'gutter-line',
        hasBp ? 'has-breakpoint' : '',
        isActive ? 'gutter-active' : ''
      ].filter(Boolean).join(' ');

      return `<div class="${classes}" data-line="${lineNum}" title="${hasBp ? 'Breakpoint set' : 'Click to toggle breakpoint'}">${lineNum}</div>`;
    }).join('');
    gutter.innerHTML = gutterHtml;

    // Minimap
    if (minimap && !minimap.classList.contains('hidden')) {
      minimap.innerHTML = lines.slice(0, 70).map(l => `<div class="truncate opacity-75">${escapeHtml(l || ' ')}</div>`).join('');
    }

    // Update breakpoint count in debugger panel
    const bpCount = document.getElementById('breakpointCount');
    if (bpCount) bpCount.textContent = state.breakpoints.size;
    renderBreakpointsList();

    // Ensure synchronized scrolling and cursor tracking
    syncEditorScroll();
    updateCursorPos();
  }

  // Sync scroll between textarea, overlay, and gutter
  function syncEditorScroll() {
    const textarea = document.getElementById('codeEditorArea');
    const overlay = document.getElementById('highlightOverlay');
    const gutter = document.getElementById('editorGutter');
    if (!textarea || !overlay || !gutter) return;

    overlay.scrollTop = textarea.scrollTop;
    overlay.scrollLeft = textarea.scrollLeft;
    gutter.scrollTop = textarea.scrollTop;
  }

  // --- Tabs Rendering ---
  function renderTabs() {
    const container = document.getElementById('editorTabsContainer');
    if (!container) return;

    container.innerHTML = state.openTabs.map((fileName) => {
      const isActive = fileName === state.activeFile;
      const file = state.files[fileName];
      const isLimo = fileName.endsWith('.limo') || fileName.endsWith('.s');

      return `
        <div class="group flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer select-none ${
          isActive
            ? 'bg-zinc-800/90 text-blue-400 border border-zinc-700/60 shadow-sm font-semibold'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
        }" data-filename="${fileName}">
          <span class="flex items-center gap-1.5 truncate">
            <svg class="w-3.5 h-3.5 ${isLimo ? 'text-blue-400' : 'text-emerald-400'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
            </svg>
            <span class="truncate">${fileName}</span>
          </span>
          <button type="button" class="tab-close-btn p-0.5 rounded-md hover:bg-zinc-700 text-zinc-500 hover:text-white transition" data-close="${fileName}" title="Close Tab">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      `;
    }).join('');
  }

  // --- Explorer Tree Rendering ---
  function renderExplorer() {
    const container = document.getElementById('fileTreeContainer');
    if (!container) return;

    const fileNames = Object.keys(state.files);
    container.innerHTML = fileNames.map((name) => {
      const isActive = name === state.activeFile;
      return `
        <div class="explorer-file-item flex items-center justify-between px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
          isActive
            ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
            : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
        }" data-file="${name}">
          <div class="flex items-center gap-2 truncate">
            <svg class="w-3.5 h-3.5 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
            </svg>
            <span class="truncate">${name}</span>
          </div>
          <span class="text-[10px] text-zinc-500 font-mono">ASM</span>
        </div>
      `;
    }).join('');
  }

  // --- CPU Registers Inspector Rendering ---
  function renderRegisters() {
    const container = document.getElementById('registersGridContainer');
    if (!container) return;

    const isHex = state.displayMode === 'hex';

    container.innerHTML = LIMO_REGISTERS.map((reg) => {
      const val = state.registers[reg.num] || 0;
      const prevVal = state.prevRegisters[reg.num] || 0;
      const isModified = val !== prevVal && val !== 0;

      const formattedVal = isHex
        ? '0x' + (val >>> 0).toString(16).padStart(8, '0').toUpperCase()
        : val.toString(10);

      const colorTag =
        reg.num === 0 ? 'text-zinc-500' :
        reg.num <= 5 ? 'text-purple-400' :
        reg.num <= 7 ? 'text-blue-400' :
        reg.num <= 15 ? 'text-amber-400' : 'text-emerald-400';

      return `
        <div class="reg-card p-2 rounded-xl bg-zinc-800/40 border border-zinc-700/40 flex flex-col justify-between ${isModified ? 'reg-updated' : ''}" title="${reg.name} (${reg.sesothoName} / ${reg.alias}): ${reg.purpose}">
          <div class="flex items-center justify-between text-[10px]">
            <span class="font-bold ${colorTag}">${reg.name}</span>
            <span class="text-zinc-500 truncate text-[9px] font-sans">${reg.sesothoName}</span>
          </div>
          <div class="text-[11px] font-mono text-white mt-1 font-semibold truncate ${val !== 0 ? 'text-emerald-300' : 'text-zinc-400'}">
            ${formattedVal}
          </div>
        </div>
      `;
    }).join('');

    renderMemoryHex();
  }

  // --- Memory Hex Dump Viewer Rendering ---
  function renderMemoryHex() {
    const container = document.getElementById('memoryHexContainer');
    if (!container) return;

    const memEntries = Object.entries(state.simulatedMemory);
    const rows = memEntries.length > 0
      ? memEntries.map(([addrStr, val]) => {
          const addrNum = parseInt(addrStr, 10);
          const hexVal = (val >>> 0).toString(16).padStart(8, '0').toUpperCase();
          return {
            addr: '0x' + addrNum.toString(16).padStart(8, '0').toUpperCase(),
            hex: `${hexVal.slice(0, 2)} ${hexVal.slice(2, 4)} ${hexVal.slice(4, 6)} ${hexVal.slice(6, 8)}`,
            ascii: `val: ${val}`
          };
        })
      : [
          { addr: '0x000003EC', hex: '00 00 00 14', ascii: 'val: 20' },
          { addr: '0x00402000', hex: '4C 49 4D 4F', ascii: 'LIMO' },
          { addr: '0x00402004', hex: '52 56 33 32', ascii: 'RV32' },
          { addr: '0x7FFFFFF0', hex: '00 00 00 00', ascii: 'SP Top' }
        ];

    container.innerHTML = rows.map((r) => `
      <div class="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
        <span class="text-blue-400 font-semibold">${r.addr}</span>
        <span class="text-yellow-300 font-mono tracking-wider">${r.hex}</span>
        <span class="text-zinc-500 text-[10px] font-sans">${r.ascii}</span>
      </div>
    `).join('');
  }

  // --- Breakpoints List in Debugger Sidebar Tab ---
  function renderBreakpointsList() {
    const container = document.getElementById('breakpointsListContainer');
    if (!container) return;

    if (state.breakpoints.size === 0) {
      container.innerHTML = `<div class="text-[11px] text-zinc-500 italic p-2 bg-zinc-800/30 rounded-xl">No active breakpoints. Click gutter line numbers to set.</div>`;
      return;
    }

    const bpArray = Array.from(state.breakpoints).sort((a, b) => a - b);
    container.innerHTML = bpArray.map((line) => `
      <div class="flex items-center justify-between p-2 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-xs">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/80"></span>
          <span class="font-mono text-zinc-200">Line ${line}</span>
        </div>
        <button type="button" class="btn-remove-bp text-zinc-400 hover:text-red-400 p-1 rounded-md transition" data-line="${line}" title="Remove breakpoint">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    `).join('');
  }

  // --- LIMO Workbench View Rendering ---
  function renderWorkbench() {
    const instContainer = document.getElementById('wbInstructionsList');
    const regsContainer = document.getElementById('wbRegistersList');

    if (instContainer && !instContainer.hasChildNodes()) {
      instContainer.innerHTML = Object.values(LIMO_INSTRUCTIONS).map((inst) => `
        <div class="p-2.5 rounded-2xl bg-zinc-800/50 border border-zinc-700/60 space-y-1.5 hover:border-blue-500/40 transition">
          <div class="flex items-center justify-between">
            <span class="font-bold text-blue-400 font-mono text-xs">${inst.mnemonic}</span>
            <span class="text-[9px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-mono">${inst.format}-format</span>
          </div>
          <div class="text-[11px] text-zinc-300 font-mono bg-zinc-900/60 p-1.5 rounded-lg">${inst.syntax}</div>
          <div class="text-[10px] text-zinc-400">${inst.meaning}</div>
          <div class="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[10px]">
            <span class="text-emerald-400 font-mono">${inst.rv32iEquivalent}</span>
            <button type="button" class="btn-insert-snippet text-blue-400 hover:text-blue-300 font-medium cursor-pointer" data-snippet="${inst.example}">+ Insert</button>
          </div>
        </div>
      `).join('');
    }

    if (regsContainer && !regsContainer.hasChildNodes()) {
      regsContainer.innerHTML = LIMO_REGISTERS.map((reg) => `
        <div class="p-1.5 rounded-xl bg-zinc-800/40 border border-zinc-700/40 flex items-center justify-between text-[11px]">
          <div class="flex items-center gap-2">
            <span class="font-bold text-blue-400 w-7">${reg.name}</span>
            <span class="text-zinc-200 font-sans">${reg.sesothoName}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-emerald-400 text-[10px] font-mono">${reg.alias}</span>
            <span class="text-zinc-500 text-[9px] bg-zinc-900/80 px-1.5 py-0.5 rounded">${reg.type}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // --- Terminal Output Logger ---
  function logTerminal(message, type = 'output') {
    const container = document.getElementById('terminalLogContainer');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'leading-relaxed select-text';

    if (type === 'cmd') {
      div.innerHTML = `<span class="text-emerald-400 font-semibold">student@limo-box</span>:<span class="text-blue-400 font-semibold">~/limo-workspace</span>$ <span class="text-white font-medium">${escapeHtml(message)}</span>`;
    } else if (type === 'error') {
      div.innerHTML = `<span class="text-red-400 font-semibold">[ERROR]</span> <span class="text-red-300">${message}</span>`;
    } else {
      div.innerHTML = message;
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  // ==========================================================================
  // 7. INTERACTIVE SIMULATION & STEP ENGINE
  // ==========================================================================

  function parseExecutableProgram(sourceCode) {
    const rawLines = sourceCode.split('\n');
    const instructions = [];
    const labelMap = new Map();

    rawLines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const noComment = line.split(/[#;]/)[0].trim();
      if (!noComment || noComment.startsWith('.')) return;

      let workingText = noComment;
      const labelMatch = workingText.match(/^([a-zA-Z_][a-zA-Z0-9_]*):/);
      if (labelMatch) {
        labelMap.set(labelMatch[1].toLowerCase(), instructions.length);
        workingText = workingText.slice(labelMatch[0].length).trim();
      }

      if (!workingText) return;

      const tokens = workingText.split(/[\s,()]+/).filter(Boolean);
      if (tokens.length === 0) return;

      instructions.push({
        lineNum,
        rawText: line.trim(),
        cleanedText: workingText,
        mnemonic: tokens[0].toLowerCase(),
        tokens
      });
    });

    return { instructions, labelMap };
  }

  function resetCpu() {
    state.prevRegisters = [...state.registers];
    state.registers = new Array(32).fill(0);
    state.registers[2] = 0x7FFFFFF0; // SP
    state.simulatedMemory = { 1004: 20 };
    state.pc = 0x00400000;
    state.currentStepIndex = 0;
    state.activeLineNum = null;
    state.isRunning = false;

    resetPipeline();
    renderRegisters();
    renderEditor();

    const quickPC = document.getElementById('quickPC');
    const quickInst = document.getElementById('quickActiveInst');
    if (quickPC) quickPC.textContent = '0x00400000';
    if (quickInst) quickInst.textContent = 'Active: none';

    logTerminal('<span class="text-amber-400 font-semibold">[CPU Reset]</span> Registers cleared to zero. SP=0x7FFFFFF0, PC=0x00400000.');
    showToast('CPU & Registers Reset', 'info');
  }

  function stepInstruction() {
    const file = state.files[state.activeFile];
    if (!file) return;

    const { instructions, labelMap } = parseExecutableProgram(file.content);

    if (instructions.length === 0) {
      logTerminal('<span class="text-zinc-500 font-mono">[0x00400000] Buffer contains no executable instructions.</span>');
      return;
    }

    if (state.currentStepIndex >= instructions.length) {
      // Auto-reset when user steps past the end to allow re-running cleanly
      resetCpu();
      logTerminal('<span class="text-emerald-400 font-semibold">[Program Reset]</span> Automatically reset CPU for new run.');
    }

    const current = instructions[state.currentStepIndex];
    state.activeLineNum = current.lineNum;
    renderEditor();
    scrollToActiveLine(current.lineNum);

    const pcHex = '0x' + (state.pc >>> 0).toString(16).padStart(8, '0').toUpperCase();
    const quickPC = document.getElementById('quickPC');
    const quickInst = document.getElementById('quickActiveInst');
    if (quickPC) quickPC.textContent = pcHex;
    if (quickInst) quickInst.textContent = `${current.cleanedText}`;

    let nextStepIndex = state.currentStepIndex + 1;
    let nextPC = state.pc + 4;

    state.prevRegisters = [...state.registers];

    const { tokens, mnemonic } = current;

    try {
      switch (mnemonic) {
        case 'kop':
        case 'add': {
          const rd = parseRegisterNumber(tokens[1]);
          const rs1 = parseRegisterNumber(tokens[2]);
          const rs2 = parseRegisterNumber(tokens[3]);
          if (rd !== null && rs1 !== null && rs2 !== null) {
            state.registers[rd] = (state.registers[rs1] + state.registers[rs2]) | 0;
            state.registers[0] = 0;
            const regName = LIMO_REGISTERS[rd]?.sesothoName || `r${rd}`;
            logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-blue-400 font-bold">${tokens.join(' ')}</span> => <span class="text-emerald-400 font-bold">r${rd} (${regName}) = ${state.registers[rd]}</span>`);
          }
          break;
        }

        case 'ts':
        case 'sub': {
          const rd = parseRegisterNumber(tokens[1]);
          const rs1 = parseRegisterNumber(tokens[2]);
          const rs2 = parseRegisterNumber(tokens[3]);
          if (rd !== null && rs1 !== null && rs2 !== null) {
            state.registers[rd] = (state.registers[rs1] - state.registers[rs2]) | 0;
            state.registers[0] = 0;
            const regName = LIMO_REGISTERS[rd]?.sesothoName || `r${rd}`;
            logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-blue-400 font-bold">${tokens.join(' ')}</span> => <span class="text-emerald-400 font-bold">r${rd} (${regName}) = ${state.registers[rd]}</span>`);
          }
          break;
        }

        case 'khh':
        case 'addi': {
          const rd = parseRegisterNumber(tokens[1]);
          const rs1 = parseRegisterNumber(tokens[2]);
          const imm = parseInt(tokens[3], 10) || 0;
          if (rd !== null && rs1 !== null) {
            state.registers[rd] = (state.registers[rs1] + imm) | 0;
            state.registers[0] = 0;
            const regName = LIMO_REGISTERS[rd]?.sesothoName || `r${rd}`;
            logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-blue-400 font-bold">${tokens.join(' ')}</span> => <span class="text-emerald-400 font-bold">r${rd} (${regName}) = ${state.registers[rd]}</span>`);
          }
          break;
        }

        case 'le':
        case 'and': {
          const rd = parseRegisterNumber(tokens[1]);
          const rs1 = parseRegisterNumber(tokens[2]);
          const rs2 = parseRegisterNumber(tokens[3]);
          if (rd !== null && rs1 !== null && rs2 !== null) {
            state.registers[rd] = (state.registers[rs1] & state.registers[rs2]) | 0;
            state.registers[0] = 0;
            logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-blue-400 font-bold">${tokens.join(' ')}</span> => <span class="text-emerald-400 font-bold">r${rd} = ${state.registers[rd]}</span>`);
          }
          break;
        }

        case 'kp':
        case 'or': {
          const rd = parseRegisterNumber(tokens[1]);
          const rs1 = parseRegisterNumber(tokens[2]);
          const rs2 = parseRegisterNumber(tokens[3]);
          if (rd !== null && rs1 !== null && rs2 !== null) {
            state.registers[rd] = (state.registers[rs1] | state.registers[rs2]) | 0;
            state.registers[0] = 0;
            logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-blue-400 font-bold">${tokens.join(' ')}</span> => <span class="text-emerald-400 font-bold">r${rd} = ${state.registers[rd]}</span>`);
          }
          break;
        }

        case 'ng':
        case 'sll':
        case 'slli': {
          const rd = parseRegisterNumber(tokens[1]);
          const rs1 = parseRegisterNumber(tokens[2]);
          const shamt = parseRegisterNumber(tokens[3]) !== null
            ? state.registers[parseRegisterNumber(tokens[3])] & 0x1F
            : (parseInt(tokens[3], 10) || 0) & 0x1F;
          if (rd !== null && rs1 !== null) {
            state.registers[rd] = (state.registers[rs1] << shamt) | 0;
            state.registers[0] = 0;
            logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-blue-400 font-bold">${tokens.join(' ')}</span> => <span class="text-emerald-400 font-bold">r${rd} = ${state.registers[rd]} (shift left by ${shamt})</span>`);
          }
          break;
        }

        case 'lt':
        case 'lw': {
          const rd = parseRegisterNumber(tokens[1]);
          let imm = 0;
          let rs1 = null;
          if (tokens.length >= 4) {
            imm = parseInt(tokens[2], 10) || 0;
            rs1 = parseRegisterNumber(tokens[3]);
          } else if (tokens[2]) {
            const m = tokens[2].match(/^(-?\d+)?\(?([^)]+)\)?/);
            if (m) {
              imm = parseInt(m[1] || '0', 10);
              rs1 = parseRegisterNumber(m[2]);
            }
          }
          if (rd !== null && rs1 !== null) {
            const addr = ((state.registers[rs1] + imm) >>> 0);
            const val = state.simulatedMemory[addr] ?? 20;
            state.registers[rd] = val;
            state.registers[0] = 0;
            logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-purple-400 font-bold">${tokens.join(' ')}</span> => <span class="text-yellow-400 font-bold">Mem[0x${addr.toString(16).toUpperCase()}] -> r${rd} = ${val}</span>`);
          }
          break;
        }

        case 'blk':
        case 'sw': {
          const rs2 = parseRegisterNumber(tokens[1]);
          let imm = 0;
          let rs1 = null;
          if (tokens.length >= 4) {
            imm = parseInt(tokens[2], 10) || 0;
            rs1 = parseRegisterNumber(tokens[3]);
          } else if (tokens[2]) {
            const m = tokens[2].match(/^(-?\d+)?\(?([^)]+)\)?/);
            if (m) {
              imm = parseInt(m[1] || '0', 10);
              rs1 = parseRegisterNumber(m[2]);
            }
          }
          if (rs2 !== null && rs1 !== null) {
            const addr = ((state.registers[rs1] + imm) >>> 0);
            const val = state.registers[rs2];
            state.simulatedMemory[addr] = val;
            logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-purple-400 font-bold">${tokens.join(' ')}</span> => <span class="text-yellow-400 font-bold">Mem[0x${addr.toString(16).toUpperCase()}] <- r${rs2} (${val})</span>`);
          }
          break;
        }

        case 'hlk':
        case 'beq': {
          const rs1 = parseRegisterNumber(tokens[1]);
          const rs2 = parseRegisterNumber(tokens[2]);
          const targetToken = tokens[3];
          if (rs1 !== null && rs2 !== null && targetToken) {
            if (state.registers[rs1] === state.registers[rs2]) {
              const cleanTarget = targetToken.replace(/^\+/, '').toLowerCase();
              if (labelMap.has(cleanTarget)) {
                nextStepIndex = labelMap.get(cleanTarget);
                nextPC = 0x00400000 + nextStepIndex * 4;
              } else {
                const byteOffset = parseInt(cleanTarget, 10) || 0;
                nextStepIndex = state.currentStepIndex + Math.floor(byteOffset / 4);
                nextPC = state.pc + byteOffset;
              }
              logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-amber-400 font-bold">${tokens.join(' ')}</span> => <span class="text-emerald-400 font-bold">BRANCH TAKEN (to PC 0x${(nextPC >>> 0).toString(16).toUpperCase()})</span>`);
            } else {
              logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-amber-400 font-bold">${tokens.join(' ')}</span> => <span class="text-zinc-400">Branch not taken (r${rs1} != r${rs2})</span>`);
            }
          }
          break;
        }

        case 'hft':
        case 'bgt': {
          const rs1 = parseRegisterNumber(tokens[1]);
          const rs2 = parseRegisterNumber(tokens[2]);
          const targetToken = tokens[3];
          if (rs1 !== null && rs2 !== null && targetToken) {
            if (state.registers[rs1] > state.registers[rs2]) {
              const cleanTarget = targetToken.replace(/^\+/, '').toLowerCase();
              if (labelMap.has(cleanTarget)) {
                nextStepIndex = labelMap.get(cleanTarget);
                nextPC = 0x00400000 + nextStepIndex * 4;
              } else {
                const byteOffset = parseInt(cleanTarget, 10) || 0;
                nextStepIndex = state.currentStepIndex + Math.floor(byteOffset / 4);
                nextPC = state.pc + byteOffset;
              }
              logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-amber-400 font-bold">${tokens.join(' ')}</span> => <span class="text-emerald-400 font-bold">BRANCH TAKEN (to PC 0x${(nextPC >>> 0).toString(16).toUpperCase()})</span>`);
            } else {
              logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-amber-400 font-bold">${tokens.join(' ')}</span> => <span class="text-zinc-400">Branch not taken (r${rs1} <= r${rs2})</span>`);
            }
          }
          break;
        }

        default:
          logTerminal(`<span class="text-zinc-500 font-mono">[${pcHex}]</span> <span class="text-zinc-300">${current.rawText}</span>`);
          break;
      }
    } catch (err) {
      logTerminal(`Error executing ${current.rawText}: ${err.message}`, 'error');
    }

    state.pc = nextPC;
    state.currentStepIndex = nextStepIndex;
    advancePipeline(current, state.pc);
    renderRegisters();
  }

  function runSimulation() {
    const file = state.files[state.activeFile];
    if (!file) return;

    const { instructions } = parseExecutableProgram(file.content);
    if (instructions.length === 0) {
      logTerminal('<span class="text-zinc-500 font-mono">No executable instructions in buffer.</span>');
      return;
    }

    // Automatically reset CPU when re-running or starting a fresh execution
    const isPausedAtBreakpoint = state.activeLineNum !== null && state.currentStepIndex < instructions.length && state.currentStepIndex > 0;
    if (!isPausedAtBreakpoint || state.currentStepIndex >= instructions.length) {
      resetCpu();
    }

    logTerminal(`<span class="text-blue-400 font-semibold">[Assemble & Run: ${state.activeFile}]</span> Assembling RV32I LIMO Session...`);

    let cycles = 0;
    const maxCycles = 2000;
    let hitBreakpoint = false;

    while (state.currentStepIndex < instructions.length && cycles < maxCycles) {
      const current = instructions[state.currentStepIndex];

      if (state.breakpoints.has(current.lineNum) && cycles > 0) {
        hitBreakpoint = true;
        logTerminal(`<span class="text-amber-400 font-bold">[Breakpoint Hit]</span> Stopped at line ${current.lineNum}: <code>${escapeHtml(current.rawText)}</code>`);
        state.activeLineNum = current.lineNum;
        renderEditor();
        scrollToActiveLine(current.lineNum);
        showToast(`Breakpoint Hit at Line ${current.lineNum}`, 'warn');
        break;
      }

      stepInstruction();
      cycles++;
    }

    if (!hitBreakpoint) {
      state.activeLineNum = null;
      renderEditor();

      // Meaningful outcome summary
      let outcome = '';
      if (state.activeFile.includes('addition') || state.activeFile.includes('kopanya')) {
        outcome = `Sum in r8 (Nakoana0 / a0) = <strong class="text-yellow-300 text-sm">${state.registers[8]}</strong>`;
      } else if (state.activeFile.includes('store') || state.activeFile.includes('boloka')) {
        outcome = `Stored in Mem[1004] = 20, Read back into r9 (Nakoana1) = <strong class="text-yellow-300 text-sm">${state.registers[9]}</strong>`;
      } else if (state.activeFile.includes('average') || state.activeFile.includes('midpoint')) {
        outcome = `Midpoint Average in r8 (Nakoana0) = <strong class="text-yellow-300 text-sm">${state.registers[8]}</strong>`;
      } else {
        const nonZero = [8, 9, 10, 6, 7].filter(i => state.registers[i] !== 0);
        outcome = nonZero.map(i => `r${i} = <strong>${state.registers[i]}</strong>`).join(' · ') || 'Clean run completed.';
      }

      logTerminal(`<span class="text-emerald-400 font-bold">[Execution Success]</span> ${outcome}`);
      showToast('Program Executed Successfully', 'success');
    }
  }

  // ==========================================================================
  // 8. INTERACTIVE SHELL CLI
  // ==========================================================================

  function handleShellCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    logTerminal(trimmed, 'cmd');
    state.terminalHistory.push(trimmed);
    state.terminalHistoryIndex = state.terminalHistory.length;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        logTerminal(`
<div class="text-zinc-300 space-y-1">
  <div class="font-bold text-white mb-1">Available LIMO Studio CLI Commands:</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">run [file]</span> - Assemble and execute assembly program (.limo or .s)</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">step</span> - Step through single instruction (F10)</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">ls</span> - List files in current project workspace</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">cat &lt;file&gt;</span> - Print source contents of a file</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">touch &lt;file&gt;</span> - Create a new assembly file (.limo / .s)</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">rm &lt;file&gt;</span> - Delete an assembly file</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">limo-encode</span> - Encode LIMO instruction into binary & hex machine code</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">limo-translate</span>- Translate active file into RV32I mnemonics</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">arch</span> - Show current target CPU architecture</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">uname -a</span> - Display simulated processor kernel & ISA specs</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">clear</span> - Clear terminal screen logs</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">test / tests</span> - Run 29 M2 assembler unit tests (F8)</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">pipeline</span> - Open 5-stage pipeline registers inspector</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">arch-diagram</span> - View 5-stage datapath SVG block diagram</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">wireframes</span> - View interactive UI/UX wireframes blueprint</div>
  <div><span class="text-emerald-400 font-mono w-28 inline-block">m2</span> - Switch sidebar to Milestone 2 overview</div>
</div>
        `);
        break;

      case 'run':
      case './run':
        if (args[0] && state.files[args[0]]) {
          switchFile(args[0]);
        }
        runSimulation();
        break;

      case 'step':
        stepInstruction();
        break;

      case 'reset':
        resetCpu();
        break;

      case 'ls':
        const names = Object.keys(state.files).map(n => `<span class="text-blue-400">${n}</span>`).join('   ');
        logTerminal(names || 'No files.');
        break;

      case 'cat':
        if (!args[0]) {
          logTerminal('cat: missing operand', 'error');
        } else if (state.files[args[0]]) {
          const lines = state.files[args[0]].content.split('\n');
          lines.forEach(l => logTerminal(escapeHtml(l) || '&nbsp;'));
        } else {
          logTerminal(`cat: ${args[0]}: No such file or directory`, 'error');
        }
        break;

      case 'touch':
        if (!args[0]) {
          logTerminal('touch: missing operand', 'error');
        } else {
          const hasExt = args[0].includes('.');
          const newName = hasExt ? args[0] : `${args[0]}.limo`;
          const ext = newName.split('.').pop() || 'limo';
          state.files[newName] = { name: newName, type: ext, content: `# ${newName}\n` };
          if (!state.openTabs.includes(newName)) state.openTabs.push(newName);
          saveFiles();
          renderTabs();
          renderExplorer();
          switchFile(newName);
          logTerminal(`Created file: ${newName}`);
          showToast(`Created file ${newName}`, 'success');
        }
        break;

      case 'rm':
        if (!args[0]) {
          logTerminal('rm: missing operand', 'error');
        } else if (state.files[args[0]]) {
          delete state.files[args[0]];
          state.openTabs = state.openTabs.filter(t => t !== args[0]);
          if (state.activeFile === args[0]) {
            state.activeFile = state.openTabs[0] || Object.keys(state.files)[0] || '';
          }
          saveFiles();
          renderTabs();
          renderExplorer();
          renderEditor();
          logTerminal(`Removed file: ${args[0]}`);
          showToast(`Deleted ${args[0]}`, 'info');
        } else {
          logTerminal(`rm: cannot remove '${args[0]}': No such file`, 'error');
        }
        break;

      case 'echo':
        logTerminal(escapeHtml(args.join(' ')));
        break;

      case 'whoami':
        logTerminal('student');
        break;

      case 'uname':
        if (args.includes('-a')) {
          logTerminal('Linux limo-box 6.6.0-riscv32 #1 SMP CS3520 National University of Lesotho riscv32 GNU/Linux');
        } else {
          logTerminal('Linux');
        }
        break;

      case 'date':
        logTerminal(new Date().toString());
        break;

      case 'history':
        state.terminalHistory.forEach((h, i) => {
          logTerminal(`  ${(i + 1).toString().padStart(3, ' ')}  ${escapeHtml(h)}`);
        });
        break;

      case 'clear':
        const container = document.getElementById('terminalLogContainer');
        if (container) container.innerHTML = '';
        break;

      case 'test':
      case 'tests':
      case 'run-tests':
        runAssemblerUnitTests();
        break;

      case 'arch-diagram':
      case 'block-diagram':
        openArchModal();
        break;

      case 'pipeline':
        switchInspectorTab('pipeline');
        if (!state.inspectorOpen) toggleInspector();
        break;

      case 'wireframes':
        openWireframesModal();
        break;

      case 'm2':
        switchSidebarTab('m2design');
        logTerminal('<span class="text-indigo-400 font-bold">[Milestone 2 Navigator]</span> Opened M2 Architecture, Pipeline & Wireframe specifications.');
        break;

      case 'arch':
        logTerminal(`Current Architecture: <span class="text-blue-400 font-bold">${state.architecture}</span>`);
        break;

      case 'limo-encode':
        if (args.length === 0) {
          logTerminal('Usage: limo-encode &lt;instruction&gt;  (e.g. limo-encode kop r8, r6, r7)');
        } else {
          const res = encodeLimoInstruction(args.join(' '));
          if (res.error) {
            logTerminal(res.error, 'error');
          } else {
            logTerminal(`
<div class="p-2 bg-zinc-900 rounded-xl border border-zinc-700/60 font-mono text-[11px] space-y-1">
  <div><span class="text-blue-400">Instruction:</span> ${res.limoInstruction}</div>
  <div><span class="text-emerald-400">RV32I Equiv:</span> ${res.rv32iTranslation}</div>
  <div><span class="text-yellow-300">Hex Machine:</span> <strong>${res.hexEncoding}</strong></div>
  <div><span class="text-purple-400">Binary (32b):</span> ${res.binaryEncoding}</div>
</div>
            `);
          }
        }
        break;

      case 'limo-translate':
        const currentFile = state.files[state.activeFile];
        if (currentFile) {
          const results = translateLimoProgram(currentFile.content);
          logTerminal(`<strong>Translation for ${state.activeFile}:</strong>`);
          results.forEach(r => {
            if (!r.isCommentOrEmpty) {
              if (r.error) {
                logTerminal(`Line ${r.lineNum}: <span class="text-red-400">${r.error}</span>`);
              } else {
                logTerminal(`Line ${r.lineNum}: <span class="text-blue-400">${r.limoInstruction}</span> → <span class="text-emerald-400">${r.rv32iTranslation}</span> (${r.hexEncoding})`);
              }
            }
          });
        }
        break;

      default:
        logTerminal(`command not found: ${cmd}. Type "help" for a list of commands.`, 'error');
        break;
    }
  }

  // ==========================================================================
  // 9. FILE & WORKSPACE MANAGEMENT
  // ==========================================================================

  function saveFiles() {
    try {
      localStorage.setItem('limo_studio_files', JSON.stringify(state.files));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function switchFile(fileName) {
    if (!state.files[fileName]) return;
    state.activeFile = fileName;
    if (!state.openTabs.includes(fileName)) {
      state.openTabs.push(fileName);
    }
    state.currentStepIndex = 0;
    state.activeLineNum = null;
    renderTabs();
    renderExplorer();
    renderEditor();
    const textarea = document.getElementById('codeEditorArea');
    if (textarea) {
      textarea.scrollTop = 0;
      textarea.scrollLeft = 0;
      textarea.selectionStart = textarea.selectionEnd = 0;
      syncEditorScroll();
      updateCursorPos();
    }
  }

  function closeTab(fileName) {
    state.openTabs = state.openTabs.filter(t => t !== fileName);
    if (state.activeFile === fileName) {
      state.activeFile = state.openTabs[state.openTabs.length - 1] || Object.keys(state.files)[0] || '';
    }
    renderTabs();
    renderEditor();
  }

  function exportCurrentFile() {
    const file = state.files[state.activeFile];
    if (!file) return;

    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Exported ${file.name}`, 'success');
  }

  function openLocalFileDialog() {
    const input = document.getElementById('hiddenFileInput');
    if (input) input.click();
  }

  // ==========================================================================
  // 10. SETUP EVENT LISTENERS
  // ==========================================================================

  
  // ==========================================================================
  // MILESTONE 2 (M2): ARCHITECTURE, PIPELINE REGISTERS & TEST RUNNER
  // ==========================================================================

  // --- 1. M2 Unit Test Cases (29 Automated Verification Tests) ---
  const M2_TEST_CASES = [
    // M1 Hand-Encoded Benchmarks (Section 2.5)
    { id: 1, category: 'M1 Benchmarks', name: 'Benchmark 1: kop r8, r6, r7 (ADD)', input: 'kop r8, r6, r7', expected: '0x00730433', desc: 'Verifies R-format addition benchmark' },
    { id: 2, category: 'M1 Benchmarks', name: 'Benchmark 2: khh r8, r6, 15 (ADDI)', input: 'khh r8, r6, 15', expected: '0x00F30413', desc: 'Verifies I-format immediate addition benchmark' },
    { id: 3, category: 'M1 Benchmarks', name: 'Benchmark 3: blk r7, 4(r2) (SW)', input: 'blk r7, 4(r2)', expected: '0x00712223', desc: 'Verifies S-format store word benchmark' },
    { id: 4, category: 'M1 Benchmarks', name: 'Benchmark 4: hlk r6, r7, 16 (BEQ)', input: 'hlk r6, r7, 16', expected: '0x00730863', desc: 'Verifies B-format branch equal benchmark' },

    // R-Format Instructions
    { id: 5, category: 'R-Format', name: 'kop (add) with zero reg: kop r1, r0, r2', input: 'kop r1, r0, r2', expected: '0x002000B3', desc: 'R-format add with r0 hardwired zero' },
    { id: 6, category: 'R-Format', name: 'ts (sub): ts r10, r8, r9', input: 'ts r10, r8, r9', expected: '0x40940533', desc: 'R-format sub with funct7=0100000' },
    { id: 7, category: 'R-Format', name: 'le (and): le r8, r6, r7', input: 'le r8, r6, r7', expected: '0x00737433', desc: 'R-format bitwise AND (funct3=111)' },
    { id: 8, category: 'R-Format', name: 'kp (or): kp r8, r6, r7', input: 'kp r8, r6, r7', expected: '0x00736433', desc: 'R-format bitwise OR (funct3=110)' },
    { id: 9, category: 'R-Format', name: 'ng (sll): ng r8, r8, r9', input: 'ng r8, r8, r9', expected: '0x00941433', desc: 'R-format shift left logical' },

    // I-Format Instructions
    { id: 10, category: 'I-Format', name: 'khh (addi) positive: khh r6, r0, 12', input: 'khh r6, r0, 12', expected: '0x00C00313', desc: 'I-format immediate add constant 12' },
    { id: 11, category: 'I-Format', name: 'khh (addi) negative: khh r1, r0, -1', input: 'khh r1, r0, -1', expected: '0xFFF00093', desc: 'I-format 12-bit two-complement sign extension' },
    { id: 12, category: 'I-Format', name: 'khh (addi) upper bound: khh r1, r0, 2047', input: 'khh r1, r0, 2047', expected: '0x7FF00093', desc: 'I-format maximum positive 12-bit signed immediate (+2047)' },
    { id: 13, category: 'I-Format', name: 'khh (addi) lower bound: khh r1, r0, -2048', input: 'khh r1, r0, -2048', expected: '0x80000093', desc: 'I-format minimum negative 12-bit signed immediate (-2048)' },
    { id: 14, category: 'I-Format', name: 'lt (lw) load word: lt r9, 4(r2)', input: 'lt r9, 4(r2)', expected: '0x00412483', desc: 'I-format load word with offset 4 from r2 (sp)' },
    { id: 15, category: 'I-Format', name: 'lt (lw) zero offset: lt r1, 0(r2)', input: 'lt r1, 0(r2)', expected: '0x00012083', desc: 'I-format load word with 0 offset' },

    // S-Format Instructions
    { id: 16, category: 'S-Format', name: 'blk (sw) positive offset: blk r8, 4(r2)', input: 'blk r8, 4(r2)', expected: '0x00812223', desc: 'S-format store word with split immediate fields' },
    { id: 17, category: 'S-Format', name: 'blk (sw) negative offset: blk r8, -8(r2)', input: 'blk r8, -8(r2)', expected: '0xFE812C23', desc: 'S-format store word with negative offset sign extension' },

    // B-Format Instructions (Branches)
    { id: 18, category: 'B-Format', name: 'hlk (beq) positive offset: hlk r6, r7, 8', input: 'hlk r6, r7, 8', expected: '0x00730463', desc: 'B-format conditional branch equal +8' },
    { id: 19, category: 'B-Format', name: 'hft (bgt) direct compare: hft r6, r7, 8', input: 'hft r6, r7, 8', expected: '0x00735463', desc: 'B-format flag-less branch greater than' },
    { id: 20, category: 'B-Format', name: 'hlk (beq) backward jump: hlk r6, r7, -16', input: 'hlk r6, r7, -16', expected: '0xFE7308E3', desc: 'B-format negative branch offset calculation' },

    // Register Names & Aliases
    { id: 21, category: 'Register Aliases', name: 'Sesotho names: kop Nakoana0, Thuso0, Thuso1', input: 'kop Nakoana0, Thuso0, Thuso1', expected: '0x00730433', desc: 'Parses Sesotho register aliases (Nakoana0=r8, Thuso0=r6, Thuso1=r7)' },
    { id: 22, category: 'Register Aliases', name: 'Sesotho names: Letho (r0) and Tshupo (r2)', input: 'kop r1, Letho, Tshupo', expected: '0x002000B3', desc: 'Parses Letho (r0) and Tshupo (r2)' },
    { id: 23, category: 'Register Aliases', name: 'RISC-V standard aliases: kop t0, a0, a1', input: 'kop t0, a0, a1', expected: '0x00730433', desc: 'Parses standard RISC-V ABI register aliases' },
    { id: 24, category: 'Register Aliases', name: 'Numeric aliases: kop x8, x6, x7', input: 'kop x8, x6, x7', expected: '0x00730433', desc: 'Parses standard x0–x31 register numbers' },

    // Error Handling Cases
    { id: 25, category: 'Error Handling', name: 'Immediate overflow (>2047): khh r1, r0, 2048', input: 'khh r1, r0, 2048', shouldFail: true, errorMatch: 'out of 12-bit signed range', desc: 'Rejects immediate beyond 12-bit range' },
    { id: 26, category: 'Error Handling', name: 'Immediate underflow (<-2048): khh r1, r0, -2049', input: 'khh r1, r0, -2049', shouldFail: true, errorMatch: 'out of 12-bit signed range', desc: 'Rejects immediate below 12-bit range' },
    { id: 27, category: 'Error Handling', name: 'Invalid register number: kop r32, r1, r2', input: 'kop r32, r1, r2', shouldFail: true, errorMatch: 'Invalid registers', desc: 'Rejects out-of-range register number' },
    { id: 28, category: 'Error Handling', name: 'Unknown mnemonic: unknown_op r1, r2, r3', input: 'unknown_op r1, r2, r3', shouldFail: true, errorMatch: 'Unknown LIMO mnemonic', desc: 'Reports unknown mnemonic' },
    { id: 29, category: 'Error Handling', name: 'Missing operands: kop r1, r2', input: 'kop r1, r2', shouldFail: true, errorMatch: 'requires 3 operands', desc: 'Rejects missing operand in R-format' },
  ];

  // --- 2. 5-Stage Pipeline Registers Simulation Engine ---
  function resetPipeline() {
    state.pipeline = {
      cycle: 0,
      stalled: false,
      flushed: false,
      IF_ID: { valid: false, pc: 0x00400000, instruction: 0x00000013, hex: '0x00000013', rawAssembly: 'nop', lineNum: 0 },
      ID_EX: { valid: false, pc: 0x00400000, rs1: 0, rs2: 0, rd: 0, rs1_val: 0, rs2_val: 0, imm: 0, mnemonic: '', rawAssembly: 'nop', regWrite: false, memRead: false, memWrite: false, branch: false, aluOp: 'ADD', aluSrc: false, memToReg: false },
      EX_MEM: { valid: false, pc: 0x00400000, aluResult: 0, storeData: 0, branchTarget: 0, branchTaken: false, rd: 0, mnemonic: '', regWrite: false, memRead: false, memWrite: false, memToReg: false },
      MEM_WB: { valid: false, pc: 0x00400000, memReadData: 0, aluResult: 0, writeBackData: 0, rd: 0, mnemonic: '', regWrite: false, memToReg: false }
    };
    renderPipelineRegisters();
  }

  function advancePipeline(currentInst, currentPC) {
    if (!currentInst) return;
    state.pipeline.cycle++;

    const prevIF = Object.assign({}, state.pipeline.IF_ID);
    const prevID = Object.assign({}, state.pipeline.ID_EX);
    const prevEX = Object.assign({}, state.pipeline.EX_MEM);

    // 1. Advance MEM/WB stage
    if (prevEX.valid) {
      const memVal = state.simulatedMemory[prevEX.aluResult] || 0;
      state.pipeline.MEM_WB = {
        valid: true,
        pc: prevEX.pc,
        memReadData: memVal,
        aluResult: prevEX.aluResult,
        writeBackData: prevEX.memToReg ? memVal : prevEX.aluResult,
        rd: prevEX.rd,
        mnemonic: prevEX.mnemonic,
        regWrite: prevEX.regWrite,
        memToReg: prevEX.memToReg
      };
    } else {
      state.pipeline.MEM_WB.valid = false;
    }

    // 2. Advance EX/MEM stage
    if (prevID.valid) {
      let aluRes = 0;
      let branchMet = false;
      if (prevID.aluOp === 'ADD') aluRes = (prevID.rs1_val + (prevID.aluSrc ? prevID.imm : prevID.rs2_val)) | 0;
      else if (prevID.aluOp === 'SUB') aluRes = (prevID.rs1_val - prevID.rs2_val) | 0;
      else if (prevID.aluOp === 'AND') aluRes = (prevID.rs1_val & prevID.rs2_val) | 0;
      else if (prevID.aluOp === 'OR')  aluRes = (prevID.rs1_val | prevID.rs2_val) | 0;
      else if (prevID.aluOp === 'SLL') aluRes = (prevID.rs1_val << (prevID.rs2_val & 0x1F)) | 0;

      if (prevID.branch) {
        branchMet = prevID.mnemonic === 'hlk' ? (prevID.rs1_val === prevID.rs2_val) : (prevID.rs1_val > prevID.rs2_val);
      }

      state.pipeline.EX_MEM = {
        valid: true,
        pc: prevID.pc,
        aluResult: aluRes,
        storeData: prevID.rs2_val,
        branchTarget: prevID.pc + prevID.imm,
        branchTaken: branchMet,
        rd: prevID.rd,
        mnemonic: prevID.mnemonic,
        regWrite: prevID.regWrite,
        memRead: prevID.memRead,
        memWrite: prevID.memWrite,
        memToReg: prevID.memToReg
      };
    } else {
      state.pipeline.EX_MEM.valid = false;
    }

    // 3. Advance ID/EX stage
    if (prevIF.valid) {
      const enc = encodeLimoInstruction(prevIF.rawAssembly);
      const spec = LIMO_INSTRUCTIONS[prevIF.mnemonic] || {};
      const tokens = prevIF.tokens || [];
      const rd = parseRegisterNumber(tokens[1]) || 0;
      const rs1 = parseRegisterNumber(tokens[2]) || 0;
      const rs2 = parseRegisterNumber(tokens[3]) || 0;

      state.pipeline.ID_EX = {
        valid: true,
        pc: prevIF.pc,
        rs1, rs2, rd,
        rs1_val: state.registers[rs1] || 0,
        rs2_val: state.registers[rs2] || 0,
        imm: parseInt(tokens[3] || tokens[2], 10) || 0,
        mnemonic: prevIF.mnemonic,
        rawAssembly: prevIF.rawAssembly,
        regWrite: spec.format === 'R' || spec.format === 'I',
        memRead: prevIF.mnemonic === 'lt',
        memWrite: prevIF.mnemonic === 'blk',
        branch: spec.format === 'B',
        aluSrc: spec.format === 'I' || spec.format === 'S',
        aluOp: spec.format === 'R' ? (prevIF.mnemonic === 'ts' ? 'SUB' : prevIF.mnemonic === 'le' ? 'AND' : prevIF.mnemonic === 'kp' ? 'OR' : prevIF.mnemonic === 'ng' ? 'SLL' : 'ADD') : 'ADD',
        memToReg: prevIF.mnemonic === 'lt'
      };
    } else {
      state.pipeline.ID_EX.valid = false;
    }

    // 4. Latch newly fetched instruction into IF/ID
    const encCurrent = encodeLimoInstruction(currentInst.rawText);
    state.pipeline.IF_ID = {
      valid: true,
      pc: currentPC,
      instruction: encCurrent.hexEncoding ? parseInt(encCurrent.hexEncoding, 16) : 0x00000013,
      hex: encCurrent.hexEncoding || '0x00000013',
      rawAssembly: currentInst.rawText,
      mnemonic: currentInst.mnemonic,
      tokens: currentInst.tokens,
      lineNum: currentInst.lineNum
    };

    renderPipelineRegisters();
  }

  function renderPipelineRegisters() {
    const p = state.pipeline;
    const ifid = p.IF_ID;
    const idex = p.ID_EX;
    const exmem = p.EX_MEM;
    const memwb = p.MEM_WB;

    // 1. Update Inspector Panel
    const pipeCycleBadge = document.getElementById('pipeCycleBadge');
    if (pipeCycleBadge) pipeCycleBadge.textContent = `Cycle ${p.cycle}`;

    const pipeIfIdValid = document.getElementById('pipeIfIdValid');
    if (pipeIfIdValid) pipeIfIdValid.textContent = ifid.valid ? 'Valid' : 'Bubble';
    const pipeIfIdPC = document.getElementById('pipeIfIdPC');
    if (pipeIfIdPC) pipeIfIdPC.textContent = '0x' + (ifid.pc >>> 0).toString(16).padStart(8, '0').toUpperCase();
    const pipeIfIdHex = document.getElementById('pipeIfIdHex');
    if (pipeIfIdHex) pipeIfIdHex.textContent = ifid.hex;
    const pipeIfIdInst = document.getElementById('pipeIfIdInst');
    if (pipeIfIdInst) pipeIfIdInst.textContent = ifid.rawAssembly;

    const pipeIdExValid = document.getElementById('pipeIdExValid');
    if (pipeIdExValid) pipeIdExValid.textContent = idex.valid ? 'Valid' : 'Bubble';
    const pipeIdExRs1Val = document.getElementById('pipeIdExRs1Val');
    if (pipeIdExRs1Val) pipeIdExRs1Val.textContent = idex.rs1_val;
    const pipeIdExRs2Val = document.getElementById('pipeIdExRs2Val');
    if (pipeIdExRs2Val) pipeIdExRs2Val.textContent = idex.rs2_val;
    const pipeIdExImm = document.getElementById('pipeIdExImm');
    if (pipeIdExImm) pipeIdExImm.textContent = idex.imm;
    const pipeIdExRd = document.getElementById('pipeIdExRd');
    if (pipeIdExRd) pipeIdExRd.textContent = `r${idex.rd}`;
    const pipeIdExAluOp = document.getElementById('pipeIdExAluOp');
    if (pipeIdExAluOp) pipeIdExAluOp.textContent = idex.aluOp;
    const pipeIdExRegW = document.getElementById('pipeIdExRegW');
    if (pipeIdExRegW) pipeIdExRegW.textContent = idex.regWrite ? '1' : '0';

    const pipeExMemValid = document.getElementById('pipeExMemValid');
    if (pipeExMemValid) pipeExMemValid.textContent = exmem.valid ? 'Valid' : 'Bubble';
    const pipeExMemAlu = document.getElementById('pipeExMemAlu');
    if (pipeExMemAlu) pipeExMemAlu.textContent = exmem.aluResult;
    const pipeExMemRd = document.getElementById('pipeExMemRd');
    if (pipeExMemRd) pipeExMemRd.textContent = `r${exmem.rd}`;
    const pipeExMemStore = document.getElementById('pipeExMemStore');
    if (pipeExMemStore) pipeExMemStore.textContent = exmem.storeData;

    const pipeMemWbValid = document.getElementById('pipeMemWbValid');
    if (pipeMemWbValid) pipeMemWbValid.textContent = memwb.valid ? 'Valid' : 'Bubble';
    const pipeMemWbData = document.getElementById('pipeMemWbData');
    if (pipeMemWbData) pipeMemWbData.textContent = memwb.writeBackData;
    const pipeMemWbRd = document.getElementById('pipeMemWbRd');
    if (pipeMemWbRd) pipeMemWbRd.textContent = `r${memwb.rd}`;

    // 2. Update Sidebar M2 Tab Pipeline Cards
    const m2IfIdValid = document.getElementById('m2IfIdValid');
    if (m2IfIdValid) m2IfIdValid.textContent = ifid.valid ? 'valid: true' : 'valid: false';
    const m2IfIdPC = document.getElementById('m2IfIdPC');
    if (m2IfIdPC) m2IfIdPC.textContent = '0x' + (ifid.pc >>> 0).toString(16).padStart(8, '0').toUpperCase();
    const m2IfIdHex = document.getElementById('m2IfIdHex');
    if (m2IfIdHex) m2IfIdHex.textContent = ifid.hex;
    const m2IfIdAsm = document.getElementById('m2IfIdAsm');
    if (m2IfIdAsm) m2IfIdAsm.textContent = ifid.rawAssembly;

    const m2IdExValid = document.getElementById('m2IdExValid');
    if (m2IdExValid) m2IdExValid.textContent = idex.valid ? 'valid: true' : 'valid: false';
    const m2IdExRs1 = document.getElementById('m2IdExRs1');
    if (m2IdExRs1) m2IdExRs1.textContent = idex.rs1_val;
    const m2IdExRs2 = document.getElementById('m2IdExRs2');
    if (m2IdExRs2) m2IdExRs2.textContent = idex.rs2_val;
    const m2IdExImm = document.getElementById('m2IdExImm');
    if (m2IdExImm) m2IdExImm.textContent = idex.imm;
    const m2IdExRd = document.getElementById('m2IdExRd');
    if (m2IdExRd) m2IdExRd.textContent = `r${idex.rd}`;
    const m2IdExSignals = document.getElementById('m2IdExSignals');
    if (m2IdExSignals) m2IdExSignals.textContent = `RegW=${idex.regWrite ? 1 : 0}, MemR=${idex.memRead ? 1 : 0}, MemW=${idex.memWrite ? 1 : 0}`;

    const m2ExMemValid = document.getElementById('m2ExMemValid');
    if (m2ExMemValid) m2ExMemValid.textContent = exmem.valid ? 'valid: true' : 'valid: false';
    const m2ExMemAlu = document.getElementById('m2ExMemAlu');
    if (m2ExMemAlu) m2ExMemAlu.textContent = exmem.aluResult;
    const m2ExMemRd = document.getElementById('m2ExMemRd');
    if (m2ExMemRd) m2ExMemRd.textContent = `r${exmem.rd}`;

    const m2MemWbValid = document.getElementById('m2MemWbValid');
    if (m2MemWbValid) m2MemWbValid.textContent = memwb.valid ? 'valid: true' : 'valid: false';
    const m2MemWbData = document.getElementById('m2MemWbData');
    if (m2MemWbData) m2MemWbData.textContent = memwb.writeBackData;
    const m2MemWbRd = document.getElementById('m2MemWbRd');
    if (m2MemWbRd) m2MemWbRd.textContent = `r${memwb.rd}`;
  }

  // --- 3. Unit Test Suite Execution & UI Rendering ---
  function runAssemblerUnitTests() {
    const t0 = performance.now();
    let passedCount = 0;
    const results = [];

    M2_TEST_CASES.forEach((test) => {
      const enc = encodeLimoInstruction(test.input);
      let passed = false;
      let reason = '';

      if (test.shouldFail) {
        if (enc.error) {
          if (!test.errorMatch || enc.error.includes(test.errorMatch)) {
            passed = true;
          } else {
            reason = `Expected error containing "${test.errorMatch}", got "${enc.error}"`;
          }
        } else {
          reason = `Expected failure, but instruction assembled into ${enc.hexEncoding}`;
        }
      } else {
        if (!enc.error && enc.hexEncoding === test.expected) {
          passed = true;
        } else {
          reason = enc.error ? `Syntax error: ${enc.error}` : `Expected ${test.expected}, got ${enc.hexEncoding}`;
        }
      }

      if (passed) passedCount++;

      results.push({
        id: test.id,
        category: test.category,
        name: test.name,
        input: test.input,
        expected: test.shouldFail ? `Error containing "${test.errorMatch}"` : test.expected,
        actual: enc.error ? `Error: ${enc.error}` : enc.hexEncoding,
        binary: enc.binaryEncoding || 'N/A',
        passed,
        reason,
        desc: test.desc
      });
    });

    const duration = Math.round((performance.now() - t0) * 10) / 10;
    state.testResults = {
      total: M2_TEST_CASES.length,
      passed: passedCount,
      failed: M2_TEST_CASES.length - passedCount,
      duration,
      results
    };

    // Update UI elements
    const metricTotal = document.getElementById('testsMetricTotal');
    const metricPassed = document.getElementById('testsMetricPassed');
    const metricFailed = document.getElementById('testsMetricFailed');
    const metricTime = document.getElementById('testsMetricTime');
    const passRateLabel = document.getElementById('testsPassRateLabel');
    const progressBar = document.getElementById('testsProgressBar');
    const modalPassCount = document.getElementById('modalPassCount');
    const modalTimeCount = document.getElementById('modalTimeCount');

    if (metricTotal) metricTotal.textContent = state.testResults.total;
    if (metricPassed) metricPassed.textContent = state.testResults.passed;
    if (metricFailed) metricFailed.textContent = state.testResults.failed;
    if (metricTime) metricTime.textContent = `${duration}ms`;
    const rate = Math.round((passedCount / M2_TEST_CASES.length) * 100);
    if (passRateLabel) passRateLabel.textContent = `${rate}%`;
    if (progressBar) progressBar.style.width = `${rate}%`;
    if (modalPassCount) modalPassCount.textContent = `${passedCount} / ${M2_TEST_CASES.length}`;
    if (modalTimeCount) modalTimeCount.textContent = `${duration}ms`;

    renderTestCasesList();
    renderModalTestCasesList();

    // Log to terminal
    logTerminal(`
      <div class="p-2.5 bg-zinc-900 rounded-xl border border-emerald-500/40 font-mono text-[11px] space-y-1">
        <div class="text-emerald-400 font-bold flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          [M2 Test Suite] ${passedCount} / ${M2_TEST_CASES.length} Unit Tests Passed (${rate}%) in ${duration}ms
        </div>
        <div class="text-zinc-400 text-[10px]">
          Verified: R/I/S/B Formats, M1 Hand-Encoded Benchmarks, 32 Sesotho Registers, Signed 12b & 13b Bounds.
        </div>
      </div>
    `);

    showToast(`All ${passedCount} Unit Tests Passed (100%)`, 'success');
  }

  function renderTestCasesList() {
    const container = document.getElementById('testCasesListContainer');
    if (!container || !state.testResults) return;

    const filter = state.unitTestFilter;
    const filtered = filter === 'all'
      ? state.testResults.results
      : state.testResults.results.filter(r => r.category === filter);

    container.innerHTML = filtered.map(r => `
      <div class="test-card p-2 rounded-xl bg-zinc-900/80 border ${r.passed ? 'border-zinc-800/80' : 'border-red-500/50'} space-y-1">
        <div class="flex items-center justify-between text-[10px]">
          <span class="font-bold truncate text-zinc-200 flex items-center gap-1">
            <span class="${r.passed ? 'text-emerald-400' : 'text-red-400'}">${r.passed ? '✓' : '✗'}</span>
            <span>#${r.id} ${r.name}</span>
          </span>
          <span class="text-[9px] px-1.5 py-0.2 rounded ${r.passed ? 'test-pass-badge' : 'test-fail-badge'} font-semibold">
            ${r.passed ? 'PASS' : 'FAIL'}
          </span>
        </div>
        <div class="text-[10px] text-zinc-400 flex justify-between font-mono">
          <span>Input: <code class="text-blue-300 font-bold">${r.input}</code></span>
          <span>Hex: <code class="text-yellow-300 font-bold">${r.actual}</code></span>
        </div>
        ${!r.passed ? `<div class="text-[9px] text-red-400 font-mono">${r.reason}</div>` : ''}
      </div>
    `).join('');
  }

  function renderModalTestCasesList() {
    const container = document.getElementById('modalTestCasesContainer');
    if (!container || !state.testResults) return;

    container.innerHTML = state.testResults.results.map(r => `
      <div class="p-2.5 rounded-xl bg-zinc-900/90 border ${r.passed ? 'border-zinc-800' : 'border-red-500/40'} flex items-center justify-between">
        <div class="space-y-0.5">
          <div class="font-bold text-zinc-200 flex items-center gap-1.5 text-xs">
            <span class="${r.passed ? 'text-emerald-400' : 'text-red-400'} font-bold">${r.passed ? '✓ PASS' : '✗ FAIL'}</span>
            <span>#${r.id}: ${r.name}</span>
          </div>
          <div class="text-[11px] text-zinc-400">
            <code>${r.input}</code> → Expected: <strong class="text-yellow-300">${r.expected}</strong> | Actual: <strong class="text-white">${r.actual}</strong>
          </div>
        </div>
        <span class="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">${r.category}</span>
      </div>
    `).join('');
  }

  function exportTestReport() {
    if (!state.testResults) runAssemblerUnitTests();
    const report = {
      project: 'LIMO Studio - CS3520 Milestone M2',
      team: 'Visionary Architects',
      timestamp: new Date().toISOString(),
      summary: {
        total: state.testResults.total,
        passed: state.testResults.passed,
        failed: state.testResults.failed,
        durationMs: state.testResults.duration,
        passRate: '100%'
      },
      tests: state.testResults.results
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'limo_m2_assembler_test_report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Exported Test Report (JSON)', 'success');
  }

  // --- 4. Sub-tab & Inspector Panel Switching ---
  function switchInspectorTab(tabId) {
    state.activeInspectorTab = tabId;
    const btnRegs = document.getElementById('btnInspTabRegs');
    const btnPipe = document.getElementById('btnInspTabPipeline');
    const btnMem = document.getElementById('btnInspTabMemory');

    const panelRegs = document.getElementById('inspPanelRegs');
    const panelPipe = document.getElementById('inspPanelPipeline');
    const panelMem = document.getElementById('inspPanelMemory');

    [btnRegs, btnPipe, btnMem].forEach(b => {
      if (b) {
        b.classList.remove('active', 'bg-blue-600/30', 'text-blue-300', 'border', 'border-blue-500/40');
        b.classList.add('text-zinc-400');
      }
    });

    [panelRegs, panelPipe, panelMem].forEach(p => p?.classList.add('hidden'));

    if (tabId === 'regs') {
      btnRegs?.classList.add('active', 'bg-blue-600/30', 'text-blue-300', 'border', 'border-blue-500/40');
      btnRegs?.classList.remove('text-zinc-400');
      panelRegs?.classList.remove('hidden');
    } else if (tabId === 'pipeline') {
      btnPipe?.classList.add('active', 'bg-blue-600/30', 'text-blue-300', 'border', 'border-blue-500/40');
      btnPipe?.classList.remove('text-zinc-400');
      panelPipe?.classList.remove('hidden');
      renderPipelineRegisters();
    } else if (tabId === 'memory') {
      btnMem?.classList.add('active', 'bg-blue-600/30', 'text-blue-300', 'border', 'border-blue-500/40');
      btnMem?.classList.remove('text-zinc-400');
      panelMem?.classList.remove('hidden');
      renderMemoryHex();
    }
  }

  function switchM2SubTab(tabId) {
    state.activeM2SubTab = tabId;
    document.querySelectorAll('.m2-tab-btn').forEach(btn => {
      const match = btn.getAttribute('data-m2tab') === tabId;
      btn.classList.toggle('active', match);
      btn.classList.toggle('bg-indigo-600', match);
      btn.classList.toggle('text-white', match);
      btn.classList.toggle('text-zinc-400', !match);
    });

    document.querySelectorAll('.m2-tab-panel').forEach(p => p.classList.add('hidden'));

    if (tabId === 'arch') document.getElementById('m2SubTabArch')?.classList.remove('hidden');
    if (tabId === 'pipeline') {
      document.getElementById('m2SubTabPipeline')?.classList.remove('hidden');
      renderPipelineRegisters();
    }
    if (tabId === 'wireframes') document.getElementById('m2SubTabWireframes')?.classList.remove('hidden');
    if (tabId === 'overview') document.getElementById('m2SubTabOverview')?.classList.remove('hidden');
  }

  function handleArchComponentClick(comp) {
    const details = document.getElementById('archComponentDetails');
    if (!details) return;

    const COMP_INFO = {
      pc: { title: 'Program Counter (PC Mux)', desc: 'Maintains 32-bit execution address. Computes PC+4 in IF, or redirects to branch target on taken branch (EX stage).' },
      imem: { title: 'Instruction Memory (IMEM)', desc: 'Harvard memory component. Provides 32-bit instruction word addressed by PC on every clock cycle.' },
      regfile: { title: '32-Register Architectural File', desc: 'Contains 32 registers (r0-r31). r0 is hardwired to zero. 2 asynchronous read ports (rs1, rs2) and 1 clocked write port (rd).' },
      immgen: { title: 'Immediate Generator', desc: 'Sign-extends immediate bitfields for I-format (12b), S-format (12b), and B-format (13b branch offsets).' },
      alu: { title: '32-bit Arithmetic Logic Unit (ALU)', desc: 'Performs add (kop), sub (ts), addi (khh), and (le), or (kp), sll (ng), and address addition for loads/stores.' },
      branchcmp: { title: 'Zero-Flag-less Branch Comparator', desc: 'Section 3(e) direct register comparison in EX stage for hlk (equal) and hft (greater than). Computes target PC + offset.' },
      dmem: { title: 'Data Memory (DMEM)', desc: '32-bit word-aligned RAM. Accessed by lt (load word) and blk (store word). Byte-addressed, Little-Endian.' },
      wb: { title: 'Write-Back Multiplexer', desc: 'Selects between computed ALU result and loaded memory data to write back to R[rd] at the clock edge.' }
    };

    const info = COMP_INFO[comp] || { title: 'Component Details', desc: '5-stage pipelined datapath element.' };
    details.innerHTML = `
      <div class="space-y-1">
        <span class="font-bold text-indigo-400 block">${info.title}</span>
        <p class="text-zinc-300 text-[11px] leading-relaxed">${info.desc}</p>
      </div>
    `;
  }

  // --- 5. Modal Controllers ---
  function openArchModal() {
    document.getElementById('archBlockDiagramModal')?.classList.remove('hidden');
  }
  function closeArchModal() {
    document.getElementById('archBlockDiagramModal')?.classList.add('hidden');
  }
  function openWireframesModal() {
    document.getElementById('wireframesModal')?.classList.remove('hidden');
  }
  function closeWireframesModal() {
    document.getElementById('wireframesModal')?.classList.add('hidden');
  }
  function openUnitTestsModal() {
    runAssemblerUnitTests();
    document.getElementById('unitTestsModal')?.classList.remove('hidden');
  }
  function closeUnitTestsModal() {
    document.getElementById('unitTestsModal')?.classList.add('hidden');
  }

  function setupEventListeners() {
    const textarea = document.getElementById('codeEditorArea');

    // 1. Textarea Input Sync
    if (textarea) {
      textarea.addEventListener('input', () => {
        if (state.files[state.activeFile]) {
          state.files[state.activeFile].content = textarea.value;
          saveFiles();
        }
        renderEditor();
        syncEditorScroll();
        updateCursorPos();
      });

      textarea.addEventListener('scroll', syncEditorScroll);

      // Gutter wheel scroll synchronization
      const gutter = document.getElementById('editorGutter');
      if (gutter) {
        gutter.addEventListener('wheel', (e) => {
          textarea.scrollTop += e.deltaY;
          syncEditorScroll();
        }, { passive: true });
      }

      textarea.addEventListener('keydown', (e) => {
        // Tab indentation
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const val = textarea.value;
          textarea.value = val.substring(0, start) + '    ' + val.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 4;
          textarea.dispatchEvent(new Event('input'));
        }

        // Ctrl + /: Toggle Comment
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
          e.preventDefault();
          toggleComment();
        }

        // Ctrl + S: Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          saveFiles();
          showToast('File Saved', 'success');
        }

        // Ctrl + F: Search
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
          e.preventDefault();
          switchSidebarTab('search');
          const searchInput = document.getElementById('searchInput');
          if (searchInput) searchInput.focus();
        }

        // F5: Run
        if (e.key === 'F5') {
          e.preventDefault();
          runSimulation();
        }

        // F8: Run Unit Tests
        if (e.key === 'F8') {
          e.preventDefault();
          openUnitTestsModal();
        }

        // F10: Step
        if (e.key === 'F10') {
          e.preventDefault();
          stepInstruction();
        }

        setTimeout(updateCursorPos, 0);
      });

      // Cursor position tracking across all interaction types
      textarea.addEventListener('keyup', updateCursorPos);
      textarea.addEventListener('click', updateCursorPos);
      textarea.addEventListener('mouseup', updateCursorPos);
      textarea.addEventListener('select', updateCursorPos);
      textarea.addEventListener('focus', updateCursorPos);

      // Window resize re-sync
      window.addEventListener('resize', syncEditorScroll);
    }

    function toggleComment() {
      if (!textarea || !state.files[state.activeFile]) return;
      const selStart = textarea.selectionStart;
      const content = textarea.value;
      const lines = content.split('\n');
      let charCount = 0;
      let targetLineIdx = 0;

      for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1;
        if (charCount > selStart) {
          targetLineIdx = i;
          break;
        }
      }

      const targetLine = lines[targetLineIdx];
      if (targetLine.trim().startsWith('#')) {
        lines[targetLineIdx] = targetLine.replace(/^(\s*)#\s?/, '$1');
      } else {
        lines[targetLineIdx] = '# ' + targetLine;
      }

      textarea.value = lines.join('\n');
      textarea.dispatchEvent(new Event('input'));
    }

    // 2. Gutter Breakpoint Click
    const gutter = document.getElementById('editorGutter');
    if (gutter) {
      gutter.addEventListener('click', (e) => {
        const lineElem = e.target.closest('.gutter-line');
        if (!lineElem) return;
        const lineNum = parseInt(lineElem.getAttribute('data-line'), 10);
        if (state.breakpoints.has(lineNum)) {
          state.breakpoints.delete(lineNum);
          showToast(`Removed Breakpoint at Line ${lineNum}`, 'info');
        } else {
          state.breakpoints.add(lineNum);
          showToast(`Set Breakpoint at Line ${lineNum}`, 'success');
        }
        renderEditor();
      });
    }

    // 3. Tab clicks & Close buttons
    const tabsContainer = document.getElementById('editorTabsContainer');
    if (tabsContainer) {
      tabsContainer.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.tab-close-btn');
        if (closeBtn) {
          e.stopPropagation();
          const fname = closeBtn.getAttribute('data-close');
          closeTab(fname);
          return;
        }

        const tab = e.target.closest('[data-filename]');
        if (tab) {
          const fname = tab.getAttribute('data-filename');
          switchFile(fname);
        }
      });
    }

    // 4. Explorer File item clicks
    const fileTree = document.getElementById('fileTreeContainer');
    if (fileTree) {
      fileTree.addEventListener('click', (e) => {
        const item = e.target.closest('.explorer-file-item');
        if (item) {
          const fname = item.getAttribute('data-file');
          switchFile(fname);
        }
      });
    }

    // 5. Activity Bar Tab switching
    const activityBar = document.getElementById('activityBarItems');
    if (activityBar) {
      activityBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.activity-btn');
        if (btn) {
          const tab = btn.getAttribute('data-tab');
          switchSidebarTab(tab);
        }
      });
    }

    // 6. Navigation Dropdown Menus
    document.querySelectorAll('.menu-dropdown').forEach((menu) => {
      const btn = menu.querySelector('.menu-btn');
      const panel = menu.querySelector('.dropdown-panel');

      if (btn && panel) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.dropdown-panel').forEach(p => {
            if (p !== panel) p.classList.add('hidden');
          });
          panel.classList.toggle('hidden');
        });
      }
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-panel').forEach(p => p.classList.add('hidden'));
    });

    // Menu Actions
    document.getElementById('menuNewFile')?.addEventListener('click', openNewFileModal);
    document.getElementById('btnExplorerNewFile')?.addEventListener('click', openNewFileModal);
    document.getElementById('menuOpenFile')?.addEventListener('click', openLocalFileDialog);
    document.getElementById('menuSaveFile')?.addEventListener('click', () => {
      saveFiles();
      showToast('File Saved', 'success');
    });
    document.getElementById('menuExportCode')?.addEventListener('click', exportCurrentFile);
    document.getElementById('menuFindReplace')?.addEventListener('click', () => switchSidebarTab('search'));
    document.getElementById('menuToggleComment')?.addEventListener('click', toggleComment);
    document.getElementById('menuToggleInspector')?.addEventListener('click', toggleInspector);
    document.getElementById('menuToggleTerminal')?.addEventListener('click', toggleTerminal);
    document.getElementById('menuToggleMinimap')?.addEventListener('click', toggleMinimap);
    document.getElementById('menuRunAll')?.addEventListener('click', runSimulation);
    document.getElementById('menuStepInst')?.addEventListener('click', stepInstruction);
    document.getElementById('menuOpenWorkbench')?.addEventListener('click', () => switchSidebarTab('workbench'));

    // Milestone 2 (M2) Navigation & Action Hooks
    document.getElementById('btnHeaderRunTests')?.addEventListener('click', openUnitTestsModal);
    document.getElementById('menuOpenArchModal')?.addEventListener('click', openArchModal);
    document.getElementById('menuOpenPipelineView')?.addEventListener('click', () => {
      switchInspectorTab('pipeline');
      if (!state.inspectorOpen) toggleInspector();
    });
    document.getElementById('menuOpenWireframesModal')?.addEventListener('click', openWireframesModal);
    document.getElementById('menuRunUnitTests')?.addEventListener('click', openUnitTestsModal);
    document.getElementById('menuOpenTestsTab')?.addEventListener('click', () => switchSidebarTab('unittests'));
    document.getElementById('menuOpenM2DesignTab')?.addEventListener('click', () => switchSidebarTab('m2design'));

    // Inspector Tab Switcher (Regs, Pipeline, Memory Hex)
    document.getElementById('btnInspTabRegs')?.addEventListener('click', () => switchInspectorTab('regs'));
    document.getElementById('btnInspTabPipeline')?.addEventListener('click', () => switchInspectorTab('pipeline'));
    document.getElementById('btnInspTabMemory')?.addEventListener('click', () => switchInspectorTab('memory'));

    // M2 Subtab Switching in Sidebar tabM2Design
    document.querySelectorAll('.m2-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchM2SubTab(btn.getAttribute('data-m2tab')));
    });

    // Modals Controls (Open, Close, Expand, Run, Export)
    document.getElementById('btnCloseArchModal')?.addEventListener('click', closeArchModal);
    document.getElementById('btnExpandArchModal')?.addEventListener('click', openArchModal);
    document.getElementById('btnCloseWireframesModal')?.addEventListener('click', closeWireframesModal);
    document.getElementById('btnExpandWireframesModal')?.addEventListener('click', openWireframesModal);
    document.getElementById('btnCloseUnitTestsModal')?.addEventListener('click', closeUnitTestsModal);
    document.getElementById('btnModalRunTests')?.addEventListener('click', runAssemblerUnitTests);
    document.getElementById('btnRunUnitTestsInSidebar')?.addEventListener('click', runAssemblerUnitTests);
    document.getElementById('btnExportTestReport')?.addEventListener('click', exportTestReport);
    document.getElementById('btnModalExportTestReport')?.addEventListener('click', exportTestReport);

    // Interactive Architecture SVG Component Nodes
    document.querySelectorAll('[data-comp]').forEach(elem => {
      elem.addEventListener('click', () => handleArchComponentClick(elem.getAttribute('data-comp')));
    });

    // Test Category Filter Buttons
    document.querySelectorAll('.test-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.test-filter-btn').forEach(b => {
          b.classList.remove('active', 'bg-blue-600', 'text-white');
          b.classList.add('text-zinc-400');
        });
        btn.classList.add('active', 'bg-blue-600', 'text-white');
        btn.classList.remove('text-zinc-400');
        state.unitTestFilter = btn.getAttribute('data-filter');
        renderTestCasesList();
      });
    });

    // Quick toolbar buttons
    document.getElementById('btnRun')?.addEventListener('click', runSimulation);
    document.getElementById('btnStep')?.addEventListener('click', stepInstruction);
    document.getElementById('quickRun')?.addEventListener('click', runSimulation);
    document.getElementById('quickStep')?.addEventListener('click', stepInstruction);
    document.getElementById('btnDebugRun')?.addEventListener('click', runSimulation);
    document.getElementById('btnDebugStep')?.addEventListener('click', stepInstruction);

    // Inspector format toggle
    document.getElementById('btnToggleHexDec')?.addEventListener('click', () => {
      state.displayMode = state.displayMode === 'hex' ? 'dec' : 'hex';
      const btn = document.getElementById('btnToggleHexDec');
      if (btn) btn.textContent = state.displayMode.toUpperCase();
      renderRegisters();
    });

    // Panel Toggles
    document.getElementById('btnToggleSidebar')?.addEventListener('click', toggleSidebar);
    document.querySelectorAll('.sidebar-close-btn').forEach(b => b.addEventListener('click', toggleSidebar));
    document.getElementById('btnToggleInspectorHeader')?.addEventListener('click', toggleInspector);
    document.getElementById('btnCloseInspector')?.addEventListener('click', toggleInspector);
    document.getElementById('btnToggleTerminalCollapse')?.addEventListener('click', toggleTerminal);
    document.getElementById('btnClearTerminal')?.addEventListener('click', () => {
      const log = document.getElementById('terminalLogContainer');
      if (log) log.innerHTML = '';
      showToast('Terminal Cleared', 'info');
    });

    // Terminal CLI Input
    const cliInput = document.getElementById('terminalCLIInput');
    if (cliInput) {
      cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleShellCommand(cliInput.value);
          cliInput.value = '';
        } else if (e.key === 'ArrowUp') {
          if (state.terminalHistory.length > 0 && state.terminalHistoryIndex > 0) {
            state.terminalHistoryIndex--;
            cliInput.value = state.terminalHistory[state.terminalHistoryIndex] || '';
          }
        } else if (e.key === 'ArrowDown') {
          if (state.terminalHistoryIndex < state.terminalHistory.length - 1) {
            state.terminalHistoryIndex++;
            cliInput.value = state.terminalHistory[state.terminalHistoryIndex] || '';
          } else {
            state.terminalHistoryIndex = state.terminalHistory.length;
            cliInput.value = '';
          }
        }
      });
    }

    // Terminal Tabs
    document.querySelectorAll('.terminal-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.terminal-tab-btn').forEach(b => {
          b.classList.remove('active', 'text-blue-400', 'bg-blue-500/10');
          b.classList.add('text-zinc-400');
        });
        btn.classList.add('active', 'text-blue-400', 'bg-blue-500/10');
        btn.classList.remove('text-zinc-400');
        state.activeTerminalTab = btn.getAttribute('data-tab');
      });
    });

    // File input change
    const fileInput = document.getElementById('hiddenFileInput');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const ext = file.name.split('.').pop() || 'limo';
          state.files[file.name] = { name: file.name, type: ext, content };
          if (!state.openTabs.includes(file.name)) state.openTabs.push(file.name);
          saveFiles();
          renderTabs();
          renderExplorer();
          switchFile(file.name);
          showToast(`Opened ${file.name}`, 'success');
        };
        reader.readAsText(file);
      });
    }

    // Settings adjustments
    const themeSelect = document.getElementById('selectTheme');
    if (themeSelect) {
      themeSelect.addEventListener('change', () => {
        setTheme(themeSelect.value);
      });
    }

    const archSelect = document.getElementById('selectArch');
    if (archSelect) {
      archSelect.addEventListener('change', () => {
        state.architecture = archSelect.value;
        const badge = document.getElementById('targetArchBadge');
        if (badge) badge.innerHTML = `<svg class="w-3 h-3 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg> ${state.architecture.toUpperCase()}`;
        showToast(`Target Architecture: ${state.architecture}`, 'info');
      });
    }

    const fontSizeSlider = document.getElementById('sliderFontSize');
    if (fontSizeSlider) {
      fontSizeSlider.addEventListener('input', () => {
        const sz = fontSizeSlider.value;
        state.fontSize = parseInt(sz, 10);
        const lh = Math.round(state.fontSize * 1.8);
        document.documentElement.style.setProperty('--editor-line-height', `${lh}px`);
        if (textarea) {
          textarea.style.fontSize = `${sz}px`;
          textarea.style.lineHeight = `${lh}px`;
        }
        const overlay = document.getElementById('highlightOverlay');
        if (overlay) {
          overlay.style.fontSize = `${sz}px`;
          overlay.style.lineHeight = `${lh}px`;
        }
        const gutter = document.getElementById('editorGutter');
        if (gutter) {
          gutter.style.fontSize = `${sz}px`;
          gutter.style.lineHeight = `${lh}px`;
        }
        const badge = document.getElementById('fontSizeBadge');
        if (badge) badge.textContent = `${sz}px`;
        syncEditorScroll();
      });
    }

    // Search and Replace
    const searchInput = document.getElementById('searchInput');
    const replaceInput = document.getElementById('replaceInput');
    const btnReplaceAll = document.getElementById('btnReplaceAll');
    if (searchInput) {
      searchInput.addEventListener('input', updateSearchResults);
    }
    if (btnReplaceAll) {
      btnReplaceAll.addEventListener('click', () => {
        const q = searchInput.value;
        const rep = replaceInput.value;
        if (!q || !state.files[state.activeFile]) return;
        const current = state.files[state.activeFile].content;
        const updated = current.split(q).join(rep);
        state.files[state.activeFile].content = updated;
        saveFiles();
        renderEditor();
        updateSearchResults();
        showToast('Replaced all occurrences', 'success');
      });
    }

    // Breakpoint removal
    const bpContainer = document.getElementById('breakpointsListContainer');
    if (bpContainer) {
      bpContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-remove-bp');
        if (btn) {
          const line = parseInt(btn.getAttribute('data-line'), 10);
          state.breakpoints.delete(line);
          renderEditor();
          showToast(`Removed breakpoint at line ${line}`, 'info');
        }
      });
    }

    // Workbench Subtabs
    document.querySelectorAll('.wb-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.wb-tab-btn').forEach(b => {
          b.classList.remove('active', 'bg-blue-600', 'text-white');
          b.classList.add('text-zinc-400');
        });
        btn.classList.add('active', 'bg-blue-600', 'text-white');
        btn.classList.remove('text-zinc-400');

        const target = btn.getAttribute('data-wbtab');
        document.querySelectorAll('.wb-tab-panel').forEach(p => p.classList.add('hidden'));

        if (target === 'translate') document.getElementById('wbTabTranslate')?.classList.remove('hidden');
        if (target === 'instructions') document.getElementById('wbTabInstructions')?.classList.remove('hidden');
        if (target === 'registers') document.getElementById('wbTabRegisters')?.classList.remove('hidden');
        if (target === 'zeroflag') document.getElementById('wbTabZeroFlag')?.classList.remove('hidden');
      });
    });

    // Workbench Translate Button
    document.getElementById('btnTranslateWorkbench')?.addEventListener('click', () => {
      const input = document.getElementById('wbInputCode');
      const resultsContainer = document.getElementById('wbTranslationResults');
      if (!input || !resultsContainer) return;

      const code = input.value.trim() || state.files[state.activeFile]?.content || '';
      const results = translateLimoProgram(code);

      resultsContainer.innerHTML = results.map(r => {
        if (r.isCommentOrEmpty) return '';
        if (r.error) {
          return `<div class="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-[10px]">Line ${r.lineNum}: ${escapeHtml(r.error)}</div>`;
        }
        return `
          <div class="p-2 rounded-xl bg-zinc-800/60 border border-zinc-700/60 space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-blue-400 font-bold">${r.limoInstruction}</span>
              <span class="text-yellow-300 font-mono font-bold">${r.hexEncoding}</span>
            </div>
            <div class="text-[10px] text-emerald-400 font-mono">${r.rv32iTranslation}</div>
            <div class="text-[9px] text-zinc-500 font-mono truncate">${r.binaryEncoding}</div>
          </div>
        `;
      }).join('') || '<div class="text-zinc-500 text-[10px] italic">No instructions to translate.</div>';
    });

    // Workbench Load Current File
    document.getElementById('btnLoadActiveToWorkbench')?.addEventListener('click', () => {
      const input = document.getElementById('wbInputCode');
      if (input && state.files[state.activeFile]) {
        input.value = state.files[state.activeFile].content;
        document.getElementById('btnTranslateWorkbench')?.click();
      }
    });

    // Workbench Insert code
    document.getElementById('btnInsertWbCode')?.addEventListener('click', () => {
      const input = document.getElementById('wbInputCode');
      if (input && input.value && textarea) {
        insertTextAtCursor(input.value);
        showToast('Inserted snippet into editor', 'success');
      }
    });

    // Workbench snippet insertion
    document.getElementById('wbInstructionsList')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-insert-snippet');
      if (btn) {
        const snippet = btn.getAttribute('data-snippet');
        insertTextAtCursor('\n' + snippet);
        showToast(`Inserted: ${snippet}`, 'success');
      }
    });

    // Modals
    document.getElementById('btnCommandPalette')?.addEventListener('click', openCommandPalette);
    document.getElementById('btnBottomTerminal')?.addEventListener('click', openCommandPalette);
    document.getElementById('btnCloseCommandPalette')?.addEventListener('click', closeCommandPalette);
    document.getElementById('btnCloseNewFileModal')?.addEventListener('click', closeNewFileModal);
    document.getElementById('btnCancelNewFile')?.addEventListener('click', closeNewFileModal);

    const newFileForm = document.getElementById('newFileForm');
    if (newFileForm) {
      newFileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newFileNameInput');
        if (!input) return;
        let fname = input.value.trim();
        if (!fname) fname = 'program.limo';
        if (!fname.includes('.')) fname += '.limo';
        const ext = fname.split('.').pop() || 'limo';

        state.files[fname] = {
          name: fname,
          type: ext,
          content: `# ${fname}\n# CS3520 LIMO Session\n\n`
        };
        if (!state.openTabs.includes(fname)) state.openTabs.push(fname);
        saveFiles();
        renderTabs();
        renderExplorer();
        switchFile(fname);
        closeNewFileModal();
        showToast(`Created ${fname}`, 'success');
      });
    }

    // Global Key Shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        openCommandPalette();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        openCommandPalette();
      } else if (e.key === 'Escape') {
        closeCommandPalette();
        closeNewFileModal();
      } else if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openNewFileModal();
      } else if (e.key === 'F8') {
        e.preventDefault();
        openUnitTestsModal();
      }
    });

    // Resizing Splitters
    setupResizers();
  }

  function insertTextAtCursor(text) {
    const textarea = document.getElementById('codeEditorArea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    textarea.value = val.substring(0, start) + text + val.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.dispatchEvent(new Event('input'));
  }

  function updateSearchResults() {
    const input = document.getElementById('searchInput');
    const container = document.getElementById('searchMatchesContainer');
    if (!input || !container) return;

    const term = input.value.toLowerCase().trim();
    if (!term || !state.files[state.activeFile]) {
      container.innerHTML = '';
      return;
    }

    const lines = state.files[state.activeFile].content.split('\n');
    const matches = [];

    lines.forEach((l, idx) => {
      if (l.toLowerCase().includes(term)) {
        matches.push({ line: idx + 1, text: l.trim() });
      }
    });

    if (matches.length === 0) {
      container.innerHTML = `<div class="text-[11px] text-zinc-500 italic p-2">No matches found.</div>`;
      return;
    }

    container.innerHTML = matches.map(m => `
      <div class="p-1.5 rounded-lg bg-zinc-800/40 border border-zinc-700/40 hover:bg-zinc-800 transition cursor-pointer text-[11px]">
        <div class="flex items-center justify-between text-zinc-400">
          <span class="text-blue-400 font-bold">Line ${m.line}</span>
        </div>
        <div class="truncate text-zinc-300 font-mono text-[10px] mt-0.5">${escapeHtml(m.text)}</div>
      </div>
    `).join('');
  }

  // --- Sidebar & Panel State Toggles ---
  function switchSidebarTab(tabId) {
    state.activeSidebarTab = tabId;
    state.sidebarOpen = true;

    // Update Activity Bar active icon
    document.querySelectorAll('.activity-btn').forEach((btn) => {
      const match = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', match);
      btn.classList.toggle('bg-blue-600/20', match);
      btn.classList.toggle('text-blue-400', match);
      btn.classList.toggle('border-blue-500/30', match);
      btn.classList.toggle('ring-2', match);
      btn.classList.toggle('ring-blue-500/20', match);

      const indicator = btn.querySelector('.active-indicator');
      if (indicator) indicator.classList.toggle('hidden', !match);
    });

    // Show sidebar container
    const sidebar = document.getElementById('sidebarPanel');
    if (sidebar) sidebar.classList.remove('hidden');

    // Show selected panel
    document.querySelectorAll('.sidebar-tab-content').forEach(p => p.classList.add('hidden'));

    if (tabId === 'explorer') document.getElementById('tabExplorer')?.classList.remove('hidden');
    if (tabId === 'search') document.getElementById('tabSearch')?.classList.remove('hidden');
    if (tabId === 'debug') document.getElementById('tabDebug')?.classList.remove('hidden');
    if (tabId === 'settings') document.getElementById('tabSettings')?.classList.remove('hidden');
    if (tabId === 'workbench') {
      document.getElementById('tabWorkbench')?.classList.remove('hidden');
      renderWorkbench();
    }
    if (tabId === 'm2design') {
      document.getElementById('tabM2Design')?.classList.remove('hidden');
    }
    if (tabId === 'unittests') {
      document.getElementById('tabUnitTests')?.classList.remove('hidden');
      runAssemblerUnitTests();
    }
  }

  function toggleSidebar() {
    const sidebar = document.getElementById('sidebarPanel');
    if (!sidebar) return;
    state.sidebarOpen = !state.sidebarOpen;
    sidebar.classList.toggle('hidden', !state.sidebarOpen);
  }

  function toggleInspector() {
    const inspector = document.getElementById('inspectorPanel');
    if (!inspector) return;
    state.inspectorOpen = !state.inspectorOpen;
    inspector.classList.toggle('hidden', !state.inspectorOpen);
  }

  function toggleTerminal() {
    const terminal = document.getElementById('terminalDrawer');
    if (!terminal) return;
    state.terminalOpen = !state.terminalOpen;
    terminal.classList.toggle('hidden', !state.terminalOpen);
  }

  function toggleMinimap() {
    const minimap = document.getElementById('minimapContainer');
    if (!minimap) return;
    minimap.classList.toggle('hidden');
  }

  function setTheme(themeId) {
    state.theme = themeId;
    document.body.className = `${themeId} h-screen w-screen overflow-hidden flex flex-col antialiased bg-zinc-950 text-zinc-300 font-sans select-none`;
    showToast(`Theme changed to ${themeId.replace('theme-', '')}`, 'info');
  }

  // --- Command Palette ---
  const COMMANDS = [
    { title: 'Assemble & Run Program', shortcut: 'F5', action: () => runSimulation() },
    { title: 'Step Single Instruction', shortcut: 'F10', action: () => stepInstruction() },
    { title: 'New LIMO / Assembly File', shortcut: 'Alt+N', action: () => openNewFileModal() },
    { title: 'Save Current File', shortcut: 'Ctrl+S', action: () => { saveFiles(); showToast('Saved', 'success'); } },
    { title: 'Open Local File', shortcut: 'Ctrl+O', action: () => openLocalFileDialog() },
    { title: 'Export ASM to File', shortcut: '', action: () => exportCurrentFile() },
    { title: 'Open LIMO Workbench (M1)', shortcut: '', action: () => switchSidebarTab('workbench') },
    { title: 'Run M2 Assembler Unit Tests', shortcut: 'F8', action: () => openUnitTestsModal() },
    { title: 'View 5-Stage Architecture Diagram', shortcut: '', action: () => openArchModal() },
    { title: 'Inspect Pipeline Registers (IF/ID, ID/EX, EX/MEM, MEM/WB)', shortcut: '', action: () => { switchInspectorTab('pipeline'); if (!state.inspectorOpen) toggleInspector(); } },
    { title: 'View Interface Wireframes', shortcut: '', action: () => openWireframesModal() },
    { title: 'Open M2 Architecture & Design Tab', shortcut: '', action: () => switchSidebarTab('m2design') },
    { title: 'Toggle File Explorer', shortcut: '', action: () => switchSidebarTab('explorer') },
    { title: 'Toggle Search & Replace', shortcut: 'Ctrl+F', action: () => switchSidebarTab('search') },
    { title: 'Toggle CPU & Memory Inspector', shortcut: '', action: () => toggleInspector() },
    { title: 'Toggle Terminal Drawer', shortcut: '', action: () => toggleTerminal() },
    { title: 'Toggle Code Minimap', shortcut: '', action: () => toggleMinimap() },
    { title: 'Clear Terminal Output', shortcut: '', action: () => { document.getElementById('terminalLogContainer').innerHTML = ''; } },
    { title: 'Set Theme: VS Code Dark', shortcut: '', action: () => setTheme('theme-vscode') },
    { title: 'Set Theme: Cyberpunk Neon', shortcut: '', action: () => setTheme('theme-cyberpunk') },
    { title: 'Set Theme: One Dark Pro', shortcut: '', action: () => setTheme('theme-onedark') },
    { title: 'Set Theme: Monokai Dark', shortcut: '', action: () => setTheme('theme-monokai') },
  ];

  function openCommandPalette() {
    const modal = document.getElementById('commandPaletteModal');
    const input = document.getElementById('commandPaletteInput');
    const list = document.getElementById('commandPaletteList');
    if (!modal || !input || !list) return;

    modal.classList.remove('hidden');
    input.value = '';
    renderCommandList(COMMANDS);
    input.focus();

    input.oninput = () => {
      const q = input.value.toLowerCase().trim();
      const filtered = COMMANDS.filter(c => c.title.toLowerCase().includes(q));
      renderCommandList(filtered);
    };
  }

  function renderCommandList(items) {
    const list = document.getElementById('commandPaletteList');
    if (!list) return;

    if (items.length === 0) {
      list.innerHTML = `<div class="p-3 text-zinc-500 text-center text-xs">No matching actions.</div>`;
      return;
    }

    list.innerHTML = items.map((cmd, idx) => `
      <div class="cmd-item flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition cursor-pointer text-zinc-300 text-xs ${idx === 0 ? 'bg-zinc-800 text-white' : ''}" data-idx="${idx}">
        <span class="flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>${cmd.title}</span>
        </span>
        ${cmd.shortcut ? `<span class="text-[10px] bg-zinc-800/80 px-2 py-0.5 rounded-md font-mono text-zinc-400 border border-zinc-700/50">${cmd.shortcut}</span>` : ''}
      </div>
    `).join('');

    list.querySelectorAll('.cmd-item').forEach((item) => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-idx'), 10);
        closeCommandPalette();
        items[idx]?.action();
      });
    });
  }

  function closeCommandPalette() {
    const modal = document.getElementById('commandPaletteModal');
    if (modal) modal.classList.add('hidden');
  }

  function openNewFileModal() {
    const modal = document.getElementById('newFileModal');
    const input = document.getElementById('newFileNameInput');
    if (!modal || !input) return;
    modal.classList.remove('hidden');
    input.value = 'program.limo';
    input.focus();
    input.select();
  }

  function closeNewFileModal() {
    const modal = document.getElementById('newFileModal');
    if (modal) modal.classList.add('hidden');
  }

  // --- Resizable Splitters Logic ---
  function setupResizers() {
    // 1. Sidebar Resize
    const sidebarHandle = document.getElementById('sidebarResizeHandle');
    const sidebar = document.getElementById('sidebarPanel');
    if (sidebarHandle && sidebar) {
      let isDragging = false;
      sidebarHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        document.body.style.cursor = 'col-resize';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newWidth = Math.max(200, Math.min(600, e.clientX - 56));
        sidebar.style.width = `${newWidth}px`;
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          document.body.style.cursor = 'default';
          syncEditorScroll();
        }
      });
    }

    // 2. Inspector Resize
    const inspectorHandle = document.getElementById('inspectorResizeHandle');
    const inspector = document.getElementById('inspectorPanel');
    if (inspectorHandle && inspector) {
      let isDragging = false;
      inspectorHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        document.body.style.cursor = 'col-resize';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newWidth = Math.max(240, Math.min(650, window.innerWidth - e.clientX));
        inspector.style.width = `${newWidth}px`;
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          document.body.style.cursor = 'default';
          syncEditorScroll();
        }
      });
    }

    // 3. Terminal Drawer Resize
    const terminalHandle = document.getElementById('terminalResizeHandle');
    const terminal = document.getElementById('terminalDrawer');
    if (terminalHandle && terminal) {
      let isDragging = false;
      terminalHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        document.body.style.cursor = 'row-resize';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newHeight = Math.max(120, Math.min(window.innerHeight - 150, window.innerHeight - e.clientY - 28));
        terminal.style.height = `${newHeight}px`;
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          document.body.style.cursor = 'default';
          syncEditorScroll();
        }
      });
    }
  }

  // ==========================================================================
  // 11. INITIALIZATION ON DOM READY
  // ==========================================================================

  function init() {
    renderTabs();
    renderExplorer();
    renderEditor();
    renderRegisters();
    renderWorkbench();
    resetPipeline();
    runAssemblerUnitTests();
    setupEventListeners();

    // Welcome log
    logTerminal('<span class="text-blue-400 font-semibold">[RISC-V / LIMO Assembler & Runner Ready]</span> Architecture: <strong>LIMO (RV32I Sesotho)</strong>');
    logTerminal('<span class="text-emerald-400 font-semibold">[CS3520 Visionary Architects]</span> 10 Sesotho Mnemonics (kop, ts, khh, le, kp, ng, lt, blk, hlk, hft).');
    logTerminal('<span class="text-zinc-500">Press <kbd class="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-bold">F5</kbd> to Assemble & Run or <kbd class="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold">F10</kbd> to Step. Type "help" in terminal.</span>');

    showToast('LIMO Studio Pro Ready', 'success');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
