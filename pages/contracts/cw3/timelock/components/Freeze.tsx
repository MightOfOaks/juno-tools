import Button from 'components/Button'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk, FaSnowflake } from 'react-icons/fa'

import Tooltip from '../../../../../utils/OperationsTableHelpers/Tooltip'

const Freeze = (props: { contractAddress: string }) => {
  const { contractAddress } = props

  const [spinnerFlag, setSpinnerFlag] = useState(false)
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const freeze = async () => {
    try {
      const client = contract?.use(contractAddress)
      if (!client || !wallet) {
        toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
      }
      setSpinnerFlag(true)
      const res = await client?.freeze(wallet.address)
      setSpinnerFlag(false)
      toast.success('Timelock contract is now frozen.', {
        style: { maxWidth: 'none' },
      })
      console.log('update min delay res: ', res)
    } catch (error: any) {
      setSpinnerFlag(false)
      if (error.message.includes('Unauthorized')) {
        toast.error('You need administrator rights for this action.', {
          style: { maxWidth: 'none' },
        })
      } else if (error.message.includes('frozen Timelock')) {
        toast.error(
          'The Timelock contract with the specified address is already frozen.',
          {
            style: { maxWidth: 'none' },
          }
        )
      } else if (
        error.message.includes('bech32') ||
        error.message.includes('unknown variant') ||
        error.message.includes('empty address string')
      ) {
        toast.error('You need to specify a valid Timelock contract address.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  return (
    <div>
      <div className="flex">
        <div className="mr-2 font-bold">Disclaimer:</div> Freezing a Timelock
        contract will prevent any further updates to the contract through
        administrative actions and may render the contract practically unusable.
        Please make sure the current configuration of the contract is finalized
        before you proceed.
      </div>
      <div className="p-8 pt-0 ml-10 w-2/5">
        <div className="basis-1/4 flex-col my-0">
          <div className="absolute px-3 mt-5">
            <Button
              className="bg-blue-500 hover:bg-blue-400"
              isLoading={spinnerFlag}
              isWide
              rightIcon={<FaSnowflake />}
              onClick={freeze}
            >
              Freeze Contract
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Freeze
