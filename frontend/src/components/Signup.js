import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  Alert,
  IconButton,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

const providers = [{ id: 'credentials', name: 'Email, Username, and Password' }];

function CustomUsernameField() {
  return (
    <TextField
      id="username-field"
      label="Username"
      name="username"
      type="text"
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

function CustomEmailField() {
  return (
    <TextField
      id="email-field"
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
  const [showPassword, setShowPassword] = React.useState(false);

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
      Sign Up
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/Signin" variant="body2">
      Already have an account? Log In
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
  return <h2 style={{ marginBottom: 8 }}>Sign Up</h2>;
}

function Subtitle({ severity, message }) {
  return (
    <Alert sx={{ mb: 2, px: 1, py: 0.25 }} severity={severity}>
      {message}
    </Alert>
  );
}

function AgreeWithTerms() {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name="tandc"
          value="true"
          color="primary"
          sx={{ padding: 0.5, '& .MuiSvgIcon-root': { fontSize: 20 } }}
        />
      }
      slotProps={{
        typography: {
          fontSize: 14,
        },
      }}
      color="textSecondary"
      label="I agree with the T&C"
    />
  );
}

export default function Signup() {
  const theme = useTheme();

  const [subtitle, setSubtitle] = useState({
    severity: 'info', // Default severity
    message: 'Please fill out the form to sign up.',
  });

  const handleSignUp = async (provider, formData) => {
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const tandc = formData.get('tandc');

    try {
      const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubtitle({
          severity: 'success',
          message: `Account created successfully! Welcome, ${data.user.username}!`,
        });
      } else {
        setSubtitle({
          severity: 'error',
          message: data.message || 'Signup failed',
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
        signIn={handleSignUp}
        slots={{
          title: Title,
          subtitle: () => (
            <Subtitle severity={subtitle.severity} message={subtitle.message} />
          ),
          usernameField: CustomUsernameField,
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          signUpLink: SignUpLink,
          rememberMe: AgreeWithTerms,
          forgotPasswordLink: ForgotPasswordLink,
        }}
        providers={providers}
      />
    </AppProvider>
  );
}
