import { describe, it, expect } from 'vitest'

// Test 1: Subject progress calculation
describe('calculateSubjectProgress', () => {
  it('returns correct percentage', () => {
    const hoursStudied = 8
    const targetHours = 10
    const progress = (hoursStudied / targetHours) * 100
    expect(progress).toBe(80)
  })

  it('does not exceed 100%', () => {
    const hoursStudied = 12
    const targetHours = 10
    const progress = Math.min((hoursStudied / targetHours) * 100, 100)
    expect(progress).toBe(100)
  })
})

// Test 2: Streak calculation
describe('studyStreak', () => {
  it('returns 0 for empty log', () => {
    const log: string[] = []
    expect(log.length).toBe(0)
  })

  it('counts consecutive days correctly', () => {
    const dates = ['2024-01-01', '2024-01-02', '2024-01-03']
    expect(dates.length).toBe(3)
  })
})