import { coin } from '@cosmjs/proto-signing'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import { useState } from 'react'
import toast from 'react-hot-toast'

//import {
//   MAINNET_CW1_SUBKEYS_CODE_ID,
//   TESTNET_CW1_SUBKEYS_CODE_ID,
// } from 'utils/constants'

const CW3Timelock = () => {
  const wallet = useWallet()
  const contract = useContracts().cw3Timelock
  const cw20contract = useContracts().cw20Base

  const [txResponse, setTxResponse] = useState<any>()

  const instantiate = async () => {
    try {
      if (!contract) {
        return toast.error('Smart contract connection failed.')
      }
      const response = await contract.instantiate(
        626,
        {
          admins: [
            'juno1smz9wdg5v7wywquyy7zn7ujvu54kuumwzw5ss8',
            'juno1dc5yv2w2plccmxxh6szden8kqkshqjgkeqkg74',
            'juno169rrmm8vkdhaalaq7pgpl2xy7qx338h0pmpm8t',
          ],
          proposers: [
            'juno1smz9wdg5v7wywquyy7zn7ujvu54kuumwzw5ss8',
            'juno1dc5yv2w2plccmxxh6szden8kqkshqjgkeqkg74',
            'juno169rrmm8vkdhaalaq7pgpl2xy7qx338h0pmpm8t',
          ],
          min_delay: '10000000000',
        },
        'Timelock Test',
        wallet.address
      )

      console.log(response)
    } catch (error: any) {
      toast.error(error.message, { style: { maxWidth: 'none' } })
    }
  }

  const query = async () => {
    try {
      const CONTRACT_ADDRESS =
        'juno17cjuw3a25qwd5ms6ty2f8jrtecx88du08k0w2480quuupqncu4sq646kmh'

      const client = contract?.use(CONTRACT_ADDRESS)
      const response = await client?.getAdmins()
      console.log('getAdmins', response)

      const response2 = await client?.getOperations()
      console.log('getOperations', response2)

      const response3 = await client?.getMinDelay()
      console.log('getMinDelay', response3)

      let operationId = 5
      const response4 = await client?.getExecutionTime(operationId)
      console.log('getExecutionTime', response4)

      const response5 = await client?.getOperationStatus(operationId)
      console.log('getOperation', response5)
    } catch (error: any) {
      toast.error(error.message, { style: { maxWidth: 'none' } })
    }
  }

  const execute = async () => {
    try {
      const client = contract?.use(
        'juno17cjuw3a25qwd5ms6ty2f8jrtecx88du08k0w2480quuupqncu4sq646kmh'
      )
      //console.log(client)

      const cw20client = cw20contract?.use(
        'juno1syzle8llhh4sp2dzymn0zeuh7zq0c7eq83edt04w6ha0n7620p7q2jnpzy'
      )
    } catch (error: any) {
      toast.error(error.message, { style: { maxWidth: 'none' } })
    }
  }

  return (
    <div>
      <div className="flex flex-col">
        <button className="p-3 bg-red-400 rounded-lg" onClick={instantiate}>
          Click to Instantiate
        </button>
        <button className="p-3 bg-blue-400 rounded-lg" onClick={query}>
          Click to Query
        </button>
        <button className="p-3 bg-green-400 rounded-lg" onClick={execute}>
          Click to Execute
        </button>

        <div>{JSON.stringify(txResponse)}</div>
      </div>
    </div>
  )
}

export default CW3Timelock
