import clsx from 'clsx'
import Tooltip from './OperationsTableHelpers/Tooltip'
import { useWallet } from 'contexts/wallet'
import { DetailedHTMLProps, TableHTMLAttributes } from 'react'
import toast from 'react-hot-toast'
import { FaCopy } from 'react-icons/fa'
import { copy } from './OperationsTableHelpers/clipboard'
import { truncateMiddle } from './OperationsTableHelpers/text'

import AnchorButton from './OperationsTableHelpers/AnchorButton'

export interface OperationResponse {
  id: string
  executionTime: string
  target: string
  data: string
  status: string
}

const getAirdropDate = (date: number, type: string | null) => {
  if (type === null) return '-'
  if (type === 'height') return date
  const d = new Date(date * 1000)
  return d.toLocaleDateString('en-US') + ' approx'
}

type BaseProps<T = HTMLTableElement> = DetailedHTMLProps<
  TableHTMLAttributes<T>,
  T
>

export interface OperationsTableProps extends Omit<BaseProps, 'children'> {
  data: OperationResponse[]
}

const OperationsTable = ({
  data,
  className,
  ...rest
}: OperationsTableProps) => {
  const wallet = useWallet()

  return (
    <table className={clsx('min-w-full', className)} {...rest}>
      <thead className="sticky inset-x-0 top-0 bg-plumbus-dark/50 backdrop-blur-sm">
        <tr className="text-left text-plumbus-matte">
          <th className="p-3">ID</th>
          <th className="p-3 text-right">Execution Time</th>
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
              className="hover:bg-white/5"
              id={operation.id}
            >
              <td className="p-4">
                <div className="flex items-center space-x-4 font-medium">
                  <div className="w-8 min-w-max h-8 min-h-max">
                    <img
                      src={'/juno_logo.png'}
                      alt={operation.id}
                      className="overflow-hidden w-8 h-8 bg-plumbus rounded-full"
                    />
                  </div>
                  <div>
                    <div>{operation.id}</div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-right">{operation.executionTime}</td>
              <td className="p-4 text-right">{operation.target}</td>
              <td className="p-4 text-right">{operation.data}</td>
              <td className="p-4">{operation.status}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="p-4 text-center text-white/50">
              No opereations available :(
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default OperationsTable
