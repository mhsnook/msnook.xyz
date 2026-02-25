import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

async function handler(request: NextRequest) {
	return await updateSession(request)
}

export default handler
export { handler as proxy, handler as middleware }

export const config = {
	matcher: [
		'/((?!_vinext/|_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
	],
}
