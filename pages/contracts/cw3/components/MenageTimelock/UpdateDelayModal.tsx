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

  const updateMinDelay = async () => {
    try {
      const client = contract?.use(contractAddress)
      if (!client || !wallet) {
        toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
      }

      const res = await client?.updateMinDelay(minDelay, wallet.address)
      console.log('update min delay res: ', res)
    } catch (error: any) {
      toast.error('Error', { style: { maxWidth: 'none' } })
    }
  }

  return (
    <div className="bg-black p-8">
      <div>Update Min Delay</div>
      <div className="flex-col basis-1/4 my-4">
        <label
          htmlFor="small-input"
          className="mb-1 mx-3 block text-sm font-bold text-gray-900 dark:text-gray-300"
        >
          Execution Time
        </label>

        <input
          type="text"
          onChange={handleChangeMinDelay}
          className="py-2 px-1 mx-3 rounded text-black text-gray-900 dark:text-gray-300"
          placeholder=" Execution Time"
        />
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

      <div>
        <div className="px-3 mt-8 basis-1/4">
          <button
            onClick={updateMinDelay}
            className=" mt-10 h-15 w-25 bg-juno border border-gray-300 shadow-sm flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
          >
            Update Min Delay
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateDelayModal