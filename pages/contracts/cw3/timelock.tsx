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

  const execute = async () => {
    try {
      const client = contract?.use(CONTRACT_ADDRESS)
      console.log(client)

      // let operation_id = 1
      // const res1 = await client?.cancel(wallet.address, operation_id)
      // console.log('cancel', res1)

      // const res2 = await client?.addProposer(
      //   wallet.address,
      //   'juno1dc5yv2w2plccmxxh6szden8kqkshqjgkeqkg74'
      // )
      // console.log('addProposer', res2)

      // const res3 = await client?.removeProposer(
      //   wallet.address,
      //   'juno1dc5yv2w2plccmxxh6szden8kqkshqjgkeqkg74'
      // )
      // console.log('removeProposer', res3)

      // const res4 = await client?.execute(wallet.address, operation_id)
      // console.log('execute', res4)

      // const res5 = await client?.updateMinDelay(10000000000, wallet.address)
      // console.log('updateMinDelay', res5)

      // const msg = {
      //   mint: {
      //     amount: '1000',
      //   },
      // }
      // const res6 = await client?.schedule(
      //   wallet.address,
      //   'juno154xu4268g2rdtnxjjsfr3wy9t3vx97308rdgau66s0d3amlxp7zq4j78us',
      //   msg,
      //   Number(17446744073709551515).toString(),
      //   ['juno1smz9wdg5v7wywquyy7zn7ujvu54kuumwzw5ss8']
      // )
      // console.log('schedule: ', res6)

      //   revokeAdmin: (senderAddress: string, admin_address: string) => Promise<any>
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
      className="w-full h-screen flex-grow overflow-y-auto no-scrollbar"
      style={{ scrollbarWidth: 'none' }}
    >
      <h1 className="mt-[10%] text-6xl font-bold text-center">Timelock</h1>
      <div className="mt-5 text-center text-lg">
        A smart contract that relays execute function calls on other smart
        contracts with a predetermined minimum time delay.
      </div>
      <div className="py-3 px-6 container mt-5">
        <div className="mb-3 px-10">
          <label
            htmlFor="Section"
            className="block overflow-hidden h-6 rounded-full bg-gray-300"
          ></label>
          <span className="text-gray-400 font-medium">Create</span>
          <div className="bg-juno rounded-full border-solid border-2 border-white-600 relative inline-block w-10 ml-2 mr-2 align-middle select-none">
            <input
              onClick={togglePage}
              type="checkbox"
              name="toggle"
              id="sectionToggle"
              className="outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="Section"
              className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
          <span className="text-gray-400 font-medium">Manage</span>
        </div>
      </div>
      <br />
      {!isManagePage ? (
        <div className="p-3 container items-start float-left">
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
