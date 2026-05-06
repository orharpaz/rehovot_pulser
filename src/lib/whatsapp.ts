export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone)
  return normalized.length >= 7 && normalized.length <= 15
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const normalized = normalizePhone(phone)
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
