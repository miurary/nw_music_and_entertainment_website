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

/** Contact inquiry form with a success state that replaces the form once sent. */
function ContactForm({ onSubmit }: ContactFormProps): ReactNode {
  const [data, setData] = useState<InquiryData>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')

  const update =
    (field: keyof InquiryData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
    <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
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
          />
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
          />
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
        />
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
          />
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
          />
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
        />
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
