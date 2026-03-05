import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Paper,
  Grow,
  Fade,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
   Visibility, 
   VisibilityOff, 
   Person, 
   Email, 
   Lock, 
   PersonAdd, 
   CheckCircle, 
   FlashOn,
   AccountCircle
  } from '@mui/icons-material';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'writer',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);

  useEffect(() => {
    setAnimateContent(true);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <>
      <Head title="Register" />

      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        {/* Split container */}
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            maxWidth: 1200,
            height: { xs: 'auto', md: 650 },
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'all 0.5s ease-in-out',
          }}
        >
          {/* Left panel: Registration form */}
          <Slide direction="left" in={animateContent} timeout={800}>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
                p: 4,
              }}
            >
              <Paper elevation={0} sx={{ width: '100%', maxWidth: 400 }}>
                <Fade in={animateContent} timeout={1200}>
                  <Box>
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{ fontWeight: 700, color: '#333', mb: 1 }}
                    >
                      Create Account
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#999', mb: 3 }}
                    >
                      Join us and start your journey today
                    </Typography>
                  </Box>
                </Fade>

                <form onSubmit={submit}>
                  {/* Name */}
                  <Grow in={animateContent} timeout={1000}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        border: '2px solid #e0e0e0',
                        borderRadius: 2,
                        p: 1.5,
                        mt: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
                        },
                        '&:focus-within': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        },
                      }}
                    >
                      <Person sx={{ color: '#667eea', mr: 1.5, fontSize: 24 }} />
                      <TextField
                        label="Name"
                        variant="standard"
                        fullWidth
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        InputProps={{
                          disableUnderline: true,
                        }}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontSize: '0.95rem',
                          },
                        }}
                      />
                    </Box>
                  </Grow>

                  {/* Email */}
                  <Grow in={animateContent} timeout={1100}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        border: '2px solid #e0e0e0',
                        borderRadius: 2,
                        p: 1.5,
                        mt: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
                        },
                        '&:focus-within': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        },
                      }}
                    >
                      <Email sx={{ color: '#667eea', mr: 1.5, fontSize: 24 }} />
                      <TextField
                        label="Email"
                        type="email"
                        variant="standard"
                        fullWidth
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        InputProps={{
                          disableUnderline: true,
                        }}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontSize: '0.95rem',
                          },
                        }}
                      />
                    </Box>
                  </Grow>

                  {/* Password */}
                  <Grow in={animateContent} timeout={1200}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        border: '2px solid #e0e0e0',
                        borderRadius: 2,
                        p: 1.5,
                        mt: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
                        },
                        '&:focus-within': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        },
                      }}
                    >
                      <Lock sx={{ color: '#667eea', mr: 1.5, fontSize: 24 }} />
                      <TextField
                        label="Password"
                        variant="standard"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        required
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: (
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{
                                color: '#667eea',
                                transition: 'all 0.2s ease',
                                '&:hover': { transform: 'scale(1.1)' },
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          ),
                        }}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontSize: '0.95rem',
                          },
                        }}
                      />
                    </Box>
                  </Grow>

                  {/* Confirm Password */}
                  <Grow in={animateContent} timeout={1400}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        border: '2px solid #e0e0e0',
                        borderRadius: 2,
                        p: 1.5,
                        mt: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
                        },
                        '&:focus-within': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        },
                      }}
                    >
                      <Lock sx={{ color: '#667eea', mr: 1.5, fontSize: 24 }} />
                      <TextField
                        label="Confirm Password"
                        variant="standard"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation}
                        required
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: (
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{
                                color: '#667eea',
                                transition: 'all 0.2s ease',
                                '&:hover': { transform: 'scale(1.1)' },
                              }}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          ),
                        }}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontSize: '0.95rem',
                          },
                        }}
                      />
                    </Box>
                  </Grow>

                  {/* Role */}
                  <Grow in={animateContent} timeout={1500}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        border: '2px solid #e0e0e0',
                        borderRadius: 2,
                        p: 1.5,
                        mt: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
                        },
                        '&:focus-within': {
                          borderColor: '#667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        },
                      }}
                    >
                      <PersonAdd sx={{ color: '#667eea', mr: 1.5, fontSize: 24 }} />
                      <FormControl fullWidth variant="standard">
                        <InputLabel
                          sx={{
                            color: '#666',
                            '&.Mui-focused': {
                              color: '#667eea',
                            },
                          }}
                        >
                          Role
                        </InputLabel>
                        <Select
                          value={data.role}
                          onChange={(e) => setData('role', e.target.value)}
                          error={!!errors.role}
                          sx={{
                            '& .MuiInputBase-input': {
                              fontSize: '0.95rem',
                            },
                            '&:before': {
                              borderBottom: 'none',
                            },
                            '&:after': {
                              borderBottom: 'none',
                            },
                          }}
                        >
                          <MenuItem value="writer">Writer</MenuItem>
                          <MenuItem value="editor">Editor</MenuItem>
                          <MenuItem value="student">Student/Reader</MenuItem>
                        </Select>
                        {errors.role && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                            {errors.role}
                          </Typography>
                        )}
                      </FormControl>
                    </Box>
                  </Grow>

                  {/* Submit Button */}
                  <Grow in={animateContent} timeout={1700}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 600,
                          py: 1,
                          px: 4,
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                          },
                          '&:disabled': {
                            opacity: 0.6,
                          },
                        }}
                        disabled={processing}
                      >
                        {processing ? 'Creating...' : 'Sign Up'}
                      </Button>
                    </Box>
                  </Grow>
                </form>
              </Paper>
            </Box>
          </Slide>

          {/* Right panel: Sign In message */}
          <Slide direction="right" in={animateContent} timeout={800}>
            <Box
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                p: 4,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -60,
                  left: -60,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
              />

              {/* Content */}
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Fade in={animateContent} timeout={1500}>
                  <Box>
                    <PersonAdd
                      sx={{
                        fontSize: 60,
                        mb: 2,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.1)' },
                          '100%': { transform: 'scale(1)' },
                        },
                      }}
                    />
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                      Welcome Back!
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 300,
                        lineHeight: 1.6,
                        mb: 3,
                        opacity: 0.95,
                      }}
                    >
                      Already have an account? Sign in to access your dashboard and continue your journey.
                    </Typography>

                    {/* Features list */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        my: 4,
                        textAlign: 'left',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ fontSize: 20 }} />
                        <Typography variant="body2">Account Verification</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FlashOn sx={{ fontSize: 20 }} />
                        <Typography variant="body2">Instant Access</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountCircle sx={{ fontSize: 20 }} />
                        <Typography variant="body2">Manage Your Profile</Typography>
                      </Box>
                    </Box>

                    <Grow in={animateContent} timeout={2000}>
                      <Link
                        href={route('login')}
                        style={{
                          textDecoration: 'none',
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            mt: 2,
                            bgcolor: 'white',
                            color: '#667eea',
                            fontWeight: 700,
                            py: 1.5,
                            px: 5,
                            borderRadius: 2,
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                              bgcolor: '#f5f5f5',
                            },
                          }}
                        >
                          Sign In
                        </Button>
                      </Link>
                    </Grow>
                  </Box>
                </Fade>
              </Box>
            </Box>
          </Slide>
        </Box>
      </Box>
    </>
  );
}
