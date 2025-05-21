// material-tailwind.d.ts
import {} from '@material-tailwind/react'

type EventCapture = {
  onPointerEnterCapture?: unknown
  onPointerLeaveCapture?: unknown
}

declare module '@material-tailwind/react' {
  export interface DrawerProps extends EventCapture {
    placeholder?: unknown
  }
  export interface InputProps extends EventCapture {
    crossOrigin?: unknown
  }
  export interface SelectProps extends EventCapture {
    placeholder?: unknown
  }
}
