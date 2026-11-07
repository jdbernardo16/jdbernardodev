import { describe, it, expect } from 'vitest'
import { workStudies, getWorkStudy } from '../../app/data/work'
import { services } from '../../app/data/services'
import { site } from '../../app/data/site'

describe('content data', () => {
  it('has four unique case studies', () => {
    expect(workStudies).toHaveLength(4)
    expect(new Set(workStudies.map(s => s.slug)).size).toBe(4)
  })

  it('resolves a study by slug and returns undefined for unknown slugs', () => {
    expect(getWorkStudy('education-agent')?.title).toBe('Grading automation agent')
    expect(getWorkStudy('missing')).toBeUndefined()
  })

  it('labels the 5x metric as an estimate and keeps it unrounded', () => {
    const metric = workStudies[0].metrics[0]
    expect(metric.value).toBe('5x')
    expect(metric.estimate).toBe(true)
  })

  it('has five services with valid work links', () => {
    expect(services).toHaveLength(5)
    for (const service of services) {
      if (service.workSlug) expect(getWorkStudy(service.workSlug)).toBeDefined()
    }
  })

  it('never stores agency names', () => {
    const json = JSON.stringify(workStudies)
    expect(json).not.toContain('PNA')
    expect(json).not.toContain('DOJ')
  })

  it('exposes the expected site identity', () => {
    expect(site.email).toBe('jdbernardo16@gmail.com')
    expect(site.nav.map(n => n.href)).toEqual(['#work', '#services', '#about', '#security', '#contact'])
  })
})
