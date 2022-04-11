import {
  useCW1LockboxContract,
  UseCW1LockboxContractProps,
} from 'contracts/cw1/lockbox'
import {
  useCW1SubkeysContract,
  UseCW1SubkeysContractProps,
} from 'contracts/cw1/subkeys'
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
import { FC, Fragment, useEffect, VFC } from 'react'
import create, { State } from 'zustand'

/**
 * Contracts store type definitions
 */
export interface ContractsStore extends State {
  cw20Base: UseCW20BaseContractProps | null
  cw20Bonding: UseCW20BondingContractProps | null
  cw20Staking: UseCW20StakingContractProps | null
  cw20MerkleAirdrop: UseCW20MerkleAirdropContractProps | null
  cw1Subkeys: UseCW1SubkeysContractProps | null
  cw1Lockbox: UseCW1LockboxContractProps | null
}

/**
 * Contracts store default values as a separate variable for reusability
 */
export const defaultValues: ContractsStore = {
  cw20Base: null,
  cw20Bonding: null,
  cw20Staking: null,
  cw20MerkleAirdrop: null,
  cw1Subkeys: null,
  cw1Lockbox: null,
}

/**
 * Entrypoint for contracts store using {@link defaultValues}
 */
export const useContracts = create<ContractsStore>(() => ({
  ...defaultValues,
}))

/**
 * Contracts store provider to easily mount {@link ContractsSubscription}
 * to listen/subscribe to contract changes
 */
export const ContractsProvider: FC = ({ children }) => {
  return (
    <Fragment>
      {children}
      <ContractsSubscription />
    </Fragment>
  )
}

/**
 * Contracts store subscriptions (side effects)
 *
 * @todo refactor all contract logics to zustand store
 */
const ContractsSubscription: VFC = () => {
  const cw20Base = useCW20BaseContract()
  const cw20Bonding = useCW20BondingContract()
  const cw20Staking = useCW20StakingContract()
  const cw20MerkleAirdrop = useCW20MerkleAirdropContract()
  const cw1Subkeys = useCW1SubkeysContract()
  const cw1Lockbox = useCW1LockboxContract()

  useEffect(() => {
    useContracts.setState({
      cw20Base,
      cw20Bonding,
      cw20Staking,
      cw20MerkleAirdrop,
      cw1Subkeys,
      cw1Lockbox,
    })
  }, [
    cw20Base,
    cw20Bonding,
    cw20Staking,
    cw20MerkleAirdrop,
    cw1Subkeys,
    cw1Lockbox,
    //
  ])

  return null
}
