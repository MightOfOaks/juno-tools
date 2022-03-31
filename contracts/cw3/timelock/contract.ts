import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export interface InstantiateResponse {
  readonly contractAddress: string
  readonly transactionHash: string
}

export type Expiration =
  | { at_height: number }
  | { at_time: string }
  | { never: {} }

export interface CW3TimelockInstance {
  readonly contractAddress: string

  //Query
  getAdmins: () => Promise<any>
  getOperations: () => Promise<any>
  getMinDelay: () => Promise<any>
  getExecutionTime: (operation_id: string) => Promise<any>
  getOperationStatus: (operation_id: string) => Promise<any>
  getProposers: () => Promise<any>
  getExecutors: (operation_id: string) => Promise<any>
  //Execute
  schedule: (
    senderAddress: string,
    targetAddress: string,
    data: Record<string, unknown>,
    executionTime: string,
    executors?: string[]
  ) => Promise<string>

  cancel: (senderAddress: string, operation_id: string) => Promise<any>
  revokeAdmin: (senderAddress: string, admin_address: string) => Promise<any>
  addProposer: (senderAddress: string, proposer_address: string) => Promise<any>
  removeProposer: (
    senderAddress: string,
    proposer_address: string
  ) => Promise<any>
  updateMinDelay: (new_delay: number, senderAddress: string) => Promise<any>
  execute: (senderAddress: string, operation_id: string) => Promise<any>
}

export interface CW3TimelockContract {
  instantiate: (
    senderAddress: string,
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string
  ) => Promise<InstantiateResponse>

  use: (contractAddress: string) => CW3TimelockInstance
}

export const CW3Timelock = (
  client: SigningCosmWasmClient
): CW3TimelockContract => {
  const use = (contractAddress: string): CW3TimelockInstance => {
    const encode = (str: string): string =>
      Buffer.from(str, 'binary').toString('base64')

    //QUERY
    const getOperations = async (): Promise<any> => {
      const res = await client.queryContractSmart(contractAddress, {
        get_operations: {},
      })
      return res
    }
    const getMinDelay = async (): Promise<any> => {
      const res = await client.queryContractSmart(contractAddress, {
        get_min_delay: {},
      })

      return res
    }
    const getAdmins = async (): Promise<string> => {
      const res = await client.queryContractSmart(contractAddress, {
        get_admins: {},
      })
      return res
    }
    const getProposers = async (): Promise<any> => {
      const res = await client.queryContractSmart(contractAddress, {
        get_proposers: {},
      })
      return res
    }

    const getExecutors = async (operation_id: string): Promise<any> => {
      const res = await client.queryContractSmart(contractAddress, {
        get_executors: { operation_id },
      })

      return res
    }

    const getExecutionTime = async (operation_id: string): Promise<any> => {
      const res = await client.queryContractSmart(contractAddress, {
        get_execution_time: { operation_id },
      })
      return res
    }
    const getOperationStatus = async (operation_id: string): Promise<any> => {
      const res = await client.queryContractSmart(contractAddress, {
        get_operation_status: { operation_id },
      })
      return res
    }

    /// EXECUTE
    const schedule = async (
      senderAddress: string,
      targetAddress: string,
      data: Record<string, unknown>,
      executionTime: string,
      executors?: string[]
    ): Promise<string> => {
      try {
        const res = await client.execute(
          senderAddress,
          contractAddress,
          {
            schedule: {
              target_address: targetAddress,
              data: encode(JSON.stringify(data)),
              execution_time: executionTime,
              executors: executors,
            },
          },
          'auto'
        )
        return res.transactionHash
      } catch (err: any) {
        return err
      }
    }

    const cancel = async (
      senderAddress: string,
      operation_id: string
    ): Promise<string> => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          cancel: { operation_id },
        },
        'auto'
      )
      return res.transactionHash
    }

    const execute = async (
      senderAddress: string,
      operation_id: string
    ): Promise<string> => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          execute: { operation_id },
        },
        'auto'
      )
      return res.transactionHash
    }

    const revokeAdmin = async (
      senderAddress: string,
      admin_address: string
    ): Promise<string> => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          revoke_admin: { admin_address },
        },
        'auto'
      )
      return res.transactionHash
    }

    const addProposer = async (
      senderAddress: string,
      proposer_address: string
    ) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          add_proposer: { proposer_address },
        },
        'auto'
      )
      return res.transactionHash
    }

    const removeProposer = async (
      senderAddress: string,
      proposer_address: string
    ) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          remove_proposer: { proposer_address },
        },
        'auto'
      )
      return res.transactionHash
    }

    const updateMinDelay = async (new_delay: number, senderAddress: string) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        { update_min_delay: { new_delay } },
        'auto'
      )
      console.log('update min delay ', res)
      return res.transactionHash
    }

    return {
      contractAddress,
      schedule,
      getAdmins,
      getOperations,
      getMinDelay,
      getExecutionTime,
      getOperationStatus,
      cancel,
      revokeAdmin,
      addProposer,
      removeProposer,
      updateMinDelay,
      execute,
      getProposers,
      getExecutors,
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
