import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Container,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    AppBar,
    Toolbar,
    Alert,
    Snackbar,
    Paper,
    Divider,
    Avatar,
    IconButton
} from '@mui/material';
import {
    AutoStories,
    Edit,
    Lock,
    Delete,
    ArrowBack,
    Save,
    Person,
    Mail,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

export default function Profile({ auth, mustVerifyEmail, status }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const profileForm = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'), {
            onSuccess: () => setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' }),
            onError: () => setSnackbar({ open: true, message: 'Error updating profile', severity: 'error' })
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.post(route('password.update'), {
            onSuccess: () => {
                passwordForm.reset();
                setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' });
            },
            onError: () => setSnackbar({ open: true, message: 'Error updating password', severity: 'error' })
        });
    };

    return (
        <>
            <Head title="Profile" />

            {/* Navigation Bar */}
            <AppBar position="static" sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            component={Link}
                            href={route('dashboard')}
                            variant="text"
                            size="small"
                            sx={{ color: 'white', minWidth: 'auto' }}
                        >
                            <ArrowBack sx={{ mr: 1 }} />
                            Back
                        </Button>
                        <AutoStories sx={{ fontSize: 32, color: 'white' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                            Profile Settings
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            component={Link}
                            href={route('dashboard')}
                            variant="outlined"
                            size="small"
                            sx={{ color: 'white', borderColor: 'white' }}
                        >
                            Dashboard
                        </Button>
                        <Button
                            component="button"
                            onClick={() => router.post(route('logout'))}
                            variant="text"
                            size="small"
                            sx={{ 
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box sx={{ 
                minHeight: '100vh', 
                backgroundColor: 'background.default',
                pt: 8,
                pb: 4
            }}>
                <Container maxWidth="md">
                    {/* Profile Header */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Avatar
                            sx={{ 
                                width: 80, 
                                height: 80, 
                                mx: 'auto', 
                                mb: 2,
                                backgroundColor: 'primary.main',
                                fontSize: '2rem'
                            }}
                        >
                            {auth.user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {auth.user.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                            {auth.user.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Role: {auth.user.role || 'User'}
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {/* Update Profile Information */}
                        <Grid item xs={12}>
                            <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Person sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: '600' }}>
                                            Profile Information
                                        </Typography>
                                    </Box>
                                    
                                    {status && (
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            {status}
                                        </Alert>
                                    )}

                                    <form onSubmit={updateProfile}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Name"
                                                    value={profileForm.data.name}
                                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                                    error={!!profileForm.errors.name}
                                                    helperText={profileForm.errors.name}
                                                    disabled={profileForm.processing}
                                                    InputProps={{
                                                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    type="email"
                                                    value={profileForm.data.email}
                                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                                    error={!!profileForm.errors.email}
                                                    helperText={profileForm.errors.email}
                                                    disabled={profileForm.processing}
                                                    InputProps={{
                                                        startAdornment: <Mail sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={profileForm.processing}
                                                    startIcon={<Save />}
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
                                                        }
                                                    }}
                                                >
                                                    {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Update Password */}
                        <Grid item xs={12}>
                            <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Lock sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: '600' }}>
                                            Update Password
                                        </Typography>
                                    </Box>

                                    <form onSubmit={updatePassword}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Current Password"
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    value={passwordForm.data.current_password}
                                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                    error={!!passwordForm.errors.current_password}
                                                    helperText={passwordForm.errors.current_password}
                                                    disabled={passwordForm.processing}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <IconButton
                                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                edge="end"
                                                            >
                                                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="New Password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={passwordForm.data.password}
                                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                    error={!!passwordForm.errors.password}
                                                    helperText={passwordForm.errors.password}
                                                    disabled={passwordForm.processing}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <IconButton
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Confirm Password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={passwordForm.data.password_confirmation}
                                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                    error={!!passwordForm.errors.password_confirmation}
                                                    helperText={passwordForm.errors.password_confirmation}
                                                    disabled={passwordForm.processing}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={passwordForm.processing}
                                                    startIcon={<Save />}
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
                                                        }
                                                    }}
                                                >
                                                    {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Delete Account */}
                        <Grid item xs={12}>
                            <Card sx={{ 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                border: '1px solid',
                                borderColor: 'error.light'
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Delete sx={{ mr: 2, color: 'error.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: '600', color: 'error.main' }}>
                                            Delete Account
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Once your account is deleted, all of its resources and data will be permanently deleted. 
                                        Before deleting your account, please download any data or information that you wish to retain.
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Delete />}
                                        component={Link}
                                        href={route('profile.destroy')}
                                        method="delete"
                                        as="button"
                                    >
                                        Delete Account
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
