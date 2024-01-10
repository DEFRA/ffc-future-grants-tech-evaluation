const { sendMessage, receiveMessage } = require('../')
const {
  grantRequestQueueAddressSf,
  grantRequestQueueAddressSnd,
  grantRequestQueueAddressSn,
  grantRequestQueueAddressPega,
  fetchCostRequestMsgType,
  grantResponseQueueAddressSf,
  grantResponseQueueAddressSnd,
  grantResponseQueueAddressSn,
  grantResponseQueueAddressPega
} = require('../../config/messaging.js')

async function getGrants(sessionId, msgQueueSuffix, grantID = null) {
  console.log('[MADE IT TO MESSAGE]', sessionId, getGrantReqResQueueAddress(msgQueueSuffix), 'PPPPPPPPPPP')
  const msgBody = grantID ? { grantID: grantID } : { userID: 'Farmer Giles' }
  console.log(msgBody,'MMMMMMMM')
  const {grantRequestQueueAddress, grantResponseQueueAddress }= getGrantReqResQueueAddress(msgQueueSuffix)
  await sendMessage(msgBody, fetchCostRequestMsgType, grantRequestQueueAddress , { sessionId })

  console.log('[FINISHED SENDING MESSAGE MOVING TO RECEIVING]')
  return receiveMessage(sessionId, grantResponseQueueAddress)
}

const getGrantReqResQueueAddress = (msgQueueSuffix) => {
  let grantRequestQueueAddress
  let grantResponseQueueAddress
  switch (msgQueueSuffix) {
    case 'Sf':
      grantRequestQueueAddress = grantRequestQueueAddressSf
      grantResponseQueueAddress = grantResponseQueueAddressSf
      break
    case 'Snd':
      grantRequestQueueAddress = grantRequestQueueAddressSnd
      grantResponseQueueAddress = grantResponseQueueAddressSnd
      break
      case 'Sn':
        grantRequestQueueAddress = grantRequestQueueAddressSn
        grantResponseQueueAddress = grantResponseQueueAddressSn
      break
      case 'Pega':
        grantRequestQueueAddress = grantRequestQueueAddressPega
        grantResponseQueueAddress = grantResponseQueueAddressPega
        break
  }
  return {grantRequestQueueAddress: grantRequestQueueAddress, grantResponseQueueAddress: grantResponseQueueAddress }
  
}

module.exports = {
  getGrants
}
