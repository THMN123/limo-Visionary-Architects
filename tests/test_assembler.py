#!/usr/bin/env python3
"""
LIMO Assembler Unit Test Runner (Python verification for Milestone M2)
Validates all 10 Sesotho instructions, 4 instruction formats (R, I, S, B),
hand-encoded benchmarks, register aliases, immediate bounds, and error handling.
"""

import sys

LIMO_REGISTERS = {
    'r0': 0, 'letho': 0, 'zero': 0, 'x0': 0,
    'r1': 1, 'khutlisa': 1, 'ra': 1, 'x1': 1,
    'r2': 2, 'tshupo': 2, 'sp': 2, 'x2': 2,
    'r3': 3, 'sebali': 3, 'pc': 3, 'x3': 3,
    'r4': 4, 'sesupi': 4, 'gp': 4, 'x4': 4,
    'r5': 5, 'lesupa': 5, 'fp': 5, 'x5': 5,
    'r6': 6, 'thuso0': 6, 'a0': 6, 'x6': 6,
    'r7': 7, 'thuso1': 7, 'a1': 7, 'x7': 7,
    'r8': 8, 'nakoana0': 8, 't0': 8, 'x8': 8,
    'r9': 9, 'nakoana1': 9, 't1': 9, 'x9': 9,
    'r10': 10, 'nakoana2': 10, 't2': 10, 'x10': 10,
    'r11': 11, 'nakoana3': 11, 't3': 11, 'x11': 11,
    'r12': 12, 'nakoana4': 12, 't4': 12, 'x12': 12,
    'r13': 13, 'nakoana5': 13, 't5': 13, 'x13': 13,
    'r14': 14, 'nakoana6': 14, 't6': 14, 'x14': 14,
    'r15': 15, 'nakoana7': 15, 't7': 15, 'x15': 15,
    'r16': 16, 'polokelo0': 16, 's0': 16, 'x16': 16,
    'r17': 17, 'polokelo1': 17, 's1': 17, 'x17': 17,
    'r18': 18, 'polokelo2': 18, 's2': 18, 'x18': 18,
    'r19': 19, 'polokelo3': 19, 's3': 19, 'x19': 19,
    'r20': 20, 'polokelo4': 20, 's4': 20, 'x20': 20,
    'r21': 21, 'polokelo5': 21, 's5': 21, 'x21': 21,
    'r22': 22, 'polokelo6': 22, 's6': 22, 'x22': 22,
    'r23': 23, 'polokelo7': 23, 's7': 23, 'x23': 23,
    'r24': 24, 'polokelo8': 24, 's8': 24, 'x24': 24,
    'r25': 25, 'polokelo9': 25, 's9': 25, 'x25': 25,
    'r26': 26, 'polokelo10': 26, 's10': 26, 'x26': 26,
    'r27': 27, 'polokelo11': 27, 's11': 27, 'x27': 27,
    'r28': 28, 'tsehlahlamang0': 28, 't8': 28, 'x28': 28,
    'r29': 29, 'tsehlahlamang1': 29, 't9': 29, 'x29': 29,
    'r30': 30, 'tsehlahlamang2': 30, 't10': 30, 'x30': 30,
    'r31': 31, 'tsehlahlamang3': 31, 't11': 31, 'x31': 31,
}

LIMO_INSTRUCTIONS = {
    'kop': {'format': 'R', 'opcode': '0110011', 'funct3': '000', 'funct7': '0000000'},
    'ts':  {'format': 'R', 'opcode': '0110011', 'funct3': '000', 'funct7': '0100000'},
    'khh': {'format': 'I', 'opcode': '0010011', 'funct3': '000'},
    'le':  {'format': 'R', 'opcode': '0110011', 'funct3': '111', 'funct7': '0000000'},
    'kp':  {'format': 'R', 'opcode': '0110011', 'funct3': '110', 'funct7': '0000000'},
    'ng':  {'format': 'R', 'opcode': '0110011', 'funct3': '001', 'funct7': '0000000'},
    'lt':  {'format': 'I', 'opcode': '0000011', 'funct3': '010'},
    'blk': {'format': 'S', 'opcode': '0100011', 'funct3': '010'},
    'hlk': {'format': 'B', 'opcode': '1100011', 'funct3': '000'},
    'hft': {'format': 'B', 'opcode': '1100011', 'funct3': '101'},
}

