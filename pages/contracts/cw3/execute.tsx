import LinkTabs from 'components/LinkTabs'
import PageHeaderCW3 from 'components/timelock/PageHeaderCW3'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { withMetadata } from 'utils/layout'

import { cw3LinkTabs } from '../../../components/timelock/LinkTabs.data'
import { useInstantiateCW3Form } from '../../../hooks/useInstantiateCW3Form'
import ManageTimelock from './components/ManageTimelock'

const ExecuteTab = () => {
  return (
    <form className="py-6 px-12 space-y-4">
      <NextSeo title="Execute actions for Timelock Contract" />
      <PageHeaderCW3 />
      <LinkTabs data={cw3LinkTabs} activeIndex={2} />

      <div className="w-full">
        <ManageTimelock />
      </div>
    </form>
  )
}

export default withMetadata(ExecuteTab, { center: false })
