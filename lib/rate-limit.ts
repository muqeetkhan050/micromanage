const requests = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = requests.get(ip)

  if (!entry || now > entry.resetTime) {
    requests.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  entry.count++
  if (entry.count > maxRequests) {
    return true
  }

  return false
}
