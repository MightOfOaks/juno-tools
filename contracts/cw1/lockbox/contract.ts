import { coin } from '@cosmjs/amino'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useContracts } from 'contexts/contracts'
import { CW20BaseInstance } from 'contracts/cw20/base/contract'

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
  getLockbox: (lockbox_id: number) => Promise<any>
  getLockboxes: (start_after?: number, limit?: number) => Promise<any>

  //Execute
  create: (
    senderAddress: string,
    msg: Record<string, unknown>
  ) => Promise<String>
  claim: (senderAddress: string, id: string) => Promise<string>
  reset: (senderAddress: string, id: string) => Promise<string>
  deposit_native: (
    senderAddress: string,
    id: string,
    amount: number,
    denom: string
  ) => Promise<string>
  deposit_cw20: (
    senderAddress: string,
    id: string,
    amount: number,
    cw20Client: CW20BaseInstance | undefined
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
        list_lock_boxes: { start_after, limit },
      })
      return res
    }

    const getLockbox = async (id: number): Promise<any> => {
      const res = await client.queryContractSmart(contractAddress, {
        get_lock_box: { id: id.toString() },
      })
      console.log(res)

      return res
    }

    // const getLockbox = async (id: number): Promise<any> => {
    //   const res = await client.queryContractSmart(contractAddress, {
    //     get_lock_box: { id },
    //   })
    //   console.log(res)

    //   return res
    // }

    /// EXECUTE

    const create = async (
      senderAddress: string,
      msg: Record<string, unknown>
    ): Promise<String> => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        msg,
        'auto'
      )

      return res.transactionHash
    }

    const claim = async (
      senderAddress: string,
      id: string
    ): Promise<string> => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          claim: { id },
        },
        'auto',
        ''
      )
      return res.transactionHash
    }

    const reset = async (
      senderAddress: string,
      id: string
    ): Promise<string> => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          reset: { id },
        },
        'auto',
        ''
      )
      return res.transactionHash
    }

    const deposit_native = async (
      senderAddress: string,
      id: string,
      amount: number,
      denom: string
    ): Promise<string> => {
      console.log('here')
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          deposit: { id },
        },
        'auto',
        '',
        [coin(amount, denom)]
      )
      return res.transactionHash
    }

    const deposit_cw20 = async (
      senderAddress: string,
      id: string,
      amount: number,
      cw20Client: CW20BaseInstance | undefined
    ): Promise<string> => {
      const response = await cw20Client?.send(
        senderAddress,
        contractAddress,
        amount.toString(),
        {
          deposit: { id },
        }
      )
      console.log(response)
      return response || ''
    }

    return {
      contractAddress,
      getLockbox,
      getLockboxes,
      create,
      claim,
      reset,
      deposit_native,
      deposit_cw20,
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
