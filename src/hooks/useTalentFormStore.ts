import { useState, useCallback } from 'react'

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
}

interface TalentFormData {
  step: number
  firstName: string
  lastName: string
  email: string
  company: string
  pillars: string[]
  hasReferral: string
  referralName: string
  portfolioUrl: string
  uploadedFiles: UploadedFile[]
  contributionSummary: string
  termsAccepted: boolean
  laborValueOptIn: boolean
}

const defaultData: TalentFormData = {
  step: 1,
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  pillars: [],
  hasReferral: '',
  referralName: '',
  portfolioUrl: '',
  uploadedFiles: [],
  contributionSummary: '',
  termsAccepted: false,
  laborValueOptIn: false,
}

let storedData: TalentFormData = { ...defaultData }

export function useTalentFormStore() {
  const [data, setData] = useState<TalentFormData>({ ...storedData })

  const update = useCallback((patch: Partial<TalentFormData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch }
      storedData = { ...next }
      return next
    })
  }, [])

  const setStep = useCallback((step: number) => update({ step }), [update])

  const reset = useCallback(() => {
    storedData = { ...defaultData }
    setData({ ...defaultData })
  }, [])

  return { data, update, setStep, reset }
}
