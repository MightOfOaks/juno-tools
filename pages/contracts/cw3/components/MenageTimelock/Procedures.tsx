import React from 'react'
import ScheduleModal from './ScheduleModal'
import CancelExecuteModal from './CancelExecuteModal'
import RemoveAddProposerAdminModal from './RemoveAddProposerAdmin'
import UpdateDelayModal from './UpdateDelayModal'

const Prosedures = (props: {
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
            userType={'admin'}
            contractAddress={contractAddress}
          />
        )
      case 'add':
        return (
          <RemoveAddProposerAdminModal
            functionType="add"
            userType="proposer"
            contractAddress={contractAddress}
          />
        )
      case 'remove':
        return (
          <RemoveAddProposerAdminModal
            functionType={'remove'}
            userType={'proposer'}
            contractAddress={contractAddress}
          />
        )
      case 'min-delay':
        return <UpdateDelayModal contractAddress={contractAddress} />

      default:
        return <div> TEST </div>
    }
  }

  return <div className="w-1/2 ">{renderModal()}</div>
}

export default Prosedures
