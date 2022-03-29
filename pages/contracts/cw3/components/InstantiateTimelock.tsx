import React, { useEffect, useState } from 'react'
import CustomInput from './CustomInput'

const InstantiateTimelock = (props: {
  function: (arg0: Record<string, unknown>) => void
}) => {
  const [initMsg, setInitMsg] = useState<Record<string, unknown>>({})
  const [admins, setAdmins] = useState<string[]>([])
  const [proposers, setProposers] = useState<string[]>([])
  const [minDelay, setMinDelay] = useState(0)
  const [minDelayUnit, setMinDelayUnit] = useState("seconds")
  const [flag, setFlag] = useState(false)

  const resetFlags = () => {
    setFlag(false)
  }
  
  const handleChangeAdmins = (arg0: string[]
  ) => {
    setAdmins(arg0);
    console.log("Admins: " + admins)
  }
  
  const handleChangeProposers = (arg0: string[]
    ) => {
      setProposers(arg0);
      console.log("Proposers: " + proposers)
    }
  
  const handleChangeMinDelay = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setMinDelay(Number(event.target.value))
  }

  const handleChangeMinDelayUnit = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setMinDelayUnit(event.target.value)
  }

  

  useEffect(() => {
    setInitMsg({
      admins: [admins],
      proposers: [proposers],
      min_delay: Number(minDelay).toString(),
      
    })
  }, [admins, proposers, minDelay, minDelayUnit])

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
              className="py-2 px-1 mx-3 rounded text-black text-gray-900 dark:text-gray-300"
              placeholder="Minimum Delay"
            />
          </div>
          <select
            name="time"
            id="time"
            className="h-10 mt-6 basis-1/4 rounded text-black px-1 float-right"
          >
            <option value="days">days</option>
            <option value="hours">hours</option>
            <option value="minutes">minutes</option>
            <option value="seconds">seconds</option>
          </select>
          <div className="px-6 mt-5 basis-1/4">
            <button onClick={instantiate} className="p-2 border-2 rounded-lg hover:text-juno">
              Instantiate
            </button>
          </div>
        </div>
        <hr className="mx-3" />
        <div className="grid grid-cols-2 gap-4 mt-10">
          <CustomInput function={handleChangeAdmins} placeholder="Admins" />
          <CustomInput function={handleChangeProposers} placeholder="Proposers" />
        </div>
      </div>
    </div>
  )
}

export default InstantiateTimelock
