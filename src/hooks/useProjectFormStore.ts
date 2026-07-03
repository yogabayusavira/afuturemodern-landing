import { useState, useCallback } from 'react'

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
}

export interface ProjectFormData {
  path: 'selection' | 'find-talent' | 'build-team'
  step: number

  // Shared Client fields
  firstName: string
  lastName: string
  email: string
  company: string
  workArrangement: string
  location: string
  relevantLink: string
  uploadedFiles: UploadedFile[]
  termsAccepted: boolean
  laborValueOptIn: boolean

  // Find Talent specific
  rolesNeeded: string[]
  findTalentPillars: string[]
  requestSummary: string
  findTalentBudgetRange: string

  // Build a Team specific
  projectName: string
  projectSummary: string
  buildTeamPillars: string[]
  teamCapabilities: string[]
  engagementLength: string
  buildTeamBudgetRange: string
  additionalNotes: string
}

const defaultData: ProjectFormData = {
  path: 'selection',
  step: 1,
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  workArrangement: '',
  location: '',
  relevantLink: '',
  uploadedFiles: [],
  termsAccepted: false,
  laborValueOptIn: false,
  rolesNeeded: [],
  findTalentPillars: [],
  requestSummary: '',
  findTalentBudgetRange: '',
  projectName: '',
  projectSummary: '',
  buildTeamPillars: [],
  teamCapabilities: [],
  engagementLength: '',
  buildTeamBudgetRange: '',
  additionalNotes: '',
}

let storedData: ProjectFormData = { ...defaultData }

export function useProjectFormStore() {
  const [data, setData] = useState<ProjectFormData>({ ...storedData })

  const update = useCallback((patch: Partial<ProjectFormData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch }
      storedData = { ...next }
      return next
    })
  }, [])

  const setStep = useCallback((step: number) => update({ step }), [update])
  const setPath = useCallback((path: ProjectFormData['path']) => update({ path, step: 1 }), [update])

  const reset = useCallback(() => {
    storedData = { ...defaultData }
    setData({ ...defaultData })
  }, [])

  return { data, update, setStep, setPath, reset }
}
