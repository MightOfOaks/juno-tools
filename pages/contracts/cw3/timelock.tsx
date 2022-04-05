import { coin } from '@cosmjs/proto-signing'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import InstantiateTimelock from './components/InstantiateTimelock'
import ManageTimelock from './components/ManageTimelock'

//import {
//   MAINNET_CW1_SUBKEYS_CODE_ID,
//   TESTNET_CW1_SUBKEYS_CODE_ID,
// } from 'utils/constants'

const CW3Timelock = () => {
  const [isManagePage, setIsManagePage] = useState(false)

  const wallet = useWallet()
  const contract = useContracts().cw3Timelock
  const cw20contract = useContracts().cw20Base

  const [initResponse, setInitResponse] = useState<any>()
  const [initResponseFlag, setInitResponseFlag] = useState(false)
  const [initSpinnerFlag, setInitSpinnerFlag] = useState(false)

  const CONTRACT_ADDRESS =
    'juno1ptxjpktyrus6g8xn9yd98ewzahyhhvc56ddg6c8ln2hk6qhlesxqy43240'

  const encode = (str: string): string =>
    Buffer.from(str, 'binary').toString('base64')

  const instantiate = async (initMsg: Record<string, unknown>) => {
    setInitResponseFlag(false)
    try {
      if (!contract) {
        return toast.error('Smart contract connection failed.')
      }
      if (!wallet.initialized) {
        return toast.error('Oops! Need to connect your Keplr Wallet first.', {
          style: { maxWidth: 'none' },
        })
      }

      console.log(initMsg)
      setInitSpinnerFlag(true)
      const response = await contract.instantiate(
        702,
        initMsg,
        'Timelock Test',
        wallet.address
      )
      setInitSpinnerFlag(false)
      setInitResponse(response)
      toast.success('Timelock contract instantiation successful.', {
        style: { maxWidth: 'none' },
      })
      setInitResponseFlag(true)
      console.log(response)
    } catch (error: any) {
      toast.error(error.message, { style: { maxWidth: 'none' } })
      setInitSpinnerFlag(false)
    }
  }

  const query = async () => {
    try {
      const client = contract?.use(CONTRACT_ADDRESS)
      const response = await client?.getAdmins()
      console.log('getAdmins', response)

      const response2 = await client?.getOperations()
      console.log('getOperations', response2)

      const response3 = await client?.getMinDelay()
      console.log('getMinDelay', response3)

      let operation_id = ''
      const response4 = await client?.getExecutionTime(operation_id)
      console.log('getExecutionTime', response4)

      const response5 = await client?.getOperationStatus(operation_id)
      console.log('getOperation', response5)
    } catch (error: any) {
      toast.error(error.message, { style: { maxWidth: 'none' } })
    }
  }

  const togglePage = () => {
    if (isManagePage) {
      setIsManagePage(false)
    } else {
      setIsManagePage(true)
    }
  }

  return (
    <div
      className="overflow-y-auto flex-grow w-full h-screen no-scrollbar"
      style={{ scrollbarWidth: 'none' }}
    >
      <h1 className="mt-[10%] text-6xl font-bold text-center">Timelock</h1>
      <div className="mt-5 text-lg text-center">
        A smart contract that relays execute function calls on other smart
        contracts with a predetermined minimum time delay.
      </div>
      <div className="container py-3 px-6 mt-5">
        <div className="px-10 mb-3">
          <label
            htmlFor="Section"
            className="block overflow-hidden h-6 bg-gray-300 rounded-full"
          ></label>
          <span className="font-medium text-gray-400">Create</span>
          <div className="inline-block relative mr-2 ml-2 w-10 align-middle bg-juno rounded-full border-2 border-solid select-none border-white-600">
            <input
              onClick={togglePage}
              type="checkbox"
              name="toggle"
              id="sectionToggle"
              className="block absolute right-4 checked:right-0 w-6 h-6 bg-white rounded-full border-4 outline-none focus:outline-none duration-200 ease-in appearance-none cursor-pointer"
            />
            <label
              htmlFor="Section"
              className="block overflow-hidden h-6 bg-gray-300 rounded-full cursor-pointer"
            ></label>
          </div>
          <span className="font-medium text-gray-400">Manage</span>
        </div>
      </div>
      <br />
      {!isManagePage ? (
        <div className="container float-left items-start p-3">
          <InstantiateTimelock
            spinnerFlag={initSpinnerFlag}
            initFlag={initResponseFlag}
            initResponse={initResponse}
            function={instantiate}
          />
        </div>
      ) : (
        <div className="w-full">
          <ManageTimelock />
        </div>
      )}
    </div>
  )
}

export default CW3Timelock
