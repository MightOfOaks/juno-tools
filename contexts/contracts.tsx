import {
  useCW1SubkeysContract,
  UseCW1SubkeysContractProps,
} from 'contracts/cw1/subkeys'
import {
  useCW3TimelockContract,
  UseCW3TimelockContractProps,
} from 'contracts/cw3/timelock'
import {
  useCW20BaseContract,
  UseCW20BaseContractProps,
} from 'contracts/cw20/base'
import {
  useCW20BondingContract,
  UseCW20BondingContractProps,
} from 'contracts/cw20/bonding'
import {
  useCW20MerkleAirdropContract,
  UseCW20MerkleAirdropContractProps,
} from 'contracts/cw20/merkleAirdrop'
import {
  useCW20StakingContract,
  UseCW20StakingContractProps,
} from 'contracts/cw20/staking'
import React from 'react'

interface ContractsContextType {
  cw20Base: UseCW20BaseContractProps | null
  cw20Bonding: UseCW20BondingContractProps | null
  cw20Staking: UseCW20StakingContractProps | null
  cw20MerkleAirdrop: UseCW20MerkleAirdropContractProps | null
  cw1Subkeys: UseCW1SubkeysContractProps | null
  cw3Timelock: UseCW3TimelockContractProps | null
}

const defaultContext: ContractsContextType = {
  cw20Base: null,
  cw20Bonding: null,
  cw20Staking: null,
  cw20MerkleAirdrop: null,
  cw1Subkeys: null,
  cw3Timelock: null,
}

const ContractsContext =
  React.createContext<ContractsContextType>(defaultContext)

export const useContracts = (): ContractsContextType =>
  React.useContext(ContractsContext)

export function ContractsProvider({
  children,
}: React.HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const cw20Base = useCW20BaseContract()
  const cw20Bonding = useCW20BondingContract()
  const cw20Staking = useCW20StakingContract()
  const cw20MerkleAirdrop = useCW20MerkleAirdropContract()
  const cw1Subkeys = useCW1SubkeysContract()
  const cw3Timelock = useCW3TimelockContract()

  const value: ContractsContextType = {
    cw20Base,
    cw20Bonding,
    cw20Staking,
    cw20MerkleAirdrop,
    cw1Subkeys,
    cw3Timelock,
  }

  return (
    <ContractsContext.Provider value={value}>
      {children}
    </ContractsContext.Provider>
  )
}
