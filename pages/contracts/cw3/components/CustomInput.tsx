import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Bech32 } from '@cosmjs/encoding'

const CustomInput = (props: {
  placeholder: string | undefined
  function: (arg0: string[]) => void
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

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
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

  function isValidAddress(input: string): boolean {
    try {
      const prefix = input.substring(0, 5)
      if (prefix != 'juno1') {
        return false
      }
      return true
    } catch {
      return false
    }
  }

  useEffect(() => {
    props.function(items)
  }, [items])

  return (
    <div className="px-3">
      <div className="flex flex-row">
        <div className="mb-6 w-9/12">
          <label
            htmlFor="small-input"
            className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-300"
          >
            {props.placeholder}
          </label>
          <input
            type="text"
            className="rounded py-2 px-1 text-black w-full"
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
          <span className="hover:text-juno p-2 border-2 rounded-full">+</span>
        </button>
      </div>
      <div className="grid grid-cols-2 w-3/4">
        {items.map((item: string) => {
          return (
            <div key={item}>
              <div className="col-span-1 grid grid-cols-2 p-2 rounded bg-black bg-opacity-10">
                <button
                  type="button"
                  onClick={() => copy(item)}
                  className="text-sm"
                  data-bs-toggle="tooltip"
                  title={item}
                  // title="<em>Tooltip</em> <u>with</u> <b>HTML</b>"
                  data-bs-html="true"
                >
                  {item.slice(0, 5) +
                    '...' +
                    item.slice(item.length - 5, item.length)}
                </button>
                <div
                  className="ml-5"
                  onClick={() => {
                    removeClicked(item)
                  }}
                >
                  <button type="button" className="hover:text-juno pl-2">
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
