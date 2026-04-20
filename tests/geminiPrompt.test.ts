import { describe, it, expect } from 'vitest'

// Simulated context builder (mirror your real one)
function buildStudyContext(data: {
  totalHours: number
  streak: number
  weakSubjects: string[]
}) {
  return `Total hours: ${data.totalHours}. Streak: ${data.streak} days. Weak subjects: ${data.weakSubjects.join(', ')}.`
}

describe('Gemini prompt builder', () => {
  it('includes total hours in context', () => {
    const ctx = buildStudyContext({ totalHours: 42, streak: 7, weakSubjects: ['Physics'] })
    expect(ctx).toContain('42')
  })

  it('includes streak in context', () => {
    const ctx = buildStudyContext({ totalHours: 42, streak: 7, weakSubjects: ['Physics'] })
    expect(ctx).toContain('7 days')
  })

  it('includes weak subjects in context', () => {
    const ctx = buildStudyContext({ totalHours: 42, streak: 7, weakSubjects: ['Physics', 'Chemistry'] })
    expect(ctx).toContain('Physics')
    expect(ctx).toContain('Chemistry')
  })
})