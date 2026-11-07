import { describe, it, expect } from 'vitest'
import { validateContact } from '../../app/utils/contact'

const valid = {
  name: 'Ana Cruz',
  email: 'ana@example.com',
  projectType: 'AI agent',
  budget: '5k-10k',
  message: 'I need an agent that monitors orders and notifies my team.',
  consent: true,
}

describe('contact validation', () => {
  it('accepts a valid payload', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('requires name, email, project type, message, and consent', () => {
    const errors = validateContact({ ...valid, name: '', email: '', projectType: '', message: '', consent: false })
    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.projectType).toBeDefined()
    expect(errors.message).toBeDefined()
    expect(errors.consent).toBeDefined()
  })

  it('rejects an invalid email and a short message', () => {
    const errors = validateContact({ ...valid, email: 'not-an-email', message: 'too short' })
    expect(errors.email).toBeDefined()
    expect(errors.message).toBeDefined()
  })
})
