const formatError = function (error) {
    if (error.extensions && error.extensions.code === 'GRAPHQL_VALIDATION_FAILED') {
      return {
          errorCode: 400,
          message: "Input Validation Failed"
      }
    }
  
    return error
  }

module.exports = {
    formatError
}