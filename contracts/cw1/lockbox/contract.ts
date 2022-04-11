import { coin } from '@cosmjs/amino'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export interface InstantiateResponse {
  readonly contractAddress: string
  readonly transactionHash: string
}

export type Expiration =
  | { at_height: number }
  | { at_time: string }
  | { never: {} }

export interface CW1LockboxInstance {
  readonly contractAddress: string

  //Query
  getLockbox: (lockbox_id: string) => Promise<any>
  getLockboxes: (start_after?: number, limit?: number) => Promise<any>

  //Execute
  claim: (senderAddress: string, lockbox_id: number) => Promise<string>
  reset: (senderAddress: string, lockbox_id: number) => Promise<string>
  deposit_native: (
    senderAddress: string,
    lockbox_id: number,
    amount: number,
    denom: string
  ) => Promise<string>
}

export interface CW1LockboxContract {
  instantiate: (
    senderAddress: string,
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string
  ) => Promise<InstantiateResponse>

  use: (contractAddress: string) => CW1LockboxInstance
}

export const CW1Lockbox = (
  client: SigningCosmWasmClient
): CW1LockboxContract => {
  const use = (contractAddress: string): CW1LockboxInstance => {
    const encode = (str: string): string =>
      Buffer.from(str, 'binary').toString('base64')

    //QUERY
    const getLockboxes = async (
      start_after?: number,
      limit?: number
    ): Promise<any> => {
      const res = await client.queryContractSmart(contractAddress, {
        List_lock_boxes: { start_after, limit },
      })
      return res
    }

    const getLockbox = async (id: string): Promise<any> => {
      const res = await client.queryContractSmart(contractAddress, {
        get_executors: { id },
      })

      return res
    }

    /// EXECUTE

    const claim = async (
      senderAddress: string,
      lockbox_id: number
    ): Promise<string> => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          claim: { lockbox_id },
        },
        'auto'
      )
      return res.transactionHash
    }

    const reset = async (
      senderAddress: string,
      lockbox_id: number
    ): Promise<string> => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          reset: { lockbox_id },
        },
        'auto'
      )
      return res.transactionHash
    }

    const deposit_native = async (
      senderAddress: string,
      lockbox_id: number,
      amount: number,
      denom: string
    ): Promise<string> => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          deposit: { lockbox_id },
        },
        'auto',
        '',
        [coin(amount, denom)]
      )
      return res.transactionHash
    }

    return {
      contractAddress,
      getLockbox,
      getLockboxes,
      claim,
      reset,
      deposit_native,
    }
  }

  const instantiate = async (
    senderAddress: string,
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string
  ): Promise<InstantiateResponse> => {
    const result = await client.instantiate(
      senderAddress,
      codeId,
      initMsg,
      label,
      'auto',
      {
        admin,
      }
    )
    return {
      contractAddress: result.contractAddress,
      transactionHash: result.transactionHash,
    }
  }

  return { use, instantiate }
}
