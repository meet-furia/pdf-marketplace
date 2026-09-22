import { useEffect, useState } from 'react'
import {
  getSellerPaymentDetails,
  saveSellerPaymentDetails,
} from '../services/sellerService'

const initialForm = {
  accountHolderName: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  upiId: '',
}

const ACCOUNT_NUMBER_PATTERN = /^[0-9]{9,18}$/
const ACCOUNT_HOLDER_PATTERN = /^[\p{L}\p{M} .'-]+$/u
const IFSC_PATTERN = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/
const UPI_PATTERN = /^[A-Za-z0-9._-]{2,256}@[A-Za-z0-9.-]{2,64}$/

function SellerPaymentDetailsPage() {
  const [form, setForm] = useState(initialForm)
  const [savedDetails, setSavedDetails] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let isCurrent = true

    const loadPaymentDetails = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getSellerPaymentDetails()
        const details = response.data

        if (isCurrent && details) {
          setSavedDetails(details)
          setForm({
            accountHolderName: details.accountHolderName || '',
            bankName: details.bankName || '',
            accountNumber: '',
            ifscCode: details.ifscCode || '',
            upiId: details.upiId || '',
          })
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message || 'Unable to load payment details.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadPaymentDetails()

    return () => {
      isCurrent = false
    }
  }, [])

  const updateForm = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.accountHolderName.trim()) {
      setError('Account holder name is required.')
      return
    }

    if (
      form.accountHolderName.trim().length < 2 ||
      !ACCOUNT_HOLDER_PATTERN.test(form.accountHolderName.trim())
    ) {
      setError('Enter a valid account holder name.')
      return
    }

    const bankName = form.bankName.trim()
    const accountNumber = form.accountNumber.trim()
    const ifscCode = form.ifscCode.trim()
    const upiId = form.upiId.trim()
    const hasSavedAccountNumber = Boolean(savedDetails?.maskedAccountNumber)
    const hasAccountNumber = Boolean(accountNumber || hasSavedAccountNumber)
    const hasAnyBankDetail = Boolean(bankName || hasAccountNumber || ifscCode)
    const hasCompleteBankDetails = Boolean(
      bankName && hasAccountNumber && ifscCode
    )

    if (accountNumber && !ACCOUNT_NUMBER_PATTERN.test(accountNumber)) {
      setError('Account number must contain 9 to 18 digits.')
      return
    }

    if (ifscCode && !IFSC_PATTERN.test(ifscCode)) {
      setError('IFSC code must use the format ABCD0123456.')
      return
    }

    if (upiId && !UPI_PATTERN.test(upiId)) {
      setError('Enter a valid UPI ID such as name@bank.')
      return
    }

    if (hasAnyBankDetail && !hasCompleteBankDetails) {
      setError(
        'Bank name, account number, and IFSC code are all required for bank payouts.'
      )
      return
    }

    if (!hasCompleteBankDetails && !upiId) {
      setError('Provide complete bank details or a UPI ID.')
      return
    }

    setIsSaving(true)

    try {
      const response = await saveSellerPaymentDetails({
        accountHolderName: form.accountHolderName.trim(),
        bankName: bankName || undefined,
        accountNumber: accountNumber || undefined,
        ifscCode: ifscCode.toUpperCase() || undefined,
        upiId: upiId || undefined,
      })

      setSavedDetails(response.data)
      setForm((currentForm) => ({
        ...currentForm,
        accountNumber: '',
      }))
      setSuccess('Payment details saved successfully.')
    } catch (saveError) {
      setError(saveError.message || 'Unable to save payment details.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <section className="grid min-h-72 place-items-center rounded-lg border border-slate-200 bg-white">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Loading payment details
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
            Seller payouts
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            Payment details
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Save payout account information for future seller earnings.
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Account holder name
            </span>
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              onChange={(event) =>
                updateForm('accountHolderName', event.target.value)
              }
              maxLength={100}
              minLength={2}
              required
              type="text"
              value={form.accountHolderName}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Bank name
            </span>
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              onChange={(event) => updateForm('bankName', event.target.value)}
              maxLength={100}
              type="text"
              value={form.bankName}
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Account number
              </span>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              onChange={(event) =>
                  updateForm(
                    'accountNumber',
                    event.target.value.replace(/\D/g, '').slice(0, 18)
                  )
                }
                inputMode="numeric"
                maxLength={18}
                minLength={9}
                pattern="[0-9]{9,18}"
                placeholder={
                  savedDetails?.maskedAccountNumber
                    ? `Current: ${savedDetails.maskedAccountNumber}`
                    : ''
                }
                type="text"
                value={form.accountNumber}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                IFSC code
              </span>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base uppercase outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                onChange={(event) => updateForm('ifscCode', event.target.value)}
                maxLength={11}
                pattern="[A-Za-z]{4}0[A-Za-z0-9]{6}"
                type="text"
                value={form.ifscCode}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              UPI ID
            </span>
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              onChange={(event) => updateForm('upiId', event.target.value)}
              maxLength={321}
              pattern="[A-Za-z0-9._-]{2,256}@[A-Za-z0-9.-]{2,64}"
              type="text"
              value={form.upiId}
            />
          </label>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <button
          className="mt-6 w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? 'Saving...' : 'Save payment details'}
        </button>
      </form>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">Saved details</h3>

        {savedDetails ? (
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-slate-500">Account holder</dt>
              <dd className="mt-1 font-bold text-slate-950">
                {savedDetails.accountHolderName || 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Bank</dt>
              <dd className="mt-1 font-bold text-slate-950">
                {savedDetails.bankName || 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Account</dt>
              <dd className="mt-1 font-bold text-slate-950">
                {savedDetails.maskedAccountNumber || 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">IFSC</dt>
              <dd className="mt-1 font-bold text-slate-950">
                {savedDetails.ifscCode || 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">UPI</dt>
              <dd className="mt-1 font-bold text-slate-950">
                {savedDetails.upiId || 'Not set'}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-600">
            No payment details saved yet.
          </p>
        )}
      </aside>
    </section>
  )
}

export default SellerPaymentDetailsPage
