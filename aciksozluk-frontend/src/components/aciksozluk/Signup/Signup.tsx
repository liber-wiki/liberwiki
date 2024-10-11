import React from 'react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/shadcn/input-otp'
import { Label } from '@/components/shadcn/label'

import { useAcikSozlukAPI, useFormState } from '@/lib/hooks'

export function Signup() {
  const aciksozluk = useAcikSozlukAPI()
  const { mutateAsync: signup } = aciksozluk.signup()

  const {
    formState: signupState,
    handleFormStateEvent: handleSignupStateEvent,
    handleFormStateValue: handleSignupStateValue,
    formErrors: signupErrors,
    setFormErrors: setSignupErrors,
  } = useFormState<{
    email: string
    username: string
    first_name: string
    last_name: string
    password: string
    password_confirmation: string
    invitation_code: string
  }>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirmation: '',
    invitation_code: '',
  })

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = await signup(signupState)
    if (data.response.ok) {
      setSignupErrors({})
    } else {
      setSignupErrors(data.error)
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Signup</CardTitle>
        <CardDescription>Signup below by using your invitation code</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={signupState.email}
                onChange={handleSignupStateEvent('email')}
                errorText={signupErrors?.email?.join(' ')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usernae">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                required
                value={signupState.username}
                onChange={handleSignupStateEvent('username')}
                errorText={signupErrors?.username?.join(' ')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={signupState.password}
                onChange={handleSignupStateEvent('password')}
                errorText={signupErrors?.password?.join(' ')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Password Confirmation</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm your password"
                required
                value={signupState.password_confirmation}
                onChange={handleSignupStateEvent('password_confirmation')}
                errorText={signupErrors?.password_confirmation?.join(' ')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Invitation Code</Label>
              <InputOTP
                pattern="[a-z0-9]+$"
                id="invitation_code"
                required
                maxLength={8}
                onChange={handleSignupStateValue('invitation_code')}
                value={signupState.invitation_code}
                inputMode="text"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                  <InputOTPSlot index={6} />
                  <InputOTPSlot index={7} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {signupErrors?.non_field_errors && (
              <div className="text-red-600 text-sm mt-2">{signupErrors.non_field_errors.join(' ')}</div>
            )}
            <Button type="submit" className="w-full">
              Signup
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
