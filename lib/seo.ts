const defaultSiteUrl = "https://portraitwiz.com"

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(/\/$/, "")
}
