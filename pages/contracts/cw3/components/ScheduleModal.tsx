import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contracts'
import CustomInput from './CustomInput'

const ScheduleModal = () => {
  const [contractAddress, setContractAddress] = useState(
    'juno1cspathx3ex9hud98vt6qpsujj9gnefkjphzm4f83shue5q5u8suq7me0lc'
  )
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [executors, setExecutors] = useState<string[]>([])
  const [targetAddress, setTargetAddress] = useState('')
  const [data, setData] = useState('')
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const handleChangeExecutors = (arg0: string[]) => {
    setExecutors(arg0)
  }

  const handleChangeTargetAddress = (arg0: string) => {
    setTargetAddress(arg0)
  }

  const handleChangeExecutionDate = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setDate(event.target.value)
    console.log(date)
  }

  const handleChangeExecutionTime = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setTime(event.target.value)
    console.log(time)
  }

  function getExecutionTimeInNanosecs(): number {
    const yearMonthDay = date.split('-')
    return (
      new Date(
        Number(yearMonthDay[1]).toString() +
          '-' +
          Number(yearMonthDay[2]).toString() +
          '-' +
          Number(yearMonthDay[0]).toString() +
          '-' +
          time
      ).getTime() * 1000000
    )
  }

  const execute = async () => {
    console.log(getExecutionTimeInNanosecs().toString())
    try {
      const client = contract?.use(contractAddress)

      if (client && wallet) {
        //Reserved for hard coded data
        // const msg = {
        //   mint: {
        //     amount: '1000',
        //   },
        // }
        const res6 = await client?.schedule(
          wallet.address,
          targetAddress,
          { data },
          getExecutionTimeInNanosecs().toString(),
          executors
        )
        console.log('schedule: ', res6)
      }
    } catch (error: any) {
      toast.error('Error', { style: { maxWidth: 'none' } })
    }
  }

  return (
    <div className="bg-dark-gray p-8">
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
      <label
        htmlFor="small-input"
        className="mb-1 mx-3 block font-bold text-gray-900 dark:text-gray-300"
      >
        Target Address
      </label>
      <input
        onChange={(e) => {
          setTargetAddress(e.target.value)
        }}
        placeholder="Target Address"
        className="w-4/5 py-2 px-1 mx-3 mb-3 rounded text-black text-gray-900 dark:text-gray-300"
      />
      <div className="flex">
        <div className="flex-col basis-1/4">
          <label
            htmlFor="small-input"
            className="mb-1 mx-3 block text-sm font-bold text-gray-900 dark:text-gray-300"
          >
            Execution Time
          </label>
          <div className="flex">
            <div>
              <input
                type="date"
                onChange={handleChangeExecutionDate}
                className="py-2 px-1 ml-3 mr-1 rounded text-black text-gray-900 dark:text-gray-300"
                placeholder=" Execution Time"
              />
            </div>
            <div>
              <input
                type="time"
                onChange={handleChangeExecutionTime}
                className="py-2 px-1 mr-2 ml-1 rounded text-black text-gray-900 dark:text-gray-300"
                placeholder=" Execution Time"
              />
            </div>
            <div className="px-2 basis-1/4">
              <button
                onClick={execute}
                className="p-2 border-2 rounded-lg hover:text-juno"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ScheduleModal
