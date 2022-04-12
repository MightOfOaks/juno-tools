import { Bech32 } from '@cosmjs/encoding'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { isValidAddress } from 'utils/isValidAddress'

import { copy } from '../../../../../utils/clipboard'
import Tooltip from '../../../../../utils/OperationsTableHelpers/Tooltip'

type Claim = {
  address: string
  amount: string
}

const ClaimsInput = (props: { function: (arg0: Claim[]) => void }) => {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [claims, setClaims] = useState<Claim[]>([])

  const handleAddressChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setAddress(event.target.value)
  }

  const handleAmountChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setAmount(event.target.value)
  }

  const contain = (): boolean => {
    for (let i = 0; i < claims.length; i++) {
      if (claims[i].address === address) return true
    }
    return false
  }

  const addClicked = () => {
    let tempArray: Claim[] = []
    if (contain()) {
      toast.error('The address already exists.', {
        style: { maxWidth: 'none' },
      })
    } else if (address.length === 0) {
      toast.error('The address cannot be empty.', {
        style: { maxWidth: 'none' },
      })
    } else if (Number(amount) <= 0) {
      toast.error('The amount cannot be zero.', {
        style: { maxWidth: 'none' },
      })
    } else if (!isValidAddress(address.toString())) {
      toast.error('The specified address is not valid.', {
        style: { maxWidth: 'none' },
      })
    } else {
      const nc: Claim = {
        address,
        amount,
      }
      tempArray = [...claims, nc] as never
      setClaims(tempArray)
      setAddress('')
      setAmount('')
    }
  }

  const removeClicked = (address: string) => {
    let tempArray: Claim[] = []
    for (let i = 0; i < claims.length; i++) {
      if (claims[i].address !== address) {
        tempArray.push(claims[i])
      }
    }
    setClaims(tempArray)
  }

  useEffect(() => {
    props.function(claims)
  }, [claims])

  return (
    <div className="px-3 mt-2">
      <div className="flex flex-row">
        <div className="mb-6 w-full">
          <div className="flex">
            <label
              htmlFor="small-input"
              className='block mb-2 font-bold text-white after:text-red-500 dark:text-gray-300 after:content-["_*] text-md'
            >
              Claims
            </label>
            <Tooltip label="asd">
              <svg
                className="mt-1 ml-1 w-4 h-4"
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
          <div className="flex flex-row w-full">
            <input
              type="text"
              className="py-2 px-1 w-1/3 bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
              value={address}
              onChange={handleAddressChange}
              placeholder="Claim Address"
            />
            <input
              type="number"
              className="py-2 px-1 ml-8 w-1/3 bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Claim Amount"
            />
          </div>
        </div>
        <button
          type="button"
          className=" basis-1/12 mt-2 ml-1"
          onClick={addClicked}
        >
          <span className="p-2 text-white bg-juno hover:bg-plumbus rounded-full">
            +
          </span>
        </button>
      </div>
      <div className="w-full">
        {claims.map((value: Claim, index: Number, array: Claim[]) => {
          return (
            <div key={value.address}>
              <div className="p-2 hover:text-juno bg-black bg-opacity-10 rounded">
                <label>{1 + (index as number) + ' | '}</label>
                <Tooltip label={value.address}>
                  <button
                    type="button"
                    onClick={() => copy(value.address)}
                    className="mx-10 text-m"
                  >
                    {value.address + ' | ' + value.amount}
                  </button>
                </Tooltip>

                <button
                  type="button"
                  className="pl-2 hover:text-juno"
                  onClick={() => {
                    removeClicked(value.address)
                  }}
                >
                  x
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ClaimsInput
