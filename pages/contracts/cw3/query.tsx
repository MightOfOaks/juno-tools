import Button from 'components/Button'
import LinkTabs from 'components/LinkTabs'
import PageHeaderCW3 from 'components/timelock/PageHeaderCW3'
import { useContracts } from 'contexts/contracts'
import { useTheme } from 'contexts/theme'
import { useWallet } from 'contexts/wallet'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'
import { isValidAddress } from 'utils/isValidAddress'
import { withMetadata } from 'utils/layout'
import { Operation, Timelock } from 'utils/models'

import { cw3LinkTabs } from '../../../components/timelock/LinkTabs.data'
import { useInstantiateCW3Form } from '../../../hooks/useInstantiateCW3Form'
import OperationsTable from './components/OperationsTable'

const QueryTab: NextPage = () => {
  const theme = useTheme()
  const decode = (str: string): string =>
    Buffer.from(str, 'base64').toString('binary')

  const [timelock, setTimelock] = useState<Timelock>(new Timelock([], [], 0))
  const [clientFound, setClientFound] = useState(false)
  const [data, setData] = useState<Operation[]>([])
  const [pageNumber, setPageNumber] = useState(0)
  const [topList, setTopList] = useState([0])
  const [nextPage, setNextPage] = useState(false)

  const operationCountOnPage = 2

  const contract = useContracts().cw3Timelock
  const wallet = useWallet()
  const [contractAddress, setContractAddress] = useState(
    contract?.getContractAddress() || ''
  )

  function dhms(secs: number) {
    let result = ''
    const days = Math.floor(secs / (24 * 60 * 60))
    if (days > 0) result += days + ' day(s) '
    const days_s = secs % (24 * 60 * 60)
    const hours = Math.floor(days_s / (60 * 60))
    if (hours > 0) {
      if (result.length > 0) result += ' : '
      result += hours + ' hour(s) '
    }
    const hours_s = secs % (60 * 60)
    const minutes = Math.floor(hours_s / 60)
    if (minutes > 0) {
      if (result.length > 0) result += ' : '
      result += minutes + ' minute(s) '
    }
    const minutes_s = secs % 60
    const sec = Math.floor(minutes_s)
    if (sec > 0) {
      if (result.length > 0) result += ' : '
      result += sec + ' second(s) '
    }
    return result
  }

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

          const admins = await client?.getAdmins()
          const proposers = await client?.getProposers()
          const minDelay = await client?.getMinDelay()

          const res = await client?.getOperations(
            Number(topList[pageNumber]?.toString()),
            operationCountOnPage + 1
          )
          const operationList = res.operationList

          await setNextPage(
            operationCountOnPage + 1 > operationList.length ? true : false
          )

          let list = topList

          if (list.length > pageNumber + 1) {
            list[pageNumber + 1] = operationList[operationList.length - 2]?.id
          } else {
            list.push(operationList[operationList.length - 2]?.id)
          }
          await setTopList(list)
          console.log(operationList)
          console.log(minDelay.substring(5))

          setTimelock(
            new Timelock(admins, proposers, Number(minDelay.substring(5)))
          )
          setData([])
          let indexMax =
            operationCountOnPage < operationList.length
              ? operationCountOnPage
              : operationList.length
          for (let i = 0; i < indexMax; i++) {
            setData((prevData) =>
              prevData.concat(
                new Operation(
                  operationList[i].id,
                  new Date().getTime() * 1000000 >
                    Number(operationList[i].execution_time.at_time) &&
                  operationList[i].status === 'Pending'
                    ? 'Ready'
                    : operationList[i].status,
                  operationList[i].proposer,
                  operationList[i].executors,
                  new Date(
                    Number(operationList[i].execution_time.at_time) / 1000000
                  )
                    .toString()
                    .slice(0, 33),
                  operationList[i].target,
                  decode(operationList[i].data),
                  operationList[i].description
                )
              )
            )
          }
        }
      } else {
        toast.error('You need to specify a valid Timelock contract address.', {
          style: { maxWidth: 'none' },
        })
      }
    } catch (error: any) {
      if (error.message.includes('bech32 failed')) {
        toast.error('You need to specify a valid Timelock contract address.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  useEffect(() => {
    query()
  }, [pageNumber])

  return (
    <div>
      <form className="py-6 px-12 space-y-4">
        <NextSeo title="Query Timelock Contract" />

        <PageHeaderCW3 />

        <LinkTabs data={cw3LinkTabs} activeIndex={1} />
      </form>
      <div className="px-6">
        <div className="py-2 px-10">
          <label className="block mb-2 font-bold text-left text-white dark:text-gray-300 text-md">
            Timelock Contract Address
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
                    setPageNumber(0)
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
        {(timelock.admins.length > 0 || timelock.proposers.length > 0) && (
          <div className="flex mt-10">
            <ul className="mr-3 ml-10 w-full h-full text-sm font-medium text-white dark:text-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <li className="py-2 px-4 w-full font-bold rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                <span className="text-plumbus-matte">Administrators</span>
              </li>
              {timelock.admins.map((item, index) => (
                <li
                  key={index}
                  className={
                    'hover:bg-white/5 w-full px-4 py-2' +
                    (index !== timelock.admins.length - 1
                      ? ' border-b'
                      : ' p-1')
                  }
                >
                  <span className="mr-5 font-bold">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
            <ul className="mr-3 ml-2 w-full h-full text-sm font-medium text-white dark:text-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <li className="py-2 px-4 w-full font-bold rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                <span className="text-plumbus-matte">Proposers</span>
              </li>
              {timelock.proposers.map((item, index) => (
                <li
                  key={index}
                  className={
                    'hover:bg-white/5 w-full px-4 py-2' +
                    (index !== timelock.proposers.length - 1
                      ? ' border-b'
                      : ' p-1')
                  }
                >
                  <span className="mr-5 font-bold">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
            <ul className="mr-10 ml-2 w-1/3 h-1/3 text-sm font-medium text-white dark:text-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <li className="py-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                <span className="text-plumbus-matte">Minimum Delay</span>
              </li>
              <li className="py-2 px-4 w-full hover:bg-white/5 border-gray-200 dark:border-gray-600">
                {dhms(timelock.min_time_delay)}
              </li>
            </ul>
          </div>
        )}

        <div
          className="overflow-auto px-10 my-10 no-scrollbar"
          style={{ maxHeight: '525px' }}
        >
          {data.length > 0 && (
            <div>
              <OperationsTable data={data} />
              <div className="flex mt-3">
                <div className="mr-3 disabled">
                  <Button
                    onClick={(e) => {
                      setPageNumber(pageNumber - 1)
                    }}
                    isDisabled={pageNumber === 0}
                  >
                    Previous Page
                  </Button>
                </div>
                <div>
                  <Button
                    isWide
                    onClick={(e) => {
                      setPageNumber(pageNumber + 1)
                    }}
                    isDisabled={nextPage}
                  >
                    Next Page
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {clientFound && data.length === 0 && (
          <div
            className={`${
              theme.isDarkTheme ? 'border-gray/20' : 'border-dark/20'
            } text-center m-5 mx-10`}
          >
            <div className="flex flex-col items-center p-3 w-full h-32 rounded-xl border">
              <div className="flex items-center mb-1 text-lg font-bold">
                {' NO OPERATIONS FOUND '}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default withMetadata(QueryTab, { center: false })
