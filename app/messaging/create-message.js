const createMessage = (body, type, options) => {
  return {
    body,
    type,
    source: 'ffc-grants-slurry-web',
    ...options
  }
}

module.exports = createMessage
