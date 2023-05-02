function generateErrorResponse(err) {
  const msg = {
    error: {
      code: 500 || err.code,
      title: 'Error' || err.title,
      message: 'Internal server error' || err.message
    }
  };
  console.log(err)
  return msg
}

module.exports = { generateErrorResponse }