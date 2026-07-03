import { useState, useRef, useCallback } from 'react'
import { useTalentFormStore, type UploadedFile } from '../hooks/useTalentFormStore'
import ScrollCue from './ScrollCue'

const PILLARS = ['STEM', 'Creative Media', 'Professional Services'] as const
const MAX_WORDS = 300
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

interface TalentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TalentModal({ isOpen, onClose }: TalentModalProps) {
  const { data, update, setStep, reset } = useTalentFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'error' | 'done'>('idle')
  const [submitError, setSubmitError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileValidationErrors, setFileValidationErrors] = useState<string[]>([])

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
    if (!data.email.trim()) errs.email = 'Email is required.'
    else if (!validateEmail(data.email.trim())) errs.email = 'Please enter a valid email address.'
    if (data.pillars.length === 0) errs.pillars = 'Select at least one pillar.'
    if (data.hasReferral === 'yes' && !data.referralName.trim()) errs.referralName = 'Enter the name of the person who referred you.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [data])

  const validateStep2 = useCallback(() => {
    const errs: Record<string, string> = {}
    const hasUrl = data.portfolioUrl.trim().length > 0
    const hasFiles = data.uploadedFiles.length > 0
    if (!hasUrl && !hasFiles) errs.portfolio = 'Provide a portfolio URL or upload at least one PDF.'
    if (!data.contributionSummary.trim()) errs.contributionSummary = 'Tell us what you want to contribute.'
    else if (wordCount(data.contributionSummary) > MAX_WORDS) errs.contributionSummary = `Maximum ${MAX_WORDS} words.`
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
      formData.append('firstName', data.firstName.trim())
      formData.append('lastName', data.lastName.trim())
      formData.append('email', data.email.trim())
      formData.append('company', data.company.trim())
      data.pillars.forEach((p) => formData.append('pillars', p))
      formData.append('hasReferral', data.hasReferral)
      if (data.hasReferral === 'yes') formData.append('referralName', data.referralName.trim())
      formData.append('portfolioUrl', data.portfolioUrl.trim())
      data.uploadedFiles.forEach((uf) => formData.append('files', uf.file))
      formData.append('contributionSummary', data.contributionSummary.trim())
      formData.append('termsAccepted', String(data.termsAccepted))
      formData.append('laborValueOptIn', String(data.laborValueOptIn))
      formData.append('honeypot', (document.getElementById('talent-honeypot') as HTMLInputElement)?.value || '')

      const res = await fetch('/api/talent-applications', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to send application. Please try again.')
      }

      const body = await res.json()
      if (body.success) {
        setSubmitState('done')
      } else {
        throw new Error('Failed to send application. Please try again.')
      }
    } catch (err) {
      setSubmitState('error')
      setSubmitError(err instanceof Error ? err.message : 'Failed to send application. Please try again.')
    }
  }, [data, submitState])

  const handleContinue = useCallback(() => {
    if (data.step === 1 && validateStep1()) setStep(2)
    else if (data.step === 2 && validateStep2()) {
      handleSubmit()
    }
  }, [data.step, validateStep1, validateStep2, setStep, handleSubmit])

  const handleBack = useCallback(() => {
    setStep(1)
    setErrors({})
  }, [setStep])

  const handlePillarToggle = useCallback((pillar: string) => {
    const next = data.pillars.includes(pillar)
      ? data.pillars.filter((p) => p !== pillar)
      : [...data.pillars, pillar]
    update({ pillars: next })
    if (next.length > 0) clearError('pillars')
  }, [data.pillars, update, clearError])

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
      clearError('portfolio')
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [data.uploadedFiles, update, clearError])

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
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handleClose}>✕</button>
          <div className="modal-success">
            <h2>Application received</h2>
            <p className="modal-success-body">Thanks for sharing your work. We'll review your application and be in touch if there's a fit.</p>
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
      <div className="modal" onClick={(e) => e.stopPropagation()} ref={modalRef}>
        <button className="modal-close" onClick={handleClose}>✕</button>

        <div className="modal-header">
          <p className="eyebrow">Join the Cooperative</p>
          <p className="step-indicator-text">Step {data.step} of 2</p>
        </div>

        <input type="text" id="talent-honeypot" className="honeypot" tabIndex={-1} autoComplete="off" />

        {data.step === 1 && (
          <div className="modal-step">
            <p className="step-title">Your profile</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="tf-firstName">First name <span className="required">*</span></label>
                <input
                  id="tf-firstName"
                  className={`form-input${errors.firstName ? ' has-error' : ''}`}
                  type="text"
                  value={data.firstName}
                  onChange={(e) => { update({ firstName: e.target.value }); clearError('firstName') }}
                  placeholder="Jane"
                />
                {errors.firstName && <p className="field-error">{errors.firstName}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="tf-lastName">Last name <span className="required">*</span></label>
                <input
                  id="tf-lastName"
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
              <label className="form-label" htmlFor="tf-email">Email <span className="required">*</span></label>
              <input
                id="tf-email"
                className={`form-input${errors.email ? ' has-error' : ''}`}
                type="email"
                value={data.email}
                onChange={(e) => { update({ email: e.target.value }); clearError('email') }}
                placeholder="jane@example.com"
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tf-company">Company</label>
              <input
                id="tf-company"
                className="form-input"
                type="text"
                value={data.company}
                onChange={(e) => update({ company: e.target.value })}
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <fieldset className="form-fieldset">
                <legend className="form-label">Which pillars do you work across? <span className="required">*</span></legend>
                <div className="pillar-chips">
                  {PILLARS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`chip${data.pillars.includes(p) ? ' selected' : ''}`}
                      onClick={() => handlePillarToggle(p)}
                    >
                      {data.pillars.includes(p) && <span className="chip-check">✓</span>}
                      {p}
                    </button>
                  ))}
                </div>
                {errors.pillars && <p className="field-error">{errors.pillars}</p>}
              </fieldset>
            </div>

            <div className="form-group">
              <label className="form-label">Do you have a referral? <span className="required">*</span></label>
              <div className="radio-row">
                <label className={`radio-label${data.hasReferral === 'yes' ? ' selected' : ''}`}>
                  <input
                    type="radio"
                    name="hasReferral"
                    value="yes"
                    checked={data.hasReferral === 'yes'}
                    onChange={() => { update({ hasReferral: 'yes' }); clearError('referralName') }}
                  />
                  Yes
                </label>
                <label className={`radio-label${data.hasReferral === 'no' ? ' selected' : ''}`}>
                  <input
                    type="radio"
                    name="hasReferral"
                    value="no"
                    checked={data.hasReferral === 'no'}
                    onChange={() => { update({ hasReferral: 'no', referralName: '' }); clearError('referralName') }}
                  />
                  No
                </label>
              </div>
            </div>

            {data.hasReferral === 'yes' && (
              <div className="form-group">
                <label className="form-label" htmlFor="tf-referralName">Referral name <span className="required">*</span></label>
                <input
                  id="tf-referralName"
                  className={`form-input${errors.referralName ? ' has-error' : ''}`}
                  type="text"
                  value={data.referralName}
                  onChange={(e) => { update({ referralName: e.target.value }); clearError('referralName') }}
                  placeholder="Enter the full name of the person who referred you"
                />
                {errors.referralName && <p className="field-error">{errors.referralName}</p>}
              </div>
            )}
          </div>
        )}

        {data.step === 2 && (
          <div className="modal-step">
            <p className="step-title">Your work and consent</p>

            <div className="form-group">
              <p className="form-label">Resume / portfolio</p>
              <p className="form-caption">Provide a link, upload PDF files, or both.</p>

              <div className="form-group">
                <label className="form-label" htmlFor="tf-portfolioUrl">Portfolio or profile URL</label>
                <input
                  id="tf-portfolioUrl"
                  className={`form-input${errors.portfolio ? ' has-error' : ''}`}
                  type="url"
                  value={data.portfolioUrl}
                  onChange={(e) => { update({ portfolioUrl: e.target.value }); clearError('portfolio') }}
                  placeholder="https://yourportfolio.com or LinkedIn URL"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload PDFs</label>
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

                {errors.portfolio && <p className="field-error">{errors.portfolio}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tf-contribution">What do you want to contribute? <span className="required">*</span></label>
              <textarea
                id="tf-contribution"
                className={`form-textarea${errors.contributionSummary ? ' has-error' : ''}`}
                rows={5}
                value={data.contributionSummary}
                onChange={(e) => { update({ contributionSummary: e.target.value }); clearError('contributionSummary') }}
                placeholder="What are you best at? What domains, projects, or types of work do you want more of through the cooperative?"
              />
              <p className={`word-count${wordCount(data.contributionSummary) > MAX_WORDS ? ' over' : ''}`}>
                {wordCount(data.contributionSummary)} / {MAX_WORDS} words
              </p>
              {errors.contributionSummary && <p className="field-error">{errors.contributionSummary}</p>}
            </div>

            <div className="form-group">
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
          </div>
        )}

        {submitState === 'error' && (
          <div className="submit-error-banner">
            {submitError}
          </div>
        )}

        <ScrollCue containerRef={modalRef} isOpen={isOpen} />

        <div className="modal-footer">
          {data.step === 2 && (
            <button className="btn btn-ghost" onClick={handleBack}>Back</button>
          )}
          {data.step === 1 && <div />}
          <button
            className="btn btn-join"
            onClick={handleContinue}
            disabled={submitState === 'submitting'}
          >
            {submitState === 'submitting'
              ? 'Submitting…'
              : data.step === 1
                ? 'Continue'
                : 'Submit application'
            }
          </button>
        </div>
      </div>
    </div>
  )
}
