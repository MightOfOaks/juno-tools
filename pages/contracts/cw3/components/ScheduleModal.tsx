import Button from 'components/Button'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'

import Tooltip from '../../../../utils/OperationsTableHelpers/Tooltip'
import CustomInput from './CustomInput'

const ScheduleModal = (props: { contractAddress: string }) => {
  const { contractAddress } = props
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [executors, setExecutors] = useState<string[]>([])
  const [targetAddress, setTargetAddress] = useState('')
  const [data, setData] = useState('')
  const [spinnerFlag, setSpinnerFlag] = useState(false)
  const [description, setDescription] = useState('')

  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const handleChangeExecutors = (arg0: string[]) => {
    setExecutors(arg0)
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

  const isJson = (str: any) => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  const execute = async () => {
    if (!isJson(data)) {
      toast.error('Data is not in JSON format.')
      return
    }

    try {
      console.log(getExecutionTimeInNanosecs().toString())
      const client = contract?.use(contractAddress)

      if (client && wallet) {
        setSpinnerFlag(true)
        const res = await client?.schedule(
          wallet.address,
          targetAddress,
          data,
          description,
          getExecutionTimeInNanosecs().toString(),
          executors
        )

        setSpinnerFlag(false)
        console.log(res)

        toast.success('Successfully scheduled an operation.', {
          style: { maxWidth: 'none' },
        })
      }
    } catch (error: any) {
      setSpinnerFlag(false)
      if (error.message.includes('Unauthorized')) {
        toast.error('You are not authorized to perform this action.', {
          style: { maxWidth: 'none' },
        })
      } else if (
        error.message.includes('Minimum Delay condition not satisfied') ||
        error.message.includes('Cannot Sub')
      ) {
        toast.error('Minimum delay condition not satisfied.', {
          style: { maxWidth: 'none' },
        })
      } else if (error.message.includes('addr_validate error')) {
        toast.error('Invalid target contract address.', {
          style: { maxWidth: 'none' },
        })
      } else if (
        error.message.includes('bech32') ||
        error.message.includes('Invalid type')
      ) {
        toast.error('Please specify a valid Timelock contract address.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  return (
    <div className="px-8">
      <div className="basis-1/4 flex-col mb-1">
        <div className="flex">
          <label
            htmlFor="small-input"
            className="block mr-1 mb-1 ml-3 font-bold text-white dark:text-gray-300"
          >
            Data
          </label>
          <Tooltip label="The function message to be executed by the target contract in JSON format.">
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
        <textarea
          onChange={(e) => {
            setData(e.target.value)
          }}
          className="overflow-auto py-2 px-1 mx-3 mb-1 w-4/5 placeholder:text-white/50 bg-white/10 rounded
          border-2
          border-white/20 focus:ring focus:ring-plumbus-20 h-1/8 form-input,"
          placeholder="{ }"
        />
      </div>

      <CustomInput
        function={handleChangeExecutors}
        placeholder="Executors"
        tooltip="Addresses that are in charge of executing operations. Any address can execute the scheduled operation after the execution time if the executor list is left empty."
      />
      <div className="flex">
        <label
          htmlFor="small-input"
          className="block mr-1 mb-1 ml-3 font-bold text-white dark:text-gray-300"
        >
          Target Contract Address
        </label>
        <Tooltip label="Target contract address over which the Timelock contract has control.">
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
      <input
        onChange={(e) => {
          setTargetAddress(e.target.value)
        }}
        placeholder="Target Address"
        className="py-2 px-1 mx-3 mb-2 w-4/5 bg-white/10 rounded border-2 border-white/20 focus:ring
        focus:ring-plumbus-20
        form-input, placeholder:text-white/50,"
      />
      <div className="basis-1/4 flex-col my-4">
        <div className="flex">
          <label
            htmlFor="small-input"
            className="block mr-1 mb-1 ml-3 font-bold text-white dark:text-gray-300"
          >
            Description
          </label>
          <Tooltip label="Brief account of the operation to be scheduled.">
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
        <input
          type="text"
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          className="py-2 px-1 mx-3 bg-white/10 rounded border-2 border-white/20 focus:ring
          focus:ring-plumbus-20
          form-input, placeholder:text-white/50,"
          placeholder="Description"
        />
      </div>
      <div className="flex">
        <div className="basis-1/4 flex-col">
          <div className="flex">
            <label
              htmlFor="small-input"
              className="block mr-1 mb-1 ml-3 font-bold text-white dark:text-gray-300"
            >
              Execution Time
            </label>
            <Tooltip label="The time after which a scheduled operation can be executed and have an effect on the target contract.">
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
          <div className="flex">
            <div>
              <input
                type="date"
                onChange={handleChangeExecutionDate}
                className="py-2 px-1 mr-1 ml-3 bg-white/10 rounded border-2 border-white/20 focus:ring
                focus:ring-plumbus-20
                form-input, placeholder:text-white/50,"
                placeholder=" Execution Time"
              />
            </div>
            <div>
              <input
                type="time"
                onChange={handleChangeExecutionTime}
                className="py-2 px-1 mr-2 ml-1 bg-white/10 rounded border-2 border-white/20 focus:ring
                focus:ring-plumbus-20
                form-input, placeholder:text-white/50,"
                placeholder=" Execution Time"
              />
            </div>
            <div className="basis-1/4 px-2 mt-1">
              <Button
                isLoading={spinnerFlag}
                isWide
                rightIcon={<FaAsterisk />}
                onClick={execute}
              >
                Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ScheduleModal
