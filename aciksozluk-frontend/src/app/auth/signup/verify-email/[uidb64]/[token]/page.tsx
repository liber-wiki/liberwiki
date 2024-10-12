'use client'

import VerifyEmail from '@/components/aciksozluk/VerifyEmail'

export default function VerifyEmailPage({ params }: { params: { uidb64: string; token: string } }) {
  return <VerifyEmail uidb64={params.uidb64} token={params.token} />
}