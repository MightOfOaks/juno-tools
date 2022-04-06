import { Bech32 } from '@cosmjs/encoding'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { isValidAddress } from 'utils/isValidAddress'

import { copy } from '../../../../utils/clipboard'
import Tooltip from '../../../../utils/OperationsTableHelpers/Tooltip'

const CustomInput = (props: {
  placeholder: string | undefined
  function: (arg0: string[]) => void
  tooltip?: string | undefined
  isRequired?: boolean | undefined
}) => {
  const [input, setInput] = useState('')
  const [items, setItems] = useState([])

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setInput(event.target.value)
  }

  const addClicked = () => {
    let tempArray: React.SetStateAction<never[]> = []
    if (items.includes(input.toString() as never)) {
      toast.error('The address already exists.', {
        style: { maxWidth: 'none' },
      })
    } else if (input.length === 0) {
      toast.error('The address cannot be empty.', {
        style: { maxWidth: 'none' },
      })
    } else if (!isValidAddress(input.toString())) {
      toast.error('The specified address is not valid.', {
        style: { maxWidth: 'none' },
      })
    } else {
      tempArray = [...items, input] as never
      setItems(tempArray)
      setInput('')
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
        <div className="mb-6 w-9/12">
          <div className="flex">
            <label
              htmlFor="small-input"
              className={`block mb-2 font-bold text-white dark:text-gray-300 text-md ${
                props.isRequired
                  ? "after:text-red-500 after:content-['_*']"
                  : ''
              }`}
            >
              {props.placeholder}
            </label>
            {props.tooltip && (
              <Tooltip label={props.tooltip}>
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
            )}
          </div>
          <input
            type="text"
            className="py-2 px-1 w-full bg-white/10 rounded border-2 border-white/20 focus:ring
            focus:ring-plumbus-20
            form-input, placeholder:text-white/50,"
            value={input}
            onChange={handleChange}
            placeholder={props.placeholder}
          />
        </div>
        <button
          type="button"
          className=" basis-1/12 mt-2 ml-1"
          onClick={addClicked}
        >
          <span className="p-2 hover:text-juno rounded-full border-2">+</span>
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

export default CustomInput
