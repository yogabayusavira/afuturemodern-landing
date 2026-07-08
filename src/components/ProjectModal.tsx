import { useState, useRef, useCallback, useEffect } from 'react'
import { useProjectFormStore, type UploadedFile } from '../hooks/useProjectFormStore'
import ScrollCue from './ScrollCue'

const PILLARS = ['STEM', 'Creative Media', 'Professional Services'] as const
const ENGAGEMENT_LENGTHS = [
  'Under 1 month',
  '1–3 months',
  '3–6 months',
  '6+ months',
  'Not sure yet',
] as const
const WORK_ARRANGEMENTS = ['Remote', 'Hybrid', 'In-person'] as const

const MAX_WORDS = 500
const MAX_FILES = 5
const MAX_FILE_SIZE = 12 * 1024 * 1024
const MAX_COMBINED_SIZE = 25 * 1024 * 1024

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function getFileError(file: File): string | null {
  if (file.type !== 'application/pdf') return 'Only PDF files are allowed.'
  if (file.size > MAX_FILE_SIZE) return 'Maximum 12 MB per file.'
  return null
}

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  hasError?: boolean
  id?: string
}

function TagInput({ tags, onChange, placeholder, hasError, id }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val.includes(',')) {
      const parts = val.split(',')
      const newTags = parts.slice(0, -1).map((t) => t.trim()).filter(Boolean)
      if (newTags.length > 0) {
        onChange([...tags, ...newTags])
      }
      setInputValue(parts[parts.length - 1])
    } else {
      setInputValue(val)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = inputValue.trim()
      if (trimmed) {
        onChange([...tags, trimmed])
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  const handleBlur = () => {
    const trimmed = inputValue.trim()
    if (trimmed) {
      onChange([...tags, trimmed])
      setInputValue('')
    }
  }

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove))
  }

  return (
    <div className={`tag-input-container${hasError ? ' has-error' : ''}`}>
      <div className="tag-chips">
        {tags.map((tag, index) => (
          <span key={index} className="tag-chip">
            {tag}
            <button
              type="button"
              className="tag-chip-remove"
              onClick={() => removeTag(index)}
              aria-label={`Remove ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        id={id}
        type="text"
        className="tag-input-field"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? placeholder : ''}
      />
    </div>
  )
}

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const { data, update, setStep, setPath, reset } = useProjectFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'error' | 'done'>('idle')
  const [submitError, setSubmitError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileValidationErrors, setFileValidationErrors] = useState<string[]>([])
  const modalRef = useRef<HTMLDivElement>(null)

  // Reset to selection screen every time modal opens
  useEffect(() => {
    if (isOpen) {
      reset()
      setErrors({})
      setSubmitState('idle')
      setSubmitError('')
      setFileValidationErrors([])
    }
  }, [isOpen, reset])

  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Focus first focusable element
    const firstFocusable = modalRef.current?.querySelector(
      'input, select, textarea, button, a'
    ) as HTMLElement
    firstFocusable?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const validateStep1 = useCallback(() => {
    const errs: Record<string, string> = {}
    if (!data.firstName.trim()) errs.firstName = 'First name is required.'
    if (!data.lastName.trim()) errs.lastName = 'Last name is required.'
    if (!data.email.trim()) errs.email = 'Work email is required.'
    else if (!validateEmail(data.email.trim())) errs.email = 'Please enter a valid email address.'
    if (!data.company.trim()) errs.company = 'Company / organization is required.'
    if (!data.workArrangement) errs.workArrangement = 'Work arrangement is required.'
    if ((data.workArrangement === 'Hybrid' || data.workArrangement === 'In-person') && !data.location.trim()) {
      errs.location = 'Location is required for Hybrid or In-person arrangements.'
    }

    if (data.path === 'find-talent') {
      if (data.rolesNeeded.length === 0) errs.rolesNeeded = 'Require at least one role or capability.'
      if (data.findTalentPillars.length === 0) errs.findTalentPillars = 'Select at least one pillar.'
    } else if (data.path === 'build-team') {
      if (!data.projectSummary.trim()) errs.projectSummary = 'This is required.'
      else if (wordCount(data.projectSummary) > MAX_WORDS) errs.projectSummary = `Maximum ${MAX_WORDS} words.`
      if (data.buildTeamPillars.length === 0) errs.buildTeamPillars = 'Select at least one pillar.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [data])

  const validateStep2 = useCallback(() => {
    const errs: Record<string, string> = {}
    if (data.path === 'find-talent') {
      if (!data.requestSummary.trim()) errs.requestSummary = 'This is required.'
      else if (wordCount(data.requestSummary) > MAX_WORDS) errs.requestSummary = `Maximum ${MAX_WORDS} words.`
    }

    if (!data.termsAccepted) errs.termsAccepted = 'You must accept the Terms.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [data])

  const handleSubmit = useCallback(async () => {
    if (submitState === 'submitting') return
    setSubmitState('submitting')
    setSubmitError('')

    try {
      const formData = new FormData()
      formData.append('path', data.path)
      formData.append('firstName', data.firstName.trim())
      formData.append('lastName', data.lastName.trim())
      formData.append('email', data.email.trim())
      formData.append('company', data.company.trim())
      formData.append('workArrangement', data.workArrangement)
      formData.append('location', data.location.trim())
      formData.append('relevantLink', data.relevantLink.trim())
      data.uploadedFiles.forEach((uf) => formData.append('files', uf.file))
      formData.append('termsAccepted', String(data.termsAccepted))
      formData.append('laborValueOptIn', String(data.laborValueOptIn))
      formData.append('honeypot', (document.getElementById('project-honeypot') as HTMLInputElement)?.value || '')

      if (data.path === 'find-talent') {
        data.rolesNeeded.forEach((r) => formData.append('rolesNeeded', r))
        data.findTalentPillars.forEach((p) => formData.append('pillars', p))
        formData.append('requestSummary', data.requestSummary.trim())
        formData.append('budgetRange', data.findTalentBudgetRange.trim())
      } else {
        formData.append('projectName', data.projectName.trim())
        formData.append('projectSummary', data.projectSummary.trim())
        data.buildTeamPillars.forEach((p) => formData.append('pillars', p))
        data.teamCapabilities.forEach((c) => formData.append('teamCapabilities', c))
        formData.append('engagementLength', data.engagementLength)
        formData.append('budgetRange', data.buildTeamBudgetRange.trim())
        formData.append('additionalNotes', data.additionalNotes.trim())
      }

      const res = await fetch('/api/project-submissions', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const textBody = await res.text()
        console.log(`[response error] Status: ${res.status} | StatusText: ${res.statusText} | Body: ${textBody}`)

        let payloadError = 'Failed to send request. Please try again.'
        try {
          const parsed = JSON.parse(textBody)
          if (parsed && parsed.error) {
            payloadError = parsed.error
          }
        } catch (e) {
          // ignore parsing error
        }

        throw new Error(payloadError)
      }

      const body = await res.json()
      if (body.success) {
        setSubmitState('done')
      } else {
        throw new Error('Failed to send request. Please try again.')
      }
    } catch (err) {
      setSubmitState('error')
      setSubmitError(err instanceof Error ? err.message : 'Failed to send request. Please try again.')
    }
  }, [data, submitState])

  const handleContinue = useCallback(() => {
    if (data.step === 1 && validateStep1()) setStep(2)
    else if (data.step === 2 && validateStep2()) {
      handleSubmit()
    }
  }, [data.step, validateStep1, validateStep2, setStep, handleSubmit])

  const handleBack = useCallback(() => {
    if (data.step === 2) {
      setStep(1)
      setErrors({})
    } else {
      setPath('selection')
      setErrors({})
    }
  }, [data.step, setStep, setPath])

  const handlePillarToggle = useCallback((pillar: string) => {
    if (data.path === 'find-talent') {
      const next = data.findTalentPillars.includes(pillar)
        ? data.findTalentPillars.filter((p) => p !== pillar)
        : [...data.findTalentPillars, pillar]
      update({ findTalentPillars: next })
      if (next.length > 0) clearError('findTalentPillars')
    } else {
      const next = data.buildTeamPillars.includes(pillar)
        ? data.buildTeamPillars.filter((p) => p !== pillar)
        : [...data.buildTeamPillars, pillar]
      update({ buildTeamPillars: next })
      if (next.length > 0) clearError('buildTeamPillars')
    }
  }, [data, update, clearError])

  const handleFilesSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    const errs: string[] = []
    const valid: File[] = []

    if (data.uploadedFiles.length + selected.length > MAX_FILES) {
      errs.push(`Maximum ${MAX_FILES} files allowed.`)
    }

    const currentTotal = data.uploadedFiles.reduce((s, f) => s + f.size, 0)

    for (const file of selected) {
      const fe = getFileError(file)
      if (fe) errs.push(`"${file.name}": ${fe}`)
      else valid.push(file)
    }

    const newTotal = currentTotal + valid.reduce((s, f) => s + f.size, 0)
    if (newTotal > MAX_COMBINED_SIZE) {
      errs.push(`Combined size exceeds 25 MB (${formatSize(newTotal)}).`)
    }

    setFileValidationErrors(errs)

    if (errs.length === 0) {
      const newFiles: UploadedFile[] = valid.map((file) => ({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        file,
        name: file.name,
        size: file.size,
      }))
      update({ uploadedFiles: [...data.uploadedFiles, ...newFiles] })
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [data.uploadedFiles, update])

  const removeFile = useCallback((id: string) => {
    update({ uploadedFiles: data.uploadedFiles.filter((f) => f.id !== id) })
    setFileValidationErrors([])
  }, [data.uploadedFiles, update])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleBackToSite = useCallback(() => {
    reset()
    setSubmitState('idle')
    onClose()
  }, [reset, onClose])

  if (!isOpen) return null

  if (submitState === 'done') {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()} ref={modalRef} role="dialog" aria-modal="true">
          <button className="modal-close" onClick={handleClose} aria-label="Close modal">✕</button>
          <div className="modal-success">
            <div className="check-circle">
              <svg viewBox="0 0 28 28"><polyline points="6 14 12 20 22 8" /></svg>
            </div>
            <h2>Request received</h2>
            <p className="modal-success-body">
              {data.path === 'find-talent'
                ? 'Thanks for sharing what you need. We’ll review your request and be in touch about the right contributor.'
                : 'Thanks for sharing your project. We’ll review the brief and be in touch about building the right team.'}
            </p>
            <div className="modal-success-actions">
              <button className="btn btn-join" onClick={handleBackToSite}>Back to site</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} ref={modalRef} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={handleClose} aria-label="Close modal">✕</button>

        <div className="modal-header">
          <p className="eyebrow">Start a Project</p>
          {data.path !== 'selection' && (
            <p className="step-indicator-text">Step {data.step} of 2</p>
          )}
        </div>

        <input type="text" id="project-honeypot" className="honeypot" tabIndex={-1} autoComplete="off" />

        {/* ── Selection Screen ── */}
        {data.path === 'selection' && (
          <div key="selection" className="modal-step path-selection-step modal-step-anim">
            <div className="path-intro">
              <h2>What do you need?</h2>
              <p>We'll match you with the right people — whether you need one expert or a full crew.</p>
            </div>

            <div className="project-paths">
              <button type="button" className="path-card find-talent" onClick={() => setPath('find-talent')}>
                <div className="path-card-body">
                  <h3>Find talent</h3>
                  <p>You need a specific role or capability and want help finding the right contributor.</p>
                </div>
                <div className="path-card-action">
                  <span className="btn btn-primary btn-path">Find talent →</span>
                </div>
              </button>

              <button type="button" className="path-card build-team" onClick={() => setPath('build-team')}>
                <div className="path-card-body">
                  <h3>Build a team</h3>
                  <p>You have a project or initiative that needs multiple capabilities working together.</p>
                </div>
                <div className="path-card-action">
                  <span className="btn btn-primary btn-path">Build a team →</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── Find Talent Form ── */}
        {data.path === 'find-talent' && (
          <div key="find-talent" className="modal-step modal-step-anim">
            {data.step === 1 ? (
              <>
                <p className="step-title">Your request</p>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="pf-firstName">First name <span className="required">*</span></label>
                    <input
                      id="pf-firstName"
                      className={`form-input${errors.firstName ? ' has-error' : ''}`}
                      type="text"
                      value={data.firstName}
                      onChange={(e) => { update({ firstName: e.target.value }); clearError('firstName') }}
                      placeholder="Jane"
                    />
                    {errors.firstName && <p className="field-error">{errors.firstName}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pf-lastName">Last name <span className="required">*</span></label>
                    <input
                      id="pf-lastName"
                      className={`form-input${errors.lastName ? ' has-error' : ''}`}
                      type="text"
                      value={data.lastName}
                      onChange={(e) => { update({ lastName: e.target.value }); clearError('lastName') }}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="field-error">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-email">Work email <span className="required">*</span></label>
                  <input
                    id="pf-email"
                    className={`form-input${errors.email ? ' has-error' : ''}`}
                    type="email"
                    value={data.email}
                    onChange={(e) => { update({ email: e.target.value }); clearError('email') }}
                    placeholder="jane@company.com"
                  />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-company">Company / organization <span className="required">*</span></label>
                  <input
                    id="pf-company"
                    className={`form-input${errors.company ? ' has-error' : ''}`}
                    type="text"
                    value={data.company}
                    onChange={(e) => { update({ company: e.target.value }); clearError('company') }}
                    placeholder="Acme Corp"
                  />
                  {errors.company && <p className="field-error">{errors.company}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-rolesNeeded">What roles or capabilities do you need? <span className="required">*</span></label>
                  <p className="form-caption">Enter each role separated by a comma.</p>
                  <TagInput
                    id="pf-rolesNeeded"
                    tags={data.rolesNeeded}
                    onChange={(tags) => { update({ rolesNeeded: tags }); clearError('rolesNeeded') }}
                    placeholder="Senior product designer, React developer, grant writer"
                    hasError={!!errors.rolesNeeded}
                  />
                  {errors.rolesNeeded && <p className="field-error">{errors.rolesNeeded}</p>}
                </div>

                <div className="form-group">
                  <fieldset className="form-fieldset" style={{ border: 'none', padding: 0, margin: 0 }}>
                    <legend className="form-label">Relevant pillars <span className="required">*</span></legend>
                    <p className="form-caption">Select all that apply.</p>
                    <div className="pillar-chips">
                      {PILLARS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={`chip${data.findTalentPillars.includes(p) ? ' selected' : ''}`}
                          onClick={() => handlePillarToggle(p)}
                        >
                          {data.findTalentPillars.includes(p) && <span className="chip-check">✓</span>}
                          {p}
                        </button>
                      ))}
                    </div>
                    {errors.findTalentPillars && <p className="field-error">{errors.findTalentPillars}</p>}
                  </fieldset>
                </div>

                <div className="form-group">
                  <label className="form-label">Work arrangement <span className="required">*</span></label>
                  <div className="radio-row">
                    {WORK_ARRANGEMENTS.map((wa) => (
                      <label key={wa} className={`radio-label${data.workArrangement === wa ? ' selected' : ''}`}>
                        <input
                          type="radio"
                          name="workArrangement"
                          value={wa}
                          checked={data.workArrangement === wa}
                          onChange={() => { update({ workArrangement: wa, location: wa === 'Remote' ? '' : data.location }); clearError('workArrangement'); clearError('location') }}
                        />
                        {wa}
                      </label>
                    ))}
                  </div>
                  {errors.workArrangement && <p className="field-error">{errors.workArrangement}</p>}
                </div>

                {(data.workArrangement === 'Hybrid' || data.workArrangement === 'In-person') && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="pf-location">Location <span className="required">*</span></label>
                    <input
                      id="pf-location"
                      className={`form-input${errors.location ? ' has-error' : ''}`}
                      type="text"
                      value={data.location}
                      onChange={(e) => { update({ location: e.target.value }); clearError('location') }}
                      placeholder="City, Country"
                    />
                    {errors.location && <p className="field-error">{errors.location}</p>}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="step-title">Scope and context</p>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-requestSummary">What do you need? <span className="required">*</span></label>
                  <textarea
                    id="pf-requestSummary"
                    className={`form-textarea${errors.requestSummary ? ' has-error' : ''}`}
                    rows={5}
                    value={data.requestSummary}
                    onChange={(e) => { update({ requestSummary: e.target.value }); clearError('requestSummary') }}
                    placeholder="Tell us about the role, the work involved, the outcomes you need, and any context that will help us find the right person."
                  />
                  <p className={`word-count${wordCount(data.requestSummary) > MAX_WORDS ? ' over' : ''}`}>
                    {wordCount(data.requestSummary)} / {MAX_WORDS} words
                  </p>
                  {errors.requestSummary && <p className="field-error">{errors.requestSummary}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-relevantLink">Relevant link</label>
                  <input
                    id="pf-relevantLink"
                    className="form-input"
                    type="text"
                    value={data.relevantLink}
                    onChange={(e) => update({ relevantLink: e.target.value })}
                    placeholder="Project website, job post, existing brief, or relevant link"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Supporting PDF brief uploads</label>
                  <div
                    className="upload-area"
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p>Click to upload PDFs</p>
                    <p className="upload-hint">PDF only · Max 5 files · 12 MB each · 25 MB total</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={handleFilesSelected}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {fileValidationErrors.length > 0 && (
                    <div className="file-errors">
                      {fileValidationErrors.map((err, i) => (
                        <p key={i} className="field-error">{err}</p>
                      ))}
                    </div>
                  )}

                  {data.uploadedFiles.length > 0 && (
                    <ul className="file-list">
                      {data.uploadedFiles.map((uf) => (
                        <li key={uf.id} className="file-item">
                          <div className="file-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="file-name">{uf.name}</span>
                            <span className="file-size">{formatSize(uf.size)}</span>
                          </div>
                          <button type="button" className="file-remove" onClick={() => removeFile(uf.id)}>✕</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-budgetRange">Budget range</label>
                  <input
                    id="pf-budgetRange"
                    className="form-input"
                    type="text"
                    value={data.findTalentBudgetRange}
                    onChange={(e) => update({ findTalentBudgetRange: e.target.value })}
                    placeholder="Optional — share a range if you have one"
                  />
                </div>

                {/* Consent Section */}
                <div className="form-group" style={{ marginTop: 'var(--gap-lg)' }}>
                  <label className={`checkbox-label${errors.termsAccepted ? ' has-error' : ''}`}>
                    <input
                      type="checkbox"
                      checked={data.termsAccepted}
                      onChange={(e) => { update({ termsAccepted: e.target.checked }); clearError('termsAccepted') }}
                    />
                    <span>I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="link-placeholder">Terms</a> <span className="required">*</span></span>
                  </label>
                  {errors.termsAccepted && <p className="field-error">{errors.termsAccepted}</p>}
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={data.laborValueOptIn}
                      onChange={(e) => update({ laborValueOptIn: e.target.checked })}
                    />
                    <span>I'd like to participate in labor-value data research. See <a href="#" onClick={(e) => e.preventDefault()} className="link-placeholder">Data Use Policy</a>.</span>
                  </label>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Build a Team Form ── */}
        {data.path === 'build-team' && (
          <div key="build-team" className="modal-step modal-step-anim">
            {data.step === 1 ? (
              <>
                <p className="step-title">Your project</p>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="pf-firstName-bt">First name <span className="required">*</span></label>
                    <input
                      id="pf-firstName-bt"
                      className={`form-input${errors.firstName ? ' has-error' : ''}`}
                      type="text"
                      value={data.firstName}
                      onChange={(e) => { update({ firstName: e.target.value }); clearError('firstName') }}
                      placeholder="Jane"
                    />
                    {errors.firstName && <p className="field-error">{errors.firstName}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pf-lastName-bt">Last name <span className="required">*</span></label>
                    <input
                      id="pf-lastName-bt"
                      className={`form-input${errors.lastName ? ' has-error' : ''}`}
                      type="text"
                      value={data.lastName}
                      onChange={(e) => { update({ lastName: e.target.value }); clearError('lastName') }}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="field-error">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-email-bt">Work email <span className="required">*</span></label>
                  <input
                    id="pf-email-bt"
                    className={`form-input${errors.email ? ' has-error' : ''}`}
                    type="email"
                    value={data.email}
                    onChange={(e) => { update({ email: e.target.value }); clearError('email') }}
                    placeholder="jane@company.com"
                  />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-company-bt">Company / organization <span className="required">*</span></label>
                  <input
                    id="pf-company-bt"
                    className={`form-input${errors.company ? ' has-error' : ''}`}
                    type="text"
                    value={data.company}
                    onChange={(e) => { update({ company: e.target.value }); clearError('company') }}
                    placeholder="Acme Corp"
                  />
                  {errors.company && <p className="field-error">{errors.company}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-projectName">Project name</label>
                  <input
                    id="pf-projectName"
                    className="form-input"
                    type="text"
                    value={data.projectName}
                    onChange={(e) => update({ projectName: e.target.value })}
                    placeholder="Optional"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-projectSummary">What are you trying to build or deliver? <span className="required">*</span></label>
                  <textarea
                    id="pf-projectSummary"
                    className={`form-textarea${errors.projectSummary ? ' has-error' : ''}`}
                    rows={5}
                    value={data.projectSummary}
                    onChange={(e) => { update({ projectSummary: e.target.value }); clearError('projectSummary') }}
                    placeholder="Describe the project, initiative, problem, or outcome you need help with."
                  />
                  <p className={`word-count${wordCount(data.projectSummary) > MAX_WORDS ? ' over' : ''}`}>
                    {wordCount(data.projectSummary)} / {MAX_WORDS} words
                  </p>
                  {errors.projectSummary && <p className="field-error">{errors.projectSummary}</p>}
                </div>

                <div className="form-group">
                  <fieldset className="form-fieldset" style={{ border: 'none', padding: 0, margin: 0 }}>
                    <legend className="form-label">Relevant pillars <span className="required">*</span></legend>
                    <p className="form-caption">Select all that apply.</p>
                    <div className="pillar-chips">
                      {PILLARS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={`chip${data.buildTeamPillars.includes(p) ? ' selected' : ''}`}
                          onClick={() => handlePillarToggle(p)}
                        >
                          {data.buildTeamPillars.includes(p) && <span className="chip-check">✓</span>}
                          {p}
                        </button>
                      ))}
                    </div>
                    {errors.buildTeamPillars && <p className="field-error">{errors.buildTeamPillars}</p>}
                  </fieldset>
                </div>

                <div className="form-group">
                  <label className="form-label">Work arrangement <span className="required">*</span></label>
                  <div className="radio-row">
                    {WORK_ARRANGEMENTS.map((wa) => (
                      <label key={wa} className={`radio-label${data.workArrangement === wa ? ' selected' : ''}`}>
                        <input
                          type="radio"
                          name="workArrangement-bt"
                          value={wa}
                          checked={data.workArrangement === wa}
                          onChange={() => { update({ workArrangement: wa, location: wa === 'Remote' ? '' : data.location }); clearError('workArrangement'); clearError('location') }}
                        />
                        {wa}
                      </label>
                    ))}
                  </div>
                  {errors.workArrangement && <p className="field-error">{errors.workArrangement}</p>}
                </div>

                {(data.workArrangement === 'Hybrid' || data.workArrangement === 'In-person') && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="pf-location-bt">Location <span className="required">*</span></label>
                    <input
                      id="pf-location-bt"
                      className={`form-input${errors.location ? ' has-error' : ''}`}
                      type="text"
                      value={data.location}
                      onChange={(e) => { update({ location: e.target.value }); clearError('location') }}
                      placeholder="City, Country"
                    />
                    {errors.location && <p className="field-error">{errors.location}</p>}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="step-title">Team and context</p>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-teamCapabilities">What capabilities do you think the team needs?</label>
                  <p className="form-caption">Enter each role separated by a comma.</p>
                  <TagInput
                    id="pf-teamCapabilities"
                    tags={data.teamCapabilities}
                    onChange={(tags) => update({ teamCapabilities: tags })}
                    placeholder="Strategy, research, design, engineering, production"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-relevantLink-bt">Relevant link</label>
                  <input
                    id="pf-relevantLink-bt"
                    className="form-input"
                    type="text"
                    value={data.relevantLink}
                    onChange={(e) => update({ relevantLink: e.target.value })}
                    placeholder="Project website, job post, existing brief, or relevant link"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Supporting PDF brief uploads</label>
                  <div
                    className="upload-area"
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p>Click to upload PDFs</p>
                    <p className="upload-hint">PDF only · Max 5 files · 12 MB each · 25 MB total</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={handleFilesSelected}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {fileValidationErrors.length > 0 && (
                    <div className="file-errors">
                      {fileValidationErrors.map((err, i) => (
                        <p key={i} className="field-error">{err}</p>
                      ))}
                    </div>
                  )}

                  {data.uploadedFiles.length > 0 && (
                    <ul className="file-list">
                      {data.uploadedFiles.map((uf) => (
                        <li key={uf.id} className="file-item">
                          <div className="file-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="file-name">{uf.name}</span>
                            <span className="file-size">{formatSize(uf.size)}</span>
                          </div>
                          <button type="button" className="file-remove" onClick={() => removeFile(uf.id)}>✕</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-engagementLength">Estimated engagement length</label>
                  <select
                    id="pf-engagementLength"
                    className="form-input"
                    value={data.engagementLength}
                    onChange={(e) => update({ engagementLength: e.target.value })}
                    style={{ background: 'var(--bg)', color: 'var(--fg)' }}
                  >
                    <option value="">Select options...</option>
                    {ENGAGEMENT_LENGTHS.map((el) => (
                      <option key={el} value={el}>{el}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-budgetRange-bt">Budget range</label>
                  <input
                    id="pf-budgetRange-bt"
                    className="form-input"
                    type="text"
                    value={data.buildTeamBudgetRange}
                    onChange={(e) => update({ buildTeamBudgetRange: e.target.value })}
                    placeholder="Optional — share a range if you have one"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pf-additionalNotes">Anything else we should know?</label>
                  <textarea
                    id="pf-additionalNotes"
                    className="form-textarea"
                    rows={4}
                    value={data.additionalNotes}
                    onChange={(e) => update({ additionalNotes: e.target.value })}
                    placeholder="Optional — share any timeline constraints, target milestones, or other helpful details."
                  />
                </div>

                {/* Consent Section */}
                <div className="form-group" style={{ marginTop: 'var(--gap-lg)' }}>
                  <label className={`checkbox-label${errors.termsAccepted ? ' has-error' : ''}`}>
                    <input
                      type="checkbox"
                      checked={data.termsAccepted}
                      onChange={(e) => { update({ termsAccepted: e.target.checked }); clearError('termsAccepted') }}
                    />
                    <span>I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="link-placeholder">Terms</a> <span className="required">*</span></span>
                  </label>
                  {errors.termsAccepted && <p className="field-error">{errors.termsAccepted}</p>}
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={data.laborValueOptIn}
                      onChange={(e) => update({ laborValueOptIn: e.target.checked })}
                    />
                    <span>I'd like to participate in labor-value data research. See <a href="#" onClick={(e) => e.preventDefault()} className="link-placeholder">Data Use Policy</a>.</span>
                  </label>
                </div>
              </>
            )}
          </div>
        )}

        {submitState === 'error' && (
          <div className="submit-error-banner">
            {submitError}
          </div>
        )}

        <ScrollCue containerRef={modalRef} isOpen={isOpen} />

        <div className="modal-footer">
          {data.path !== 'selection' ? (
            <>
              <button type="button" className="btn btn-ghost" onClick={handleBack}>Back</button>
              <button
                type="button"
                className="btn btn-join"
                onClick={handleContinue}
                disabled={submitState === 'submitting'}
              >
                {submitState === 'submitting'
                  ? 'Submitting…'
                  : data.step === 1
                    ? 'Continue'
                    : 'Submit request'
                }
              </button>
            </>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
