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
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { FaAsterisk } from 'react-icons/fa'
import { withMetadata } from 'utils/layout'

import { cw3LinkTabs } from '../../../components/timelock/LinkTabs.data'
import { useInstantiateCW3Form } from '../../../hooks/useInstantiateCW3Form'

const delayUnits: { id: number; time: string }[] = [
  { id: 1, time: 'seconds' },
  { id: 2, time: 'minutes' },
  { id: 3, time: 'hours' },
  { id: 4, time: 'days' },
]
const TimeLockInstantiatePage: NextPage = () => {
  const form = useInstantiateCW3Form()
  const { formState, register, result, submitHandler } = form
  const [minDelayUnit, setMinDelayUnit] = useState<string>('seconds')

  return (
    <form className="py-6 px-12 space-y-4" onSubmit={submitHandler}>
      <NextSeo title="Instantiate CW20 Token" />

      <PageHeaderCW3 />

      <LinkTabs data={cw3LinkTabs} activeIndex={0} />

      <Conditional test={result != null}>
        <Alert type="info">
          <b>Instantiate success!</b> Here is the transaction result containing
          the contract address and the transaction hash.
        </Alert>
        <JsonPreview title="Transaction Result" content={result} />
        <br />
      </Conditional>

      <FormGroup
        title="Timelock Details"
        subtitle="Basic information about your new timelock"
      >
        <FormControl title="Min Delay" htmlId="min-delay" isRequired>
          <Input
            id="minDelay"
            type="text"
            placeholder="Minimum Delay"
            required
            {...register('minDelay', {
              required: true,
            })}
          />
        </FormControl>

        <FormControl title="Min Delay Unit" htmlId="delay-unit-select">
          <select
            id="delay-unit-select"
            className={clsx(
              'bg-white/10 rounded border-2 border-white/20 form-select',
              'placeholder:text-white/50',
              'focus:ring focus:ring-plumbus-20'
            )}
            {...register('minDelayUnit', {
              required: true,
            })}
          >
            {delayUnits.map((element) => (
              <option key={element.id}>{element.time}</option>
            ))}
          </select>
        </FormControl>

        <FormControl title="Admins" htmlId="admins" isRequired>
          <Input
            id="admins"
            type="text"
            placeholder="Admin Address"
            required
            {...register('admins', {
              required: true,
              setValueAs: (val: string) => val.toUpperCase(),
            })}
          />
        </FormControl>
        <FormControl title="Proposers" htmlId="proposers" isRequired>
          <Input
            id="proposers"
            type="text"
            placeholder="Proposer Address"
            required
            {...register('proposers', {
              required: true,
              valueAsNumber: true,
            })}
          />
        </FormControl>
      </FormGroup>

      <div className="flex justify-end p-4">
        <Button
          isLoading={formState.isSubmitting}
          isWide
          rightIcon={<FaAsterisk />}
          type="submit"
        >
          Instantiate Contract
        </Button>
      </div>
    </form>
  )
}

export default withMetadata(TimeLockInstantiatePage, { center: false })
