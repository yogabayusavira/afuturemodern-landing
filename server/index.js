import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { Resend } from 'resend'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

const resend = new Resend(process.env.RESEND_API_KEY)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'))
      return
    }
    cb(null, true)
  },
})

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  const startedAt = Date.now()

  console.log(`[request] ${req.method} ${req.originalUrl}`)

  res.on('finish', () => {
    console.log(
      `[response] ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - startedAt}ms)`
    )
  })

  next()
})


app.post('/api/talent-applications', upload.array('files', 5), async (req, res) => {
  try {
    const {
      firstName, lastName, email, company, pillars, hasReferral,
      referralName, portfolioUrl, contributionSummary,
      termsAccepted, laborValueOptIn, honeypot,
    } = req.body

    if (honeypot) {
      return res.json({ success: true })
    }

    const files = req.files || []
    const submittedAt = new Date().toISOString()

    const pillarsArr = Array.isArray(pillars) ? pillars : (pillars ? [pillars] : [])
    const attachments = files.map((f) => ({
      filename: f.originalname,
      content: f.buffer,
      contentType: 'application/pdf',
    }))

    const html = `
      <h2>New Talent Application</h2>
      <table style="border-collapse:collapse;width:100%">
        ${[
          ['First Name', firstName],
          ['Last Name', lastName],
          ['Email', email],
          ['Company', company || '—'],
          ['Pillars', pillarsArr.join(', ')],
          ['Has Referral', hasReferral],
          ['Referral Name', referralName || '—'],
          ['Portfolio URL', portfolioUrl || '—'],
          ['Contribution Summary', contributionSummary],
          ['Terms Accepted', termsAccepted],
          ['Labor Value Opt-In', laborValueOptIn || '—'],
          ['Submitted At', submittedAt],
        ].map(([label, value]) => `
          <tr style="border-bottom:1px solid #ddd">
            <td style="padding:8px 12px;font-weight:600;vertical-align:top;white-space:nowrap">${label}</td>
            <td style="padding:8px 12px">${value}</td>
          </tr>
        `).join('')}
      </table>
      ${files.length ? `
        <h3>Attached PDFs (${files.length})</h3>
        <ul>${files.map(f => `<li>${f.originalname} (${(f.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}</ul>
      ` : ''}
    `

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.TALENT_APPLICATIONS_EMAIL,
      replyTo: email,
      subject: `New Talent Application — ${firstName} ${lastName}`,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send application. Please try again.' })
    }

    res.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({ error: err.message || 'Failed to send application. Please try again.' })
  }
})

app.post(
  '/api/project-submissions',
  (req, _res, next) => {
    console.log('[project-submissions] route reached')
    next()
  },
  upload.array('files', 5),
  async (req, res) => {
  try {
    const {
      path: projectPath,
      firstName, lastName, email, company, workArrangement, location,
      relevantLink, termsAccepted, laborValueOptIn, honeypot,
      rolesNeeded, pillars, requestSummary, budgetRange,
      projectName, projectSummary, teamCapabilities,
      engagementLength, additionalNotes
    } = req.body

    if (honeypot) {
      return res.json({ success: true })
    }

    const files = req.files || []

    if (files.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 files allowed.' })
    }
    const combinedSize = files.reduce((acc, f) => acc + f.size, 0)
    if (combinedSize > 25 * 1024 * 1024) {
      return res.status(400).json({ error: 'Combined size exceeds 25 MB.' })
    }

    const submittedAt = new Date().toISOString()
    const attachments = files.map((f) => ({
      filename: f.originalname,
      content: f.buffer,
      contentType: 'application/pdf',
    }))

    const isFindTalent = projectPath === 'find-talent'
    const toEmail = isFindTalent ? process.env.FIND_TALENT_EMAIL : process.env.BUILD_TEAM_EMAIL
    const subject = isFindTalent
      ? `New Find Talent Request — ${company}`
      : `New Build a Team Request — ${company}`

    const parseArray = (val) => {
      if (!val) return []
      if (Array.isArray(val)) return val
      return [val]
    }

    const pillarsArr = parseArray(pillars)
    const rolesArr = parseArray(rolesNeeded)
    const teamCapsArr = parseArray(teamCapabilities)

    const tableRows = [
      ['First Name', firstName],
      ['Last Name', lastName],
      ['Email', email],
      ['Company / Organization', company],
      ['Work Arrangement', workArrangement],
      ['Location', location || '—'],
      ['Relevant Link', relevantLink || '—'],
      ['Terms Accepted', termsAccepted],
      ['Labor Value Opt-In', laborValueOptIn || '—'],
      ['Submitted At', submittedAt],
    ]

    if (isFindTalent) {
      tableRows.push(
        ['Roles / Capabilities Needed', rolesArr.join(', ')],
        ['Pillars', pillarsArr.join(', ')],
        ['Request Summary', requestSummary],
        ['Budget Range', budgetRange || '—']
      )
    } else {
      tableRows.push(
        ['Project Name', projectName || '—'],
        ['Project Summary', projectSummary],
        ['Pillars', pillarsArr.join(', ')],
        ['Team Capabilities Needed', teamCapsArr.join(', ')],
        ['Engagement Length', engagementLength || '—'],
        ['Budget Range', budgetRange || '—'],
        ['Additional Notes', additionalNotes || '—']
      )
    }

    const html = `
      <h2>New Project Request (${isFindTalent ? 'Find Talent' : 'Build a Team'})</h2>
      <table style="border-collapse:collapse;width:100%">
        ${tableRows.map(([label, value]) => `
          <tr style="border-bottom:1px solid #ddd">
            <td style="padding:8px 12px;font-weight:600;vertical-align:top;white-space:nowrap">${label}</td>
            <td style="padding:8px 12px">${value}</td>
          </tr>
        `).join('')}
      </table>
      ${files.length ? `
        <h3>Attached PDFs (${files.length})</h3>
        <ul>${files.map(f => `<li>${f.originalname} (${(f.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}</ul>
      ` : ''}
    `

    const { data: resData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: toEmail,
      replyTo: email,
      subject,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send request. Please try again.' })
    }

    res.json({ success: true, id: resData?.id })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({ error: err.message || 'Failed to send request. Please try again.' })
  }
)

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum 12 MB per file.' })
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum 5 files.' })
    }
    return res.status(400).json({ error: err.message })
  }
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ error: err.message })
  }
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
