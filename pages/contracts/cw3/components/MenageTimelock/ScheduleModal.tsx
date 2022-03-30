import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contracts'
import CustomInput from '../CustomInput'

const ScheduleModal = () => {
  const [contractAddress, setContractAddress] = useState(
    'juno1cspathx3ex9hud98vt6qpsujj9gnefkjphzm4f83shue5q5u8suq7me0lc'
  )
  const [minDelay, setMinDelay] = useState(0)
  const [minDelayUnit, setMinDelayUnit] = useState('seconds')
  const [executors, setExecutors] = useState<string[]>([])
  const [targetAddress, setTargetAddress] = useState<string[]>([])
  const [data, setData] = useState('')
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const handleChangeExecutors = (arg0: string[]) => {
    setExecutors(arg0)
  }

  const handleChangeTargetAddress = (arg0: string[]) => {
    setExecutors(arg0)
  }

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

  const execute = async () => {
    try {
      const client = contract?.use(contractAddress)

      if (client && wallet) {
        const msg = {
          mint: {
            amount: '1000',
          },
        }
        const res6 = await client?.schedule(
          wallet.address,
          targetAddress[0],
          msg,
          data,
          executors
        )
        console.log('schedule: ', res6)
      }
    } catch (error: any) {
      toast.error('Error', { style: { maxWidth: 'none' } })
    }
  }

  return (
    <div className="bg-black p-8">
      <div> Schedule</div>

      <div className="flex-col basis-1/4 my-4">
        <label
          htmlFor="small-input"
          className="mb-1 mx-3 block text-sm font-bold text-gray-900 dark:text-gray-300"
        >
          Data
        </label>
        <input
          type="text"
          onChange={(e) => {
            setData(e.target.value)
          }}
          className="py-2 px-1 mx-3 rounded text-black text-gray-900 dark:text-gray-300"
          placeholder="Data"
        />
      </div>
      <CustomInput function={handleChangeExecutors} placeholder="Executors" />
      <CustomInput
        function={handleChangeTargetAddress}
        placeholder="Target Address"
      />
      <div className="flex">
        <div className="flex-col basis-1/4">
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
        </div>

        <select
          onChange={handleChangeMinDelayUnit}
          defaultValue="seconds"
          name="time"
          id="time"
          className="h-10 mt-6 basis-1/8 rounded text-black px-1 float-left"
        >
          <option value="days">days</option>
          <option value="hours">hours</option>
          <option value="minutes">minutes</option>
          <option value="seconds">seconds</option>
        </select>
        <div className="px-3 mt-5 basis-1/4">
          <button
            onClick={execute}
            className="p-2 border-2 rounded-lg hover:text-juno"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  )
}
export default ScheduleModal
