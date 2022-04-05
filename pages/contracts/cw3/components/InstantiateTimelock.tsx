import React, { useEffect, useState } from 'react'
import toast, { resolveValue } from 'react-hot-toast'

import { copy } from '../../../../utils/clipboard'
import Tooltip from '../../../../utils/OperationsTableHelpers/Tooltip'
import CustomInput from './CustomInput'

const InstantiateTimelock = (props: {
  spinnerFlag: boolean
  initFlag: boolean
  initResponse: any
  function: (arg0: Record<string, unknown>) => void
}) => {
  const [initMsg, setInitMsg] = useState<Record<string, unknown>>({})
  const [admins, setAdmins] = useState<string[]>([])
  const [proposers, setProposers] = useState<string[]>([])
  const [minDelay, setMinDelay] = useState(0)
  const [minDelayUnit, setMinDelayUnit] = useState('seconds')
  const [flag, setFlag] = useState(false)

  const resetFlags = () => {
    setFlag(false)
  }

  const handleChangeAdmins = (arg0: string[]) => {
    setAdmins(arg0)
  }

  const handleChangeProposers = (arg0: string[]) => {
    setProposers(arg0)
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

  useEffect(() => {
    setInitMsg({
      admins: admins,
      proposers: proposers,
      min_delay: getMinDelayInNanoSeconds(minDelay).toString(),
    })
  }, [admins, proposers, minDelay, minDelayUnit])

  const instantiate = () => {
    if (!initMsg) {
      setFlag(true)
      setTimeout(resetFlags, 3000)
    } else if (isNaN(minDelay) || Number(minDelay) < 1) {
      toast.error('You need to specify a valid minimum delay.', {
        style: { maxWidth: 'none' },
      })
    } else if (proposers.length === 0) {
      toast.error(
        'You need to specify at least one proposer to instantiate a Timelock contract.',
        { style: { maxWidth: 'none' } }
      )
    } else {
      props.function(initMsg)
    }
  }
  return (
    <div>
      <div className="relative flex-col px-10">
        <div className="flex flex-row mb-10 w-max">
          <div className="basis-1/4 flex-col">
            <div className="flex">
              <label
                htmlFor="small-input"
                className="block mr-1 mb-1 ml-3 font-bold text-gray-900 dark:text-gray-300 text-md"
              >
                Minimum Delay
              </label>
              <Tooltip label="The minimum amount of time delay for the Timelock contract. Operations can only be scheduled by the proposers if their execution time is further in the future than the amount of this delay.">
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
              onChange={handleChangeMinDelay}
              className="py-2 px-1 mx-3 text-gray-900 dark:text-gray-300 rounded"
              placeholder="Minimum Delay"
            />
          </div>
          <select
            onChange={handleChangeMinDelayUnit}
            defaultValue="seconds"
            name="time"
            id="time"
            className="float-left px-1 mt-7 h-10 text-black rounded basis-1/8"
          >
            <option value="days">days</option>
            <option value="hours">hours</option>
            <option value="minutes">minutes</option>
            <option value="seconds">seconds</option>
          </select>
          <div className="basis-1/4 px-3 mt-6">
            <button
              onClick={instantiate}
              className="p-2 hover:text-juno rounded-lg border-2"
            >
              Instantiate
            </button>
          </div>

          {props.spinnerFlag && (
            <div className="basis-1/3 pt-7 mr-2 h-12">
              <svg
                role="status"
                className="mr-2 w-8 h-8 text-gray-200 dark:text-gray-600 animate-spin fill-juno"
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
            </div>
          )}
          {props.initFlag && (
            <div className="float-right basis-1/3 mr-2 ml-20 h-12">
              <label
                htmlFor="small-input"
                className="block mx-1 text-sm font-bold text-gray-900 dark:text-gray-300 underline underline-offset-1"
              >
                Timelock Contract Address
              </label>
              <Tooltip label="Click to copy">
                <label
                  htmlFor="small-input"
                  className="block mx-1 text-sm font-medium text-gray-900 hover:text-juno dark:text-gray-300 cursor-pointer"
                  onClick={async () => {
                    copy(props.initResponse.contractAddress)
                  }}
                >
                  {props.initResponse.contractAddress}
                </label>
              </Tooltip>

              <label
                htmlFor="small-input"
                className="block mx-1 mt-2 text-sm font-bold text-gray-900 dark:text-gray-300 underline underline-offset-1"
              >
                TxHash
              </label>

              <Tooltip label="Click to copy">
                <label
                  htmlFor="small-input"
                  className="block mx-1 text-sm font-medium text-gray-900 hover:text-juno dark:text-gray-300 cursor-pointer"
                  onClick={async () => {
                    copy(props.initResponse.transactionHash)
                  }}
                >
                  {props.initResponse.transactionHash}
                </label>
              </Tooltip>
            </div>
          )}
        </div>
        <hr className="mx-3" />
        <div className="grid grid-cols-2 gap-4 mt-10">
          <CustomInput
            function={handleChangeAdmins}
            placeholder="Admins"
            tooltip="The administrators are responsible for the initial configuration of the Timelock contract. If the administrator list is left empty, the address by which the Timelock contract is instantiated will be set as an administrator by default, along with the Timelock contract itself. Once the list of proposers and the minimum delay time of the contract is determined (upon instantiation or later), the administrator rights are expected to be renounced/revoked for the Timelock contract to become self-governed. From this point on, every action would need to pass through the Timelock mechanism before they can be executed."
          />
          <CustomInput
            function={handleChangeProposers}
            placeholder="Proposers"
            tooltip="Addresses that are in charge of scheduling and cancelling operations."
          />
        </div>
      </div>
    </div>
  )
}

export default InstantiateTimelock
