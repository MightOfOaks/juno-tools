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
      if (!(isNaN(Number(operationId)) || Number(operationId) < 1)) {    
        try {
          const client = contract?.use(props.contractAddress)
          if (!client || !wallet) {
            toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
          }
          if (props.functionType === 'Execute') {
            const res = await client?.execute(wallet.address, operationId)
            console.log('execute: ', res)
          } else {
            const res = await client?.cancel(wallet.address, operationId)
            console.log('cancel: ', res)
          }
        } catch (err: any) {
          if (err.message.includes('Unauthorized')) {
            toast.error('You are not authorized for this action.', {
              style: { maxWidth: 'none' },
            })
          } else {
            toast.error(err.message, { style: { maxWidth: 'none' } })
          }
        }
      } else{
        toast.error('You need to specify a valid Operation ID.', {
          style: { maxWidth: 'none' },})
      }
    } else {
      toast.error('Contract Address Error', { style: { maxWidth: 'none' } })
    }
  }

  return (
    <div className="bg-dark-gray p-8">
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
          className="mx-3 mt-3 p-2 border-2 rounded-lg hover:text-juno"
          id="options-menu"
          disabled={operationId === ''}
          onClick={() => cancelDelete()}
        >
          {props.functionType}
        </button>
      </div>
    </div>
  )
}

export default CancelExecuteModal
