import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from 'contexts/theme'
import { Operation, Timelock } from '../models'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contracts'

const ManageTimeLock = () => {
  const theme = useTheme()
  const [contractAddress, setContractAddress] = useState(
    'juno1w7nempd8cl96cj8s9ulpzkn49yyafgctt7e6vtj03x9ejmr8dtnqkcy0vw'
  )
  // 'juno1ptxjpktyrus6g8xn9yd98ewzahyhhvc56ddg6c8ln2hk6qhlesxqy43240'

  const [timelock, setTimelock] = useState<Timelock>(new Timelock([], [], 0))
  const [operations, setOperations] = useState<Operation[]>([])
  const [clientFound, setClientFound] = useState(false)
  const [queryDrop, setQueryDrop] = useState(false)
  const [executeDrop, setExecuteDrop] = useState(false)
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const query = async () => {
    try {
      const client = contract?.use(contractAddress)

      if (client) {
        setClientFound(true)
        const admins = await client?.getAdmins()
        const minDelay = await client?.getMinDelay()
        const res = await client?.getOperations()
        console.log(operations)

        setTimelock(new Timelock(admins, [], minDelay))
        setOperations(res.operationList)
      }
    } catch (error: any) {
      toast.error(error.message, { style: { maxWidth: 'none' } })
    }
  }

  const execute = async () => {
    try {
      const client = contract?.use(contractAddress)

      if (client && wallet) {
        const msg = {
          mint: {
            amount: '1000',
          },
        }
        const res6 = await client?.schedule(
          wallet.address,
          contractAddress,
          msg,
          Number(17446744073709551515).toString(),
          ['juno1smz9wdg5v7wywquyy7zn7ujvu54kuumwzw5ss8', wallet.address]
        )
        console.log('schedule: ', res6)
      }
    } catch (error: any) {
      toast.error('Error', { style: { maxWidth: 'none' } })
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

      <div className="w-full justify-center">
        <div className="flex">
          <div className="w-full ml-20 font-bold my-3 text-center items-center text-xl">
            {timelock.admins.length + ' admins'}
            {timelock.admins.map((item, index) => (
              <div key={index}>{'admin' + (index + 1) + ': ' + item}</div>
            ))}
            {'min delay: ' + timelock.min_time_delay} <br />
          </div>
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className=" mr-10 h-20 w-28 bg-juno border border-gray-300 shadow-sm flex items-center justify-center w-full rounded-xl px-4 py-2 text-lg font-medium text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
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
        </div>

        {operations.length > 0 &&
          operations.map((item, index) => (
            <div
              key={index}
              className={`${
                theme.isDarkTheme ? 'border-gray/20' : 'border-dark/20'
              } text-center m-5`}
            >
              <div className="h-32 w-full p-3 flex flex-col items-center border rounded-xl">
                <div className="flex items-center text-lg font-bold mb-1">
                  {' Operation' + item.id + ' status: ' + item.status}
                </div>
                {'execution time: ' + item.execution_time} <br />
                {'target: ' + item.target} <br />
                {'data: ' + item.data} <br />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ManageTimeLock
