// https://github.com/grikomsn/personal-websites/blob/main/sites/griko.id/utils/clipboard.ts

import toast from 'react-hot-toast'
import { Renderable } from 'react-hot-toast/dist/core/types'

export async function copy(
  text: string,
  message: Renderable = 'Copied to clipboard!'
) {
  try {
    await navigator.clipboard.writeText(text)
    return toast.success(message)
  } catch (err: unknown) {
    return toast.error(String(err))
  }
}

export default { copy }
