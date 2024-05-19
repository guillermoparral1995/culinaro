import React from 'react'

export interface ToastProps {
  message: string
  type: string
  showToast: boolean
}

export const Toast: React.FC<ToastProps> = ({ message, type, showToast }: ToastProps) => {
  return <output className={`fixed bottom-16 right-2/4 transition-all ease-in-out duration-300 p-4 rounded-md ${showToast ? 'opacity-100' : 'opacity-0'} ${type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-stone-600'}`}>
        <span>{message}</span>
    </output>
}
