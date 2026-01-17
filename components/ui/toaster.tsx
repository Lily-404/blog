"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors={false}
      closeButton={true}
      duration={4000}
      expand={false}
      toastOptions={{
        className: "toast-custom",
        style: {
          borderRadius: "0.5rem",
        },
      }}
    />
  )
}
