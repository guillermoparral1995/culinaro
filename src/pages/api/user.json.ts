import type { APIRoute } from "astro"
import { getSession } from 'auth-astro/server';
import { getUser, updateUser } from '../../db/user';

export const GET: APIRoute = async ({ request }) => {
    const session = await getSession(request);
    const user = await getUser(session);
    return new Response(JSON.stringify(user))
}

export const PUT: APIRoute = async ({ request }) => {
    try {
        const data = await request.formData()
        const id = (data.get('id') as string)
        if (!id) {
            throw new Error('User ID was not provided')
        }
        const username = data.get('username') as string | undefined
        const bio = data.get('bio') as string | undefined
        const image = data.get('image') as File | undefined
        const result = await updateUser(id, { username, bio, image })
        return new Response(JSON.stringify({
            message: "OK!",
            record: result
        }))
    } catch (e: unknown) {
        return new Response(JSON.stringify({
            message: 'Error updating user',
            cause: (e as Error).message
        }))
    }

}