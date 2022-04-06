import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const CancelExecuteModal = (props: {
  functionType: string
  contractAddress: string
}) => {
  const [operationId, setOperationId] = useState('')
  const [spinnerFlag, setSpinnerFlag] = useState(false)

  const wallet = useWallet()
  const contract = useContracts().cw3Timelock

  const cancelDelete = async () => {
    if (props.contractAddress) {
      if (!(isNaN(Number(operationId)) || Number(operationId) < 1)) {
        try {
          const client = contract?.use(props.contractAddress)
          if (!client || !wallet) {
            toast.error('Wallet Or Client Error', {
              style: { maxWidth: 'none' },
            })
          }
          setSpinnerFlag(true)
          if (props.functionType === 'Execute') {
            const res = await client?.execute(wallet.address, operationId)
            toast.success('Operation execution successful.', {
              style: { maxWidth: 'none' },
            })
            console.log('execute: ', res)
          } else {
            const res = await client?.cancel(wallet.address, operationId)
            toast.success('Operation cancellation successful.', {
              style: { maxWidth: 'none' },
            })
            console.log('cancel: ', res)
          }
          setSpinnerFlag(false)
        } catch (err: any) {
          setSpinnerFlag(false)
          if (err.message.includes('Unauthorized')) {
            toast.error('You are not authorized to perform this action.', {
              style: { maxWidth: 'none' },
            })
          } else if (err.message.includes('Operation not found')) {
            toast.error('An operation with the specified ID does not exist.', {
              style: { maxWidth: 'none' },
            })
          } else if (err.message.includes('Delay time')) {
            toast.error('The execution time has not been reached yet.', {
              style: { maxWidth: 'none' },
            })
          } else if (err.message.includes('already executed')) {
            toast.error(
              'The operation with the specified ID has already been executed.',
              {
                style: { maxWidth: 'none' },
              }
            )
          } else if (err.message.includes('submessages')) {
            toast.error(
              'The contained message within the specified operation is not valid for the target contract.',
              {
                style: { maxWidth: 'none' },
              }
            )
          } else {
            toast.error(err.message, { style: { maxWidth: 'none' } })
          }
        }
      } else {
        toast.error('You need to specify a valid Operation ID.', {
          style: { maxWidth: 'none' },
        })
      }
    } else {
      toast.error('Contract Address Error', { style: { maxWidth: 'none' } })
    }
  }

  return (
    <div className="p-8 bg-dark-gray">
      <div> {props.functionType + ' Operation'}</div>
      <div className="basis-1/4 flex-col my-4">
        <label
          htmlFor="small-input"
          className="block mx-3 mb-1 text-sm font-bold text-gray-900 dark:text-gray-300"
        >
          Operation ID
        </label>
        <input
          type="text"
          onChange={(e) => {
            setOperationId(e.target.value)
          }}
          className="py-2 px-1 mx-3 text-black text-gray-900 dark:text-gray-300 rounded"
          placeholder="Operation ID"
        />
      </div>
      <div className="flex">
        <div className="basis-1/4">
          <button
            type="button"
            className="p-2 mx-3 mt-3 hover:text-juno rounded-lg border-2"
            id="options-menu"
            disabled={operationId === ''}
            onClick={(e) => {
              e.preventDefault()
              cancelDelete()
            }}
          >
            {props.functionType}
          </button>
        </div>
        <div className="basis-3/4 mt-5">
          {spinnerFlag && (
            <svg
              role="status"
              className="mr-2 w-6 h-6 text-gray-200 dark:text-gray-600 animate-spin fill-juno"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

export default CancelExecuteModal
