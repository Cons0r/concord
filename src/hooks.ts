import type { GetSession, Handle } from '@sveltejs/kit'
import * as cookie from 'cookie'

import db from '$lib/prisma'

export const handle: Handle = async ({
  event,
  resolve,
}) => {
  const cookieHeader = event.request.headers.get('cookie')
  const cookies = cookie.parse(cookieHeader ?? '')

  if (!cookies.session) {
	return await resolve(event)
  }

  const session = await db.user.findUnique({
	where: { token: cookies.session },
    select: {
        username: true,
        token: true,
        id: true
    }
  })

  if (session) {
	event.locals.user = session
  }

  return await resolve(event)
}

export const getSession: GetSession = ({ locals }) => {
	if (!locals.user) return {}

	return {
		user: locals.user
	}
}