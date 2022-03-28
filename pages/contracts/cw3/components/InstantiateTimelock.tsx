import React, { useEffect,useState } from 'react'


const InstantiateTimelock = (props: {
  function: (
    arg0: Record<string, unknown>,
  ) => void
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
      admins:[admins],
      proposers:[proposers],
      min_delay: Number(minDelay).toString(),
      executors:[executors],
    });
}, [admins,proposers,minDelay,executors]);


  const instantiate = () => {
    if (!(initMsg)) {
      setFlag(true)
      setTimeout(resetFlags, 3000)
    } else {
      props.function(initMsg)
    }
  }
  return (
    
      <div>
       
        <div className=" relative px-10 py-5">
          
           <input type="text" id="admins" onChange={handleChangeAdmins} className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-black placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-3" placeholder="Admins"/>
           <input type="text" id="proposers" onChange={handleChangeProposers} className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-black placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-3" placeholder="Proposers"/>
           <input type="text" id="executors" onChange={handleChangeExecutors} className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-black placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-3" placeholder="Executors"/>
           <input type="text" id="min_delay" onChange={handleChangeMinDelay} className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-black placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-3" placeholder="Minimum Delay in nanosecs"/>

          
           <button onClick={instantiate} className="p-3 bg-juno rounded-lg mt-3">
              Instantiate
           </button>
        </div>
       
      
      <br />
      {flag && <div></div>}
    </div>
  )
}

export default InstantiateTimelock
