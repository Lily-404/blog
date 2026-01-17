"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      duration={5000}
      expand={true}
      toastOptions={{
        className: "shadow-xl backdrop-blur-md",
        style: {
          borderRadius: "0.875rem",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        },
      }}
    />
  )
}
