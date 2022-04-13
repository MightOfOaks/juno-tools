import clsx from 'clsx'
import Button from 'components/Button'
import { useContracts } from 'contexts/contracts'
import React, { useEffect, useState } from 'react'
import toast, { resolveValue } from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'
import { isValidAddress } from 'utils/isValidAddress'

import { copy } from '../../../../../utils/clipboard'
import Tooltip from '../../../../../utils/OperationsTableHelpers/Tooltip'

const InstantiateLockbox = (props: {
  contractAddress: string
  spinnerFlag: boolean
  initFlag: boolean
  initResponse: any
  function: (arg0: Record<string, unknown>) => void
}) => {
  const [initMsg, setInitMsg] = useState<Record<string, unknown>>({})
  const [admin, setAdmin] = useState('')
  const [flag, setFlag] = useState(false)
  const { contractAddress } = props

  const resetFlags = () => {
    setFlag(false)
  }

  useEffect(() => {
    setInitMsg({
      admin,
    })
  }, [admin])

  const handleChangeAdmin = (event: { target: { value: string } }) => {
    setAdmin(event.target.value)
  }

  const instantiate = () => {
    if (!initMsg) {
      setFlag(true)
      setTimeout(resetFlags, 3000)
    } else if (!isValidAddress(admin.toString())) {
      toast.error('The specified address is not valid.', {
        style: { maxWidth: 'none' },
      })
    } else {
      props.function(initMsg)
    }
  }

  return (
    <div className="relative flex-col px-10 mt-5">
      <div className="px-3">
        <div className="flex flex-row">
          <div className="w-2/5">
            <label className="block mb-2 text-4xl font-bold text-left text-white dark:text-gray-300">
              Instantiate
            </label>
          </div>
          <div className="w-2/3">
            <label className="block mb-2 font-bold text-left text-white dark:text-gray-300 text-md">
              Admin Address
            </label>
            <div className="flex-row">
              <div className="flex">
                <input
                  type="text"
                  onChange={handleChangeAdmin}
                  className="py-2 px-1 w-full bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
                  placeholder="Please enter admin address"
                />
              </div>
              <div className="float-right mt-3">
                <Button
                  isLoading={props.spinnerFlag}
                  isWide
                  rightIcon={<FaAsterisk />}
                  onClick={(e) => {
                    e.preventDefault()
                    instantiate()
                  }}
                >
                  Instantiate Contract
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-5 mx-3" />

      <div className="basis-1/4 px-3 mt-6">
        {props.initFlag && (
          <div className="float-right basis-1/3 mr-2 ml-3 h-10">
            <label
              htmlFor="small-input"
              className="block mx-1 font-bold text-white dark:text-gray-300 underline underline-offset-1 text-md"
            >
              Lockbox Contract Address
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

export default InstantiateLockbox
