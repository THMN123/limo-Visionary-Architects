/**
 * ============================================================================
 * LIMO Studio - Assembler Unit Test Suite (Milestone M2)
 * National University of Lesotho · Department of Computer Science
 * CS3520 Computer Organisation and Architecture
 * Team: Visionary Architects
 * ============================================================================
 *
 * This test suite verifies the working LIMO assembler according to the M1 & M2
 * ISA specification:
 * - Table 2.2: 32 Architectural Registers (Numbers, RV32I names, and Sesotho names)
 * - Table 2.4: 10 Sesotho Mnemonics & RV32I mappings (R, I, S, B formats)
 * - Section 2.5: Hand-encoded benchmark verification
 * - Section 3(e): Zero-flag direct branch comparisons
 * - Immediate range boundary conditions (signed 12-bit & 13-bit offsets)
 * - Robust error handling (invalid registers, out-of-range immediates, unknown tokens)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js environment
    module.exports = factory();
    if (require.main === module) {
      const runner = module.exports.runTests();
      process.exit(runner.failed > 0 ? 1 : 0);
    }
  } else {
    // Browser environment
    root.LimoAssemblerTests = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // --------------------------------------------------------------------------
  // LIMO ISA DEFINITIONS
  // --------------------------------------------------------------------------
  const LIMO_REGISTERS = [
    { num: 0, name: 'r0', sesotho: 'letho', alias: 'zero' },
    { num: 1, name: 'r1', sesotho: 'khutlisa', alias: 'ra' },
    { num: 2, name: 'r2', sesotho: 'tshupo', alias: 'sp' },
    { num: 3, name: 'r3', sesotho: 'sebali', alias: 'pc' },
    { num: 4, name: 'r4', sesotho: 'sesupi', alias: 'gp' },
    { num: 5, name: 'r5', sesotho: 'lesupa', alias: 'fp' },
    { num: 6, name: 'r6', sesotho: 'thuso0', alias: 'a0' },
    { num: 7, name: 'r7', sesotho: 'thuso1', alias: 'a1' },
    { num: 8, name: 'r8', sesotho: 'nakoana0', alias: 't0' },
    { num: 9, name: 'r9', sesotho: 'nakoana1', alias: 't1' },
    { num: 10, name: 'r10', sesotho: 'nakoana2', alias: 't2' },
    { num: 11, name: 'r11', sesotho: 'nakoana3', alias: 't3' },
    { num: 12, name: 'r12', sesotho: 'nakoana4', alias: 't4' },
    { num: 13, name: 'r13', sesotho: 'nakoana5', alias: 't5' },
    { num: 14, name: 'r14', sesotho: 'nakoana6', alias: 't6' },
    { num: 15, name: 'r15', sesotho: 'nakoana7', alias: 't7' },
    { num: 16, name: 'r16', sesotho: 'polokelo0', alias: 's0' },
    { num: 17, name: 'r17', sesotho: 'polokelo1', alias: 's1' },
    { num: 18, name: 'r18', sesotho: 'polokelo2', alias: 's2' },
    { num: 19, name: 'r19', sesotho: 'polokelo3', alias: 's3' },
    { num: 20, name: 'r20', sesotho: 'polokelo4', alias: 's4' },
    { num: 21, name: 'r21', sesotho: 'polokelo5', alias: 's5' },
    { num: 22, name: 'r22', sesotho: 'polokelo6', alias: 's6' },
    { num: 23, name: 'r23', sesotho: 'polokelo7', alias: 's7' },
    { num: 24, name: 'r24', sesotho: 'polokelo8', alias: 's8' },
    { num: 25, name: 'r25', sesotho: 'polokelo9', alias: 's9' },
    { num: 26, name: 'r26', sesotho: 'polokelo10', alias: 's10' },
    { num: 27, name: 'r27', sesotho: 'polokelo11', alias: 's11' },
    { num: 28, name: 'r28', sesotho: 'tsehlahlamang0', alias: 't8' },
    { num: 29, name: 'r29', sesotho: 'tsehlahlamang1', alias: 't9' },
    { num: 30, name: 'r30', sesotho: 'tsehlahlamang2', alias: 't10' },
    { num: 31, name: 'r31', sesotho: 'tsehlahlamang3', alias: 't11' },
  ];

  const LIMO_INSTRUCTIONS = {
    kop: { format: 'R', opcode: '0110011', funct3: '000', funct7: '0000000', equiv: 'add' },
    ts:  { format: 'R', opcode: '0110011', funct3: '000', funct7: '0100000', equiv: 'sub' },
    khh: { format: 'I', opcode: '0010011', funct3: '000', equiv: 'addi' },
    le:  { format: 'R', opcode: '0110011', funct3: '111', funct7: '0000000', equiv: 'and' },
    kp:  { format: 'R', opcode: '0110011', funct3: '110', funct7: '0000000', equiv: 'or' },
    ng:  { format: 'R', opcode: '0110011', funct3: '001', funct7: '0000000', equiv: 'sll' },
    lt:  { format: 'I', opcode: '0000011', funct3: '010', equiv: 'lw' },
    blk: { format: 'S', opcode: '0100011', funct3: '010', equiv: 'sw' },
    hlk: { format: 'B', opcode: '1100011', funct3: '000', equiv: 'beq' },
    hft: { format: 'B', opcode: '1100011', funct3: '101', equiv: 'bgt' },
  };

  // --------------------------------------------------------------------------
  // CORE ASSEMBLER ENGINE
  // --------------------------------------------------------------------------
  function parseRegister(token) {
    if (!token) return null;
    const clean = token.trim().toLowerCase().replace(/,$/, '');
    const rMatch = clean.match(/^r(\d+)$/);
    if (rMatch) {
      const n = parseInt(rMatch[1], 10);
      return n >= 0 && n <= 31 ? n : null;
    }
    const xMatch = clean.match(/^x(\d+)$/);
    if (xMatch) {
      const n = parseInt(xMatch[1], 10);
      return n >= 0 && n <= 31 ? n : null;
    }
    const reg = LIMO_REGISTERS.find(
      (r) => r.name === clean || r.sesotho === clean || r.alias === clean
    );
    return reg ? reg.num : null;
  }

  function toBin(num, bits) {
    let val = num;
    if (val < 0) {
      val = (1 << bits) + val;
    }
    const s = (val >>> 0).toString(2);
    return s.padStart(bits, '0').slice(-bits);
  }

  function binToHex(bin) {
    const num = parseInt(bin, 2) >>> 0;
    return '0x' + num.toString(16).padStart(8, '0').toUpperCase();
  }

  function assembleLine(line) {
    const raw = line.trim();
    if (!raw || raw.startsWith('#') || raw.startsWith(';')) {
      return { isEmpty: true, original: raw };
    }
    const code = raw.split(/[#;]/)[0].trim();
    const tokens = code.split(/[\s,()]+/).filter(Boolean);
    if (tokens.length === 0) return { isEmpty: true, original: raw };

    const mnemonic = tokens[0].toLowerCase();
    const spec = LIMO_INSTRUCTIONS[mnemonic];
    if (!spec) {
      return { success: false, error: `Unknown mnemonic: "${mnemonic}"`, original: raw };
    }

    if (spec.format === 'R') {
      if (tokens.length < 4) {
        return { success: false, error: `R-format ${mnemonic} requires 3 operands: rd, rs1, rs2`, original: raw };
      }
      const rd = parseRegister(tokens[1]);
      const rs1 = parseRegister(tokens[2]);
      const rs2 = parseRegister(tokens[3]);
      if (rd === null || rs1 === null || rs2 === null) {
        return { success: false, error: `Invalid register in R-format: "${tokens.slice(1).join(', ')}"`, original: raw };
      }
      const bin = `${spec.funct7}${toBin(rs2, 5)}${toBin(rs1, 5)}${spec.funct3}${toBin(rd, 5)}${spec.opcode}`;
      return {
        success: true,
        hex: binToHex(bin),
        bin,
        format: 'R',
        mnemonic,
        rd, rs1, rs2,
        original: raw
      };
    }

    if (spec.format === 'I') {
      let rd, rs1, immVal;
      if (mnemonic === 'lt') {
        if (tokens.length < 4) {
          return { success: false, error: `lt (load) requires syntax: lt rd, imm(rs1)`, original: raw };
        }
        rd = parseRegister(tokens[1]);
        immVal = parseInt(tokens[2], 10);
        rs1 = parseRegister(tokens[3]);
      } else {
        if (tokens.length < 4) {
          return { success: false, error: `khh (addi) requires syntax: khh rd, rs1, imm`, original: raw };
        }
        rd = parseRegister(tokens[1]);
        rs1 = parseRegister(tokens[2]);
        immVal = parseInt(tokens[3], 10);
      }
      if (rd === null || rs1 === null) {
        return { success: false, error: `Invalid register in I-format: "${tokens.slice(1).join(', ')}"`, original: raw };
      }
      if (isNaN(immVal)) {
        return { success: false, error: `Invalid immediate value: "${tokens[3]}"`, original: raw };
      }
      if (immVal < -2048 || immVal > 2047) {
        return { success: false, error: `Immediate ${immVal} out of 12-bit signed range [-2048, 2047]`, original: raw };
      }
      const bin = `${toBin(immVal, 12)}${toBin(rs1, 5)}${spec.funct3}${toBin(rd, 5)}${spec.opcode}`;
      return {
        success: true,
        hex: binToHex(bin),
        bin,
        format: 'I',
        mnemonic,
        rd, rs1, imm: immVal,
        original: raw
      };
    }

    if (spec.format === 'S') {
      if (tokens.length < 4) {
        return { success: false, error: `blk (store) requires syntax: blk rs2, imm(rs1)`, original: raw };
      }
      const rs2 = parseRegister(tokens[1]);
      const immVal = parseInt(tokens[2], 10);
      const rs1 = parseRegister(tokens[3]);
      if (rs1 === null || rs2 === null) {
        return { success: false, error: `Invalid register in S-format: "${tokens.slice(1).join(', ')}"`, original: raw };
      }
      if (isNaN(immVal)) {
        return { success: false, error: `Invalid store offset: "${tokens[2]}"`, original: raw };
      }
      if (immVal < -2048 || immVal > 2047) {
        return { success: false, error: `Store offset ${immVal} out of 12-bit signed range [-2048, 2047]`, original: raw };
      }
      const imm12 = toBin(immVal, 12);
      const immHigh = imm12.slice(0, 7);
      const immLow = imm12.slice(7);
      const bin = `${immHigh}${toBin(rs2, 5)}${toBin(rs1, 5)}${spec.funct3}${immLow}${spec.opcode}`;
      return {
        success: true,
        hex: binToHex(bin),
        bin,
        format: 'S',
        mnemonic,
        rs1, rs2, imm: immVal,
        original: raw
      };
    }

    if (spec.format === 'B') {
      if (tokens.length < 4) {
        return { success: false, error: `${mnemonic} branch requires syntax: ${mnemonic} rs1, rs2, offset`, original: raw };
      }
      const rs1 = parseRegister(tokens[1]);
      const rs2 = parseRegister(tokens[2]);
      const offsetVal = parseInt(tokens[3].replace(/^\+/, ''), 10);
      if (rs1 === null || rs2 === null) {
        return { success: false, error: `Invalid register in B-format: "${tokens.slice(1).join(', ')}"`, original: raw };
      }
      if (isNaN(offsetVal)) {
        return { success: false, error: `Invalid branch offset: "${tokens[3]}"`, original: raw };
      }
      if (offsetVal < -4096 || offsetVal > 4094) {
        return { success: false, error: `Branch offset ${offsetVal} out of 13-bit signed range [-4096, 4094]`, original: raw };
      }
      const offset13 = toBin(offsetVal, 13);
      const b12 = offset13[0];
      const b11 = offset13[1];
      const b10_5 = offset13.slice(2, 8);
      const b4_1 = offset13.slice(8, 12);
      const immHigh = `${b12}${b10_5}`;
      const immLow = `${b4_1}${b11}`;
      const bin = `${immHigh}${toBin(rs2, 5)}${toBin(rs1, 5)}${spec.funct3}${immLow}${spec.opcode}`;
      return {
        success: true,
        hex: binToHex(bin),
        bin,
        format: 'B',
        mnemonic,
        rs1, rs2, imm: offsetVal,
        original: raw
      };
    }

    return { success: false, error: `Unsupported format for ${mnemonic}`, original: raw };
  }

  // --------------------------------------------------------------------------
  // UNIT TEST CASES SPECIFICATION
  // --------------------------------------------------------------------------
  const TEST_CASES = [
    // 1. M1 Hand-Encoded Benchmark Program Tests (Section 2.5)
    {
      category: 'M1 Benchmarks',
      name: 'Benchmark 1: kop r8, r6, r7 (ADD t0, a0, a1)',
      input: 'kop r8, r6, r7',
      expectedHex: '0x00730433',
      description: 'Verifies hand-encoded benchmark for R-type addition.'
    },
    {
      category: 'M1 Benchmarks',
      name: 'Benchmark 2: khh r8, r6, 15 (ADDI t0, a0, 15)',
      input: 'khh r8, r6, 15',
      expectedHex: '0x00F30413',
      description: 'Verifies hand-encoded benchmark for I-type immediate addition.'
    },
    {
      category: 'M1 Benchmarks',
      name: 'Benchmark 3: blk r7, 4(r2) (SW a1, 4(sp))',
      input: 'blk r7, 4(r2)',
      expectedHex: '0x00712223',
      description: 'Verifies hand-encoded benchmark for S-type store word.'
    },
    {
      category: 'M1 Benchmarks',
      name: 'Benchmark 4: hlk r6, r7, 16 (BEQ a0, a1, +16)',
      input: 'hlk r6, r7, 16',
      expectedHex: '0x00730863',
      description: 'Verifies hand-encoded benchmark for B-type branch equal.'
    },

    // 2. R-Format Instructions
    {
      category: 'R-Format',
      name: 'kop (add) with zero register: kop r1, r0, r2',
      input: 'kop r1, r0, r2',
      expectedHex: '0x002000B3',
      description: 'Checks addition with hard-wired zero register r0.'
    },
    {
      category: 'R-Format',
      name: 'ts (sub): ts r10, r8, r9',
      input: 'ts r10, r8, r9',
      expectedHex: '0x40940533',
      description: 'Checks subtraction with funct7 = 0100000.'
    },
    {
      category: 'R-Format',
      name: 'le (and): le r8, r6, r7',
      input: 'le r8, r6, r7',
      expectedHex: '0x00737433',
      description: 'Checks bitwise AND with funct3 = 111.'
    },
    {
      category: 'R-Format',
      name: 'kp (or): kp r8, r6, r7',
      input: 'kp r8, r6, r7',
      expectedHex: '0x00736433',
      description: 'Checks bitwise OR with funct3 = 110.'
    },
    {
      category: 'R-Format',
      name: 'ng (sll): ng r8, r8, r9',
      input: 'ng r8, r8, r9',
      expectedHex: '0x00941433',
      description: 'Checks shift left logical with funct3 = 001.'
    },

    // 3. I-Format Instructions
    {
      category: 'I-Format',
      name: 'khh (addi) positive immediate: khh r6, r0, 12',
      input: 'khh r6, r0, 12',
      expectedHex: '0x00C00313',
      description: 'Checks ADDI with small positive constant.'
    },
    {
      category: 'I-Format',
      name: 'khh (addi) negative immediate: khh r1, r0, -1',
      input: 'khh r1, r0, -1',
      expectedHex: '0xFFF00093',
      description: 'Checks 12-bit two-complement sign extension of -1.'
    },
    {
      category: 'I-Format',
      name: 'khh (addi) max positive 12-bit limit: khh r1, r0, 2047',
      input: 'khh r1, r0, 2047',
      expectedHex: '0x7FF00093',
      description: 'Validates maximum positive 12-bit signed immediate (+2047).'
    },
    {
      category: 'I-Format',
      name: 'khh (addi) min negative 12-bit limit: khh r1, r0, -2048',
      input: 'khh r1, r0, -2048',
      expectedHex: '0x80000093',
      description: 'Validates minimum negative 12-bit signed immediate (-2048).'
    },
    {
      category: 'I-Format',
      name: 'lt (lw) load word: lt r9, 4(r2)',
      input: 'lt r9, 4(r2)',
      expectedHex: '0x00412483',
      description: 'Checks load word with base r2 (sp) and offset 4.'
    },
    {
      category: 'I-Format',
      name: 'lt (lw) with zero offset: lt r1, 0(r2)',
      input: 'lt r1, 0(r2)',
      expectedHex: '0x00012083',
      description: 'Checks load word with 0 immediate offset.'
    },

    // 4. S-Format Instructions
    {
      category: 'S-Format',
      name: 'blk (sw) positive offset: blk r8, 4(r2)',
      input: 'blk r8, 4(r2)',
      expectedHex: '0x00812223',
      description: 'Checks store word with immediate split between high/low fields.'
    },
    {
      category: 'S-Format',
      name: 'blk (sw) negative offset: blk r8, -8(r2)',
      input: 'blk r8, -8(r2)',
      expectedHex: '0xFE812C23',
      description: 'Checks store word with negative offset sign extension.'
    },

    // 5. B-Format Instructions (Branches)
    {
      category: 'B-Format',
      name: 'hlk (beq) positive branch offset: hlk r6, r7, 8',
      input: 'hlk r6, r7, 8',
      expectedHex: '0x00730463',
      description: 'Validates branch equal with +8 byte offset.'
    },
    {
      category: 'B-Format',
      name: 'hft (bgt) branch greater than: hft r6, r7, 8',
      input: 'hft r6, r7, 8',
      expectedHex: '0x00735463',
      description: 'Validates flag-less branch greater than (hft).'
    },
    {
      category: 'B-Format',
      name: 'hlk (beq) backwards jump offset: hlk r6, r7, -16',
      input: 'hlk r6, r7, -16',
      expectedHex: '0xFE7308E3',
      description: 'Validates negative branch offset calculation.'
    },

    // 6. Register Naming & Alias Tests
    {
      category: 'Register Aliases',
      name: 'Sesotho register names: kop Nakoana0, Thuso0, Thuso1',
      input: 'kop Nakoana0, Thuso0, Thuso1',
      expectedHex: '0x00730433',
      description: 'Verifies parsing of Sesotho names (Nakoana0=r8, Thuso0=r6, Thuso1=r7).'
    },
    {
      category: 'Register Aliases',
      name: 'Sesotho register names: Letho (r0) and Tshupo (r2)',
      input: 'kop r1, Letho, Tshupo',
      expectedHex: '0x002000B3',
      description: 'Verifies parsing of Letho (r0) and Tshupo (r2).'
    },
    {
      category: 'Register Aliases',
      name: 'RISC-V standard aliases: kop t0, a0, a1',
      input: 'kop t0, a0, a1',
      expectedHex: '0x00730433',
      description: 'Verifies ABI register aliases (t0, a0, a1).'
    },
    {
      category: 'Register Aliases',
      name: 'RISC-V numeric registers: kop x8, x6, x7',
      input: 'kop x8, x6, x7',
      expectedHex: '0x00730433',
      description: 'Verifies x0-x31 standard register aliases.'
    },

    // 7. Robust Error Handling & Boundaries
    {
      category: 'Error Handling',
      name: 'Immediate out of bounds (> 2047): khh r1, r0, 2048',
      input: 'khh r1, r0, 2048',
      shouldFail: true,
      errorContains: 'out of 12-bit signed range',
      description: 'Ensures immediate 2048 is rejected as overflow.'
    },
    {
      category: 'Error Handling',
      name: 'Immediate out of bounds (< -2048): khh r1, r0, -2049',
      input: 'khh r1, r0, -2049',
      shouldFail: true,
      errorContains: 'out of 12-bit signed range',
      description: 'Ensures immediate -2049 is rejected as underflow.'
    },
    {
      category: 'Error Handling',
      name: 'Invalid register number: kop r32, r1, r2',
      input: 'kop r32, r1, r2',
      shouldFail: true,
      errorContains: 'Invalid register',
      description: 'Ensures registers beyond r31 are rejected.'
    },
    {
      category: 'Error Handling',
      name: 'Unknown mnemonic: unknown_op r1, r2, r3',
      input: 'unknown_op r1, r2, r3',
      shouldFail: true,
      errorContains: 'Unknown mnemonic',
      description: 'Ensures unsupported mnemonics fail gracefully.'
    },
    {
      category: 'Error Handling',
      name: 'Missing operands: kop r1, r2',
      input: 'kop r1, r2',
      shouldFail: true,
      errorContains: 'requires 3 operands',
      description: 'Ensures operand arity is validated.'
    }
  ];

  // --------------------------------------------------------------------------
  // TEST RUNNER
  // --------------------------------------------------------------------------
  function runTests() {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const results = [];
    let passedCount = 0;
    let failedCount = 0;

    TEST_CASES.forEach((test, idx) => {
      const res = assembleLine(test.input);
      let passed = false;
      let reason = '';

      if (test.shouldFail) {
        if (!res.success) {
          if (!test.errorContains || (res.error && res.error.includes(test.errorContains))) {
            passed = true;
          } else {
            reason = `Expected error containing "${test.errorContains}", got: "${res.error}"`;
          }
        } else {
          reason = `Expected instruction to fail, but it succeeded with hex: ${res.hex}`;
        }
      } else {
        if (res.success) {
          if (res.hex === test.expectedHex) {
            passed = true;
          } else {
            reason = `Expected hex ${test.expectedHex}, got ${res.hex}`;
          }
        } else {
          reason = `Assembly failed unexpectedly: ${res.error}`;
        }
      }

      if (passed) passedCount++;
      else failedCount++;

      results.push({
        id: idx + 1,
        category: test.category,
        name: test.name,
        input: test.input,
        expected: test.shouldFail ? `Error containing "${test.errorContains}"` : test.expectedHex,
        actual: res.success ? res.hex : `Error: ${res.error}`,
        binary: res.bin || 'N/A',
        passed,
        reason,
        description: test.description
      });
    });

    const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const durationMs = Math.round((endTime - startTime) * 10) / 10;

    const summary = {
      total: TEST_CASES.length,
      passed: passedCount,
      failed: failedCount,
      durationMs,
      passRate: Math.round((passedCount / TEST_CASES.length) * 100),
      results
    };

    // Console output for CLI/terminal
    if (typeof console !== 'undefined') {
      console.log(`\n======================================================`);
      console.log(`LIMO ASSEMBLER UNIT TEST SUITE - MILESTONE M2`);
      console.log(`======================================================`);
      results.forEach((r) => {
        const badge = r.passed ? '✓ PASS' : '✗ FAIL';
        console.log(`[${badge}] #${r.id} ${r.name}`);
        if (!r.passed) {
          console.log(`       Reason: ${r.reason}`);
        }
      });
      console.log(`------------------------------------------------------`);
      console.log(`TOTAL: ${summary.total} | PASSED: ${summary.passed} | FAILED: ${summary.failed} | TIME: ${summary.durationMs}ms`);
      console.log(`======================================================\n`);
    }

    return summary;
  }

  return {
    assembleLine,
    parseRegister,
    LIMO_REGISTERS,
    LIMO_INSTRUCTIONS,
    TEST_CASES,
    runTests
  };
});
