const {firebase, admin} = require('./init');

async function createUser(user){
    /////////////////registration
    await admin.auth().createUser({
          email:user.email,
          emailVerified: false,
          password:user.password,
          displayName: user.name,
          disabled: false
    })
    await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    const newUser = await firebase.auth().currentUser
    ////////////send verification email
    await newUser.sendEmailVerification();
    signOut();
  }
  async function signIn(email, password){
        await firebase.auth().signInWithEmailAndPassword(email, password)
        const user =await firebase.auth().currentUser;
        const token = await user.getIdToken(true);
        if(!user.emailVerified){
          throw new Error("Email Not Verified");
        }
        
        signOut();
        return {
          token,
          name: user.displayName
        };
  }
  async function signOut(){
    try{
      await firebase.auth().signOut();
    }
    catch(e){
  
    }
  }
  async function resetPassword(email){
    await firebase.auth().sendPasswordResetEmail(email);
  }
  async function validateToken(token){
    const decoded = await admin.auth().verifyIdToken(token)
    return decoded;
  }
  async function getUser(email){
    const x =await admin.auth().getUserByEmail(email);
    return x;
  }
  module.exports = {
      getUser,
      createUser,
      validateToken,
      resetPassword,
      signIn,
      signOut
  
  }