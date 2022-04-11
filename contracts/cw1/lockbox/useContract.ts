import { useWallet } from 'contexts/wallet'
import { useCallback, useEffect, useState } from 'react'

import {
  CW1Lockbox as initContract,
  CW1LockboxContract,
  CW1LockboxInstance,
} from './contract'

interface InstantiateResponse {
  readonly contractAddress: string
  readonly transactionHash: string
}

export interface UseCW1LockboxContractProps {
  instantiate: (
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string
  ) => Promise<InstantiateResponse>
  use: (customAddress: string) => CW1LockboxInstance | undefined
  updateContractAddress: (contractAddress: string) => void
  getContractAddress: () => string | undefined
}

export function useCW1LockboxContract(): UseCW1LockboxContractProps {
  const wallet = useWallet()

  const [address, setAddress] = useState<string>('')
  const [CW1Lockbox, setCW1Lockbox] = useState<CW1LockboxContract>()

  useEffect(() => {
    setAddress(localStorage.getItem('contract_address') || '')
  }, [])

  useEffect(() => {
    if (wallet.initialized) {
      const getCW1LockboxBaseInstance = async (): Promise<void> => {
        const cw1LockboxBaseContract = initContract(wallet.getClient())
        setCW1Lockbox(cw1LockboxBaseContract)
      }

      getCW1LockboxBaseInstance()
    }
  }, [wallet])

  const updateContractAddress = (contractAddress: string) => {
    setAddress(contractAddress)
  }

  const instantiate = useCallback(
    (codeId, initMsg, label, admin?): Promise<InstantiateResponse> => {
      return new Promise((resolve, reject) => {
        if (!CW1Lockbox) return reject('Contract is not initialized.')

        CW1Lockbox.instantiate(wallet.address, codeId, initMsg, label, admin)
          .then(resolve)
          .catch(reject)
      })
    },
    [CW1Lockbox, wallet]
  )

  const use = useCallback(
    (customAddress = ''): CW1LockboxInstance | undefined => {
      return CW1Lockbox?.use(address || customAddress)
    },
    [CW1Lockbox, address]
  )
  const getContractAddress = (): string | undefined => {
    return address
  }

  return {
    instantiate,
    use,
    updateContractAddress,
    getContractAddress,
  }
}
