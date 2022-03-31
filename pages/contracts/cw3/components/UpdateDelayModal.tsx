import React, { useState } from 'react'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contracts'
import toast from 'react-hot-toast'

const UpdateDelayModal = (props: { contractAddress: string }) => {
  const { contractAddress } = props

  const [minDelay, setMinDelay] = useState(0)
  const [minDelayUnit, setMinDelayUnit] = useState('seconds')
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

  const updateMinDelay = async () => {
    try {
      const client = contract?.use(contractAddress)
      if (!client || !wallet) {
        toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
      }
      if (!(isNaN(minDelay) || Number(minDelay) < 1)) {
        const res = await client?.updateMinDelay(
          getMinDelayInNanoSeconds(minDelay).toString(),
          wallet.address
        )
        console.log('update min delay res: ', res)
      } else {
        toast.error('You need to specify a valid delay.', {
          style: { maxWidth: 'none' },
        })
      }
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        toast.error('You need administrator rights for this action.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  return (
    <div className="bg-dark-gray p-8">
      <div>Update Min Delay</div>
      <div className="flex-col basis-1/4 my-4">
        <label
          htmlFor="small-input"
          className="mb-1 mx-3 block text-sm font-bold text-gray-900 dark:text-gray-300"
        >
          Minimum Delay
        </label>
        <div className="flex mt-3">
          <div>
            <input
              type="text"
              onChange={handleChangeMinDelay}
              className="py-2 px-1 mx-3 rounded text-black text-gray-900 dark:text-gray-300"
              placeholder=" Minimum Delay"
            />
          </div>
          <div>
            <select
              onChange={handleChangeMinDelayUnit}
              defaultValue="seconds"
              name="time"
              id="time"
              className="h-10 basis-1/8 rounded text-black px-1 float-left"
            >
              <option value="days">days</option>
              <option value="hours">hours</option>
              <option value="minutes">minutes</option>
              <option value="seconds">seconds</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <div className="px-3 mt-8 basis-1/4">
          <button
            onClick={updateMinDelay}
            className="p-2 border-2 rounded-lg hover:text-juno"
          >
            Update Minimum Delay
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateDelayModal
