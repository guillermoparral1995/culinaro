import { xata } from './client'
import axios from 'axios'

import type { Session } from '@auth/core/types'
import type { SelectedPick } from '@xata.io/client'
import type { UsersRecord } from '../xata'

type User = SelectedPick<UsersRecord, Array<'email' | 'name' | 'image' | 'username' | 'bio' | 'id'>> | null

export const getUser = async (session: Session | null): Promise<User> => {
  if (!session) return null
  if (!session.user?.email) return null
  let user = await xata.db.users.select(['id', 'email', 'username', 'name', 'image', 'bio']).filter({ email: session.user.email }).getFirst()
  if (!user) {
    // if session exists but user does not, means it's first login, we need to add them to db and sign them up
    user = await createUser(session)
  }
  return user
}

const downloadAndEncodeImageToBase64 = async (image: string): Promise<string> => {
  try {
    const response = await axios.get<ArrayBuffer>(image, { responseType: 'arraybuffer' })
    const base64Image = Buffer.from(response.data).toString('base64')
    return base64Image
  } catch (error) {
    console.error('Error downloading image:', error)
    throw error
  }
}

export const createUser = async (session: Session): Promise<User> => {
  const base64Img = await downloadAndEncodeImageToBase64(session.user?.image ?? '')
  const user = await xata.db.users.create({
    email: session.user?.email,
    username: session.user?.email?.split('@')[0],
    name: session.user?.name,
    image: {
      mediaType: 'image/png',
      base64Content: base64Img
    }
  })
  return user
}

export const updateUser = async (id: string, user: { username?: string, bio?: string, image?: File }): Promise<User> => {
  let base64Img
  if (user?.image) {
    const arraybuffer: ArrayBuffer = await user.image.arrayBuffer()
    base64Img = Buffer.from(arraybuffer).toString('base64')
  }
  const newRecord = {
    ...(user?.username && { username: user.username }),
    ...(user?.bio && { bio: user.bio }),
    ...(base64Img && { image: { mediaType: 'image/png', base64Content: base64Img } })
  }
  const updatedUser = await xata.db.users.update(id, newRecord)
  return updatedUser
}
