import React, { useEffect, useState } from 'react'
import CustomInput from './CustomInput'

const InstantiateTimelock = (props: {
  function: (arg0: Record<string, unknown>) => void
}) => {
  const [initMsg, setInitMsg] = useState<Record<string, unknown>>({})
  const [admins, setAdmins] = useState('')
  const [proposers, setProposers] = useState('')
  const [executors, setExecutors] = useState('')
  const [minDelay, setMinDelay] = useState(0)
  const [flag, setFlag] = useState(false)

  const resetFlags = () => {
    setFlag(false)
  }

  const handleChangeAdmins = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setAdmins(event.target.value)
  }

  const handleChangeProposers = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setProposers(event.target.value)
  }

  const handleChangeExecutors = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setExecutors(event.target.value)
  }

  const handleChangeMinDelay = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setMinDelay(Number(event.target.value))
  }

  useEffect(() => {
    setInitMsg({
      admins: [admins],
      proposers: [proposers],
      min_delay: Number(minDelay).toString(),
      executors: [executors],
    })
  }, [admins, proposers, minDelay, executors])

  const instantiate = () => {
    if (!initMsg) {
      setFlag(true)
      setTimeout(resetFlags, 3000)
    } else {
      props.function(initMsg)
    }
  }
  return (
    <div>
      <div className="relative px-10 flex-col">
        <div className="mb-10 flex flex-row w-max">
          <div className="flex-col basis-1/4">
            <label
              htmlFor="small-input"
              className="mb-1 mx-3 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Minimum Delay
            </label>
            <input
              type="text"
              className="py-1 px-1 mx-3 rounded text-black text-gray-900 dark:text-gray-300"
              placeholder="Minimum Delay"
            />
          </div>
          <select
            name="time"
            id="time"
            className="h-10 mt-5 basis-1/4 rounded text-black px-1 float-right"
          >
            <option value="days">days</option>
            <option value="hours">hours</option>
            <option value="minutes">minutes</option>
            <option value="seconds">seconds</option>
          </select>
          <div className="px-6 mt-5 basis-1/4">
            <button className="p-2 bg-juno rounded-lg hover:bg-opacity-10">
              Instantiate
            </button>
          </div>
        </div>
        <hr className="mx-3" />
        <div className="grid grid-cols-2 gap-4 mt-10">
          <CustomInput function={resetFlags} placeholder="Admins" />
          <CustomInput function={resetFlags} placeholder="Proposers" />
        </div>
      </div>
    </div>
  )
}

export default InstantiateTimelock
