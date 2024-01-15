const { sendMessage, receiveMessage } = require('../')
const {
  grantRequestQueueAddressSf,
  grantRequestQueueAddressSnd,
  grantRequestQueueAddressSn,
  grantRequestQueueAddressPega,
  fetchGrantRequestMsgType,
  fetchApplicationRequestMsgType,
  grantResponseQueueAddressSf,
  grantResponseQueueAddressSnd,
  grantResponseQueueAddressSn,
  grantResponseQueueAddressPega
} = require('../../config/messaging.js')

async function getGrants(sessionId, msgQueueSuffix, userData, grantID = null) {
  console.log('[MADE IT TO MESSAGE]', getGrantReqResQueueAddress(msgQueueSuffix), 'PPPPPPPPPPP')
  const msgBody = grantID ? { grantID: grantID } : userData
  const getMsgType = grantID ? fetchApplicationRequestMsgType : fetchGrantRequestMsgType
  const { grantRequestQueueAddress, grantResponseQueueAddress } = getGrantReqResQueueAddress(msgQueueSuffix)
  
  await sendMessage(msgBody, getMsgType, grantRequestQueueAddress , { sessionId })
  console.log('[FINISHED SENDING MESSAGE MOVING TO RECEIVING]')
  return receiveMessage(sessionId, grantResponseQueueAddress)
}

async function grantSubmitted(msgQueueSuffix, msgBody) {
  console.log('[MADE IT TO MESSAGE Submitted]')
  console.log(msgBody, 'MMMMMMMM')
  
  const {grantRequestQueueAddress }= getGrantReqResQueueAddress(msgQueueSuffix)
  await sendMessage(msgBody, fetchCostRequestMsgType, grantRequestQueueAddress)
  console.log('[FINISHED SENDING GRANT SUBMITTED]')
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
  getGrants,
  grantSubmitted
}