def parse_reg(token):
    if not token:
        return None
    token = token.strip().lower().rstrip(',')
    if token.startswith('r') and token[1:].isdigit():
        n = int(token[1:])
        return n if 0 <= n <= 31 else None
    if token.startswith('x') and token[1:].isdigit():
        n = int(token[1:])
        return n if 0 <= n <= 31 else None
    return LIMO_REGISTERS.get(token, None)

def to_bin(val, bits):
    if val < 0:
        val = (1 << bits) + val
    return bin(val & ((1 << bits) - 1))[2:].zfill(bits)

def assemble(line):
    line = line.strip()
    if not line or line.startswith(('#', ';')):
        return {'is_empty': True}
    code = line.split('#')[0].split(';')[0].strip()
    import re
    tokens = [t for t in re.split(r'[\s,()]+', code) if t]
    if not tokens:
        return {'is_empty': True}
    
    mnemonic = tokens[0].lower()
    spec = LIMO_INSTRUCTIONS.get(mnemonic)
    if not spec:
        return {'success': False, 'error': f'Unknown mnemonic: "{mnemonic}"'}
    
    fmt = spec['format']
    if fmt == 'R':
        if len(tokens) < 4:
            return {'success': False, 'error': f'R-format {mnemonic} requires 3 operands'}
        rd = parse_reg(tokens[1])
        rs1 = parse_reg(tokens[2])
        rs2 = parse_reg(tokens[3])
        if rd is None or rs1 is None or rs2 is None:
            return {'success': False, 'error': f'Invalid registers'}
        b = spec['funct7'] + to_bin(rs2, 5) + to_bin(rs1, 5) + spec['funct3'] + to_bin(rd, 5) + spec['opcode']
        return {'success': True, 'hex': '0x' + hex(int(b, 2))[2:].upper().zfill(8), 'bin': b}
    
    elif fmt == 'I':
        if mnemonic == 'lt':
            if len(tokens) < 4:
                return {'success': False, 'error': 'lt syntax error'}
            rd = parse_reg(tokens[1])
            try:
                imm = int(tokens[2])
            except ValueError:
                return {'success': False, 'error': 'invalid imm'}
            rs1 = parse_reg(tokens[3])
        else:
            if len(tokens) < 4:
                return {'success': False, 'error': 'khh syntax error'}
            rd = parse_reg(tokens[1])
            rs1 = parse_reg(tokens[2])
            try:
                imm = int(tokens[3])
            except ValueError:
                return {'success': False, 'error': 'invalid imm'}
        
        if rd is None or rs1 is None:
            return {'success': False, 'error': 'invalid register'}
        if imm < -2048 or imm > 2047:
            return {'success': False, 'error': f'Immediate {imm} out of 12-bit signed range'}
        b = to_bin(imm, 12) + to_bin(rs1, 5) + spec['funct3'] + to_bin(rd, 5) + spec['opcode']
        return {'success': True, 'hex': '0x' + hex(int(b, 2))[2:].upper().zfill(8), 'bin': b}
        
    elif fmt == 'S':
        if len(tokens) < 4:
            return {'success': False, 'error': 'blk syntax error'}
        rs2 = parse_reg(tokens[1])
        try:
            imm = int(tokens[2])
        except ValueError:
            return {'success': False, 'error': 'invalid offset'}
        rs1 = parse_reg(tokens[3])
        if rs1 is None or rs2 is None:
            return {'success': False, 'error': 'invalid register'}
        if imm < -2048 or imm > 2047:
            return {'success': False, 'error': f'Store offset {imm} out of range'}
        imm12 = to_bin(imm, 12)
        b = imm12[:7] + to_bin(rs2, 5) + to_bin(rs1, 5) + spec['funct3'] + imm12[7:] + spec['opcode']
        return {'success': True, 'hex': '0x' + hex(int(b, 2))[2:].upper().zfill(8), 'bin': b}

    elif fmt == 'B':
        if len(tokens) < 4:
            return {'success': False, 'error': 'branch syntax error'}
        rs1 = parse_reg(tokens[1])
        rs2 = parse_reg(tokens[2])
        try:
            off = int(tokens[3].lstrip('+'))
        except ValueError:
            return {'success': False, 'error': 'invalid offset'}
        if rs1 is None or rs2 is None:
            return {'success': False, 'error': 'invalid register'}
        if off < -4096 or off > 4094:
            return {'success': False, 'error': f'Branch offset {off} out of range'}
        off13 = to_bin(off, 13)
        b = off13[0] + off13[2:8] + to_bin(rs2, 5) + to_bin(rs1, 5) + spec['funct3'] + off13[8:12] + off13[1] + spec['opcode']
        return {'success': True, 'hex': '0x' + hex(int(b, 2))[2:].upper().zfill(8), 'bin': b}

    return {'success': False, 'error': 'Unsupported format'}


