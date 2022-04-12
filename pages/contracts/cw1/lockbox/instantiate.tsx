import clsx from 'clsx'
import Alert from 'components/Alert'
import Button from 'components/Button'
import Conditional from 'components/Conditional'
import FormControl from 'components/FormControl'
import FormGroup from 'components/FormGroup'
import Input from 'components/Input'
import JsonPreview from 'components/JsonPreview'
import LinkTabs from 'components/LinkTabs'
import PageHeaderCW1Lockbox from 'components/lockbox/PageHeaderCW1Lockbox'
import PageHeaderCW3 from 'components/lockbox/PageHeaderCW1Lockbox'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import { useInstantiateCW1LockboxForm } from 'hooks/useInstantiateCW1LockboxForm'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'
import { withMetadata } from 'utils/layout'

import { cw1LockboxLinkTabs } from '../../../../components/lockbox/LinkTabs.data'
import CreateLockbox from './components/CreateLockbox'
import InstantiateLockbox from './components/InstantiateLockbox'

const LockboxInstantiatePage: NextPage = () => {
  const form = useInstantiateCW1LockboxForm()
  const { formState, register, result, submitHandler } = form
  const [initResponse, setInitResponse] = useState<any>()
  const [initResponseFlag, setInitResponseFlag] = useState(false)
  const [initSpinnerFlag, setInitSpinnerFlag] = useState(false)

  const wallet = useWallet()
  const contract = useContracts().cw1Lockbox

  const instantiate = async (initMsg: Record<string, unknown>) => {
    setInitResponseFlag(false)
    try {
      if (!contract) {
        return toast.error('Smart contract connection failed.')
      }
      if (!wallet.initialized) {
        return toast.error('Oops! Need to connect your Keplr Wallet first.', {
          style: { maxWidth: 'none' },
        })
      }

      console.log(initMsg)
      setInitSpinnerFlag(true)
      const response = await contract.instantiate(
        725,
        initMsg,
        'Lockbox Test',
        wallet.address
      )
      setInitSpinnerFlag(false)
      setInitResponse(response)
      contract.updateContractAddress(response.contractAddress)
      toast.success('Lockbox contract instantiation successful.', {
        style: { maxWidth: 'none' },
      })
      setInitResponseFlag(true)
      console.log(response)
    } catch (error: any) {
      setInitSpinnerFlag(false)
      if (error.message.includes('invalid digit found')) {
        toast.error('Minimum time delay is too large for any practical use.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  const create = async (createMsg: Record<string, unknown>) => {
    setInitResponseFlag(false)
    try {
      if (!contract) {
        return toast.error('Smart contract connection failed.')
      }
      if (!wallet.initialized) {
        return toast.error('Oops! Need to connect your Keplr Wallet first.', {
          style: { maxWidth: 'none' },
        })
      }

      console.log(createMsg)
      setInitSpinnerFlag(true)
      const response = await contract.instantiate(
        725,
        createMsg,
        'Lockbox Test',
        wallet.address
      )
      setInitSpinnerFlag(false)
      setInitResponse(response)
      contract.updateContractAddress(response.contractAddress)
      toast.success('Lockbox contract instantiation successful.', {
        style: { maxWidth: 'none' },
      })
      setInitResponseFlag(true)
      console.log(response)
    } catch (error: any) {
      setInitSpinnerFlag(false)
      if (error.message.includes('invalid digit found')) {
        toast.error('Minimum time delay is too large for any practical use.', {
          style: { maxWidth: 'none' },
        })
      } else {
        toast.error(error.message, { style: { maxWidth: 'none' } })
      }
    }
  }

  return (
    <div>
      <form className="py-6 px-12 space-y-4">
        <NextSeo title="Instantiate Lockbox Contract" />

        <PageHeaderCW1Lockbox />

        <LinkTabs data={cw1LockboxLinkTabs} activeIndex={0} />
      </form>
      <InstantiateLockbox
        spinnerFlag={initSpinnerFlag}
        initFlag={initResponseFlag}
        initResponse={initResponse}
        function={instantiate}
      />
      <CreateLockbox
        spinnerFlag={initSpinnerFlag}
        initFlag={initResponseFlag}
        initResponse={initResponse}
        function={create}
      />
    </div>
  )
}

export default withMetadata(LockboxInstantiatePage, { center: false })
