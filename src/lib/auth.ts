import { createHmac } from 'crypto'

export function computeSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'admin'
  const secret = process.env.ADMIN_SESSION_SECRET ?? 'dev-session-secret'
  return createHmac('sha256', secret).update(password).digest('hex')
}

export function validatePassword(password: string): boolean {
  return password === (process.env.ADMIN_PASSWORD ?? 'admin')
}

export function isValidSessionToken(token: string): boolean {
  return token === computeSessionToken()
}
