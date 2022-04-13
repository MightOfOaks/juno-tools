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
import React, { useState } from 'react'
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
  const [pageNumber, setPageNumber] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [queryResult, setQueryResult] = useState<LockBox[]>([])
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
      setQueryResult([])
      setSearched(true)
      setIsLoading(true)
      const client = contract?.use(address)

      if (type == 'all') {
        const lockboxList = await client?.getLockboxes()
        setQueryResult(lockboxList.lockboxes)
      } else {
        const lockbox = await client?.getLockbox(queryBoxId)
        setQueryResult([lockbox])
        console.log(queryResult)
      }
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
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
    <section className="py-6 px-12 space-y-4">
      <NextSeo title="Query Timelock Contract" />
      <PageHeaderCW1Lockbox />
      <LinkTabs data={cw1LockboxLinkTabs} activeIndex={1} />
      <div className="grid p-4 space-x-8">
        <div className="space-y-8">
          <FormControl
            title="CW20 Address"
            subtitle="Address of the CW20 token"
            htmlId="contract-address"
          >
            <Input
              id="contract-address"
              name="cw20"
              type="text"
              placeholder="juno1234567890abcdefghijklmnopqrstuvwxyz..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
        </div>
      </div>

      <div className="grid grid-cols-3 p-4 space-x-8">
        <FormControl
          title="Query Type"
          subtitle="Type of query to be dispatched"
          htmlId="contract-query-type"
        >
          <select
            id="contract-query-type"
            name="query-type"
            className={clsx(
              'bg-white/10 rounded border-2 border-white/20 form-select',
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
              <option key={`query-${id}`} value={id}>
                {name}
              </option>
            ))}
          </select>
        </FormControl>
        <Conditional test={type === 'id'}>
          <FormControl
            title="LockBox ID"
            subtitle="ID of the lockbox to be queried"
            htmlId="lockbox-id"
          >
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
        <div className="px-6 pt-6 mt-8">
          <Button
            isLoading={isLoading}
            isWide
            rightIcon={<FaAsterisk />}
            onClick={query}
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
                      isDisabled={true}
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
                {' NO OPERATIONS FOUND '}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default withMetadata(QueryTab, { center: false })
