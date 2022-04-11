import Button from 'components/Button'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'

import Tooltip from '../../../../../components/Tooltip'

const Deposit = (props: { contractAddress: string }) => {
  const { contractAddress } = props

  const [lockboxId, setLockboxId] = useState(0)
  const [amount, setAmount] = useState(0)
  const [spinnerFlag, setSpinnerFlag] = useState(false)
  const [nativeCoinFlag, setNativeCoinFlag] = useState(true)
  const contract = useContracts().cw1Lockbox
  const wallet = useWallet()

  const handleChangeLockboxId = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setLockboxId(Number(event.target.value))
  }

  const handleChangeAmount = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setAmount(Number(event.target.value))
  }

  const handleChangeDepositType = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    //setNativeCoinFlag(event.target.value ===)
    console.log(event.target.value)
  }

  const deposit = async () => {
    try {
      const client = contract?.use(contractAddress)
      if (!client || !wallet) {
        toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
      }
      if (!(isNaN(lockboxId) || Number(lockboxId) < 1)) {
        setSpinnerFlag(true)
        const res = await client?.deposit_native(
          wallet.address,
          lockboxId,
          amount,
          'ujunox'
        )
        setSpinnerFlag(false)
        toast.success('Successfully made a claim.', {
          style: { maxWidth: 'none' },
        })
        console.log('update min delay res: ', res)
      } else {
        toast.error('You need to specify a valid Lockbox ID.', {
          style: { maxWidth: 'none' },
        })
      }
    } catch (error: any) {
      setSpinnerFlag(false)
      if (error.message.includes('Unauthorized')) {
        toast.error('You are not authorized to make a claim.', {
          style: { maxWidth: 'none' },
        })
      } else if (error.message.includes('bech32')) {
        toast.error('You need to specify a valid Lockbox contract address.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  return (
    <div className="p-8 pt-0 ml-10 w-3/5">
      <div className="flex justify-between mb-3 ml-3">
        <div className="form-check form-check-inline">
          <input
            className="float-none mr-2 mb-1 w-4 h-4 align-middle bg-white checked:bg-juno bg-center bg-no-repeat bg-contain rounded-full border border-gray-300 checked:border-white focus:outline-none transition duration-200 appearance-none cursor-pointer form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio1"
            value="option1"
            checked
          />
          <label
            className="inline-block text-white form-check-label"
            htmlFor="inlineRadio1"
          >
            Native Coin
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="float-none mr-2 mb-1 w-4 h-4 align-middle bg-white checked:bg-juno bg-center bg-no-repeat bg-contain rounded-full border border-gray-300 checked:border-white focus:outline-none transition duration-200 appearance-none cursor-pointer form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio2"
            value="option2"
          />
          <label
            className="inline-block text-white form-check-label"
            htmlFor="inlineRadio2"
          >
            CW20 Token
          </label>
        </div>
      </div>
      <div className="basis-1/4 flex-col my-0">
        <div className="flex">
          <label
            htmlFor="small-input"
            className="block mr-2 ml-3 font-bold text-white dark:text-gray-300 text-md"
          >
            Lockbox ID
          </label>
          <Tooltip label="The Lockbox ID to which the coins will be deposited.">
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

        <div className="flex-row mt-1">
          <div>
            <input
              type="text"
              onChange={handleChangeLockboxId}
              className="py-2 px-1 mx-3 bg-white/10 rounded border-2 border-white/20 focus:ring
              focus:ring-plumbus-20
              form-input, placeholder:text-white/50,"
              placeholder="Lockbox ID"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <label
            htmlFor="small-input"
            className="block mr-2 ml-3 font-bold text-white dark:text-gray-300 text-md"
          >
            Deposit Amount
          </label>
          <Tooltip label="The Lockbox ID to which the coins will be deposited.">
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

        <div className="flex mt-1">
          <div>
            <input
              type="text"
              onChange={handleChangeAmount}
              className="py-2 px-1 mx-3 bg-white/10 rounded border-2 border-white/20 focus:ring
              focus:ring-plumbus-20
              form-input, placeholder:text-white/50,"
              placeholder="Amount"
            />
          </div>
        </div>
        <div className="absolute px-3 mt-5">
          <Button
            isLoading={spinnerFlag}
            isWide
            rightIcon={<FaAsterisk />}
            onClick={deposit}
          >
            Deposit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Deposit