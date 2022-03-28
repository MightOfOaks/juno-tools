import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from 'contexts/theme'
import { Timelock } from '../models'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contracts'

const ManageTimeLock = () => {
  const theme = useTheme()

  const [isExecutePage, setIsExecutePage] = useState(true)
  const [contractAddress, setContractAddress] = useState(
    'juno1ptxjpktyrus6g8xn9yd98ewzahyhhvc56ddg6c8ln2hk6qhlesxqy43240'
  )

  const [timelock, setTimelock] = useState<Timelock>(new Timelock([], [], 0))
  const [clientFound, setClientFound] = useState(false)
  const [queryDrop, setQueryDrop] = useState(false)
  const [executeDrop, setExecuteDrop] = useState(false)
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const query = async () => {
    try {
      const client = contract?.use(contractAddress)

      if (client) {
        console.log(client)
        setClientFound(true)
        const response = await client?.getAdmins()
        const response3 = await client?.getMinDelay()
        setTimelock(new Timelock(response, [], response3))

        const response2 = await client?.getOperations()
        console.log('getOperations', response2)

        //   const proposers = await client?.getProposers()
        //   console.log('getProposers', proposers)

        let operation_id = '1'
        const response4 = await client?.getExecutionTime(operation_id)
        console.log('getExecutionTime', response4)

        const executors = await client?.getExecutors(operation_id)
        console.log('getExecutors', executors)

        const response5 = await client?.getOperationStatus(operation_id)
        console.log('getOperation', response5)
      }
    } catch (error: any) {
      toast.error(error.message, { style: { maxWidth: 'none' } })
    }
  }

  return (
    <div>
      <div className="px-10 py-5">
        <label className="block mb-2 text-lg font-bold text-gray-900 dark:text-gray-300 text-center">
          Timelock Contract Address
        </label>
        <div className="flex">
          <input
            type="text"
            className="w-3/4 mr-10 bg-gray-50 border border-gray-300 text-black text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={contractAddress || 'Please enter contract address'}
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
          <button onClick={query} className="p-3 bg-juno rounded-lg mt-3 ">
            Search
          </button>
        </div>
      </div>
      {clientFound && (
        <div className="flex ml-10 justify-around">
          {/*EXECUTE DROPDOWN */}
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className=" h-32 w-32  bg-juno border border-gray-300 shadow-sm flex items-center justify-center w-full rounded-xl px-4 py-2 text-lg font-medium text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                id="options-menu"
                onClick={() => setExecuteDrop(!executeDrop)}
              >
                Execute
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z"></path>
                </svg>
              </button>
            </div>
            {executeDrop && (
              <div className="origin-top-right border border-gray-300 bg-gray-800 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1 "
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>Schedule</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>Cancel</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>Execute</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>RevokeAdmin</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>AddProposer</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>RemoveProposer</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>UpdateMinDelay</span>
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>

          <div
            className={`${
              theme.isDarkTheme ? 'border-gray/20' : 'border-dark/20'
            } w-1/2 text-center`}
          >
            <div className="h-32 w-full p-3 flex flex-col items-center border rounded-xl">
              <div className="flex items-center text-lg font-bold mb-1">
                {timelock.admins.length + ' admins'}
              </div>
              {timelock.admins.map((item, index) => (
                <div key={index}>{index + 1 + ': ' + item}</div>
              ))}
              {'min delay: ' + timelock.min_time_delay}
            </div>
          </div>

          {/*QUERY DROPDOWN */}
          <div className="relative inline-block text-right">
            <div>
              <button
                type="button"
                className=" h-32 w-32  bg-juno border border-gray-300 shadow-sm flex items-center justify-center w-full rounded-xl px-4 py-2 text-lg font-medium text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                id="options-menu"
                onClick={() => setQueryDrop(!queryDrop)}
              >
                Query
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z"></path>
                </svg>
              </button>
            </div>
            {queryDrop && (
              <div className="origin-top-right border border-gray-300 bg-gray-800 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1 "
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>GetOperationStatus</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>GetExecutionTime</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>GetAdmins</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>GetOperations</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>GetMinDelay</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>GetProposers</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="block block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span>GetExecutors</span>
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageTimeLock
