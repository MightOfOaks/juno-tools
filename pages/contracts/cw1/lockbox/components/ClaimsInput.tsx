import { Bech32 } from '@cosmjs/encoding'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { isValidAddress } from 'utils/isValidAddress'

import { copy } from '../../../../../utils/clipboard'
import Tooltip from '../../../../../utils/OperationsTableHelpers/Tooltip'

const ClaimsInput = (props: { function: (arg0: string[]) => void }) => {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState(0)
  const [items, setItems] = useState([])

  const handleAddressChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setAddress(event.target.value)
  }

  const handleAmountChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setAmount(Number(event.target.value))
  }

  const addClicked = () => {
    let tempArray: React.SetStateAction<never[]> = []
    if (items.includes(address.toString() as never)) {
      toast.error('The address already exists.', {
        style: { maxWidth: 'none' },
      })
    } else if (address.length === 0) {
      toast.error('The address cannot be empty.', {
        style: { maxWidth: 'none' },
      })
    } else if (amount <= 0) {
      toast.error('The amount cannot be zero.', {
        style: { maxWidth: 'none' },
      })
    } else if (!isValidAddress(address.toString())) {
      toast.error('The specified address is not valid.', {
        style: { maxWidth: 'none' },
      })
    } else {
      tempArray = [...items, [address, amount]] as never
      setItems(tempArray)
      setAddress('')
      setAmount(0)
    }
  }

  const removeClicked = (item: string) => {
    let tempArray: React.SetStateAction<never[]> = []
    for (let i = 0; i < items.length; i++) {
      if (items[i] !== item) {
        tempArray.push(items[i])
      }
    }
    setItems(tempArray)
  }

  useEffect(() => {
    props.function(items)
  }, [items])

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
      <div className="grid grid-cols-2 w-3/4">
        {items.map((item: string) => {
          return (
            <div key={item}>
              <div className="grid grid-cols-2 col-span-1 p-2 hover:text-juno bg-black bg-opacity-10 rounded">
                <Tooltip label={item}>
                  <button
                    type="button"
                    onClick={() => copy(item)}
                    className="text-sm"
                  >
                    {item.slice(0, 5) +
                      '...' +
                      item.slice(item.length - 5, item.length)}
                  </button>
                </Tooltip>
                <div
                  className="ml-5"
                  onClick={() => {
                    removeClicked(item)
                  }}
                >
                  <button type="button" className="pl-2 hover:text-juno">
                    x
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ClaimsInput
