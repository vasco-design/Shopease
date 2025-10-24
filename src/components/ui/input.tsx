import * as React from "react"
import { cn } from "@/lib/utils"

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("border rounded px-3 py-2 bg-transparent w-full", props.className)} {...props} />
}
