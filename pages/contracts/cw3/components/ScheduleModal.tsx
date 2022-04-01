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
  const [spinnerFlag, setSpinnerFlag] = useState(false)

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
        // mint: {
        //   amount: '1000',
        // },
        // }
        setSpinnerFlag(true)
        const res = await client?.schedule(
          wallet.address,
          targetAddress,
          data,
          getExecutionTimeInNanosecs().toString(),
          executors
        )
        setSpinnerFlag(false)
        if (!res.toString().includes('Error')) {
          toast.success('Successfully scheduled an operation.', {
            style: { maxWidth: 'none' },
          })
        }
        console.log('schedule: ', res)
      }
    } catch (error: any) {
      setSpinnerFlag(false)
      if (error.message.includes('Unauthorized')) {
        toast.error('You are not authorized to perform this action.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
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
            <div className="px-1 mt-3 basis-3/4">
              {spinnerFlag && (
                <svg
                  role="status"
                  className="mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-juno"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ScheduleModal
