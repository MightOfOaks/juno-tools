import clsx from 'clsx'
import LinkTabs from 'components/LinkTabs'
import PageHeaderCW3 from 'components/lockbox/PageHeaderCW1Lockbox'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { withMetadata } from 'utils/layout'

import { cw1LockboxLinkTabs } from '../../../../components/lockbox/LinkTabs.data'
import ProcedureSelector from './components/ProcedureSelector'

const ExecuteTab = () => {
  const contract = useContracts().cw1Lockbox
  const wallet = useWallet()
  const [contractAddress, setContractAddress] = useState(
    contract?.getContractAddress() || ''
  )
  const [selectedProcedure, setSelectedProcedure] = useState('')
  return (
    <div>
      <form className="py-6 px-12 space-y-4">
        <NextSeo title="Execute actions for Timelock Contract" />
        <PageHeaderCW3 />
        <LinkTabs data={cw1LockboxLinkTabs} activeIndex={2} />
      </form>

      <div className="px-6">
        <div className="py-2 px-10">
          <label className="block mb-2 font-bold text-left text-white dark:text-gray-300 text-md">
            Timelock Contract Address
          </label>
          <div className="flex-row">
            <div>
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
            </div>
          </div>
        </div>
        <hr className="m-10" />
        <div className="justify-center p-3 pl-10">
          <div className="grid grid-cols-2">
            <div className="mb-1">
              <select
                id="contract-query-type"
                name="query-type"
                className={clsx(
                  'text-white bg-white/10 rounded border-2 border-white/20 form-select',
                  'placeholder:text-white/50',
                  'focus:ring focus:ring-plumbus-20'
                )}
                onChange={(e) => setSelectedProcedure(e.target.value)}
              >
                <option value="" disabled selected hidden>
                  Execute Action
                </option>
                <option className="bg-[#3a3535]" value="claim">
                  Claim
                </option>
                <option className="bg-[#3a3535]" value="deposit">
                  Deposit
                </option>
                <option className="bg-[#3a3535]" value="reset">
                  Reset
                </option>
              </select>
            </div>
            <div className="flex-col">
              <div>
                <ProcedureSelector
                  selectedProcedure={selectedProcedure}
                  contractAddress={contractAddress}
                />
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withMetadata(ExecuteTab, { center: false })
