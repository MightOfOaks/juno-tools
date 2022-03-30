import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from 'contexts/theme'
import { Operation, Timelock } from '../models'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contracts'
import Prosedures from './MenageTimelock/Procedures'

const ManageTimelock = () => {
  const theme = useTheme()
  const [contractAddress, setContractAddress] = useState(
    'juno1cspathx3ex9hud98vt6qpsujj9gnefkjphzm4f83shue5q5u8suq7me0lc'
  )
  // 'juno1ptxjpktyrus6g8xn9yd98ewzahyhhvc56ddg6c8ln2hk6qhlesxqy43240'

  const [timelock, setTimelock] = useState<Timelock>(new Timelock([], [], 0))
  const [operations, setOperations] = useState<Operation[]>([])
  const [clientFound, setClientFound] = useState(false)
  const [queryDrop, setQueryDrop] = useState(false)
  const [executeDrop, setExecuteDrop] = useState(false)
  const [choiseDrop, setChoiseDrop] = useState(true)
  const [proceduresDrop, setProceduresDrop] = useState(false)
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const [choise, setChoise] = useState("bos")

  const query = async () => {
    try {
      const client = contract?.use(contractAddress)

      if (client) {
        setClientFound(true)
        const admins = await client?.getAdmins()
        const proposers = await client?.getProposers()
        const minDelay = await client?.getMinDelay()

        const res = await client?.getOperations()
        console.log(operations)

        setTimelock(new Timelock(admins, proposers, minDelay))
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
        <label className="block mb-2 text-lg font-bold text-gray-900 dark:text-gray-300 text-left">
          Timelock Contract Address
        </label>
        <div className="flex">
          <input
            type="text"
            className="w-3/4 mr-10 bg-gray-50 border border-gray-300 text-black text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
        <div className="flex-col">
          {/* {(timelock.admins.length > 0 || timelock.proposers.length > 0)&&
          (<div className="w-full ml-20 font-bold my-3 text-center items-center text-xl">
            {timelock.admins.length + ' admins'}
            {timelock.admins.map((item, index) => (
              <div key={index}>{'admin ' + (index + 1) + ': ' + item}</div>
            ))}
            {timelock.proposers.length + ' proposers'}
            {timelock.proposers.map((item, index) => (
              <div key={index}>{'proposer ' + (index + 1) + ': ' + item}</div>
            ))}
            {'min delay: ' + timelock.min_time_delay} <br />
          </div>)} */}
          {(timelock.admins.length > 0 || timelock.proposers.length > 0) && (
            <div className="flex">
              <ul className="ml-10 mr-3 w-full text-sm font-medium text-gray-900 bg-dark-gray border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full font-bold px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  Administrators
                </li>
                {timelock.admins.map((item, index) => (
                  <li
                    key={index}
                    className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600"
                  >
                    {index + 1 + ') ' + item}
                  </li>
                ))}
              </ul>
              <ul className="ml-2 mr-2 w-full text-sm font-medium text-gray-900 bg-dark-gray border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full font-bold px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  Proposers
                </li>
                {timelock.proposers.map((item, index) => (
                  <li
                    key={index}
                    className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600"
                  >
                    {index + 1 + ') ' + item}
                  </li>
                ))}
              </ul>
              <ul className="ml-2 mr-10 w-1/3 h-1/3 text-sm font-medium text-gray-900 bg-dark-gray border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  Minimum Delay
                </li>
                <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  {timelock.min_time_delay} ns
                </li>
              </ul>
            </div>
          )}

          <div className="ml-10 mt-5 relative inline-block text-left">
            <div>
              <button
                type="button"
                className=" mr-10 h-20 w-28 bg-juno border border-gray-300 shadow-sm flex items-center justify-center rounded-xl px-4 py-2 text-lg font-medium text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                id="options-menu"
                onClick={() => setExecuteDrop(true)}
              >
                Execute
              </button>
              {executeDrop && (
                <div style={{
                  position: 'fixed',
                  zIndex: 1,
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'auto',
                  backgroundColor: 'rgba(117, 190, 218, 0.5)',
                  transition: '0.3s ease-in-out'
                }}>
                  <a style={{ cursor: 'pointer' }} onClick={() => setExecuteDrop(false)}><span>X</span></a>
                  <div style={{
                    width: '50%',
                    height: '65%',
                    margin: '15% auto',
                    backgroundColor: 'white',
                    borderRadius: 5,
                    position: 'relative',
                    transition: 'inherit'
                  }}>
                    {choiseDrop && (<div style={{ color: 'black' }}>
                      <div>
                        CHOOSE
                      </div>
                      <div
                        className="py-1 "
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <a
                          onClick={() => {
                            setChoiseDrop(false)
                            setProceduresDrop(true)
                          }}
                          className="block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                          role="menuitem"
                        >
                          <span className="flex flex-col">
                            <span>Schedule</span>
                          </span>
                        </a>
                        <a
                          onClick={() => setChoise("rea")}
                          className="block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                          role="menuitem"
                        >
                          <span className="flex flex-col">
                            <span>RevokeAdmin</span>
                          </span>
                        </a>
                        <a
                          onClick={() => setChoise("apr")}
                          className="block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                          role="menuitem"
                        >
                          <span className="flex flex-col">
                            <span>AddProposer</span>
                          </span>
                        </a>
                        <a
                          onClick={() => setChoise("rpr")}
                          className="block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                          role="menuitem"
                        >
                          <span className="flex flex-col">
                            <span>RemoveProposer</span>
                          </span>
                        </a>
                        <a
                          onClick={() => setChoise("umd")}
                          className="block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
                          role="menuitem"
                        >
                          <span className="flex flex-col">
                            <span>UpdateMinDelay</span>
                          </span>
                        </a>
                      </div>
                    </div>)}
                    {<Prosedures />}


                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {operations.length > 0 &&
          operations.map((item, index) => (
            <div
              key={index}
              className={`${theme.isDarkTheme ? 'border-gray/20' : 'border-dark/20'
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
    </div >
  )
}

export default ManageTimelock