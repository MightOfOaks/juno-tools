import Button from 'components/Button'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'
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
              toast.success(
                'The specified address has been removed from the list of proposers.',
                {
                  style: { maxWidth: 'none' },
                }
              )
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
        } else if (err.message.includes('Address not found')) {
          toast.error(
            'The specified address is not an actor on this contract.',
            {
              style: { maxWidth: 'none' },
            }
          )
        } else if (
          err.message.includes('bech32 failed') ||
          err.message.includes('unknown variant')
        ) {
          toast.error('The specified address is not valid.', {
            style: { maxWidth: 'none' },
          })
        } else if (
          err.message.includes('Proposers list contains this proposer address')
        ) {
          toast.error(
            'The specified address is already included in the proposers list.',
            {
              style: { maxWidth: 'none' },
            }
          )
        } else {
          toast.error(err.message, { style: { maxWidth: 'none' } })
        }
      }
    } else {
      toast.error('You need to specify a valid Timelock contract address', {
        style: { maxWidth: 'none' },
      })
    }
  }

  return (
    <div className="p-8 pt-0 ml-10">
      <div className="mb-4 font-bold">{functionType + ' ' + userType}</div>
      <div className="mb-2 w-9/12">
        <input
          type="text"
          className="py-2 px-1 w-full bg-white/10 rounded border-2 border-white/20 focus:ring
          focus:ring-plumbus-20
          form-input, placeholder:text-white/50,"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
            console.log(e.target.value)
          }}
          placeholder={userType + ' address '}
        />
      </div>
      <div className="absolute mt-3">
        <Button
          isLoading={spinnerFlag}
          isWide
          rightIcon={<FaAsterisk />}
          onClick={() => onClick()}
        >
          {functionType + ' ' + userType}
        </Button>
      </div>
    </div>
  )
}

export default RemoveAddProposerAdminModal
