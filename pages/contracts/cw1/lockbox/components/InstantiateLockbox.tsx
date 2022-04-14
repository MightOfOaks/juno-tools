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
  spinnerFlag: boolean
  initFlag: boolean
  initResponse: any
  function: (arg0: Record<string, unknown>) => void
}) => {
  const [initMsg, setInitMsg] = useState<Record<string, unknown>>({})
  const [flag, setFlag] = useState(false)

  const resetFlags = () => {
    setFlag(false)
  }

  const instantiate = () => {
    if (!initMsg) {
      setFlag(true)
      setTimeout(resetFlags, 3000)
    } else {
      props.function(initMsg)
    }
  }

  return (
    <div className="flex-col px-5 mt-5">
      <div className="px-3">
        <div className="flex flex-row">
          <div className="w-2/5">
            <label className="block mb-2 text-4xl font-bold text-left text-white dark:text-gray-300">
              Instantiate
            </label>
          </div>
          <div className="w-2/3">
            <div className="basis-1/3 mr-2 ml-3 h-10">
              <label className="block pb-2 font-bold text-white dark:text-gray-300 text-md">
                Lockbox Contract Address
              </label>
              <Tooltip
                label="Click to copy"
                style={{ display: props.initFlag ? 'block' : 'none' }}
              >
                <input
                  type="text"
                  disabled={true}
                  className="py-2 px-1 w-full placeholder:text-white/50 bg-white/10 rounded
            focus:ring
            focus:ring-plumbus-20 cursor-pointer form-input,"
                  placeholder={
                    props.initFlag
                      ? ''
                      : 'Contract address will be here after instantiation'
                  }
                  onClick={async () => {
                    if (props.initFlag)
                      await copy(props.initResponse.contractAddress)
                  }}
                  value={
                    props.initFlag ? props.initResponse.contractAddress : ''
                  }
                />
              </Tooltip>

              <label className="block pt-2 pb-2 mt-2 font-bold text-white dark:text-gray-300 text-md">
                TxHash
              </label>

              <Tooltip
                label="Click to copy"
                style={{ display: props.initFlag ? 'block' : 'none' }}
              >
                <input
                  type="text"
                  disabled={true}
                  className="py-2 px-1 w-full bg-white/10 rounded focus:ring focus:ring-plumbus-20
            cursor-pointer
            form-input, placeholder:text-white/50,"
                  placeholder={
                    props.initFlag
                      ? ''
                      : 'TxHash will be here after instantiation'
                  }
                  onClick={async () => {
                    if (props.initFlag) copy(props.initResponse.transactionHash)
                  }}
                  value={
                    props.initFlag ? props.initResponse.transactionHash : ''
                  }
                />
              </Tooltip>
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
    </div>
  )
}

export default InstantiateLockbox
