import type { APIRoute } from "astro"
import { updateUser } from "../../db/user"

export const PUT: APIRoute = ({ request }) => {
    console.log('request', request)
    return new Response(JSON.stringify({
        message: "This was a POST!"
    })
    )
}