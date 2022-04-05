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
  const [minDelayUnit, setMinDelayUnit] = useState('seconds')

  const getMinDelayInNanoSeconds = (arg: number): String => {
    if (minDelayUnit === 'seconds') {
      return String(arg * 1000000000)
    }
    if (minDelayUnit === 'minutes') {
      return String(arg * 60000000000)
    }
    if (minDelayUnit === 'hours') {
      return String(arg * 3600000000000)
    }
    if (minDelayUnit === 'days') {
      return String(arg * 86400000000000)
    } else {
      return String(arg)
    }
  }

  const submitHandler = form.handleSubmit(async (data) => {
    console.log('instantiate timelock form hook', data)

    try {
      setResult(null)

      if (!contract) {
        return toast.error('Smart contract connection failed.')
      }

      if (!wallet.initialized) {
        return toast.error('Oops! Need to connect your Keplr Wallet first.', {
          style: { maxWidth: 'none' },
        })
      }

      setMinDelayUnit(data.minDelayUnit)
      const msg = createInstantiateMsg({ wallet, data })

      const response = await contract.instantiate(
        702,
        {
          admins: msg.admins,
          proposers: msg.proposers,
          min_delay: getMinDelayInNanoSeconds(Number(msg.minDelay)).toString(),
        },
        'Timelock Test',
        wallet.address
      )
      console.log(response.transactionHash)
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
