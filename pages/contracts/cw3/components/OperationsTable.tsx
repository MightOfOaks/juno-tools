import clsx from 'clsx'
import Tooltip from './OperationsTableHelpers/Tooltip'
import { useWallet } from 'contexts/wallet'
import { DetailedHTMLProps, TableHTMLAttributes, useState } from 'react'
import { copy } from './OperationsTableHelpers/clipboard'
import { truncateMiddle } from './OperationsTableHelpers/text'
import { Operation } from '../models'
import Procedures from './Procedures'

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
    if (selectedOperation && selectedOperation.executors != []) {
      for (let i = 0; i < selectedOperation.executors.length; i++) {
        return (
          <label
            htmlFor="small-input"
            className="mb-1 mx-3 block text-sm font-bold text-gray-900 dark:text-gray-300"
          >
            {selectedOperation.executors[i]}
          </label>
        )
      }
    } else {
      return (
        <div className="flex-col basis-1/4 my-4">
          <label
            htmlFor="small-input"
            className="mb-1 mx-3 block text-sm font-bold text-gray-900 dark:text-gray-300"
          >
            No Executors Found
          </label>
        </div>
      )
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
        {data.length > 0 ? (
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
                className="p-4 text-right cursor-pointer hover:text-juno"
                onClick={async () => {
                  copy(operation.proposer)
                }}
              >
                <Tooltip label={operation.proposer}>
                  <span>{truncateMiddle(operation.proposer, 13)}</span>
                </Tooltip>
              </td>
              <td
                className="p-4 text-right cursor-pointer hover:text-juno"
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
                  className="cursor-pointer border-l pl-2 hover:text-juno"
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
        <input type="checkbox" id="my-modal-5" className="modal-toggle" />
        <label
          htmlFor="my-modal-5"
          className="modal cursor-pointer"
          style={{ background: 'rgb(25, 29, 32, 0.75)' }}
        >
          <label className="modal-box relative bg-dark-gray border-2 border-plumbus-20">
            <div className="bg-dark-gray p-8">
              <div className="text-lg font-bold">
                {' OPERATION ' + selectedOperation?.id}
              </div>
              <div className="flex-col basis-1/4 my-4">
                <div>Description</div>
                <div className="mx-3 font-bold overflow-auto h-50">
                  {selectedOperation?.description
                    ? selectedOperation.description
                    : 'No Description Provided'}
                </div>
                <div>Data</div>
                <div className="mx-3 font-bold overflow-auto h-50">
                  {selectedOperation?.data
                    ? selectedOperation.data
                    : 'No Data Provided'}
                </div>
              </div>
              <div className="flex-col basis-1/4 my-4 overflow-auto h-50">
                <div>Executors</div>
                {IterateExecutors()}
              </div>
            </div>
          </label>
        </label>
      </tbody>
    </table>
  )
}

export default OperationsTable
