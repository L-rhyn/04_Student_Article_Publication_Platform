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
    IconButton,
    Chip,
    Badge,
    Zoom,
    Fade,
    Slide,
    Grow,
    alpha
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
    VisibilityOff,
    Brush as BrushIcon,
    EmojiEmotions as EmojiIcon,
    Rocket as RocketIcon,
    Celebration as CelebrationIcon,
    Star as StarIcon,
    Forest as ForestIcon,
    Pets as PetsIcon,
    MusicNote as MusicIcon,
    Cake as CakeIcon,
    Home as HomeIcon,
    Dashboard as DashboardIcon,
    ThumbUp as ThumbUpIcon,
    Bookmark as BookmarkIcon,
    Comment as CommentIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';

export default function Profile({ auth, mustVerifyEmail, status }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [floatingIcons] = useState(() => {
        const icons = [
            <BrushIcon />, <PetsIcon />, <MusicIcon />, <StarIcon />,
            <ForestIcon />, <EmojiIcon />, <RocketIcon />, <CelebrationIcon />,
            <CakeIcon />
        ];
        return icons.map((icon, i) => ({
            icon,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 15,
            size: 15 + Math.random() * 25
        }));
    });

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
            onSuccess: () => setSnackbar({ open: true, message: '✨ Profile updated successfully!', severity: 'success' }),
            onError: () => setSnackbar({ open: true, message: '😓 Oops! Something went wrong', severity: 'error' })
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.post(route('password.update'), {
            onSuccess: () => {
                passwordForm.reset();
                setSnackbar({ open: true, message: '🔒 Password updated successfully!', severity: 'success' });
            },
            onError: () => setSnackbar({ open: true, message: '😓 Error updating password', severity: 'error' })
        });
    };

    // Cartoon color palette
    const colors = {
        primary: '#FF6B6B', // Coral red
        secondary: '#4ECDC4', // Turquoise
        accent: '#FFE66D', // Sunny yellow
        purple: '#9B6B9E',
        orange: '#FF9F1C',
        pink: '#FF8A80',
        green: '#6BAA6B',
        blue: '#6B8CFF',
        background: '#FFF9E6',
        surface: 'rgba(255, 255, 255, 0.95)',
        text: '#4A4A4A',
    };

    // Mock stats - replace with actual data from backend
    const userStats = {
        storiesRead: 42,
        commentsMade: 15,
        bookmarks: 7,
        likes: 23
    };

    return (
        <>
            <Head title="My Profile - Scribble" />

            {/* Floating Background Icons */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.1
            }}>
                {floatingIcons.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: 'absolute',
                            left: `${item.left}%`,
                            top: `${item.top}%`,
                            color: [colors.primary, colors.secondary, colors.accent, colors.purple][Math.floor(Math.random() * 4)],
                            fontSize: item.size,
                            animation: `float ${item.duration}s infinite ease-in-out`,
                            animationDelay: `${item.delay}s`,
                            '@keyframes float': {
                                '0%': { transform: 'translateY(0px) rotate(0deg)' },
                                '50%': { transform: 'translateY(-20px) rotate(10deg)' },
                                '100%': { transform: 'translateY(0px) rotate(0deg)' }
                            }
                        }}
                    >
                        {item.icon}
                    </Box>
                ))}
            </Box>

            {/* Navigation Bar */}
            <AppBar position="static" sx={{ 
                background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.blue} 100%)`,
                borderBottom: `4px solid ${colors.accent}`,
                boxShadow: `0 8px 0 ${alpha(colors.purple, 0.5)}`,
                height: 80,
                position: 'relative',
                zIndex: 10
            }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 80 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            component={Link}
                            href={route('dashboard')}
                            variant="text"
                            size="large"
                            startIcon={<ArrowBack />}
                            sx={{ 
                                color: 'white', 
                                minWidth: 'auto', 
                                fontSize: '1.1rem', 
                                py: 1,
                                bgcolor: alpha(colors.accent, 0.3),
                                borderRadius: 40,
                                px: 3,
                                fontFamily: '"Comic Sans MS", cursive',
                                '&:hover': {
                                    bgcolor: alpha(colors.accent, 0.5),
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            Back
                        </Button>
                        
                        <Box
                            sx={{
                                bgcolor: colors.accent,
                                borderRadius: '50%',
                                width: 50,
                                height: 50,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'bounce 2s infinite',
                                '@keyframes bounce': {
                                    '0%, 100%': { transform: 'translateY(0)' },
                                    '50%': { transform: 'translateY(-5px)' }
                                }
                            }}
                        >
                            <AutoStories sx={{ fontSize: 30, color: colors.purple }} />
                        </Box>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontFamily: '"Comic Sans MS", cursive',
                                fontWeight: 'bold', 
                                color: 'white', 
                                fontSize: '1.8rem',
                                textShadow: '3px 3px 0 rgba(0,0,0,0.2)'
                            }}
                        >
                            My Scribble Profile
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            component={Link}
                            href={route('dashboard')}
                            variant="outlined"
                            size="large"
                            startIcon={<DashboardIcon />}
                            sx={{ 
                                color: 'white', 
                                borderColor: colors.accent,
                                borderWidth: 3,
                                fontFamily: '"Comic Sans MS", cursive',
                                fontSize: '1rem',
                                py: 1,
                                px: 3,
                                borderRadius: 40,
                                '&:hover': {
                                    borderColor: 'white',
                                    bgcolor: alpha(colors.accent, 0.3),
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            Dashboard
                        </Button>
                        <Button
                            component="button"
                            onClick={() => router.post(route('logout'))}
                            variant="contained"
                            size="large"
                            startIcon={<RocketIcon />}
                            sx={{ 
                                bgcolor: colors.accent,
                                color: colors.purple,
                                fontFamily: '"Comic Sans MS", cursive',
                                fontSize: '1rem',
                                py: 1,
                                px: 3,
                                borderRadius: 40,
                                border: `3px solid white`,
                                '&:hover': {
                                    bgcolor: '#FFD93D',
                                    transform: 'scale(1.05)'
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
                background: `linear-gradient(135deg, ${colors.background} 0%, ${alpha(colors.accent, 0.1)} 100%)`,
                pt: 10,
                pb: 8,
                position: 'relative',
                zIndex: 5
            }}>
                <Container maxWidth="md">
                    {/* Profile Header */}
                    <Fade in timeout={1000}>
                        <Paper
                            sx={{
                                p: 4,
                                mb: 6,
                                borderRadius: 8,
                                background: `linear-gradient(135deg, ${alpha(colors.primary, 0.1)} 0%, ${alpha(colors.purple, 0.1)} 100%)`,
                                border: `4px solid ${colors.accent}`,
                                boxShadow: `8px 8px 0 ${alpha(colors.primary, 0.3)}`,
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Decorative elements */}
                            <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                                <StarIcon sx={{ fontSize: 100, color: colors.primary }} />
                            </Box>
                            <Box sx={{ position: 'absolute', bottom: -20, left: -20, opacity: 0.1 }}>
                                <CelebrationIcon sx={{ fontSize: 100, color: colors.blue }} />
                            </Box>

                            <Zoom in timeout={1200}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={
                                        <Box
                                            sx={{
                                                bgcolor: colors.accent,
                                                borderRadius: '50%',
                                                width: 40,
                                                height: 40,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '3px solid white',
                                                animation: 'pulse 2s infinite',
                                                '@keyframes pulse': {
                                                    '0%': { transform: 'scale(1)' },
                                                    '50%': { transform: 'scale(1.1)' },
                                                    '100%': { transform: 'scale(1)' }
                                                }
                                            }}
                                        >
                                            <Edit sx={{ fontSize: 20, color: colors.purple }} />
                                        </Box>
                                    }
                                >
                                    <Avatar
                                        sx={{ 
                                            width: 120, 
                                            height: 120, 
                                            mx: 'auto', 
                                            mb: 2,
                                            bgcolor: colors.blue,
                                            fontSize: '3rem',
                                            border: `4px solid ${colors.accent}`,
                                            boxShadow: `6px 6px 0 ${colors.primary}`,
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05) rotate(5deg)'
                                            }
                                        }}
                                    >
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Badge>
                            </Zoom>

                            <Typography 
                                variant="h3" 
                                sx={{ 
                                    fontFamily: '"Comic Sans MS", cursive',
                                    fontWeight: 'bold', 
                                    color: colors.primary,
                                    mb: 1,
                                    textShadow: `3px 3px 0 ${alpha(colors.primary, 0.3)}`
                                }}
                            >
                                {auth.user.name}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                                <Chip
                                    icon={<Mail sx={{ fontSize: 16 }} />}
                                    label={auth.user.email}
                                    sx={{
                                        bgcolor: 'white',
                                        color: colors.text,
                                        fontFamily: '"Comic Sans MS", cursive',
                                        border: `2px solid ${colors.secondary}`,
                                        '&:hover': {
                                            bgcolor: alpha(colors.secondary, 0.1)
                                        }
                                    }}
                                />
                                <Chip
                                    icon={<Person sx={{ fontSize: 16 }} />}
                                    label={`Role: ${auth.user.role || 'Scribble Explorer'}`}
                                    sx={{
                                        bgcolor: colors.secondary,
                                        color: 'white',
                                        fontFamily: '"Comic Sans MS", cursive',
                                        border: `2px solid ${colors.accent}`,
                                        '&:hover': {
                                            bgcolor: colors.blue
                                        }
                                    }}
                                />
                            </Box>

                            {/* Stats Cards */}
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ 
                                        p: 2, 
                                        textAlign: 'center',
                                        bgcolor: alpha(colors.blue, 0.1),
                                        borderRadius: 4,
                                        border: `2px solid ${colors.blue}`,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            bgcolor: alpha(colors.blue, 0.2)
                                        }
                                    }}>
                                        <BookmarkIcon sx={{ color: colors.blue, fontSize: 30 }} />
                                        <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', color: colors.blue }}>
                                            {userStats.storiesRead}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                            Stories Read
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ 
                                        p: 2, 
                                        textAlign: 'center',
                                        bgcolor: alpha(colors.green, 0.1),
                                        borderRadius: 4,
                                        border: `2px solid ${colors.green}`,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            bgcolor: alpha(colors.green, 0.2)
                                        }
                                    }}>
                                        <CommentIcon sx={{ color: colors.green, fontSize: 30 }} />
                                        <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', color: colors.green }}>
                                            {userStats.commentsMade}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                            Comments
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ 
                                        p: 2, 
                                        textAlign: 'center',
                                        bgcolor: alpha(colors.orange, 0.1),
                                        borderRadius: 4,
                                        border: `2px solid ${colors.orange}`,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            bgcolor: alpha(colors.orange, 0.2)
                                        }
                                    }}>
                                        <BookmarkIcon sx={{ color: colors.orange, fontSize: 30 }} />
                                        <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', color: colors.orange }}>
                                            {userStats.bookmarks}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                            Bookmarks
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ 
                                        p: 2, 
                                        textAlign: 'center',
                                        bgcolor: alpha(colors.primary, 0.1),
                                        borderRadius: 4,
                                        border: `2px solid ${colors.primary}`,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            bgcolor: alpha(colors.primary, 0.2)
                                        }
                                    }}>
                                        <ThumbUpIcon sx={{ color: colors.primary, fontSize: 30 }} />
                                        <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', color: colors.primary }}>
                                            {userStats.likes}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                            Likes Given
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Fade>

                    <Grid container spacing={4}>
                        {/* Update Profile Information */}
                        <Grid item xs={12}>
                            <Slide in timeout={800} direction="up">
                                <Card sx={{ 
                                    borderRadius: 8,
                                    border: `4px solid ${colors.blue}`,
                                    boxShadow: `8px 8px 0 ${alpha(colors.blue, 0.5)}`,
                                    bgcolor: 'white',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                            <Box
                                                sx={{
                                                    bgcolor: colors.blue,
                                                    borderRadius: '50%',
                                                    width: 50,
                                                    height: 50,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                    animation: 'spin 10s infinite linear',
                                                    '@keyframes spin': {
                                                        '0%': { transform: 'rotate(0deg)' },
                                                        '100%': { transform: 'rotate(360deg)' }
                                                    }
                                                }}
                                            >
                                                <Person sx={{ color: 'white', fontSize: 30 }} />
                                            </Box>
                                            <Typography 
                                                variant="h5" 
                                                sx={{ 
                                                    fontFamily: '"Comic Sans MS", cursive',
                                                    fontWeight: 'bold',
                                                    color: colors.blue
                                                }}
                                            >
                                                Tell Us About Yourself ✨
                                            </Typography>
                                        </Box>
                                        
                                        {status && (
                                            <Grow in timeout={500}>
                                                <Alert 
                                                    severity="info" 
                                                    sx={{ 
                                                        mb: 3, 
                                                        borderRadius: 4,
                                                        border: `2px solid ${colors.blue}`,
                                                        fontFamily: '"Comic Sans MS", cursive',
                                                        bgcolor: alpha(colors.blue, 0.1)
                                                    }}
                                                    icon={<CelebrationIcon />}
                                                >
                                                    {status}
                                                </Alert>
                                            </Grow>
                                        )}

                                        <form onSubmit={updateProfile}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Your Name"
                                                        placeholder="Enter your name"
                                                        value={profileForm.data.name}
                                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                                        error={!!profileForm.errors.name}
                                                        helperText={profileForm.errors.name}
                                                        disabled={profileForm.processing}
                                                        
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Email Address"
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={profileForm.data.email}
                                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                                        error={!!profileForm.errors.email}
                                                        helperText={profileForm.errors.email}
                                                        disabled={profileForm.processing}
                                                        
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        disabled={profileForm.processing}
                                                        startIcon={<Save />}
                                                        sx={{
                                                            bgcolor: colors.blue,
                                                            color: 'white',
                                                            fontFamily: '"Comic Sans MS", cursive',
                                                            fontSize: '1.1rem',
                                                            py: 1.5,
                                                            px: 4,
                                                            borderRadius: 40,
                                                            border: `3px solid ${colors.accent}`,
                                                            '&:hover': {
                                                                bgcolor: '#5A7DFF',
                                                                transform: 'scale(1.05)'
                                                            },
                                                            '&:disabled': {
                                                                bgcolor: alpha(colors.blue, 0.5)
                                                            }
                                                        }}
                                                    >
                                                        {profileForm.processing ? 'Saving...' : 'Save Changes ✨'}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </CardContent>
                                </Card>
                            </Slide>
                        </Grid>

                        {/* Update Password */}
                        <Grid item xs={12}>
                            <Slide in timeout={1000} direction="up">
                                <Card sx={{ 
                                    borderRadius: 8,
                                    border: `4px solid ${colors.orange}`,
                                    boxShadow: `8px 8px 0 ${alpha(colors.orange, 0.5)}`,
                                    bgcolor: 'white',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                            <Box
                                                sx={{
                                                    bgcolor: colors.orange,
                                                    borderRadius: '50%',
                                                    width: 50,
                                                    height: 50,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                    animation: 'pulse 2s infinite'
                                                }}
                                            >
                                                <Lock sx={{ color: 'white', fontSize: 30 }} />
                                            </Box>
                                            <Typography 
                                                variant="h5" 
                                                sx={{ 
                                                    fontFamily: '"Comic Sans MS", cursive',
                                                    fontWeight: 'bold',
                                                    color: colors.orange
                                                }}
                                            >
                                                Change Your Secret Password 🔒
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
                                                            bgcolor: colors.orange,
                                                            color: 'white',
                                                            fontFamily: '"Comic Sans MS", cursive',
                                                            fontSize: '1.1rem',
                                                            py: 1.5,
                                                            px: 4,
                                                            borderRadius: 40,
                                                            border: `3px solid ${colors.accent}`,
                                                            '&:hover': {
                                                                bgcolor: '#F97316',
                                                                transform: 'scale(1.05)'
                                                            },
                                                            '&:disabled': {
                                                                bgcolor: alpha(colors.orange, 0.5)
                                                            }
                                                        }}
                                                    >
                                                        {passwordForm.processing ? 'Updating...' : 'Update Password 🔒'}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </CardContent>
                                </Card>
                            </Slide>
                        </Grid>

                        {/* Delete Account */}
                        <Grid item xs={12}>
                            <Slide in timeout={1200} direction="up">
                                <Card sx={{ 
                                    borderRadius: 8,
                                    border: `4px solid ${colors.primary}`,
                                    boxShadow: `8px 8px 0 ${alpha(colors.primary, 0.5)}`,
                                    bgcolor: 'white'
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                            <Box
                                                sx={{
                                                    bgcolor: colors.primary,
                                                    borderRadius: '50%',
                                                    width: 50,
                                                    height: 50,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2
                                                }}
                                            >
                                                <Delete sx={{ color: 'white', fontSize: 30 }} />
                                            </Box>
                                            <Typography 
                                                variant="h5" 
                                                sx={{ 
                                                    fontFamily: '"Comic Sans MS", cursive',
                                                    fontWeight: 'bold',
                                                    color: colors.primary
                                                }}
                                            >
                                                Delete Account ⚠️
                                            </Typography>
                                        </Box>
                                        
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                mb: 3,
                                                fontFamily: '"Comic Sans MS", cursive',
                                                color: colors.text,
                                                bgcolor: alpha(colors.primary, 0.1),
                                                p: 2,
                                                borderRadius: 4,
                                                border: `2px dashed ${colors.primary}`
                                            }}
                                        >
                                            Once your account is deleted, all of your stories and comments will be gone forever. 
                                            Make sure you've saved anything important before saying goodbye! 😢
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<Delete />}
                                            component={Link}
                                            href={route('profile.destroy')}
                                            method="delete"
                                            as="button"
                                            sx={{
                                                bgcolor: colors.primary,
                                                fontFamily: '"Comic Sans MS", cursive',
                                                fontSize: '1.1rem',
                                                py: 1.5,
                                                px: 4,
                                                borderRadius: 40,
                                                border: `3px solid ${colors.accent}`,
                                                '&:hover': {
                                                    bgcolor: '#D32F2F',
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                        >
                                            Delete My Account
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Slide>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    icon={snackbar.severity === 'success' ? <CelebrationIcon /> : <EmojiIcon />}
                    sx={{ 
                        width: '100%', 
                        fontFamily: '"Comic Sans MS", cursive',
                        fontSize: '1rem',
                        borderRadius: 4,
                        border: `2px solid ${snackbar.severity === 'success' ? colors.green : colors.primary}`
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Back to Top Button */}
            <IconButton
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    bgcolor: colors.accent,
                    color: colors.purple,
                    width: 56,
                    height: 56,
                    border: `3px solid ${colors.secondary}`,
                    '&:hover': {
                        bgcolor: colors.orange,
                        color: 'white',
                        transform: 'scale(1.1) rotate(360deg)'
                    },
                    transition: 'all 0.5s ease',
                    zIndex: 1200
                }}
            >
                <RocketIcon />
            </IconButton>
        </>
    );
}