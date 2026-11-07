export interface ContactPayload {
  name: string
  email: string
  projectType: string
  budget: string
  message: string
  consent: boolean
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>

export function validateContact(payload: ContactPayload): ContactErrors {
  const errors: ContactErrors = {}
  const name = payload.name.trim()
  const email = payload.email.trim()
  const message = payload.message.trim()

  if (!name) {
    errors.name = 'Name is required'
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!payload.projectType.trim()) {
    errors.projectType = 'Project type is required'
  }

  if (!message) {
    errors.message = 'Message is required'
  } else if (message.length < 20) {
    errors.message = 'Message must be at least 20 characters'
  }

  if (!payload.consent) {
    errors.consent = 'Consent is required'
  }

  return errors
}
