import React, { useState } from 'react'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contracts'
import toast from 'react-hot-toast'

const CancelExecuteModal = (props: {
  functionType: string
  contractAddress: string
}) => {
  const [operationId, setOperationId] = useState('')
  const wallet = useWallet()
  const contract = useContracts().cw3Timelock

  const cancelDelete = async () => {
    if (props.contractAddress) {
      try {
        const client = contract?.use(props.contractAddress)
        if (!client || !wallet) {
          toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
        }
        if (props.functionType === 'execute') {
          const res = await client?.execute(wallet.address, Number(operationId))
          console.log('execute: ', res)
        } else {
          const res = await client?.cancel(wallet.address, Number(operationId))
          console.log('cancel: ', res)
        }
      } catch (err: any) {
        toast.error(err, { style: { maxWidth: 'none' } })
      }
    } else {
      toast.error('Contract Address Error', { style: { maxWidth: 'none' } })
    }
  }

  return (
    <div className="bg-black p-8">
      <div> {props.functionType.toUpperCase() + ' OPERATION'}</div>
      <div className="flex-col basis-1/4 my-4">
        <label
          htmlFor="small-input"
          className="mb-1 mx-3 block text-sm font-bold text-gray-900 dark:text-gray-300"
        >
          Operation ID
        </label>
        <input
          type="text"
          onChange={(e) => {
            setOperationId(e.target.value)
          }}
          className="py-2 px-1 mx-3 rounded text-black text-gray-900 dark:text-gray-300"
          placeholder="Operation ID"
        />
      </div>
      <div>
        <button
          type="button"
          className=" mt-10 h-10 w-20 bg-juno border border-gray-300 shadow-sm flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
          id="options-menu"
          onClick={() => cancelDelete()}
        >
          {props.functionType.toUpperCase()}
        </button>
      </div>
    </div>
  )
}

export default CancelExecuteModal
