import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Tooltip from '../../../../utils/OperationsTableHelpers/Tooltip'

const UpdateDelayModal = (props: { contractAddress: string }) => {
  const { contractAddress } = props

  const [minDelay, setMinDelay] = useState(0)
  const [minDelayUnit, setMinDelayUnit] = useState('seconds')
  const [spinnerFlag, setSpinnerFlag] = useState(false)
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const handleChangeMinDelay = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setMinDelay(Number(event.target.value))
  }

  const handleChangeMinDelayUnit = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setMinDelayUnit(event.target.value)
  }

  const updateMinDelay = async () => {
    try {
      const client = contract?.use(contractAddress)
      if (!client || !wallet) {
        toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
      }
      if (!(isNaN(minDelay) || Number(minDelay) < 1)) {
        setSpinnerFlag(true)
        const res = await client?.updateMinDelay(minDelay, wallet.address)
        setSpinnerFlag(false)
        toast.success('Successfully updated the minimum delay.', {
          style: { maxWidth: 'none' },
        })
        console.log('update min delay res: ', res)
      } else {
        toast.error('You need to specify a valid delay.', {
          style: { maxWidth: 'none' },
        })
      }
    } catch (error: any) {
      setSpinnerFlag(false)
      if (error.message.includes('Unauthorized')) {
        toast.error('You need administrator rights for this action.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  return (
    <div className="p-8 bg-dark-gray">
      <div>Update Min Delay</div>
      <div className="basis-1/4 flex-col my-4">
        <div className="flex">
          <label
            htmlFor="small-input"
            className="block mr-2 mb-1 ml-3 font-bold text-gray-900 dark:text-gray-300 text-md"
          >
            Minimum Delay
          </label>
          <Tooltip label="The minimum timelock duration for future operations.">
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

        <div className="flex mt-3">
          <div>
            <input
              type="text"
              onChange={handleChangeMinDelay}
              className="py-2 px-1 mx-3 text-gray-900 dark:text-gray-300 rounded"
              placeholder=" Minimum Delay"
            />
          </div>
          <div>
            <select
              onChange={handleChangeMinDelayUnit}
              defaultValue="seconds"
              name="time"
              id="time"
              className="float-left px-1 h-10 text-black rounded basis-1/8"
            >
              <option value="days">days</option>
              <option value="hours">hours</option>
              <option value="minutes">minutes</option>
              <option value="seconds">seconds</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="basis-3/4 pl-2 mt-8">
          <button
            onClick={(e) => {
              e.preventDefault()
              updateMinDelay()
            }}
            className="p-2 hover:text-juno rounded-lg border-2"
          >
            Update Minimum Delay
          </button>
        </div>
        <div className="basis-3/4 px-1 mt-10">
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

export default UpdateDelayModal
