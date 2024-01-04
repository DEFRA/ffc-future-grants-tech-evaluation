const { sendMessage, receiveMessage } = require('../')
const {
  grantRequestQueueAddressSf,
  grantRequestQueueAddressSnd,
  fetchCostRequestMsgType,
  grantResponseQueueAddressSf,
  grantResponseQueueAddressSnd
} = require('../../config/messaging.js')

async function getGrants(sessionId, msgQueueSuffix) {
  console.log('[MADE IT TO MESSAGE]', sessionId, getGrantReqResQueueAddress(msgQueueSuffix), 'PPPPPPPPPPP')
  const {grantRequestQueueAddress, grantResponseQueueAddress }= getGrantReqResQueueAddress(msgQueueSuffix)
  await sendMessage({ userID: 'Farmer Giles' }, fetchCostRequestMsgType, grantRequestQueueAddress , { sessionId })

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
  }
  return {grantRequestQueueAddress: grantRequestQueueAddress, grantResponseQueueAddress: grantResponseQueueAddress }
  
}

module.exports = {
  getGrants
}
