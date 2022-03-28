import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

const CustomInput = (props: {
  placeholder: string | undefined
  function: () => void
}) => {
  const [input, setInput] = useState('')
  const [items, setItems] = useState([])

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setInput(event.target.value)
    console.log(input)
  }

  const addClicked = () => {
    // @ts-ignore
    setItems([...items, input])
  }

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success('copied to clipboard')
  }

  const removeClicked = (item: string) => {
    let tempArray: React.SetStateAction<never[]>= [];
    for (let i = 0; i < items.length; i++) {
      if (items[i] !== item) {
        tempArray.push(items[i]);
      }
    }
    setItems(tempArray);
  }

  return (
    <div className="px-3">
      <div className="flex flex-row">
        <div className="mb-6">
          <label
            htmlFor="small-input"
            className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-300"
          >
            {props.placeholder}
          </label>
          <input
            type="text"
            className="rounded py-1 px-1 text-black"
            value={input}
            onChange={handleChange}
            placeholder={props.placeholder}
          />
        </div>
        <button type="button" className=" basis-1/12" onClick={addClicked}>
          <span className="hover:text-juno px-2">+</span>
        </button>
      </div>
      <div className="grid grid-rows-1">
        {items.map((item: string) => {
          return (
            <div key={item}>
              <div className="grid grid-cols-2 p-2 rounded bg-black bg-opacity-10 w-1/3">
                <button
                  type="button"
                  onClick={() => copy(item)}
                  className="text-sm"
                >
                  {item.slice(0, 5) +
                    '...' +
                    item.slice(item.length - 5, item.length)}
                </button>
                <div className="ml-5" onClick={() => {removeClicked(item)}}>
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
