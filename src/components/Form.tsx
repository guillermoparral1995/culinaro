import React, { useState, useRef, type ChangeEvent, type FormEvent } from 'react'
import { Toast, type ToastProps } from './Toast'

interface FormProps {
  user: {
    id: string
    username: string
    bio: string
    email: string
    image: {
      url: string
    }
  }
}

export const Form: React.FC<FormProps> = ({ user }: FormProps) => {
  const [username, setUsername] = useState<string>(user?.username)
  const [bio, setBio] = useState<string>(user?.bio)
  const [image, setImage] = useState<ArrayBuffer>()
  const [toast, setToast] = useState<ToastProps>({ message: '', type: '', showToast: false })
  const hiddenFileUploadInput = useRef<HTMLInputElement>(null)

  const handleToastUpdate = (success: boolean): void => {
    if (success) {
      setToast({ message: 'Profile updated successfully', type: 'success', showToast: true })
    } else {
      setToast({ message: 'Profile update failed', type: 'error', showToast: true })
    }
    setTimeout(() => { setToast({ message: '', type: '', showToast: false }) }, 5000)
  }

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value)
  }

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setBio(e.target.value)
  }

  const triggerImageChange = (): void => {
    hiddenFileUploadInput?.current?.click()
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target
    const file = input.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)

      reader.onload = readerEvent => {
        setImage(readerEvent?.target?.result as ArrayBuffer)
      }
    }
  }

  const submit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('id', user.id)
    if (username) {
      formData.append('username', username)
    }
    if (bio) {
      formData.append('bio', bio)
    }
    if (image) {
      formData.append('image', new Blob([image], { type: 'image/jpeg' }))
    }

    try {
      const response = await fetch('/api/user.json', {
        method: 'PUT',
        body: formData
      })
      const data = await response.json()
      handleToastUpdate(data.message === 'OK')
      setTimeout(() => { window.location.href = '/profile/your-info' }, 2000)
    } catch (e) {
      handleToastUpdate(false)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void submit(e)
  }

  return <>
        <form data-userid={user?.id} onSubmit={handleSubmit}>
            <ul className="space-y-8 text-center">
                <li className="flex justify-center relative group">
                    <img onClick={triggerImageChange} className="cursor-pointer w-40 object-cover" src={user?.image?.url} />
                    <div onClick={triggerImageChange} id="change-image-container" className="hidden group-hover:block absolute bottom-0 bg-black w-full opacity-80">Change &#9998;
                        <input onChange={handleImageChange} ref={hiddenFileUploadInput} type="file" className="hidden" id="change-image" />
                    </div>
                </li>
                <li className="flex justify-between border-2 rounded-md p-2 bg-gray-400">
                    <div>Email</div>
                    <div className="font-bold">{user?.email}</div>
                </li>
                <li className="flex justify-between border-2 rounded-md p-2 cursor-pointer">
                    <label htmlFor="username">Username</label>
                    <input id="username" className="text-black rounded-md" value={username} onChange={handleUsernameChange} placeholder={user?.username} />
                </li>
                <li className="text-left border-2 rounded-md p-2 space-y-4 cursor-pointer">
                    <div className="mb-4">Bio</div>
                    <textarea id="bio" className="text-black rounded-md w-full h-16" value={bio} onChange={handleBioChange} placeholder={user?.bio ?? ''} />
                </li>
                <li>
                    <input type="submit" className="rounded-md border-2 cursor-pointer p-2" value="Save changes" />
                </li>
            </ul>
        </form>
        <Toast {...toast} />
    </>
}
