import Button from 'components/Button'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'
import Tooltip from 'utils/OperationsTableHelpers/Tooltip'

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
          } else if (
            err.message.includes('bech32') ||
            err.message.includes('Invalid type') ||
            err.message.includes('unknown variant')
          ) {
            toast.error('Please specify a valid Timelock contract address.', {
              style: { maxWidth: 'none' },
            })
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
    <div className="p-8 pt-0 ml-10 w-2/5">
      {/* <div> {props.functionType + ' Operation'}</div> */}
      <div className="basis-1/4 flex-col my-0">
        <div className="flex">
          <label
            htmlFor="small-input"
            className="block mr-2 mb-1 ml-3 font-bold text-white dark:text-gray-300 text-md"
          >
            Operation ID
          </label>
          <Tooltip
            label={
              props.functionType === 'Cancel'
                ? 'Operation ID for Cancel'
                : 'Operation ID for Execution'
            }
          >
            <svg
              className="mt-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Tooltip>
        </div>
        <input
          type="text"
          onChange={(e) => {
            setOperationId(e.target.value)
          }}
          className="py-2 px-1 mx-3 mt-3 placeholder:text-white/50 bg-white/10 rounded border-2
              border-white/20
              focus:ring focus:ring-plumbus-20 form-input,"
          placeholder="Operation ID"
        />
      </div>
      <div className="flex">
        <div className="absolute px-3 mt-5">
          <Button
            isLoading={spinnerFlag}
            isWide
            rightIcon={<FaAsterisk />}
            onClick={cancelDelete}
          >
            {props.functionType}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CancelExecuteModal
