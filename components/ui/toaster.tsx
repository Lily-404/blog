"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors={false}
      closeButton={false}
      duration={2800}
      expand={false}
      gap={8}
      offset={24}
      visibleToasts={3}
      toastOptions={{
        className: "toast-nd",
        unstyled: true,
      }}
      icons={{
        success: null,
        error: null,
        info: null,
        warning: null,
        loading: null,
      }}
    />
  )
}
