import clsx from 'clsx'
import Alert from 'components/Alert'
import Button from 'components/Button'
import Conditional from 'components/Conditional'
import FormControl from 'components/FormControl'
import FormGroup from 'components/FormGroup'
import Input from 'components/Input'
import JsonPreview from 'components/JsonPreview'
import LinkTabs from 'components/LinkTabs'
import PageHeaderCW3 from 'components/timelock/PageHeaderCW3'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'
import { withMetadata } from 'utils/layout'

import { cw3LinkTabs } from '../../../components/timelock/LinkTabs.data'
import { useInstantiateCW3Form } from '../../../hooks/useInstantiateCW3Form'
import InstantiateTimelock from './components/InstantiateTimelock'

const TimeLockInstantiatePage: NextPage = () => {
  const form = useInstantiateCW3Form()
  const { formState, register, result, submitHandler } = form
  const [minDelayUnit, setMinDelayUnit] = useState<string>('seconds')
  const [initResponse, setInitResponse] = useState<any>()
  const [initResponseFlag, setInitResponseFlag] = useState(false)
  const [initSpinnerFlag, setInitSpinnerFlag] = useState(false)

  const wallet = useWallet()
  const contract = useContracts().cw3Timelock

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
        702,
        initMsg,
        'Timelock Test',
        wallet.address
      )
      setInitSpinnerFlag(false)
      setInitResponse(response)
      toast.success('Timelock contract instantiation successful.', {
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
        <NextSeo title="Instantiate Timelock Contract" />

        <PageHeaderCW3 />

        <LinkTabs data={cw3LinkTabs} activeIndex={0} />
      </form>
      <InstantiateTimelock
        spinnerFlag={initSpinnerFlag}
        initFlag={initResponseFlag}
        initResponse={initResponse}
        function={instantiate}
      />
    </div>
  )
}

export default withMetadata(TimeLockInstantiatePage, { center: false })