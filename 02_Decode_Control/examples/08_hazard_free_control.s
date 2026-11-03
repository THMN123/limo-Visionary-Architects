# ==================================================================
# CS3520 LIMO Milestone M3 - Hazard-Free Branch & Control Flow
# Team: Visionary Architects (National University of Lesotho)
# ==================================================================
# Verifies direct conditionals (hlk, hft) evaluated in EX stage
# without NZCV flags, flushing 2 speculative instructions on taken branches.
# ==================================================================

# 1. Initialize loop counter and limit
khh r6, r0, 0        # r6 = counter = 0
khh r7, r0, 3        # r7 = limit = 3
khh r8, r0, 10       # r8 = accumulator = 10
khh r9, r0, 1        # r9 = step = 1

loop:
  # Increment accumulator and counter
  kop r8, r8, r6     # r8 += counter
  kop r6, r6, r9     # counter += 1
  khh r1, r0, 0      # NOP
  khh r1, r0, 0      # NOP

  # Check if counter == limit (hlk)
  hlk r6, r7, done   # If counter == 3, jump to done
  khh r0, r0, 0      # Speculative slot 1 (flushed on branch)
  khh r0, r0, 0      # Speculative slot 2 (flushed on branch)

  # Otherwise repeat loop
  hlk r0, r0, loop   # Unconditional backward branch
  khh r0, r0, 0
  khh r0, r0, 0

done:
  # Final result in r8: 10 + 0 + 1 + 2 = 13
  khh r15, r0, 1     # success indicator flag
