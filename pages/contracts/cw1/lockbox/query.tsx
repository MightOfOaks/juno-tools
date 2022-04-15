import clsx from 'clsx'
import Button from 'components/Button'
import Conditional from 'components/Conditional'
import FormControl from 'components/FormControl'
import Input from 'components/Input'
import LinkTabs from 'components/LinkTabs'
import PageHeaderCW1Lockbox from 'components/lockbox/PageHeaderCW1Lockbox'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'
import { dispatchQuery, QUERY_ENTRIES, QueryType } from 'utils/cw1LockBox'
import { withMetadata } from 'utils/layout'
import { LockBox } from 'utils/models'

import { cw1LockboxLinkTabs } from '../../../../components/lockbox/LinkTabs.data'
import OperationsTable from './components/QueryTable'

const QueryTab: NextPage = () => {
  const [address, setAddress] = useState<string>('')
  const [type, setType] = useState<QueryType>('all')
  const [queryBoxId, setQueryBoxId] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [queryResult, setQueryResult] = useState<LockBox[]>([])
  const contract = useContracts().cw1Lockbox
  const wallet = useWallet()
  const [contractAddress, setContractAddress] = useState(
    contract?.getContractAddress() || ''
  )
  const [topList, setTopList] = useState([0])
  const [nextPage, setNextPage] = useState(false)

  const pageNumber = useRef(0)
  const lockboxCountOnPage = 10

  const query = async (page: number) => {
    try {
      if (!wallet.initialized) {
        toast.error('Oops! Need to connect your Keplr Wallet first.', {
          style: { maxWidth: 'none' },
        })
      }
      setQueryResult([])
      setSearched(true)
      setIsLoading(true)
      const client = contract?.use(address)

      if (type == 'all') {
        const lockboxLists = await client?.getLockboxes(
          Number(topList[page]?.toString()),
          lockboxCountOnPage + 1
        )

        const lockboxList = lockboxLists.lockboxes
        console.log(queryResult)

        await setNextPage(
          lockboxCountOnPage + 1 > lockboxList.length ? true : false
        )

        let list = topList

        if (list.length > page + 1) {
          list[page + 1] = lockboxList[lockboxList.length - 2]?.id
        } else {
          list.push(lockboxList[lockboxList.length - 2]?.id)
        }
        await setTopList(list)

        let indexMax =
          lockboxCountOnPage < lockboxList.length
            ? lockboxCountOnPage
            : lockboxList.length
        for (let i = 0; i < indexMax; i++) {
          setQueryResult((prevData) =>
            prevData.concat(
              new LockBox(
                lockboxList[i].id,
                lockboxList[i].native_denom,
                lockboxList[i].cw20_addr,
                lockboxList[i].owner,
                lockboxList[i].reset,
                lockboxList[i].total_amount,
                lockboxList[i].expiration,
                lockboxList[i].claims
              )
            )
          )
        }
      } else {
        const lockbox = await client?.getLockbox(queryBoxId)
        setQueryResult([lockbox])
        console.log(queryResult)
      }
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
      if (
        error.message.includes('bech32 failed') ||
        error.message.includes('empty address string is not allowed')
      ) {
        toast.error('You need to specify a valid Lockbox contract address.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  /*const firstUpdate = useRef(false)
  useEffect(() => {
    if (firstUpdate.current) {
      if (pageNumber === -1) query(0)
      else query(pageNumber)
    } else {
      firstUpdate.current = true
    }
  }, [pageNumber])*/

  return (
    <section className="py-6 px-12 space-y-4">
      <NextSeo title="Query Lockbox Contract" />
      <PageHeaderCW1Lockbox />
      <LinkTabs data={cw1LockboxLinkTabs} activeIndex={1} />
      <div className="grid p-4 space-x-8">
        <div className="space-y-8">
          <FormControl title="Lockbox Address" htmlId="contract-address">
            <Input
              id="contract-address"
              name="lockbox"
              type="text"
              placeholder="Please specify  a Lockbox contract address"
              value={contractAddress}
              onChange={(e) => {
                contract?.updateContractAddress(e.target.value)
                setContractAddress(e.target.value)
              }}
            />
          </FormControl>
        </div>
      </div>

      <div className="grid grid-cols-3 p-4 space-x-8">
        <FormControl title="Query Type" htmlId="contract-query-type">
          <select
            id="contract-query-type"
            name="query-type"
            className={clsx(
              'bg-white/10 rounded border-2 border-white/20 form-select',
              'options:bg-yellow',
              'placeholder:text-white/50',
              'focus:ring focus:ring-plumbus-20'
            )}
            onChange={(e) => {
              setQueryResult([])
              setSearched(false)
              setType(e.target.value as QueryType)
            }}
          >
            {QUERY_ENTRIES.map(({ id, name }) => (
              <option className="bg-[#3a3535]" key={`query-${id}`} value={id}>
                {name}
              </option>
            ))}
          </select>
        </FormControl>
        <Conditional test={type === 'id'}>
          <FormControl title="LockBox ID" htmlId="lockbox-id">
            <Input
              id="lockbox-id"
              name="id"
              type="number"
              placeholder="0"
              value={queryBoxId}
              onChange={(e) =>
                Number(e.target.value)
                  ? setQueryBoxId(Number(e.target.value))
                  : setQueryBoxId(0)
              }
            />
          </FormControl>
        </Conditional>
        <div className="px-6 pt-6 mt-2">
          <Button
            isLoading={isLoading}
            isWide
            rightIcon={<FaAsterisk />}
            onClick={() => {
              pageNumber.current = 0
              query(pageNumber.current)
            }}
          >
            Query
          </Button>
        </div>
      </div>
      <div>
        <div
          className="overflow-auto px-10 my-10 no-scrollbar"
          style={{ maxHeight: '525px' }}
        >
          {queryResult.length > 0 && (
            <div>
              <OperationsTable data={queryResult} />
              {type == 'all' && (
                <div className="flex mt-3">
                  <div className="mr-3 disabled">
                    <Button
                      onClick={() => {
                        pageNumber.current -= 1
                        query(pageNumber.current)
                      }}
                      isDisabled={pageNumber.current <= 0}
                    >
                      Previous Page
                    </Button>
                  </div>
                  <div>
                    <Button
                      isWide
                      onClick={() => {
                        pageNumber.current += 1
                        query(pageNumber.current)
                      }}
                      isDisabled={nextPage}
                    >
                      Next Page
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {searched && queryResult.length === 0 && (
          <div className="m-5 mx-10 text-center border-dark/20">
            <div className="flex flex-col items-center p-3 w-full h-32 rounded-xl border">
              <div className="flex items-center mb-1 text-lg font-bold">
                {' NO LOCKBOX FOUND '}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default withMetadata(QueryTab, { center: false })
