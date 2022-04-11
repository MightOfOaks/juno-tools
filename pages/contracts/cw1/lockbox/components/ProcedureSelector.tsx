import clsx from 'clsx'
import { useContracts } from 'contexts/contracts'
import { useTheme } from 'contexts/theme'
import { useWallet } from 'contexts/wallet'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { isValidAddress } from '../../../../../utils/isValidAddress'
import Claim from './Claim'
import Reset from './Reset'

const ProcedureSelector = (props: {
  selectedProcedure: string
  contractAddress: string
}) => {
  const { selectedProcedure, contractAddress } = props
  const decode = (str: string): string =>
    Buffer.from(str, 'base64').toString('binary')

  const renderProcedure = () => {
    switch (selectedProcedure) {
      case 'claim':
        return <Claim contractAddress={contractAddress} />

      case 'deposit':
        return 'Deposit'
      //   <Deposit contractAddress={contractAddress}/>

      case 'reset':
        return <Reset contractAddress={contractAddress} />

      default:
        return null
    }
  }

  return <div>{renderProcedure()}</div>
}

export default ProcedureSelector
