import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from 'contexts/theme'
import { Operation, Timelock } from '../models'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contracts'
import Procedures from './Procedures'
import { isValidAddress } from '../../../../utils/isValidAddress'
import OperationsTable, { OperationResponse } from './OperationsTable'
import { ImInsertTemplate } from 'react-icons/im'
import { copy } from './OperationsTableHelpers/clipboard'

const ManageTimelock = () => {
  const theme = useTheme()
  const [contractAddress, setContractAddress] = useState(
    'juno1cspathx3ex9hud98vt6qpsujj9gnefkjphzm4f83shue5q5u8suq7me0lc'
  )
  // 'juno1ptxjpktyrus6g8xn9yd98ewzahyhhvc56ddg6c8ln2hk6qhlesxqy43240'

  const decode = (str: string): string =>
    Buffer.from(str, 'base64').toString('binary')

  const [timelock, setTimelock] = useState<Timelock>(new Timelock([], [], 0))
  const [clientFound, setClientFound] = useState(false)
  const [selectedModal, setSelectedModal] = useState('')
  const [data, setData] = useState<OperationResponse[]>([])
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const query = async () => {
    try {
      console.log(wallet.initialized)

      if (!wallet.initialized) {
        toast.error('Oops! Need to connect your Keplr Wallet first.', {
          style: { maxWidth: 'none' },
        })
      }

      if (isValidAddress(contractAddress)) {
        const client = contract?.use(contractAddress)

        if (client) {
          setClientFound(true)

          const admins = await client?.getAdmins()
          const proposers = await client?.getProposers()
          const minDelay = await client?.getMinDelay()

          const res = await client?.getOperations()

          setTimelock(new Timelock(admins, proposers, minDelay))
          for (let i = 0; i < res.operationList.length; i++) {
            const operation = res.operationList[i]
            const opObj = {
              id: operation.id,
              executionTime: new Date(
                Number(operation.execution_time) / 1000000
              )
                .toString()
                .slice(0, 33),
              target: operation.target,
              data: decode(operation.data),
              status: operation.status,
              proposer: operation.proposer,
            }
            setData([...data, opObj])
            console.log(operation.proposer)
          }
        }
      } else {
        toast.error('You need to specify a valid Timelock contract address.', {
          style: { maxWidth: 'none' },
        })
      }
    } catch (error: any) {
      if (error.message.includes('bech32 failed')) {
        toast.error('You need to specify a valid Timelock contract address.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  function dhms(nanosecs: number) {
    let result = ''
    const days = Math.floor(nanosecs / (24 * 60 * 60 * 1000000000))
    if (days > 0) result += days + ' day(s) '
    const days_ns = nanosecs % (24 * 60 * 60 * 1000000000)
    const hours = Math.floor(days_ns / (60 * 60 * 1000000000))
    if (hours > 0) {
      if (result.length > 0) result += ' : '
      result += hours + ' hour(s) '
    }
    const hours_ns = nanosecs % (60 * 60 * 1000000000)
    const minutes = Math.floor(hours_ns / (60 * 1000000000))
    if (minutes > 0) {
      if (result.length > 0) result += ' : '
      result += minutes + ' minute(s) '
    }
    const minutes_ns = nanosecs % (60 * 1000000000)
    const sec = Math.floor(minutes_ns / 1000000000)
    if (sec > 0) {
      if (result.length > 0) result += ' : '
      result += sec + ' second(s) '
    }
    return result
  }

  return (
    <div className="px-6">
      <div className="px-10 py-2">
        <label className="block mb-2 text-md font-bold text-gray-900 dark:text-gray-300 text-left">
          Timelock Contract Address
        </label>
        <div className="flex">
          <input
            type="text"
            className="rounded py-2 px-1 text-black w-2/3"
            placeholder={contractAddress || 'Please enter contract address'}
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
          <button
            onClick={query}
            className="mx-5 p-2 border-2 rounded-lg hover:text-juno"
          >
            Search
          </button>
          {clientFound && (
            <label
              htmlFor="modal-menu"
              className="mx-5 p-2 border-2 rounded-lg hover:text-juno cursor-pointer"
            >
              Execute
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
                className="float-right"
              >
                <path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z"></path>
              </svg>
            </label>
          )}
          <div className="ml-10 mt-5 relative inline-block text-left">
            <input type="checkbox" id="modal-menu" className="modal-toggle" />
            <label
              htmlFor="modal-menu"
              className="modal"
              style={{ background: 'rgb(25, 29, 32, 0)' }}
            >
              <label className="origin-top-right border border-gray-300 bg-black absolute right-12 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-8">
                <div
                  className="py-1 "
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <button
                    onClick={() => {
                      setSelectedModal('schedule')
                    }}
                    className="flex flex-col px-4 py-2"
                    role="menuitem"
                  >
                    <span className="flex flex-col text-md text-gray-100 hover:text-juno hover:bg-gray-600">
                      <label className="cursor-pointer" htmlFor="my-modal-4">
                        Schedule
                      </label>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedModal('cancel')
                    }}
                    className="flex flex-col px-4 py-2"
                    role="menuitem"
                  >
                    <span className="flex flex-col text-md text-gray-100 hover:text-juno hover:bg-gray-600">
                      <label className="cursor-pointer" htmlFor="my-modal-4">
                        Cancel
                      </label>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedModal('execute')
                    }}
                    className="flex flex-col px-4 py-2"
                    role="menuitem"
                  >
                    <span className="flex flex-col text-md text-gray-100 hover:text-juno hover:bg-gray-600">
                      <label className="cursor-pointer" htmlFor="my-modal-4">
                        Execute
                      </label>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedModal('revoke')
                    }}
                    className="flex flex-col px-4 py-2"
                    role="menuitem"
                  >
                    <span className="flex flex-col text-md text-gray-100 hover:text-juno hover:bg-gray-600">
                      <label className="cursor-pointer" htmlFor="my-modal-4">
                        Revoke Admin
                      </label>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedModal('add')
                    }}
                    className="flex flex-col px-4 py-2"
                    role="menuitem"
                  >
                    <span className="flex flex-col text-md text-gray-100 hover:text-juno hover:bg-gray-600">
                      <label className="cursor-pointer" htmlFor="my-modal-4">
                        Add Proposer
                      </label>
                    </span>
                  </button>

                  <a
                    onClick={() => {
                      setSelectedModal('remove')
                    }}
                    className="flex flex-col px-4 py-2"
                    role="menuitem"
                  >
                    <span className="flex flex-col text-md text-gray-100 hover:text-juno hover:bg-gray-600">
                      <label className="cursor-pointer" htmlFor="my-modal-4">
                        Remove Proposer
                      </label>
                    </span>
                  </a>
                  <a
                    onClick={() => {
                      setSelectedModal('min-delay')
                    }}
                    className="flex flex-col px-4 py-2"
                    role="menuitem"
                  >
                    <span className="flex flex-col text-md text-gray-100 hover:text-juno hover:bg-gray-600">
                      <label className="cursor-pointer" htmlFor="my-modal-4">
                        Update Min Delay
                      </label>
                    </span>
                  </a>
                </div>
              </label>
            </label>
          </div>
        </div>
      </div>

      <div className="w-full justify-center">
        <div className="flex-col">
          <div>
            <input type="checkbox" id="my-modal-4" className="modal-toggle" />
            <label
              htmlFor="my-modal-4"
              className="modal cursor-pointer"
              style={{ background: 'rgb(25, 29, 32, 0.75)' }}
            >
              <label className="modal-box relative bg-dark-gray border-2 border-plumbus-20">
                <Procedures
                  selectedModal={selectedModal}
                  contractAddress={contractAddress}
                />
              </label>
            </label>
          </div>
          <br />
          <hr className="mx-10" />
          {(timelock.admins.length > 0 || timelock.proposers.length > 0) && (
            <div className="flex mt-10">
              <ul className="ml-10 mr-3 h-full w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full font-bold px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <span className="text-plumbus-matte">Administrators</span>
                </li>
                {timelock.admins.map((item, index) => (
                  <li
                    key={index}
                    className={
                      'hover:bg-white/5 w-full px-4 py-2' +
                      (index !== timelock.admins.length - 1
                        ? ' border-b'
                        : ' p-1')
                    }
                  >
                    <span className="mr-5 font-bold">{index + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="ml-2 mr-3 h-full w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full font-bold px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <span className="text-plumbus-matte">Proposers</span>
                </li>
                {timelock.proposers.map((item, index) => (
                  <li
                    key={index}
                    className={
                      'hover:bg-white/5 w-full px-4 py-2' +
                      (index !== timelock.proposers.length - 1
                        ? ' border-b'
                        : ' p-1')
                    }
                  >
                    <span className="mr-5 font-bold">{index + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="ml-2 mr-10 w-1/3 h-1/3 text-sm font-medium text-gray-900 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <span className="text-plumbus-matte">Minimum Delay</span>
                </li>
                <li className="hover:bg-white/5 w-full px-4 py-2 border-gray-200 dark:border-gray-600">
                  {dhms(timelock.min_time_delay)}
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="overflow-auto px-10 h-40 my-10">
          {data.length > 0 && <OperationsTable data={data} />}
        </div>

        {clientFound && data.length === 0 && (
          <div
            className={`${
              theme.isDarkTheme ? 'border-gray/20' : 'border-dark/20'
            } text-center m-5 mx-10`}
          >
            <div className="h-32 w-full p-3 flex flex-col items-center border rounded-xl">
              <div className="flex items-center text-lg font-bold mb-1">
                {' NO OPERATIONS FOUND '}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageTimelock
