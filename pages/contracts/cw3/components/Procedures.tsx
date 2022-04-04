import React from 'react'
import ScheduleModal from './ScheduleModal'
import CancelExecuteModal from './CancelExecuteModal'
import RemoveAddProposerAdminModal from './RemoveAddProposerAdmin'
import UpdateDelayModal from './UpdateDelayModal'

const Procedures = (props: {
  selectedModal: string
  contractAddress: string
}) => {
  const { selectedModal, contractAddress } = props

  const renderModal = () => {
    switch (selectedModal) {
      case 'schedule':
        return <ScheduleModal contractAddress={contractAddress} />
      case 'cancel':
        return (
          <CancelExecuteModal
            functionType="Cancel"
            contractAddress={contractAddress}
          />
        )
      case 'execute':
        return (
          <CancelExecuteModal
            functionType="Execute"
            contractAddress={contractAddress}
          />
        )
      case 'revoke':
        return (
          <RemoveAddProposerAdminModal
            functionType={'Revoke'}
            userType={'Admin'}
            contractAddress={contractAddress}
          />
        )
      case 'add':
        return (
          <RemoveAddProposerAdminModal
            functionType="Add"
            userType="Proposer"
            contractAddress={contractAddress}
          />
        )
      case 'remove':
        return (
          <RemoveAddProposerAdminModal
            functionType={'Remove'}
            userType={'Proposer'}
            contractAddress={contractAddress}
          />
        )
      case 'min-delay':
        return <UpdateDelayModal contractAddress={contractAddress} />

      default:
        return <div> TEST </div>
    }
  }

  return <div>{renderModal()}</div>
}

export default Procedures
