import { XataClient } from '../xata.ts'

export const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY })