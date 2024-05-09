import type { APIRoute } from "astro"
import { getSession } from 'auth-astro/server';
import { getUser, updateUser } from '../../db/user';

export const GET: APIRoute = async ({ request }) => {
    const session = await getSession(request);
    const user = await getUser(session);
    return new Response(JSON.stringify(user))
}

export const PUT: APIRoute = async ({ request }) => {
    const { id, username, bio } = await request.json()
    const result = await updateUser(id, { username, bio })
    return new Response(JSON.stringify({
        message: "OK!",
        record: result
    })
    )
}