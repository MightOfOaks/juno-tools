import { useContracts } from 'contexts/contracts'
import { useTheme } from 'contexts/theme'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { isValidAddress } from '../../../../utils/isValidAddress'
import { Operation, Timelock } from '../../../../utils/models'
import OperationsTable from './OperationsTable'
import Procedures from './Procedures'

const ManageTimelock = () => {
  const theme = useTheme()
  const [contractAddress, setContractAddress] = useState(
    'juno15gd96dca9klnkg8zzj0wuj7vcxza40p7gykk7x8qatpn03grs8gqj9vhav'
  )
  // 'juno1ptxjpktyrus6g8xn9yd98ewzahyhhvc56ddg6c8ln2hk6qhlesxqy43240'

  const decode = (str: string): string =>
    Buffer.from(str, 'base64').toString('binary')

  const [timelock, setTimelock] = useState<Timelock>(new Timelock([], [], 0))
  const [clientFound, setClientFound] = useState(false)
  const [menuModal, setMenuModal] = useState(false)
  const [executeModal, setExecuteModal] = useState(false)
  const [selectedModal, setSelectedModal] = useState('')
  const [data, setData] = useState<Operation[]>([])
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const query = async () => {
    try {
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
          const operationList = res.operationList
          console.log(operationList)

          setTimelock(new Timelock(admins, proposers, minDelay))
          setData([])
          for (let i = 0; i < operationList.length; i++) {
            setData((prevData) =>
              prevData.concat(
                new Operation(
                  operationList[i].id,
                  new Date().getTime() * 1000000 >
                    Number(operationList[i].execution_time) &&
                  operationList[i].status === 'Pending'
                    ? 'Ready'
                    : operationList[i].status,
                  operationList[i].proposer,
                  operationList[i].executors,
                  new Date(Number(operationList[i].execution_time) / 1000000)
                    .toString()
                    .slice(0, 33),
                  operationList[i].target,
                  decode(operationList[i].data),
                  operationList[i].description
                )
              )
            )
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
      <div className="py-2 px-10">
        <label className="block mb-2 font-bold text-left text-gray-900 dark:text-gray-300 text-md">
          Timelock Contract Address
        </label>
        <div className="flex">
          <input
            type="text"
            className="py-2 px-1 w-2/3 text-black rounded"
            placeholder={contractAddress || 'Please enter contract address'}
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              query()
            }}
            className="p-2 mx-5 hover:text-juno rounded-lg border-2"
          >
            Search
          </button>
          {clientFound && (
            <button
              onClick={(e) => {
                e.preventDefault()
                setMenuModal(true)
              }}
              className="p-2 mx-5 hover:text-juno rounded-lg border-2 cursor-pointer"
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
            </button>
          )}
          {menuModal && (
            <div>
              <input
                type="checkbox"
                id="modal-menu"
                className="absolute top-0 left-0 w-full h-full opacity-0"
                onChange={(e) => {
                  setMenuModal(!menuModal)
                  query()
                }}
              />
              <div className="inline-block relative mt-5 ml-10 text-left">
                <label
                  htmlFor="modal-menu"
                  className="modal"
                  style={{ background: 'rgb(25, 29, 32, 0)' }}
                >
                  <label className="absolute right-12 mt-2 w-56 bg-[#120F0F] rounded-md border border-[#FE9D9E] ring-1 ring-[#FE9D9E] ring-opacity-10 shadow-lg origin-top-right">
                    <div
                      className="py-1 "
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedModal('schedule')
                          setExecuteModal(!executeModal)
                        }}
                        className="flex flex-col py-2 px-4"
                        role="menuitem"
                      >
                        <span className="flex flex-col text-gray-100 hover:text-juno hover:bg-gray-600 text-md">
                          <label
                            className="cursor-pointer"
                            htmlFor="my-modal-4"
                          >
                            Schedule
                          </label>
                        </span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedModal('cancel')
                          setExecuteModal(!executeModal)
                        }}
                        className="flex flex-col py-2 px-4"
                        role="menuitem"
                      >
                        <span className="flex flex-col text-gray-100 hover:text-juno hover:bg-gray-600 text-md">
                          <label
                            className="cursor-pointer"
                            htmlFor="my-modal-4"
                          >
                            Cancel
                          </label>
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedModal('execute')
                          setExecuteModal(!executeModal)
                        }}
                        className="flex flex-col py-2 px-4"
                        role="menuitem"
                      >
                        <span className="flex flex-col text-gray-100 hover:text-juno hover:bg-gray-600 text-md">
                          <label
                            className="cursor-pointer"
                            htmlFor="my-modal-4"
                          >
                            Execute
                          </label>
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedModal('revoke')
                          setExecuteModal(!executeModal)
                        }}
                        className="flex flex-col py-2 px-4"
                        role="menuitem"
                      >
                        <span className="flex flex-col text-gray-100 hover:text-juno hover:bg-gray-600 text-md">
                          <label
                            className="cursor-pointer"
                            htmlFor="my-modal-4"
                          >
                            Revoke Admin
                          </label>
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedModal('add')
                          setExecuteModal(!executeModal)
                        }}
                        className="flex flex-col py-2 px-4"
                        role="menuitem"
                      >
                        <span className="flex flex-col text-gray-100 hover:text-juno hover:bg-gray-600 text-md">
                          <label
                            className="cursor-pointer"
                            htmlFor="my-modal-4"
                          >
                            Add Proposer
                          </label>
                        </span>
                      </button>

                      <a
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedModal('remove')
                          setExecuteModal(!executeModal)
                        }}
                        className="flex flex-col py-2 px-4"
                        role="menuitem"
                      >
                        <span className="flex flex-col text-gray-100 hover:text-juno hover:bg-gray-600 text-md">
                          <label
                            className="cursor-pointer"
                            htmlFor="my-modal-4"
                          >
                            Remove Proposer
                          </label>
                        </span>
                      </a>
                      <a
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedModal('min-delay')
                          setExecuteModal(!executeModal)
                        }}
                        className="flex flex-col py-2 px-4"
                        role="menuitem"
                      >
                        <span className="flex flex-col text-gray-100 hover:text-juno hover:bg-gray-600 text-md">
                          <label
                            className="cursor-pointer"
                            htmlFor="my-modal-4"
                          >
                            Update Min Delay
                          </label>
                        </span>
                      </a>
                    </div>
                  </label>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="justify-center w-full">
        <div className="flex-col">
          {executeModal && (
            <div className="absolute top-0 left-0 z-10 w-full h-full">
              <input
                type="checkbox"
                id="my-modal-4"
                className="absolute top-0 left-0 w-full h-full opacity-0"
                onChange={(e) => {
                  setExecuteModal(!executeModal)
                }}
              />
              <div className="absolute top-1/2 left-1/4 w-1/2">
                <label className="relative bg-dark-gray border-2 border-plumbus-20 z-2 modal-box">
                  <Procedures
                    selectedModal={selectedModal}
                    contractAddress={contractAddress}
                  />
                </label>
              </div>
            </div>
          )}
          <br />
          <hr className="mx-10" />
          {(timelock.admins.length > 0 || timelock.proposers.length > 0) && (
            <div className="flex mt-10">
              <ul className="mr-3 ml-10 w-full h-full text-sm font-medium text-white dark:text-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <li className="py-2 px-4 w-full font-bold rounded-t-lg border-b border-gray-200 dark:border-gray-600">
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
              <ul className="mr-3 ml-2 w-full h-full text-sm font-medium text-white dark:text-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <li className="py-2 px-4 w-full font-bold rounded-t-lg border-b border-gray-200 dark:border-gray-600">
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
              <ul className="mr-10 ml-2 w-1/3 h-1/3 text-sm font-medium text-white dark:text-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <li className="py-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                  <span className="text-plumbus-matte">Minimum Delay</span>
                </li>
                <li className="py-2 px-4 w-full hover:bg-white/5 border-gray-200 dark:border-gray-600">
                  {dhms(timelock.min_time_delay)}
                </li>
              </ul>
            </div>
          )}
        </div>

        <div
          className="overflow-auto px-10 my-10 no-scrollbar"
          style={{ maxHeight: '525px' }}
        >
          {data.length > 0 && <OperationsTable data={data} />}
        </div>

        {clientFound && data.length === 0 && (
          <div
            className={`${
              theme.isDarkTheme ? 'border-gray/20' : 'border-dark/20'
            } text-center m-5 mx-10`}
          >
            <div className="flex flex-col items-center p-3 w-full h-32 rounded-xl border">
              <div className="flex items-center mb-1 text-lg font-bold">
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
