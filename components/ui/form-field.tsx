"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否占据剩余空间，默认 true */
  flex?: boolean
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ flex = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(flex && "flex-1 min-w-0", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

FormField.displayName = "FormField"

export { FormField }
