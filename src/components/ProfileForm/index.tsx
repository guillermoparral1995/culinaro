import React, { useRef, type ChangeEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Toaster } from '../ui/toaster'
import { useToast } from '../ui/use-toast'

const formSchema = z.object({
  username: z.string().min(3).max(30),
  bio: z.string().max(500),
  image: z.any()
})

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

export const ProfileForm: React.FC<FormProps> = ({ user }: FormProps) => {
  const hiddenFileUploadInput = useRef<HTMLInputElement>(null)
  const chosenImage = useRef<ArrayBuffer | null>(null)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username,
      bio: user?.bio,
      image: user?.image
    }
  })
  const { toast } = useToast()

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
        chosenImage.current = readerEvent?.target?.result as ArrayBuffer
      }
    }
  }

  const handleToastUpdate = (success: boolean): void => {
    if (success) {
      toast({ title: 'Profile updated successfully' })
    } else {
      toast({ title: 'Profile update failed', variant: 'destructive' })
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
    const formData = new FormData()
    formData.append('id', user.id)
    formData.append('username', values.username)
    formData.append('bio', values.bio)

    if (chosenImage.current) {
      formData.append('image', new Blob([chosenImage.current], { type: 'image/jpeg' }))
    }

    try {
      const response = await fetch('/api/user.json', {
        method: 'PUT',
        body: formData
      })
      const data = await response.json()
      handleToastUpdate(data.message === 'OK')
    } catch (e) {
      handleToastUpdate(false)
    }

    setTimeout(() => { window.location.href = '/profile/your-info' }, 2000)
  }

  return <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField control={form.control} name="image" render={({ field }) => (
          <FormItem onClick={triggerImageChange} className="text-center flex justify-center group relative">
            <img className="cursor-pointer w-40 object-cover" src={user?.image?.url} />
            <div id="change-image-container" className="hidden group-hover:block absolute bottom-0 bg-black w-full opacity-80">Change &#9998;
                <input type="file" className="hidden" id="change-image" {...form.register('image')} ref={hiddenFileUploadInput} onChange={handleImageChange} />
            </div>
          </FormItem>
        )}></FormField>
        <FormField control={form.control} name="username" render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl><Input className="text-slate-950" placeholder="Username" {...field}></Input></FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}>
        </FormField>
        <FormField control={form.control} name="bio" render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl><Textarea className="text-slate-950" placeholder="Bio" {...field}></Textarea></FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}>
        </FormField>
        <div className="flex justify-center mt-4">
          <Button type="submit" className="rounded-md border-2 cursor-pointer p-2">Save changes</Button>
        </div>
      </form>
        <Toaster></Toaster>
    </Form>
}
