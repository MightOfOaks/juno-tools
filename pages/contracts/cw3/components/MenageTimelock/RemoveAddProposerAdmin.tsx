import React, { useState } from 'react'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contracts'
import toast from 'react-hot-toast'
import CustomInput from '../CustomInput'

const RemoveAddProposerAdminModal = (props: {
  functionType: string
  userType: string
  contractAddress: string
}) => {
  const { userType, functionType, contractAddress } = props
  const [address, setAddress] = useState('')
  const [executors, setExecutors] = useState<string[]>([])
  const [targetAddress, setTargetAddress] = useState<string[]>([])
  const [data, setData] = useState('')
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const onClick = async () => {
    if (contractAddress) {
      try {
        const client = contract?.use(props.contractAddress)
        if (!client || !wallet) {
          toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
        }

        if (userType === 'admin') {
          const res = await client?.revokeAdmin(wallet.address, address)
          console.log('revoke admin res : ', res)
        } else {
          if (functionType === 'add') {
            const res = await client?.addProposer(wallet.address, address)
            console.log('add proposer res: ', res)
          } else {
            const res = await client?.removeProposer(wallet.address, address)
            console.log('remove proposer res: ', res)
          }
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
      <div className="mt-2 mb-6 ">
        {functionType.toUpperCase() + ' ' + userType.toUpperCase()}
      </div>
      <div className="mb-6 w-9/12">
        <label
          htmlFor="small-input"
          className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-300"
        >
          {userType + ' address '}
        </label>
        <input
          type="text"
          className="rounded py-2 px-1 text-black w-full"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
            console.log(e.target.value)
          }}
          placeholder={userType + ' address '}
        />
      </div>
      <div>
        <button
          type="button"
          className=" mt-10 h-15 w-40 bg-juno border border-gray-300 shadow-sm flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-gray-50 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
          id="options-menu"
          onClick={() => onClick()}
        >
          {functionType.toUpperCase() + ' ' + userType.toUpperCase()}
        </button>
      </div>
    </div>
  )
}

export default RemoveAddProposerAdminModal
