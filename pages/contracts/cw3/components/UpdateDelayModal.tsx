import Button from 'components/Button'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'

import Tooltip from '../../../../utils/OperationsTableHelpers/Tooltip'

const UpdateDelayModal = (props: { contractAddress: string }) => {
  const { contractAddress } = props

  const [minDelay, setMinDelay] = useState(0)
  const [minDelayUnit, setMinDelayUnit] = useState('seconds')
  const [spinnerFlag, setSpinnerFlag] = useState(false)
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const handleChangeMinDelay = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setMinDelay(Number(event.target.value))
  }

  const handleChangeMinDelayUnit = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setMinDelayUnit(event.target.value)
  }

  const getMinDelayInSeconds = (arg: number): String => {
    if (minDelayUnit === 'seconds') {
      return String(arg)
    }
    if (minDelayUnit === 'minutes') {
      return String(arg * 60)
    }
    if (minDelayUnit === 'hours') {
      return String(arg * 3600)
    }
    if (minDelayUnit === 'days') {
      return String(arg * 86400)
    } else {
      return String(arg)
    }
  }

  const updateMinDelay = async () => {
    try {
      const client = contract?.use(contractAddress)
      if (!client || !wallet) {
        toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
      }
      if (!(isNaN(minDelay) || Number(minDelay) < 1)) {
        setSpinnerFlag(true)
        const res = await client?.updateMinDelay(
          Number(getMinDelayInSeconds(minDelay)),
          wallet.address
        )
        setSpinnerFlag(false)
        toast.success('Successfully updated the minimum delay.', {
          style: { maxWidth: 'none' },
        })
        console.log('update min delay res: ', res)
      } else {
        toast.error('You need to specify a valid delay.', {
          style: { maxWidth: 'none' },
        })
      }
    } catch (error: any) {
      setSpinnerFlag(false)
      if (error.message.includes('Unauthorized')) {
        toast.error('You need administrator rights for this action.', {
          style: { maxWidth: 'none' },
        })
      } else if (
        error.message.includes('bech32') ||
        error.message.includes('unknown variant')
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
    <div className="p-8 pt-0 ml-10 w-2/5">
      <div className="basis-1/4 flex-col my-0">
        <div className="flex">
          <label
            htmlFor="small-input"
            className="block mr-2 mb-1 ml-3 font-bold text-white dark:text-gray-300 text-md"
          >
            Minimum Delay
          </label>
          <Tooltip label="The minimum timelock duration for future operations.">
            <svg
              className="mt-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Tooltip>
        </div>

        <div className="flex mt-3">
          <div>
            <input
              type="text"
              onChange={handleChangeMinDelay}
              className="py-2 px-1 mx-3 bg-white/10 rounded border-2 border-white/20 focus:ring
              focus:ring-plumbus-20
              form-input, placeholder:text-white/50,"
              placeholder=" Minimum Delay"
            />
          </div>
          <div>
            <select
              onChange={handleChangeMinDelayUnit}
              defaultValue="seconds"
              name="time"
              id="time"
              className="float-left px-1 h-10 text-white bg-[#3a3535] rounded basis-1/8"
            >
              <option className="bg-[#3a3535]" value="days">
                days
              </option>
              <option className="bg-[#3a3535]" value="hours">
                hours
              </option>
              <option className="bg-[#3a3535]" value="minutes">
                minutes
              </option>
              <option className="bg-[#3a3535]" value="seconds">
                seconds
              </option>
            </select>
          </div>
        </div>
        <div className="absolute px-3 mt-5">
          <Button
            isLoading={spinnerFlag}
            isWide
            rightIcon={<FaAsterisk />}
            onClick={updateMinDelay}
          >
            Update Minimum Delay
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UpdateDelayModal
