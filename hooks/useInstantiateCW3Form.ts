import { useContracts } from 'contexts/contracts'
import { useWallet, WalletContextType } from 'contexts/wallet'
import { InstantiateResponse } from 'contracts/cw1/subkeys'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CW20_BASE_CODE_ID } from 'utils/constants'

export interface InstantiateFormData {
  minDelay: string
  minDelayUnit: string
  admins: string[]
  proposers: string[]
}

export const useInstantiateCW3Form = () => {
  const wallet = useWallet()
  const contract = useContracts().cw3Timelock

  const form = useForm<InstantiateFormData>()
  const [result, setResult] = useState<InstantiateResponse | null>(null)

  const submitHandler = form.handleSubmit(async (data) => {
    console.log('instantiate timelock form hook', data)

    try {
      setResult(null)

      if (!contract) {
        return toast.error('Smart contract connection failed.')
      }

      const msg = createInstantiateMsg({ wallet, data })

      //   setResult(
      //     await contract?.instantiate(
      //       CW20_BASE_CODE_ID,
      //       msg,
      //       msg.name,
      //       wallet.address
      //     )
      //   )
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message)
    }
  })

  //   useEffect(() => {
  //     if (wallet.address) {
  //       form.setValue('minterAddress', wallet.address)
  //       form.setValue('marketingAddress', wallet.address)
  //     }
  //   }, [form, wallet.address])

  return { ...form, result, submitHandler }
}

export const createInstantiateMsg = ({
  wallet,
  data,
}: {
  wallet: WalletContextType
  data: InstantiateFormData
}) => {
  return {
    senderAddress: wallet.address,
    codeId: '6',
    minDelay: data.minDelay,
    minDelayUnit: data.minDelayUnit,
    admins: data.admins,
    proposers: data.proposers,
  }
}
