import { describe, it, expect } from 'vitest'

describe('Study session logging', () => {
  it('adds a session to the log', () => {
    const sessions: string[] = []
    sessions.push('2024-01-01')
    expect(sessions).toHaveLength(1)
  })

  it('does not add duplicate sessions', () => {
    const sessions = ['2024-01-01']
    const newDate = '2024-01-01'
    if (!sessions.includes(newDate)) sessions.push(newDate)
    expect(sessions).toHaveLength(1)
  })
})