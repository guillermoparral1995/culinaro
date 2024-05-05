import { signIn } from 'auth-astro/client'
// import { xata } from '../db/client'

export const logInOrSignUp = async () => {
    const res = await signIn('google')
    console.log('res!!!', res)
}