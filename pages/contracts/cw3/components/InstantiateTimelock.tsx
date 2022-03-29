import React, { useEffect, useState } from 'react'
import toast, { resolveValue } from 'react-hot-toast'
import CustomInput from './CustomInput'

const InstantiateTimelock = (props: {initFlag: boolean; initResponse: any; function: (arg0: Record<string, unknown>) => void
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
  }
  
  const handleChangeProposers = (arg0: string[]
  ) => {
    setProposers(arg0);
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

  const getMinDelayInNanoSeconds = (arg: number): String => {
      if(minDelayUnit === "seconds") {
        return String(arg * 1000000000)
      }
      if(minDelayUnit === "minutes") {
        return String(arg * 60000000000)
      }
      if(minDelayUnit === "hours") {
        return String(arg * 3600000000000)
      }
      if(minDelayUnit === "days") {
        return String(arg * 86400000000000)
      }else{
        return String(arg)
      }
  }

  useEffect(() => {
    setInitMsg({
      admins: admins,
      proposers: proposers,
      min_delay: getMinDelayInNanoSeconds(minDelay).toString(),
      
    })
  }, [admins, proposers, minDelay, minDelayUnit])

  const instantiate = () => {
    if (!initMsg) {
      setFlag(true)
      setTimeout(resetFlags, 3000)
    } else if(isNaN(minDelay) || Number(minDelay) < 1) {
      toast.error('You need to specify a valid minimum delay.', {style: { maxWidth: "none" },})
    } else if(proposers.length === 0) {
      toast.error('You need to specify at least one proposer to instantiate a Timelock contract.', {style: { maxWidth: "none" },}) 
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
              className="mb-1 mx-3 block text-sm font-bold text-gray-900 dark:text-gray-300"
            >
              Minimum Delay
            </label>
            <input
              type="text"
              onChange={handleChangeMinDelay}
              className="py-2 px-1 mx-3 rounded text-black text-gray-900 dark:text-gray-300"
              placeholder="Minimum Delay"
            />
          </div>
          <select
            onChange={handleChangeMinDelayUnit}
            defaultValue="seconds"
            name="time"
            id="time"
            className="h-10 mt-6 basis-1/8 rounded text-black px-1 float-left"
          >
            <option value="days">days</option>
            <option value="hours">hours</option>
            <option value="minutes">minutes</option>
            <option value="seconds">seconds</option>
          </select>
          <div className="px-3 mt-5 basis-1/4">
            <button onClick={instantiate} className="p-2 border-2 rounded-lg hover:text-juno">
              Instantiate
            </button>
          </div>
          
          {props.initFlag && 
          (<div className="h-12 ml-20 mr-2 basis-1/3 float-right">
            <label
              htmlFor="small-input"
              className="mx-1 block text-sm underline underline-offset-1 font-bold text-gray-900 dark:text-gray-300"
            >
              Timelock Contract Address 
            </label>
            <label
              htmlFor="small-input"
              className="hover:text-juno mx-1 block text-sm font-bold text-gray-900 dark:text-gray-300"
              onClick={async () => {await navigator.clipboard.writeText(props.initResponse.contractAddress)
                       toast.success('Copied to clipboard')}}
            >
              {props.initResponse.contractAddress}
            </label>
            
            <label
              htmlFor="small-input"
              className="mt-2 mx-1 block text-sm font-bold underline underline-offset-1 text-gray-900 dark:text-gray-300"
            >
                TxHash
            </label>

            <label
              htmlFor="small-input"
              className="hover:text-juno mx-1 block text-sm font-medium text-gray-900 dark:text-gray-300"
              onClick={async () => {await navigator.clipboard.writeText(props.initResponse.transactionHash)
                toast.success('Copied to clipboard')}}
            >  
               {props.initResponse.transactionHash}
            </label>
          </div>)}
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
