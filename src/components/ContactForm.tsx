import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import './ContactForm.css'

export type InquiryData = {
  firstName: string
  lastName: string
  businessName: string
  email: string
  phone: string
  inquiry: string
}

export type ContactFormProps = {
  /**
   * Delivers the inquiry (e.g. via email + text). Should resolve on success
   * and reject on failure so the form can show the right state.
   */
  onSubmit: (data: InquiryData) => Promise<void>
}

const EMPTY: InquiryData = {
  firstName: '',
  lastName: '',
  businessName: '',
  email: '',
  phone: '',
  inquiry: '',
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

type Errors = Partial<Record<keyof InquiryData, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns a map of field -> error message for any invalid/missing fields. */
function validate(data: InquiryData): Errors {
  const errors: Errors = {}

  if (!data.firstName.trim()) errors.firstName = 'Please enter your first name.'
  if (!data.lastName.trim()) errors.lastName = 'Please enter your last name.'
  if (!data.businessName.trim())
    errors.businessName = 'Please enter your business name.'

  if (!data.email.trim()) errors.email = 'Please enter your email.'
  else if (!EMAIL_RE.test(data.email.trim()))
    errors.email = 'Please enter a valid email address.'

  const phoneDigits = data.phone.replace(/\D/g, '')
  if (!data.phone.trim()) errors.phone = 'Please enter your phone number.'
  else if (phoneDigits.length < 10)
    errors.phone = 'Please enter a valid phone number (at least 10 digits).'

  if (!data.inquiry.trim()) errors.inquiry = 'Please tell us how we can help.'

  return errors
}

/** Contact inquiry form with a success state that replaces the form once sent. */
function ContactForm({ onSubmit }: ContactFormProps): ReactNode {
  const [data, setData] = useState<InquiryData>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})

  const update =
    (field: keyof InquiryData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target
      setData((prev) => ({ ...prev, [field]: value }))
      // Once a field has been flagged, re-check it live so the error clears
      // as soon as the input becomes valid.
      setErrors((prev) =>
        prev[field]
          ? { ...prev, [field]: validate({ ...data, [field]: value })[field] }
          : prev,
      )
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Honeypot: humans never see this field, so if it's filled it's almost
    // certainly a bot. Pretend it succeeded and silently drop it.
    const honeypot = event.currentTarget.elements.namedItem('botcheck')
    if (honeypot instanceof HTMLInputElement && honeypot.checked) {
      setStatus('success')
      return
    }

    const nextErrors = validate(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      await onSubmit(data)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-success" role="status">
        <h2 className="contact-success-title">Thanks, {data.firstName}!</h2>
        <p>
          Your inquiry has been sent. We&apos;ll get back to you shortly at the
          details you provided.
        </p>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot — hidden from real users; bots that fill it are dropped. */}
      <input
        type="checkbox"
        name="botcheck"
        className="contact-honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="contact-form-row">
        <label className="contact-field">
          <span className="contact-label">First name</span>
          <input
            type="text"
            name="firstName"
            value={data.firstName}
            onChange={update('firstName')}
            required
            autoComplete="given-name"
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={errors.firstName ? 'error-firstName' : undefined}
          />
          {errors.firstName && (
            <span className="contact-field-error" id="error-firstName">
              {errors.firstName}
            </span>
          )}
        </label>

        <label className="contact-field">
          <span className="contact-label">Last name</span>
          <input
            type="text"
            name="lastName"
            value={data.lastName}
            onChange={update('lastName')}
            required
            autoComplete="family-name"
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={errors.lastName ? 'error-lastName' : undefined}
          />
          {errors.lastName && (
            <span className="contact-field-error" id="error-lastName">
              {errors.lastName}
            </span>
          )}
        </label>
      </div>

      <label className="contact-field">
        <span className="contact-label">Business name</span>
        <input
          type="text"
          name="businessName"
          value={data.businessName}
          onChange={update('businessName')}
          required
          autoComplete="organization"
          aria-invalid={errors.businessName ? true : undefined}
          aria-describedby={errors.businessName ? 'error-businessName' : undefined}
        />
        {errors.businessName && (
          <span className="contact-field-error" id="error-businessName">
            {errors.businessName}
          </span>
        )}
      </label>

      <div className="contact-form-row">
        <label className="contact-field">
          <span className="contact-label">Email</span>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={update('email')}
            required
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'error-email' : undefined}
          />
          {errors.email && (
            <span className="contact-field-error" id="error-email">
              {errors.email}
            </span>
          )}
        </label>

        <label className="contact-field">
          <span className="contact-label">Phone</span>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={update('phone')}
            required
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? 'error-phone' : undefined}
          />
          {errors.phone && (
            <span className="contact-field-error" id="error-phone">
              {errors.phone}
            </span>
          )}
        </label>
      </div>

      <label className="contact-field">
        <span className="contact-label">How can we help?</span>
        <textarea
          name="inquiry"
          value={data.inquiry}
          onChange={update('inquiry')}
          required
          rows={6}
          aria-invalid={errors.inquiry ? true : undefined}
          aria-describedby={errors.inquiry ? 'error-inquiry' : undefined}
        />
        {errors.inquiry && (
          <span className="contact-field-error" id="error-inquiry">
            {errors.inquiry}
          </span>
        )}
      </label>

      {status === 'error' && (
        <p className="contact-error" role="alert">
          Sorry, something went wrong sending your inquiry. Please try again.
        </p>
      )}

      <button type="submit" className="contact-submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Submit'}
      </button>
    </form>
  )
}

export default ContactForm
