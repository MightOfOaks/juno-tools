import clsx from 'clsx'
import Button from 'components/Button'
import Conditional from 'components/Conditional'
import FormControl from 'components/FormControl'
import Input from 'components/Input'
import JsonPreview from 'components/JsonPreview'
import LinkTabs from 'components/LinkTabs'
import PageHeaderCW1Lockbox from 'components/lockbox/PageHeaderCW1Lockbox'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'
import { useQuery } from 'react-query'
import { dispatchQuery, QUERY_ENTRIES, QueryType } from 'utils/cw1LockBox'
import { isValidAddress } from 'utils/isValidAddress'
import { withMetadata } from 'utils/layout'

import { cw1LockboxLinkTabs } from '../../../../components/lockbox/LinkTabs.data'

const QueryTab: NextPage = () => {
  const [address, setAddress] = useState<string>('')
  const [type, setType] = useState<QueryType>('id')
  const [queryBoxId, setQueryBoxId] = useState('')
  const [pageNumber, setPageNumber] = useState(0)
  const decode = (str: string): string =>
    Buffer.from(str, 'base64').toString('binary')

  const [clientFound, setClientFound] = useState(false)
  const contract = useContracts().cw1Lockbox
  const wallet = useWallet()
  const [contractAddress, setContractAddress] = useState(
    contract?.getContractAddress() || ''
  )

  const { data: response } = useQuery(
    [address, type, contract, wallet, queryBoxId] as const,
    async ({ queryKey }) => {
      const [_address, _type, _contract, _wallet, queryBoxId] = queryKey
      const messages = contract?.use(_address)
      const result = await dispatchQuery({
        id: queryBoxId,
        messages,
        type,
      })
      return result
    },
    {
      placeholderData: null,
      onError: (error: any) => {
        toast.error(error.message)
      },
      enabled: Boolean(address && type && contract && wallet),
    }
  )

  //   const query = async () => {
  //     try {
  //       if (!wallet.initialized) {
  //         toast.error('Oops! Need to connect your Keplr Wallet first.', {
  //           style: { maxWidth: 'none' },
  //         })
  //       }

  //       if (!isValidAddress(contractAddress)) {
  //         console.log('query içi')

  //         const client = contract?.use(address)
  //         console.log(address)
  //         console.log(type)
  //         const lockboxList = await client?.getLockboxes()
  //         console.log(lockboxList)

  //         if (client) {
  //           setClientFound(true)
  //         }
  //       } else {
  //         toast.error('You need to specify a valid Lockbox contract address.', {
  //           style: { maxWidth: 'none' },
  //         })
  //       }
  //     } catch (error: any) {
  //       if (error.message.includes('bech32 failed')) {
  //         toast.error('You need to specify a valid Lockbox contract address.', {
  //           style: { maxWidth: 'none' },
  //         })
  //       } else {
  //         toast.error(error.message, { style: { maxWidth: 'none' } })
  //       }
  //     }
  //   }

  return (
    <section className="py-6 px-12 space-y-4">
      <NextSeo title="Query Timelock Contract" />
      <PageHeaderCW1Lockbox />
      <LinkTabs data={cw1LockboxLinkTabs} activeIndex={1} />
      <div className="grid grid-cols-2 p-4 space-x-8">
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
              onChange={(e) => setType(e.target.value as QueryType)}
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
                type="text"
                placeholder="juno1234567890abcdefghijklmnopqrstuvwxyz..."
                value={queryBoxId}
                onChange={(e) => setQueryBoxId(e.target.value)}
              />
            </FormControl>
          </Conditional>
        </div>
        <JsonPreview
          title="Query Response "
          content={
            'This field will be filled once required data fields are filled' +
            address
              ? { type }
              : null
          }
        />
      </div>
    </section>
  )
}

export default withMetadata(QueryTab, { center: false })
