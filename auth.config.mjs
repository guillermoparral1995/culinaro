import Google from '@auth/core/providers/google'
import { defineConfig } from 'auth-astro'
import { XataAdapter } from '@next-auth/xata-adapter';
// When you ran `xata init` it created a `src/xata.ts` that exports the client
import { XataClient } from './src/xata';
const client = new XataClient({ apiKey: import.meta.env.XATA_API_KEY });

export default defineConfig({
    adapter: XataAdapter(client),
    providers: [
        Google({
            clientId: import.meta.env.GOOGLE_ID,
            clientSecret: import.meta.env.GOOGLE_SECRET,
        }),
    ],
})