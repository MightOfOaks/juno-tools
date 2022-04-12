import clsx from 'clsx'
import Button from 'components/Button'
import { useContracts } from 'contexts/contracts'
import React, { useEffect, useState } from 'react'
import toast, { resolveValue } from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'

import { copy } from '../../../../../utils/clipboard'
import Tooltip from '../../../../../utils/OperationsTableHelpers/Tooltip'
import ClaimsInput from './ClaimsInput'

type Claim = {
  address: string
  amount: Number
}

type Expiration = {
  time: number | null
  height: string | null
}

const CreateLockbox = (props: {
  spinnerFlag: boolean
  initFlag: boolean
  initResponse: any
  function: (arg0: Record<string, unknown>) => void
}) => {
  const [initMsg, setInitMsg] = useState<Record<string, unknown>>({})
  const [owner, setOwner] = useState('')
  const [claims, setClaims] = useState<Claim[]>([])
  const [expiration, setExpiration] = useState<Expiration>({
    time: 0,
    height: null,
  })
  const [unit, setUnit] = useState('juno')
  const [flag, setFlag] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [scheduleType, setScheduleType] = useState('atTime')
  const [height, setHeight] = useState('')
  const [native_token, setNativeToken] = useState<string | null>('juno')
  const [cw20_addr, setCw20Addr] = useState<string | null>(null)

  const resetFlags = () => {
    setFlag(false)
  }

  const handleChangeClaims = (arg0: Claim[]) => {
    setClaims(arg0 as never)
  }

  const handleChangeUnit = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setUnit(event.target.value)
  }

  const handleChangeScheduleType = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setScheduleType(event.target.value)
  }

  const handleChangeExecutionHeight = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setHeight(event.target.value)
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

  const handleChangeCw20 = (event: { target: { value: string } }) => {
    setCw20Addr(event.target.value)
    setNativeToken(null)
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

  useEffect(() => {
    setExpiration({
      time: getExecutionTimeInNanosecs(),
      height: null,
    })
  }, [date, time])

  useEffect(() => {
    setExpiration({
      time: null,
      height,
    })
  }, [height])

  useEffect(() => {
    if (unit === 'juno') {
      setCw20Addr(null)
      setNativeToken('juno')
    }
  }, [unit])

  useEffect(() => {
    setInitMsg({
      owner,
      claims,
      expiration,
      native_token,
      cw20_addr,
    })
  }, [owner, claims, expiration, native_token, cw20_addr])

  const instantiate = () => {
    /*if (!initMsg) {
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
            }*/
  }

  return (
    <div className="relative flex-col px-10 mt-5">
      <div className="px-3">
        <label className="block mb-2 text-5xl font-bold text-left text-white dark:text-gray-300">
          Create Lockbox
        </label>
        <div className="py-2 ">
          <label className="block mb-2 font-bold text-left text-white dark:text-gray-300 text-md">
            Contract Address
          </label>
          <div className="flex-row">
            <div className="flex">
              <input
                type="text"
                className="py-2 px-1 w-2/3 bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
                placeholder="Please enter contract address"
              />
            </div>
          </div>
        </div>
      </div>
      <hr className="my-5 mx-3" />
      <div className="px-3">
        <div className="py-2 ">
          <label className="block mb-2 font-bold text-left text-white dark:text-gray-300 text-md">
            Owner Address
          </label>
          <div className="flex-row">
            <div className="flex">
              <input
                type="text"
                className="py-2 px-1 w-2/3 bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
                placeholder="Please enter owners address"
              />
            </div>
          </div>
        </div>
      </div>
      <hr className="my-5 mx-3" />
      <div className="px-3">
        <div className="py-2 ">
          <div className="flex flex-row">
            <div className="mr-5 w-1/3">
              <label className="block mb-2 font-bold text-left text-white dark:text-gray-300 text-md">
                Type
              </label>
              {unit == 'cw20' && (
                <div className="flex-row">
                  <div className="flex">
                    <input
                      type="text"
                      onChange={handleChangeCw20}
                      className="py-2 px-1 w-full bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
                      placeholder="Please enter cw20 contract address"
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <select
                onChange={handleChangeUnit}
                defaultValue="juno"
                name="time"
                id="time"
                className="float-left px-1 mt-7 h-11 text-white bg-white/10 options:bg-white/50 rounded border-2 border-white/20 basis-1/8"
              >
                <option className="bg-[#3a3535]" value="juno">
                  juno
                </option>
                <option className="bg-[#3a3535]" value="cw20">
                  cw20
                </option>
              </select>
            </div>

            <div className="ml-10 w-1/3">
              <label className="block mb-2 font-bold text-left text-white dark:text-gray-300 text-md">
                Scheduled
              </label>
              {scheduleType == 'atHeight' && (
                <div className="flex-row">
                  <div className="flex">
                    <input
                      type="number"
                      onChange={handleChangeExecutionHeight}
                      className="py-2 px-1 w-full bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
                      placeholder="Please enter execution height"
                    />
                  </div>
                </div>
              )}
              {scheduleType == 'atTime' && (
                <div className="flex-row">
                  <div className="flex">
                    <div>
                      <input
                        type="date"
                        onChange={handleChangeExecutionDate}
                        className="py-2 px-1 mr-1 ml-3 bg-white/10 rounded border-2 border-white/20 focus:ring
        focus:ring-plumbus-20
        form-input, placeholder:text-white/50,"
                        placeholder=" Execution Date"
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
                  </div>
                </div>
              )}
            </div>
            <div>
              <select
                onChange={handleChangeScheduleType}
                defaultValue="atTime"
                name="time"
                id="time"
                className="float-left px-1 mt-7 h-11 text-white bg-white/10 options:bg-white/50 rounded border-2 border-white/20 basis-1/8"
              >
                <option className="bg-[#3a3535]" value="atTime">
                  at Time
                </option>
                <option className="bg-[#3a3535]" value="atHeight">
                  at Height
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-5 mx-3" />

      <div>
        <ClaimsInput function={handleChangeClaims} />
      </div>

      <hr className="my-5 mx-3" />

      <div className="basis-1/4 px-3 mt-6">
        <Button
          isLoading={props.spinnerFlag}
          isWide
          rightIcon={<FaAsterisk />}
          onClick={(e) => {
            e.preventDefault()
            instantiate()
          }}
        >
          Create Lockbox
        </Button>

        {props.initFlag && (
          <div className="float-right basis-1/3 mr-2 ml-3 h-10">
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
    </div>
  )
}

export default CreateLockbox
