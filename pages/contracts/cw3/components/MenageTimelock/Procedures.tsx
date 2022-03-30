import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from 'contexts/theme'
import ScheduleModal from './ScheduleModal'
import CancelExecuteModal from './CancelExecuteModal'
import RemoveAddProposerAdminModal from './RemoveAddProposerAdmin'

const Prosedures = () => {
  return (
    <div>
      <RemoveAddProposerAdminModal
        functionType={'remove'}
        userType={'proposer'}
        contractAddress={''}
      />
    </div>
  )
}

export default Prosedures
