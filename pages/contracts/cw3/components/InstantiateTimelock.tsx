import React, { useEffect, useState } from 'react'
import toast, { resolveValue } from 'react-hot-toast'
import CustomInput from './CustomInput'

const InstantiateTimelock = (props: {spinnerFlag:boolean; initFlag: boolean; initResponse: any; function: (arg0: Record<string, unknown>) => void
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

          {props.spinnerFlag && (<div className="h-12 pt-6 mr-2 basis-1/3">
            <svg role="status" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-juno" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>)}
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