def run_all_tests():
    tests = [
        # Benchmarks
        ("kop r8, r6, r7", "0x00730433", False),
        ("khh r8, r6, 15", "0x00F30413", False),
        ("blk r7, 4(r2)", "0x00712223", False),
        ("hlk r6, r7, 16", "0x00730863", False),
        # R-Format
        ("kop r1, r0, r2", "0x002000B3", False),
        ("ts r10, r8, r9", "0x40940533", False),
        ("le r8, r6, r7", "0x00737433", False),
        ("kp r8, r6, r7", "0x00736433", False),
        ("ng r8, r8, r9", "0x00941433", False),
        # I-Format
        ("khh r6, r0, 12", "0x00C00313", False),
        ("khh r1, r0, -1", "0xFFF00093", False),
        ("khh r1, r0, 2047", "0x7FF00093", False),
        ("khh r1, r0, -2048", "0x80000093", False),
        ("lt r9, 4(r2)", "0x00412483", False),
        ("lt r1, 0(r2)", "0x00012083", False),
        # S-Format
        ("blk r8, 4(r2)", "0x00812223", False),
        ("blk r8, -8(r2)", "0xFE812C23", False),
        # B-Format
        ("hlk r6, r7, 8", "0x00730463", False),
        ("hft r6, r7, 8", "0x00735463", False),
        ("hlk r6, r7, -16", "0xFE7308E3", False),
        # Sesotho Register Names
        ("kop Nakoana0, Thuso0, Thuso1", "0x00730433", False),
        ("kop r1, Letho, Tshupo", "0x002000B3", False),
        ("kop t0, a0, a1", "0x00730433", False),
        ("kop x8, x6, x7", "0x00730433", False),
        # Error Cases
        ("khh r1, r0, 2048", None, True),
        ("khh r1, r0, -2049", None, True),
        ("kop r32, r1, r2", None, True),
        ("unknown_op r1, r2, r3", None, True),
        ("kop r1, r2", None, True),
    ]

    passed = 0
    failed = 0
    print("\n" + "=" * 60)
    print("RUNNING PYTHON LIMO ASSEMBLER TEST SUITE (M2)")
    print("=" * 60)
    
    for i, (inp, expected, should_fail) in enumerate(tests, 1):
        res = assemble(inp)
        if should_fail:
            if not res.get('success'):
                passed += 1
                print(f"[PASS] #{i:02d} (Expected error): {inp} -> {res.get('error')}")
            else:
                failed += 1
                print(f"[FAIL] #{i:02d}: {inp} should have failed, got {res.get('hex')}")
        else:
            if res.get('success') and res.get('hex') == expected:
                passed += 1
                print(f"[PASS] #{i:02d}: {inp} -> {res.get('hex')}")
            else:
                failed += 1
                print(f"[FAIL] #{i:02d}: {inp} -> Expected {expected}, got {res.get('hex')} ({res.get('error')})")

    print("-" * 60)
    print(f"RESULTS: {passed} PASSED | {failed} FAILED | TOTAL: {len(tests)}")
    print("=" * 60 + "\n")
    return failed == 0

if __name__ == '__main__':
    ok = run_all_tests()
    sys.exit(0 if ok else 1)
