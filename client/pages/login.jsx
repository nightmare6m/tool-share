import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const LOGIN = gql`
mutation Login ($input: LoginInput!){
  login(input: $input){
    message,
    errorCode,
    token,
    name
  }
}
`;

function Login() {
  const [login, { data, loading, error }] = useMutation(LOGIN);
  if(typeof window !== "undefined" && localStorage.getItem('accessToken')){
    Router.push('/')
  }
  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

    return (
      <div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const data = await login({ variables: { input: {email: e.target.email.value, password: e.target.password.value }} });
          localStorage.setItem('accessToken', data.data.login.token);
          Router.push('/');
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
              name="email"
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
              name="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            </form>
      </div>
    );
  }
  
  export default Login