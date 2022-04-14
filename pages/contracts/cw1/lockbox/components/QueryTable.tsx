import clsx from 'clsx'
import { useWallet } from 'contexts/wallet'
import { DetailedHTMLProps, TableHTMLAttributes, useState } from 'react'
import { copy } from 'utils/clipboard'
import { LockBox } from 'utils/models'
import Tooltip from 'utils/OperationsTableHelpers/Tooltip'
import { truncateMiddle } from 'utils/text'

type BaseProps<T = HTMLTableElement> = DetailedHTMLProps<
  TableHTMLAttributes<T>,
  T
>

export interface LockBoxTableProps extends Omit<BaseProps, 'children'> {
  data: LockBox[]
}

const LockBoxTable = ({ data, className, ...rest }: LockBoxTableProps) => {
  const wallet = useWallet()
  const [selectedLockbox, setSelectedLockbox] = useState<LockBox>()
  const [detailsModal, setDetailsModal] = useState(false)

  const calculateTotalClaim = (lockbox: LockBox) => {
    const totalClaim = lockbox.claims.reduce(
      (acc, claim) => acc + Number(claim.amount),
      0
    )
    return totalClaim
  }
  return (
    <div>
      <table className={clsx('min-w-full', className)} {...rest}>
        <thead className="sticky inset-x-0 top-0 bg-plumbus-dark/50 backdrop-blur-sm">
          <tr className="text-left text-plumbus-matte">
            <th className="p-3 text-center">ID</th>
            <th className="p-3 text-center">Deadline</th>
            <th className="p-3 text-center">Owner</th>
            <th className="p-3 text-center">Total Deposit</th>
            <th className="p-3 text-center">Total Claim</th>
            <th className="p-3 text-center">Reset?</th>
            <th className="p-3 text-center">Expired?</th>
            <th className={clsx('p-3', { hidden: !wallet.address })}></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/20">
          {data && data?.length > 0 ? (
            data.map((lockbox, i) => (
              <tr
                key={`lockbox-${i}`}
                className="hover:bg-white/5 "
                id={lockbox.id.toString()}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-4 font-medium">
                    <div className="w-8 min-w-max h-8 min-h-max">
                      <img
                        src={'/juno_logo.png'}
                        alt={lockbox.id.toString()}
                        className="overflow-hidden w-8 h-8 bg-plumbus rounded-full"
                      />
                    </div>
                    <div>
                      <div>{lockbox.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-2 text-center">
                  {!lockbox.expiration.at_time
                    ? 'Block Height #' + lockbox.expiration.at_height
                    : new Date(
                        Number(lockbox.expiration.at_time) / 1000000
                      ).toLocaleString()}
                </td>
                <td
                  className="p-4 text-center hover:text-juno cursor-pointer"
                  onClick={async () => {
                    copy(lockbox.owner)
                  }}
                >
                  <Tooltip label={lockbox.owner}>
                    <span>{truncateMiddle(lockbox.owner, 13)}</span>
                  </Tooltip>
                </td>

                <td className="p-4 text-center">
                  {calculateTotalClaim(lockbox) - Number(lockbox.total_amount)}
                </td>

                <td className="p-4 text-center">
                  {calculateTotalClaim(lockbox)}
                </td>
                <td className="p-4 text-center">
                  {lockbox.reset ? 'True' : 'False'}
                </td>
                <td className="p-4 text-center">
                  {lockbox.expiration.at_time
                    ? Number(lockbox.expiration.at_time) / 1000000 > Date.now()
                      ? 'False'
                      : 'True'
                    : ''}
                </td>

                <td
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedLockbox(lockbox)
                    setDetailsModal(!detailsModal)
                  }}
                  className="cursor-pointer"
                >
                  <label
                    htmlFor="my-modal-5"
                    className="pr-1 pl-2 hover:text-juno border-l cursor-pointer"
                  >
                    details
                  </label>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-white/50">
                No lockboxes available :(
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* RENDER OPERATION MODAL WHEN CLICKED  */}
      {detailsModal && (
        <div className="absolute top-0 left-0 w-full h-full">
          <input
            type="checkbox"
            id="my-modal-5"
            className="w-full h-full opacity-0"
            onChange={(e) => {
              setDetailsModal(!detailsModal)
            }}
          />
          <div className="absolute top-1/2 left-1/3">
            <label
              htmlFor="my-modal-5"
              className="cursor-pointer modal"
              style={{ background: 'rgb(25, 29, 32, 0.75)' }}
            >
              <label className="relative bg-[#3a3535] ">
                <div className="p-6 bg-[#3a3535] rounded border-2 border-[#f0827d]">
                  <div className="text-lg font-bold">
                    {' Lockbox ID: ' + selectedLockbox?.id}
                  </div>
                  {selectedLockbox?.native_denom && (
                    <div className="basis-1/4 flex-col my-4 font-bold">
                      <div>Native Denom </div>
                      <div className="overflow-auto mx-3 font-normal h-50">
                        {selectedLockbox?.native_denom?.toLocaleUpperCase()}
                      </div>
                    </div>
                  )}
                  {selectedLockbox?.cw20_addr && (
                    <div className="basis-1/4 flex-col my-4 font-bold">
                      <div>CW20 Contract Address</div>
                      <div className="overflow-auto mx-3 font-normal h-50">
                        {selectedLockbox?.cw20_addr}
                      </div>
                    </div>
                  )}
                  <div className="overflow-auto basis-1/4 flex-col mt-3 mb-1 font-bold h-50">
                    <div>Claims</div>
                    {selectedLockbox &&
                    selectedLockbox.claims &&
                    selectedLockbox.claims?.length > 0 ? (
                      selectedLockbox.claims.map((claim, index) => {
                        return (
                          <label
                            key={index}
                            htmlFor="small-input"
                            className="block mx-3 mb-1 text-sm font-bold text-gray-300"
                          >
                            {claim.addr + ' | ' + claim.amount}
                          </label>
                        )
                      })
                    ) : (
                      <div className="basis-1/4 flex-col my-1">
                        <label
                          htmlFor="small-input"
                          className="block mx-3 mb-1 font-normal text-white dark:text-gray-300"
                        >
                          No claimers provided for this lockbox.
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </label>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default LockBoxTable
