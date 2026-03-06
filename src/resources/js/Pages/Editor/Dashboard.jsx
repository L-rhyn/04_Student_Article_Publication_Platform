import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Chip,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Fade,
    Select,
    MenuItem,
    Menu,
    Avatar,
    IconButton,
    Divider,
    Badge,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HomeIcon from '@mui/icons-material/Home';
import { Inertia } from '@inertiajs/inertia';
import ReviewsIcon from '@mui/icons-material/Reviews';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DashboardIcon from '@mui/icons-material/Dashboard';

const STATUS_COLORS = {
    submitted: { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' },
    needs_revision: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    published: { bg: '#e3f2fd', text: '#00b4d8', border: '#b3e5fc' },
};

const DRAWER_WIDTH = 280;
const THEME = {
    primary: '#00b4d8',
    success: '#16a34a',
    warning: '#ea580c',
    surface: 'rgba(255, 255, 255, 0.95)',
    secondary: '#0077b6',
    dark: '#03045e',
};

export default function Dashboard({ pending, published, categories: serverCategories, auth, notifications }) {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [readNotifications, setReadNotifications] = useState(new Set());
    const [categories] = useState(serverCategories && serverCategories.length > 0 ? serverCategories : []);

    // Calculate unread notifications count
    const unreadCount = notifications?.filter(n => !readNotifications.has(n.id)).length || 0;

    const handleReview = (articleId) => {
        Inertia.get(route('editor.articles.review', articleId));
    };

    const renderMainContent = () => {
        switch (activeNav) {
            case 'dashboard':
                return (
                    <Fade in={activeNav === 'dashboard'}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                    Editor Dashboard
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                    Overview of articles and review statistics
                                </Typography>
                            </Box>

                            {/* Statistics Cards */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ 
                                        borderRadius: '12px', 
                                        background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                                        border: '1px solid #fb923c'
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <HourglassEmptyIcon sx={{ fontSize: 32, color: '#ea580c', mr: 2 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ea580c' }}>
                                                    Pending Review
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#7c2d12', mb: 1 }}>
                                                {pending.length}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#9a3412' }}>
                                                article{pending.length !== 1 ? 's' : ''} awaiting review
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => setActiveNav('pending')}
                                                sx={{ 
                                                    mt: 2,
                                                    background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #c2410c 0%, #9a3412 100%)'
                                                    }
                                                }}
                                            >
                                                Review Articles
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card sx={{ 
                                        borderRadius: '12px', 
                                        background: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)',
                                        border: '1px solid #4ade80'
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <PublishedWithChangesIcon sx={{ fontSize: 32, color: '#16a34a', mr: 2 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#16a34a' }}>
                                                    Published Articles
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#14532d', mb: 1 }}>
                                                {published.length}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#166534' }}>
                                                article{published.length !== 1 ? 's' : ''} published
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => setActiveNav('published')}
                                                sx={{ 
                                                    mt: 2,
                                                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)'
                                                    }
                                                }}
                                            >
                                                View Published
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Quick Actions */}
                            <Card sx={{ borderRadius: '12px', border: '1px solid #e3f2fd' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#111827' }}>
                                        Quick Actions
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<HourglassEmptyIcon />}
                                                onClick={() => setActiveNav('pending')}
                                                sx={{ 
                                                    borderColor: '#00b4d8',
                                                    color: '#00b4d8',
                                                    py: 1.5,
                                                    '&:hover': {
                                                        borderColor: '#0096c7',
                                                        background: 'rgba(0, 180, 216, 0.04)'
                                                    }
                                                }}
                                            >
                                                View Pending ({pending.length})
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<PublishedWithChangesIcon />}
                                                onClick={() => setActiveNav('published')}
                                                sx={{ 
                                                    borderColor: '#00b4d8',
                                                    color: '#00b4d8',
                                                    py: 1.5,
                                                    '&:hover': {
                                                        borderColor: '#0096c7',
                                                        background: 'rgba(0, 180, 216, 0.04)'
                                                    }
                                                }}
                                            >
                                                View Published ({published.length})
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>
                    </Fade>
                );

            case 'pending':
                return (
                    <Fade in={activeNav === 'pending'}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                    Pending Review
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                    {pending.length} article{pending.length !== 1 ? 's' : ''} awaiting your review
                                </Typography>
                            </Box>
                            {categories.length > 0 && (
                                <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ mr: 2 }}>Filter:</Typography>
                                    <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')} displayEmpty sx={{ minWidth: 200 }}>
                                        <MenuItem value="">All Categories</MenuItem>
                                        {categories.map((c) => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            )}
                            {pending.length === 0 ? (
                                <Card sx={{ borderRadius: '12px' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                        <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                                            ✅ All caught up! No pending articles.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Grid container spacing={3}>
                                    {pending.filter(a => !selectedCategory || a.category?.id === selectedCategory).map((article) => (
                                        <Grid key={article.id} item xs={12}>
                                            <Card
                                                sx={{
                                                    borderRadius: '12px',
                                                    border: '2px solid #e3f2fd',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateX(4px)',
                                                        boxShadow: '0 8px 20px rgba(21, 101, 192, 0.15)',
                                                        borderColor: '#667eea',
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                            {article.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                                            <strong>Author:</strong> {article.writer.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                                            <strong>Category:</strong> {article.category.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Submitted: {new Date(article.created_at).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label="Pending"
                                                        sx={{
                                                            background: STATUS_COLORS.submitted.bg,
                                                            color: STATUS_COLORS.submitted.text,
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        size="small"
                                                        startIcon={<VisibilityIcon />}
                                                        onClick={() => handleReview(article.id)}
                                                        sx={{
                                                            color: 'white',
                                                            background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                                                            fontWeight: 600,
                                                            borderRadius: '6px',
                                                            px: 2,
                                                        }}
                                                    >
                                                        Review
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        onClick={() => {
                                                            const comments = window.prompt('Revision comments (required)');
                                                            if (comments && comments.trim()) {
                                                                Inertia.post(route('editor.articles.requestRevision', article.id), { comments });
                                                            }
                                                        }}
                                                        sx={{ ml: 1, color: '#e65100', fontWeight: 600 }}
                                                    >
                                                        Request Revision
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        onClick={() => {
                                                            if (window.confirm('Publish this article?')) {
                                                                Inertia.post(route('editor.articles.publish', article.id));
                                                            }
                                                        }}
                                                        sx={{ ml: 1, color: '#2e7d32', fontWeight: 600 }}
                                                    >
                                                        Publish
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Fade>
                );

            case 'published':
                return (
                    <Fade in={activeNav === 'published'}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                    Published Articles
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                    {published.length} article{published.length !== 1 ? 's' : ''} successfully published
                                </Typography>
                            </Box>
                            {published.length === 0 ? (
                                <Card sx={{ borderRadius: '12px' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                        <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                                            📚 No published articles yet.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Grid container spacing={3}>
                                    {published.map((article) => (
                                        <Grid key={article.id} item xs={12} sm={6}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    borderRadius: '12px',
                                                    border: '2px solid #e8f5e9',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 12px 30px rgba(46, 125, 50, 0.15)',
                                                        borderColor: '#2e7d32',
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                        {article.title}
                                                    </Typography>
                                                    <Chip
                                                        label="Published"
                                                        size="small"
                                                        sx={{
                                                            mb: 2,
                                                            background: STATUS_COLORS.published.bg,
                                                            color: STATUS_COLORS.published.text,
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                    <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                                                        <strong>Comments:</strong> {article.comments?.length || 0}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Published: {new Date(article.updated_at).toLocaleDateString()}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Fade>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            {/* Header */}
            <AppBar
                position="fixed"
                sx={{
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
                    boxShadow: '0 8px 32px rgba(0, 180, 216, 0.15)',
                    zIndex: 1201,
                    backdropFilter: 'blur(10px)',
                    height: 80
                }}
            >
                <Toolbar sx={{ minHeight: 80 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, flexGrow: 1, fontSize: '1.8rem', letterSpacing: '-0.3px' }}>
                        Editor Dashboard
                    </Typography>
                    
                    {/* Notification Bell */}
                    <IconButton
                        onClick={(e) => setNotificationAnchor(e.currentTarget)}
                        sx={{ 
                            color: 'white', 
                            mr: 2,
                            width: 48,
                            height: 40,
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.25)',
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            },
                            '&:active': {
                                transform: 'scale(0.95)',
                            }
                        }}
                    >
                        <Badge badgeContent={unreadCount} color="error" max={99}>
                            {unreadCount > 0 ? (
                                <NotificationsIcon sx={{ fontSize: 20 }} />
                            ) : (
                                <NotificationsNoneIcon sx={{ fontSize: 20 }} />
                            )}
                        </Badge>
                    </IconButton>
                    
                    {/* Home Button */}
                    <IconButton
                        onClick={() => Inertia.visit('/')}
                        sx={{ 
                            color: 'white', 
                            mr: 1,
                            width: 40,
                            height: 40,
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.25)',
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            },
                            '&:active': {
                                transform: 'scale(0.95)',
                            }
                        }}
                        title="Home"
                    >
                        <HomeIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    
                    <IconButton
                        onClick={(e) => setProfileAnchor(e.currentTarget)}
                        sx={{ 
                            color: 'white', 
                            ml: 2,
                            width: 48,
                            height: 48,
                            background: 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.35)',
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 25px rgba(0,0,0,0.25)',
                            },
                            '&:active': {
                                transform: 'scale(0.95)',
                            }
                        }}
                    >
                        <Avatar sx={{ 
                            background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)', 
                            width: 36, 
                            height: 36,
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            border: '2px solid rgba(255,255,255,0.5)'
                        }}>
                            {auth?.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={profileAnchor}
                        open={Boolean(profileAnchor)}
                        onClose={() => setProfileAnchor(null)}
                        PaperProps={{
                            sx: {
                                minWidth: 250,
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                            }
                        }}
                    >
                        <MenuItem disabled>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{auth?.user?.name}</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => {
                            setProfileAnchor(null);
                            Inertia.get(route('profile.edit'));
                        }}>
                            <AccountCircleIcon sx={{ mr: 1, fontSize: 18 }} />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setProfileAnchor(null);
                            Inertia.post('/logout');
                        }}>
                            <LogoutIcon sx={{ mr: 1, fontSize: 18, color: '#e65100' }} />
                            Log Out
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/sample/switch/writer';
                            }}
                            sx={{ fontSize: '0.85rem', color: '#667eea' }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16 }} />
                            Writer
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/sample/switch/student';
                            }}
                            sx={{ fontSize: '0.85rem', color: '#667eea' }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16 }} />
                            Student
                        </MenuItem>
                    </Menu>
                    
                    {/* Notification Dropdown */}
                    <Menu
                        anchorEl={notificationAnchor}
                        open={Boolean(notificationAnchor)}
                        onClose={() => setNotificationAnchor(null)}
                        PaperProps={{
                            sx: {
                                maxHeight: 400,
                                width: 350,
                                mt: 1,
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                            }
                        }}
                    >
                        <MenuItem disabled>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Notifications from Writers
                            </Typography>
                        </MenuItem>
                        <Divider />
                        
                        {notifications?.length > 0 && (
                            <MenuItem
                                onClick={() => {
                                    // Mark all notifications as read
                                    const allNotificationIds = notifications.map(n => n.id);
                                    setReadNotifications(new Set(allNotificationIds));
                                    setNotificationAnchor(null);
                                }}
                                sx={{ 
                                    py: 1,
                                    backgroundColor: '#f8fafc',
                                    borderBottom: '1px solid #e2e8f0',
                                    '&:hover': { backgroundColor: '#f1f5f9' }
                                }}
                            >
                                <Typography variant="body2" sx={{ color: '#4f46e5', fontWeight: 600, textAlign: 'center', width: '100%' }}>
                                    Mark All as Read
                                </Typography>
                            </MenuItem>
                        )}
                        
                        {notifications?.length > 0 ? (
                            notifications.map((notification) => (
                                <MenuItem
                                    key={notification.id}
                                    onClick={() => {
                                        setReadNotifications(prev => new Set(prev).add(notification.id));
                                        setNotificationAnchor(null);
                                        // Navigate to the article review if applicable
                                        if (notification.data.article_id) {
                                            Inertia.get(route('editor.articles.review', notification.data.article_id));
                                        }
                                    }}
                                    sx={{ 
                                        py: 2,
                                        borderBottom: '1px solid #f0f0f0',
                                        '&:hover': { backgroundColor: '#f8fafc' },
                                        backgroundColor: readNotifications.has(notification.id) ? '#f8fafc' : 'white'
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="body2" sx={{ fontWeight: readNotifications.has(notification.id) ? 'normal' : 'bold', mb: 0.5 }}>
                                            {notification.data.message}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                            {notification.data.writer_name} • {new Date(notification.created_at).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>
                                <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center', py: 2 }}>
                                    No notifications yet
                                </Typography>
                            </MenuItem>
                        )}
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        background: 'white',
                        borderRight: '1px solid #e2e8f0',
                        mt: '80px',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <List>
                        <ListItem
                            button
                            onClick={() => setActiveNav('dashboard')}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                background: activeNav === 'dashboard' ? '#e3f2fd' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'dashboard' ? '#00b4d8' : '#64748b' }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Main Dashboard"
                                secondary="Overview"
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('pending')}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                background: activeNav === 'pending' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'pending' ? '#667eea' : '#64748b' }}>
                                <HourglassEmptyIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Pending Articles"
                                secondary={pending.length}
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('published')}
                            sx={{
                                borderRadius: '8px',
                                background: activeNav === 'published' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'published' ? '#667eea' : '#64748b' }}>
                                <PublishedWithChangesIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Published Articles"
                                secondary={published.length}
                            />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: '80px',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                    {renderMainContent()}
                </Container>
            </Box>
        </Box>
    );
}
