import Button from 'components/Button'
import LinkTabs from 'components/LinkTabs'
import PageHeaderCW1Lockbox from 'components/lockbox/PageHeaderCW1Lockbox'
import { useContracts } from 'contexts/contracts'
import { useTheme } from 'contexts/theme'
import { useWallet } from 'contexts/wallet'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'
import { isValidAddress } from 'utils/isValidAddress'
import { withMetadata } from 'utils/layout'

import { cw1LockboxLinkTabs } from '../../../../components/lockbox/LinkTabs.data'

const QueryTab: NextPage = () => {
  const decode = (str: string): string =>
    Buffer.from(str, 'base64').toString('binary')

  const [clientFound, setClientFound] = useState(false)
  const contract = useContracts().cw1Lockbox
  const wallet = useWallet()
  const [contractAddress, setContractAddress] = useState(
    contract?.getContractAddress() || ''
  )

  const query = async () => {
    try {
      if (!wallet.initialized) {
        toast.error('Oops! Need to connect your Keplr Wallet first.', {
          style: { maxWidth: 'none' },
        })
      }

      if (isValidAddress(contractAddress)) {
        const client = contract?.use('')

        if (client) {
          setClientFound(true)
        }
      } else {
        toast.error('You need to specify a valid Lockbox contract address.', {
          style: { maxWidth: 'none' },
        })
      }
    } catch (error: any) {
      if (error.message.includes('bech32 failed')) {
        toast.error('You need to specify a valid Lockbox contract address.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  return (
    <div>
      <form className="py-6 px-12 space-y-4">
        <NextSeo title="Query Timelock Contract" />

        <PageHeaderCW1Lockbox />

        <LinkTabs data={cw1LockboxLinkTabs} activeIndex={1} />
      </form>
      <div className="px-6">
        <div className="py-2 px-10">
          <label className="block mb-2 font-bold text-left text-white dark:text-gray-300 text-md">
            Lockbox Contract Address
          </label>
          <div className="flex-row">
            <div className="flex">
              <input
                type="text"
                className="py-2 px-1 w-2/3 bg-white/10 rounded border-2 border-white/20 focus:ring
                focus:ring-plumbus-20
                form-input, placeholder:text-white/50,"
                placeholder={contractAddress || 'Please enter contract address'}
                value={contractAddress}
                onChange={(e) => {
                  contract?.updateContractAddress(e.target.value)
                  setContractAddress(e.target.value)
                }}
              />
              <div className="mt-1 ml-3">
                <Button
                  isWide
                  rightIcon={<FaAsterisk />}
                  onClick={(e) => {
                    query()
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
        <hr className="mx-10" />
      </div>
    </div>
  )
}

export default withMetadata(QueryTab, { center: false })
