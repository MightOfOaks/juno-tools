import clsx from 'clsx'
import Button from 'components/Button'
import React, { useEffect, useState } from 'react'
import toast, { resolveValue } from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'

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

  useEffect(() => {
    setInitMsg({
      admins: admins,
      proposers: proposers,
      min_delay: { time: minDelay },
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
      <div className="relative flex-col px-10 mt-5">
        <div className="flex flex-row mb-12 w-max">
          <div className="basis-1/4 flex-col">
            <div className="flex">
              <label
                htmlFor="small-input"
                className="block mr-1 mb-1 ml-3 font-bold text-white  after:text-red-500 dark:text-gray-300 after:content-['_*'] text-md"
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
              className="py-2 px-1 mx-3 bg-white/10 rounded border-2 border-white/20 focus:ring
              focus:ring-plumbus-20
              form-input, placeholder:text-white/50,"
              placeholder="Minimum Delay"
            />
          </div>

          <select
            onChange={handleChangeMinDelayUnit}
            defaultValue="seconds"
            name="time"
            id="time"
            className="float-left px-1 mt-7 h-11 text-white/50 bg-white/10 options:bg-white/50 rounded border-2 border-white/20 basis-1/8"
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

          {props.initFlag && (
            <div className="float-right basis-1/3 mr-2 ml-36 h-10">
              <label
                htmlFor="small-input"
                className="block mx-1 font-bold text-white dark:text-gray-300 underline underline-offset-1 text-md"
              >
                Timelock Contract Address
              </label>
              <Tooltip label="Click to copy">
                <label
                  htmlFor="small-input"
                  className="block mx-1 font-normal text-center text-white hover:text-juno dark:text-gray-300 bg-white/10 rounded cursor-pointer text-md"
                  onClick={async () => {
                    copy(props.initResponse.contractAddress)
                  }}
                >
                  {props.initResponse.contractAddress}
                </label>
              </Tooltip>

              <label
                htmlFor="small-input"
                className="block mx-1 mt-2 font-bold text-white dark:text-gray-300 underline underline-offset-1 text-md"
              >
                TxHash
              </label>

              <Tooltip label="Click to copy">
                <label
                  htmlFor="small-input"
                  className="block mx-1 text-sm font-normal text-white hover:text-juno dark:text-gray-300 bg-white/10 rounded cursor-pointer"
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
            placeholder="Administrators"
            tooltip="The administrators are responsible for the initial configuration of the Timelock contract. If the administrator list is left empty, the address by which the Timelock contract is instantiated will be set as an administrator by default, along with the Timelock contract itself. Once the list of proposers and the minimum delay time of the contract is determined (upon instantiation or later), the administrator rights are expected to be renounced/revoked for the Timelock contract to become self-governed. From this point on, every action would need to pass through the Timelock mechanism before they can be executed."
          />
          <CustomInput
            function={handleChangeProposers}
            placeholder="Proposers"
            tooltip="Addresses that are in charge of scheduling and cancelling operations."
            isRequired={true}
          />
        </div>
        <div className="basis-1/4 px-3 mt-6">
          <Button
            isLoading={props.spinnerFlag}
            isWide
            rightIcon={<FaAsterisk />}
            onClick={instantiate}
          >
            Instantiate Contract
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InstantiateTimelock
