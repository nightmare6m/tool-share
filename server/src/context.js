const Auth = require('./firebase/auth');

const context = async ({ req }) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
      return {};
    }
    const accessToken = authHeader.split("Bearer ")[1];
    if(!accessToken){
      return {};
    }
    try{
      const currentUser = await Auth.validateToken(accessToken);
        return {
        currentUser
        };
    }
    catch(e){
      return {};
    }
    
  }

module.exports = {
    context
}