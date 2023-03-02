import { NextRequest, NextResponse } from 'next/server'

import { getLogger } from './logging/log-util'

//regex to check if there's an extension in the path, ie .jpg
const PUBLIC_FILE = /\.(.*)$/
const logger = getLogger('middleware')

export async function middleware(req: NextRequest) {
  const { nextUrl, url } = req
  const { locale, pathname } = nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  logger.debug(req)

  if (locale === 'default' && !pathname.endsWith('/')) {
    return NextResponse.redirect(new URL(`/en${pathname}`, url))
  }

  if ((locale === 'en' || locale === 'fr') && pathname === '/') {
    return NextResponse.redirect(new URL(`/${locale}/home`, url))
  }

  return NextResponse.next()
}