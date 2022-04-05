import clsx from 'clsx'
import { useWallet } from 'contexts/wallet'
import { DetailedHTMLProps, TableHTMLAttributes, useState } from 'react'
import toast from 'react-hot-toast'

import { copy } from '../../../../utils/clipboard'
import { Operation } from '../../../../utils/models'
import Tooltip from '../../../../utils/OperationsTableHelpers/Tooltip'
import { truncateMiddle } from '../../../../utils/text'

type BaseProps<T = HTMLTableElement> = DetailedHTMLProps<
  TableHTMLAttributes<T>,
  T
>

export interface OperationsTableProps extends Omit<BaseProps, 'children'> {
  data: Operation[]
}

const OperationsTable = ({
  data,
  className,
  ...rest
}: OperationsTableProps) => {
  const wallet = useWallet()
  const [selectedOperation, setSelectedOperation] = useState<Operation>()

  const IterateExecutors = () => {
    console.log(selectedOperation?.executors)
    try {
      if (
        selectedOperation &&
        selectedOperation.executors &&
        selectedOperation.executors?.length > 0
      ) {
        for (let i = 0; i < selectedOperation.executors?.length; i++) {
          return (
            <label
              htmlFor="small-input"
              className="block mx-3 mb-1 text-sm font-bold text-gray-900 dark:text-gray-300"
            >
              {selectedOperation.executors[i]}
            </label>
          )
        }
      } else {
        return (
          <div className="basis-1/4 flex-col my-2">
            <label
              htmlFor="small-input"
              className="block mx-3 mb-1 font-normal text-gray-900 dark:text-gray-300"
            >
              Any address can execute this operation.
            </label>
          </div>
        )
      }
    } catch (err: any) {
      toast.error('Error: ' + err.message, { style: { maxWidth: 'none' } })
    }
  }

  return (
    <table className={clsx('min-w-full', className)} {...rest}>
      <thead className="sticky inset-x-0 top-0 bg-plumbus-dark/50 backdrop-blur-sm">
        <tr className="text-left text-plumbus-matte">
          <th className="p-3">ID</th>
          <th className="p-3 text-right">Execution Time</th>
          <th className="p-3 text-right">Proposer</th>
          <th className="p-3 text-right">Target</th>
          <th className="p-3 text-right">Data</th>
          <th className="p-3">Status</th>
          <th className={clsx('p-3', { hidden: !wallet.address })}></th>
        </tr>
      </thead>

      <tbody className="divide-y divide-white/20">
        {data?.length > 0 ? (
          data.map((operation, i) => (
            <tr
              key={`operation-${i}`}
              className="hover:bg-white/5 "
              id={operation.id.toString()}
            >
              <td className="p-4">
                <div className="flex items-center space-x-4 font-medium">
                  <div className="w-8 min-w-max h-8 min-h-max">
                    <img
                      src={'/juno_logo.png'}
                      alt={operation.id.toString()}
                      className="overflow-hidden w-8 h-8 bg-plumbus rounded-full"
                    />
                  </div>
                  <div>
                    <div>{operation.id}</div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-right">{operation.execution_time}</td>
              <td
                className="p-4 text-right hover:text-juno cursor-pointer"
                onClick={async () => {
                  copy(operation.proposer)
                }}
              >
                <Tooltip label={operation.proposer}>
                  <span>{truncateMiddle(operation.proposer, 13)}</span>
                </Tooltip>
              </td>
              <td
                className="p-4 text-right hover:text-juno cursor-pointer"
                onClick={async () => {
                  copy(operation.proposer)
                }}
              >
                <Tooltip label={operation.target}>
                  <span>{truncateMiddle(operation.target, 13)}</span>
                </Tooltip>
              </td>
              <td className="p-4 text-right">{operation.data}</td>
              <td className="p-4">{operation.status}</td>
              <td
                onClick={() => {
                  setSelectedOperation(operation)
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
              No opereations available :(
            </td>
          </tr>
        )}
        {/* RENDER OPERATION MODAL WHEN CLICKED  */}
        <tr>
          <td>
            <input type="checkbox" id="my-modal-5" className="modal-toggle" />
            <label
              htmlFor="my-modal-5"
              className="cursor-pointer modal"
              style={{ background: 'rgb(25, 29, 32, 0.75)' }}
            >
              <label className="relative bg-dark-gray border-2 border-plumbus-20 modal-box">
                <div className="p-8 bg-dark-gray">
                  <div className="text-lg font-bold">
                    {' Operation ID: ' + selectedOperation?.id}
                  </div>
                  <div className="basis-1/4 flex-col my-4 font-bold">
                    <div>Description</div>
                    <div className="overflow-auto mx-3 mb-3 font-normal h-50">
                      {selectedOperation?.description
                        ? selectedOperation.description
                        : 'No description provided.'}
                    </div>
                    <div>Data</div>
                    <div className="overflow-auto mx-3 font-normal h-50">
                      {selectedOperation?.data
                        ? selectedOperation.data
                        : 'No data provided.'}
                    </div>
                  </div>
                  <div className="overflow-auto basis-1/4 flex-col my-3 font-bold h-50">
                    <div>Executors</div>
                    {IterateExecutors()}
                  </div>
                </div>
              </label>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default OperationsTable
