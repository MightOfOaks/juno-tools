import React, { useState } from 'react'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contracts'
import toast from 'react-hot-toast'
import { isValidAddress } from 'utils/isValidAddress'

const RemoveAddProposerAdminModal = (props: {
  functionType: string
  userType: string
  contractAddress: string
}) => {
  const { userType, functionType, contractAddress } = props
  const [address, setAddress] = useState('')
  const [spinnerFlag, setSpinnerFlag] = useState(false)

  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  const onClick = async () => {
    if (contractAddress) {
      try {
        const client = contract?.use(props.contractAddress)
        if (!client || !wallet) {
          toast.error('Wallet Or Client Error', { style: { maxWidth: 'none' } })
        }
        if (isValidAddress(address)) {
          setSpinnerFlag(true)
          if (userType === 'Admin') {
            const res = await client?.revokeAdmin(wallet.address, address)
            toast.success('Successfully revoked administration rights.', {
              style: { maxWidth: 'none' },
            })
            console.log('revoke admin res : ', res)
          } else {
            if (functionType === 'Add') {
              const res = await client?.addProposer(wallet.address, address)
              toast.success('The specified address is now a proposer.', {
                style: { maxWidth: 'none' },
              })
              console.log('add proposer res: ', res)
            } else {
              const res = await client?.removeProposer(wallet.address, address)
              toast.success('The specified address has been removed from the list of proposers.', {
                style: { maxWidth: 'none' },
              })
              console.log('remove proposer res: ', res)
            }
          }
          setSpinnerFlag(false)
          
        } else {
          toast.error('The specified address is not valid.', {
            style: { maxWidth: 'none' },
          })
        }
      } catch (err: any) {
        setSpinnerFlag(false)
        if (err.message.includes('Unauthorized')) {
          toast.error('You need administrator rights for this action.', {
            style: { maxWidth: 'none' },
          })
        } else if(err.message.includes('Address not found')) {
          toast.error('The specified address is not an actor on this contract.', {
            style: { maxWidth: 'none' },
          })
        }else if("bech32 failed"){
          toast.error('The specified address is not valid.', {
            style: { maxWidth: 'none' },
          })
        }else {
          toast.error(err.message, { style: { maxWidth: 'none' } })
        }
      }
    } else {
      toast.error('Contract Address Error', { style: { maxWidth: 'none' } })
    }
  }

  return (
    <div className="bg-dark-gray p-8">
      <div className="mt-2 mb-6 ">{functionType + ' ' + userType}</div>
      <div className="mb-2 w-9/12">
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
      <div className="flex">
        
          <div className="basis-2/7">
            <button
              type="button"
              className="mt-3 p-2 border-2 rounded-lg hover:text-juno"
              id="options-menu"
              disabled={address === ''}
              onClick={() => onClick()}
            >
              {functionType + ' ' + userType}
            </button>
          </div>
          <div className="px-2 mt-5 basis-1">
              {spinnerFlag && (
                <svg
                  role="status"
                  className="mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-juno"
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

export default RemoveAddProposerAdminModal
