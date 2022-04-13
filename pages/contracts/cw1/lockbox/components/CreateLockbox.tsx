import clsx from 'clsx'
import Button from 'components/Button'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import React, { useEffect, useState } from 'react'
import toast, { resolveValue } from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'

import { copy } from '../../../../../utils/clipboard'
import Tooltip from '../../../../../utils/OperationsTableHelpers/Tooltip'
import ClaimsInput from './ClaimsInput'

type Claim = {
  addr: string
  amount: string
}

type Expiration =
  | {
      at_time: string
    }
  | {
      at_height: number
    }

const CreateLockbox = (props: { contractAddress: string }) => {
  const [contractAddress, setContractAddress] = useState(props.contractAddress)

  const contract = useContracts().cw1Lockbox
  const wallet = useWallet()
  const [msg, setMsg] = useState<Record<string, unknown>>({})
  const [spinnerFlag, setSpinnerFlag] = useState(false)
  const [owner, setOwner] = useState('')
  const [claims, setClaims] = useState<Claim[]>([])
  const [expiration, setExpiration] = useState<Expiration>({
    at_time: '0',
  })
  const [unit, setUnit] = useState('ujunox')
  const [flag, setFlag] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [scheduleType, setScheduleType] = useState('at_time')
  const [at_height, setHeight] = useState(0)
  const [native_token, setNativeToken] = useState<string | null>('juno')
  const [cw20_addr, setCw20Addr] = useState<string | null>(null)

  const resetFlags = () => {
    setFlag(false)
  }

  const handleChangeContractAddress = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setContractAddress(event.target.value)
  }

  const handleChangeOwnerAddress = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setOwner(event.target.value)
  }

  const handleChangeClaims = (arg0: Claim[]) => {
    setClaims(arg0 as never)
  }

  const handleChangeUnit = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setUnit(event.target.value)
  }

  const handleChangeExecutionHeight = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setHeight(Number(event.target.value))
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
      at_time: getExecutionTimeInNanosecs().toString(),
    })
  }, [date, time])

  useEffect(() => {
    setExpiration({
      at_height,
    })
  }, [at_height])

  useEffect(() => {
    if (unit === 'ujunox') {
      setCw20Addr(null)
      setNativeToken('ujunox')
    }
  }, [unit])

  useEffect(() => {
    setMsg({
      create_lockbox: {
        owner,
        claims,
        expiration,
        native_token,
        cw20_addr,
      },
    })
  }, [owner, claims, expiration, native_token, cw20_addr])

  const create = async () => {
    try {
      setSpinnerFlag(true)
      const client = contract?.use(contractAddress)
      if (!client || !wallet) {
        toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
      }
      console.log(msg)
      const res = await client?.create(wallet.address, msg)
      console.log(res)
      /*if (!(isNaN(lockboxId) || Number(lockboxId) < 1)) {
                setSpinnerFlag(true)
                if (nativeCoinFlag) {
                    const res = await client?.deposit_native(
                        wallet.address,
                        lockboxId.toString(),
                        amount,
                        'ujunox'
                    )
                    console.log(res)
                } else {
                    const res = await client?.deposit_cw20(
                        wallet.address,
                        lockboxId.toString(),
                        amount,
                        cw20Client
                    )
                    console.log(res)
                }
                setSpinnerFlag(false)
                toast.success('Successfully made a claim.', {
                    style: { maxWidth: 'none' },
                })
            } else {
                toast.error('You need to specify a valid Lockbox ID.', {
                    style: { maxWidth: 'none' },
                })
            }*/
    } catch (error: any) {
      setSpinnerFlag(false)
      if (error.message.includes('Unauthorized')) {
        toast.error('You are not authorized to make a claim.', {
          style: { maxWidth: 'none' },
        })
      } else if (error.message.includes('bech32')) {
        toast.error('You need to specify a valid Lockbox contract address.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  return (
    <div className="relative flex-col px-10 mt-5">
      <div className="px-3">
        <div className="flex flex-row">
          <div className="w-2/5">
            <label className="block mb-2 text-4xl font-bold text-left text-white dark:text-gray-300">
              Create Lockbox
            </label>
          </div>
          <div className="w-2/3">
            <div className="py-2 pl-2">
              <label className="block mb-2 font-bold text-left text-white dark:text-gray-300 text-md">
                Contract Address
              </label>
              <div className="flex-row">
                <div className="flex">
                  <input
                    type="text"
                    onChange={handleChangeContractAddress}
                    className="py-2 px-1 w-full bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
                    placeholder="Please enter contract address"
                  />
                </div>
              </div>
            </div>
            <div className="py-2 pl-2">
              <label className="block mb-2 font-bold text-left text-white dark:text-gray-300 text-md">
                Owner Address
              </label>
              <div className="flex-row">
                <div className="flex">
                  <input
                    type="text"
                    onChange={handleChangeOwnerAddress}
                    className="py-2 px-1 w-full bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
                    placeholder="Please enter owners address"
                  />
                </div>
              </div>
            </div>
            {/* Type section */}
            <div className="grid grid-rows-2 pl-2">
              <label className="mt-2 font-bold text-left text-white dark:text-gray-300 text-md">
                Type
              </label>
              <div className="flex flex-row">
                <select
                  onChange={handleChangeUnit}
                  defaultValue="ujunox"
                  name="type"
                  id="type"
                  className="px-1 w-1/5 h-11 text-white bg-white/10 options:bg-white/50 rounded border-2 border-white/20"
                >
                  <option className="bg-[#3a3535]" value="ujunox">
                    ujunox
                  </option>
                  <option className="bg-[#3a3535]" value="juno">
                    juno
                  </option>
                  <option className="bg-[#3a3535]" value="cw20">
                    cw20
                  </option>
                </select>

                {unit === 'cw20' && (
                  <input
                    type="text"
                    onChange={handleChangeCw20}
                    className="py-2 px-1 ml-5 w-full bg-white/10 rounded border-2 border-white/20 focus:ring
                focus:ring-plumbus-20
                form-input, placeholder:text-white/50,"
                    placeholder="Please enter cw20 address"
                  />
                )}

                {unit !== 'cw20' && (
                  <input
                    type="text"
                    disabled={true}
                    className="py-2 px-1 ml-5 w-full bg-white/10 rounded border-2 border-white/20 focus:ring
                focus:ring-plumbus-10
                form-input, placeholder:text-white/50,"
                    placeholder={unit}
                  />
                )}
              </div>
            </div>
            {/* End of type section */}
            {/* Scheduled Section */}
            <div className="grid grid-rows-2 pt-3 pl-2">
              <div className="flex flex-row mt-2">
                <label className="block mb-2 w-1/3 font-bold text-left text-white dark:text-gray-300 text-md">
                  Scheduled
                </label>
                {scheduleType === 'at_height' && (
                  <div className="flex flex-row w-full">
                    <button className="w-full border border-gray">
                      At Height
                    </button>

                    <button
                      className="ml-20 w-full border border-black"
                      onClick={() => {
                        setScheduleType('at_time')
                        setExpiration({
                          at_time: getExecutionTimeInNanosecs().toString(),
                        })
                      }}
                    >
                      At Time
                    </button>
                  </div>
                )}
                {scheduleType !== 'at_height' && (
                  <div className="flex flex-row w-full">
                    <button
                      className="w-full border border-black"
                      onClick={() => {
                        setScheduleType('at_height')
                        setExpiration({
                          at_height,
                        })
                      }}
                    >
                      At Height
                    </button>
                    <button className="ml-20 w-full border border-gray">
                      {' '}
                      At Time{' '}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-row my-2">
                <input
                  type="number"
                  disabled={scheduleType === 'at_time'}
                  onChange={handleChangeExecutionHeight}
                  className="py-2 px-1 w-1/2 bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
                  placeholder="Please enter execution height"
                />
                <input
                  type="date"
                  disabled={scheduleType === 'at_height'}
                  onChange={handleChangeExecutionDate}
                  className="py-2 mr-1 ml-40 bg-white/10 rounded border-2 border-white/20 focus:ring
        focus:ring-plumbus-20
        form-input, placeholder:text-white/50,"
                  placeholder=" Execution Date"
                />
                <input
                  type="time"
                  disabled={scheduleType === 'at_height'}
                  onChange={handleChangeExecutionTime}
                  className="py-2 mr-2 ml-1 bg-white/10 rounded border-2 border-white/20 focus:ring
        focus:ring-plumbus-20
        form-input, placeholder:text-white/50,"
                  placeholder=" Execution Time"
                />
              </div>
            </div>
            {/* End of scheduled */}
            <ClaimsInput function={handleChangeClaims} />
            <div className="float-right basis-1/4 px-3 my-6">
              <Button
                isLoading={spinnerFlag}
                isWide
                rightIcon={<FaAsterisk />}
                onClick={create}
              >
                Create Lockbox
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateLockbox
