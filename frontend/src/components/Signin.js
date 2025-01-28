import React, { useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  Alert,
  IconButton,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
const providers = [{ id: 'credentials', name: 'Email and Password' }];

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Log In
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/Signup" variant="body2">
      Sign up
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/forgot-password" variant="body2">
      Forgot password?
    </Link>
  );
}

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Login</h2>;
}

function Subtitle({ severity, message }) {
  return (
    <Alert sx={{ mb: 2, px: 1, py: 0.25 }} severity={severity}>
      {message}
    </Alert>
  );
}

function RoleSelect() {
  const [role, setRole] = useState('');

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <Box sx={{ my: 2, minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="role-select-label">Role</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          value={role}
          name="role"
          label="Role"
          onChange={handleChange}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default function Signin() {
  const theme = useTheme();

  const [subtitle, setSubtitle] = useState({
    severity: 'info', // Default severity
    message: 'Please log in',
  });

  const handleSignIn = async (provider, formData) => {
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');

    try {
      const response = await fetch(
        role === 'user'
          ? 'http://localhost:8000/api/users/login'
          : 'http://localhost:8000/api/users/loginAdmin',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role }),
        }
      );

      console.log();

      const data = await response.json();
      console.log(data.message);
      
      
      if (response.ok) {
        setSubtitle({
          severity: 'success',
          message: `Welcome back, ${data.user.username}!`,
        });
        localStorage.setItem("token",data.token);
        localStorage.setItem("username",data.user.username);
        localStorage.setItem("role",data.Role);
        setTimeout(() => {
          if(data.Role=="User"){
            window.location.href = "/user";
          }
          else{
          window.location.href = 'http://localhost:3000';
          }
        }, 1500);
      } else if(response!==response.ok) {
        console.log("asdfihadnfc");
        setSubtitle({
          severity: 'error',
          message: data.message || 'Login failed',
        });
      }
    } catch (error) {
      setSubtitle({
        severity: 'error',
        message: 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={handleSignIn}
        slots={{
          title: Title,
          subtitle: () => (
            <Subtitle severity={subtitle.severity} message={subtitle.message} />
          ),
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          signUpLink: SignUpLink,
          rememberMe: RoleSelect,
          forgotPasswordLink: ForgotPasswordLink,
        }}
        providers={providers}
      />
    </AppProvider>
  );
}
