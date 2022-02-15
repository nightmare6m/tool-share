import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { gql, useMutation } from '@apollo/client';
import {useState} from 'react';
import Link from 'next/link'
import Router from 'next/router'

const SIGNUP = gql`
mutation Signup ($input: SignupInput!){
  signup(input: $input){
    message,
    errorCode
  }
}
`;

function SignUp() {
  const [signedUp, setSignedUp] = useState(false);
  const [signUp, { data, loading, error }] = useMutation(SIGNUP);
  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;
  
  if(typeof window !== "undefined" && localStorage.getItem('accessToken')){
    Router.push('/')
  }

  const form = (
    <div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const data = await signUp({ variables: { input: {email: e.target.email.value, password: e.target.password.value, name: e.target.newUserName.value }} });
          console.log(data)
          setSignedUp(true);
        }}>
      <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              type="text"
              id="newUserName"
              name="newUserName"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            </form>
      </div>
  );
  const signUpResult = (
    <div>
      <p>Thank you for registering. Please verify your email and then click 
        <Link href="/login"><a> here</a></Link> to login.</p>
    </div>
  )
    return (
      signedUp?signUpResult:form
    );
  }
  
  export default SignUp