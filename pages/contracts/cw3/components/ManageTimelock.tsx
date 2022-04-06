import clsx from 'clsx'
import { useContracts } from 'contexts/contracts'
import { useTheme } from 'contexts/theme'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { isValidAddress } from '../../../../utils/isValidAddress'
import { Operation, Timelock } from '../../../../utils/models'
import OperationsTable from './OperationsTable'
import Procedures from './Procedures'

const ManageTimelock = () => {
  const theme = useTheme()
  const [contractAddress, setContractAddress] = useState(
    'juno1cspathx3ex9hud98vt6qpsujj9gnefkjphzm4f83shue5q5u8suq7me0lc'
  )
  // 'juno1ptxjpktyrus6g8xn9yd98ewzahyhhvc56ddg6c8ln2hk6qhlesxqy43240'

  const decode = (str: string): string =>
    Buffer.from(str, 'base64').toString('binary')

  const [timelock, setTimelock] = useState<Timelock>(new Timelock([], [], 0))
  const [clientFound, setClientFound] = useState(false)
  const [selectedModal, setSelectedModal] = useState('')
  const [data, setData] = useState<Operation[]>([])
  const contract = useContracts().cw3Timelock
  const wallet = useWallet()

  return (
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
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </div>
          <div className="mt-5 mb-1">
            <select
              id="contract-query-type"
              name="query-type"
              className={clsx(
                'text-white bg-white/10 rounded border-2 border-white/20 form-select',
                'placeholder:text-white/50',
                'focus:ring focus:ring-plumbus-20'
              )}
              onChange={(e) => setSelectedModal(e.target.value)}
            >
              <option value="" disabled selected hidden>
                Execute Action
              </option>
              <option className="bg-[#3a3535] rounded" value="schedule">
                Schedule
              </option>
              <option className="bg-[#3a3535]" value="cancel">
                Cancel
              </option>
              <option className="bg-[#3a3535]" value="execute">
                Execute
              </option>
              <option className="bg-[#3a3535]" value="revoke">
                Revoke Admin
              </option>
              <option className="bg-[#3a3535]" value="add">
                Add Proposer
              </option>
              <option className="bg-[#3a3535]" value="remove">
                Remove Proposer
              </option>
              <option className="bg-[#3a3535]" value="min-delay">
                Update Minimum Delay
              </option>
              ))
            </select>
            <hr className="mt-5" />
          </div>
        </div>
      </div>

      <div className="justify-center w-3/4">
        <div className="flex-col">
          <div>
            <Procedures
              selectedModal={selectedModal}
              contractAddress={contractAddress}
            />
          </div>
          <br />
        </div>
      </div>
    </div>
  )
}

export default ManageTimelock
