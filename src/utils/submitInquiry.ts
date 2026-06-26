import type { InquiryData } from '../components/ContactForm'

// ---------------------------------------------------------------------------
// Web3Forms access key — read from an env var, never committed to the repo.
//
//   Local dev: create a .env.local file (gitignored) with:
//                VITE_WEB3FORMS_ACCESS_KEY=your-key-here
//   Production: set a GitHub Actions secret named WEB3FORMS_ACCESS_KEY; the
//               deploy workflow passes it in at build time.
//
// Get a key (no account needed) at https://web3forms.com — enter the email
// address where inquiries should be delivered. Note: because this is a static
// site, the key is still readable in the shipped JS bundle. That's acceptable
// for Web3Forms (the key can only submit the form, not read or delete data);
// truly hiding a key would require a backend proxy.
// ---------------------------------------------------------------------------
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

const ENDPOINT = 'https://api.web3forms.com/submit'

/** Sends a contact inquiry as an email via Web3Forms. Rejects on failure. */
export async function submitInquiry(data: InquiryData): Promise<void> {
  if (!WEB3FORMS_ACCESS_KEY) {
    throw new Error('VITE_WEB3FORMS_ACCESS_KEY is not set')
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New inquiry from ${data.firstName} ${data.lastName}`,
      from_name: `${data.firstName} ${data.lastName}`,
      replyto: data.email,
      // These fields are included in the delivered email:
      first_name: data.firstName,
      last_name: data.lastName,
      business_name: data.businessName,
      email: data.email,
      phone: data.phone,
      inquiry: data.inquiry,
    }),
  })

  if (!response.ok) {
    throw new Error(`Inquiry submission failed (HTTP ${response.status})`)
  }

  const result: { success?: boolean; message?: string } = await response.json()
  if (!result.success) {
    throw new Error(result.message ?? 'Inquiry submission failed')
  }
}
