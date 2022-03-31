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
        return <ScheduleModal />
      case 'cancel':
        return (
          <CancelExecuteModal
            functionType="cancel"
            contractAddress={contractAddress}
          />
        )
      case 'execute':
        return (
          <CancelExecuteModal
            functionType="execute"
            contractAddress={contractAddress}
          />
        )
      case 'revoke':
        return (
          <RemoveAddProposerAdminModal
            functionType={'revoke'}
            userType={'Admin'}
            contractAddress={contractAddress}
          />
        )
      case 'add':
        return (
          <RemoveAddProposerAdminModal
            functionType="add"
            userType="Proposer"
            contractAddress={contractAddress}
          />
        )
      case 'remove':
        return (
          <RemoveAddProposerAdminModal
            functionType={'remove'}
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
