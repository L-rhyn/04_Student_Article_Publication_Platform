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
    Zoom,
    Grow,
    Paper,
    alpha
} from '@mui/material';
import {
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    SwapHoriz as SwapHorizIcon,
    Notifications as NotificationsIcon,
    NotificationsNone as NotificationsNoneIcon,
    Home as HomeIcon,
    Reviews as ReviewsIcon,
    PublishedWithChanges as PublishedWithChangesIcon,
    Visibility as VisibilityIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Dashboard as DashboardIcon,
    AutoStories as AutoStoriesIcon,
    Brush as BrushIcon,
    EmojiEmotions as EmojiIcon,
    Rocket as RocketIcon,
    Celebration as CelebrationIcon,
    Star as StarIcon,
    ThumbUp as ThumbUpIcon,
    Edit as EditIcon,
    CheckCircle as CheckCircleIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
    Forest as ForestIcon,
    Pets as PetsIcon,
    MusicNote as MusicIcon
} from '@mui/icons-material';
import { Inertia } from '@inertiajs/inertia';

const STATUS_COLORS = {
    submitted: { bg: '#FFE66D', text: '#FF6B6B', border: '#FF9F1C', icon: '🚀' },
    needs_revision: { bg: '#FF8A80', text: '#B22222', border: '#FF6B6B', icon: '🔄' },
    published: { bg: '#9B6B9E', text: '#FFFFFF', border: '#6B8CFF', icon: '✨' },
};

const DRAWER_WIDTH = 280;
const THEME = {
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

// Fun category icons
const CATEGORY_ICONS = {
    adventure: '🗺️',
    fantasy: '🐉',
    science: '🔬',
    history: '🏛️',
    art: '🎨',
    music: '🎵',
    nature: '🌿',
    space: '🚀'
};

export default function Dashboard({ pending, published, categories: serverCategories, auth, notifications }) {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [readNotifications, setReadNotifications] = useState(new Set());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [categories] = useState(serverCategories && serverCategories.length > 0 ? serverCategories : []);
    const [floatingIcons] = useState(() => {
        const icons = [
            <BrushIcon />, <PetsIcon />, <MusicIcon />, <StarIcon />,
            <ForestIcon />, <EmojiIcon />, <RocketIcon />, <CelebrationIcon />
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

    // Calculate unread notifications count
    const unreadCount = notifications?.filter(n => !readNotifications.has(n.id)).length || 0;

    const handleReview = (articleId) => {
        Inertia.get(route('editor.articles.review', articleId));
    };

    const renderMainContent = () => {
        switch (activeNav) {
            case 'dashboard':
                return (
                    <Fade in={activeNav === 'dashboard'} timeout={800}>
                        <Box>
                            {/* Welcome Banner */}
                            <Paper
                                sx={{
                                    p: 4,
                                    mb: 4,
                                    borderRadius: 8,
                                    background: `linear-gradient(135deg, ${THEME.purple} 0%, ${THEME.blue} 100%)`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: `4px solid ${THEME.accent}`,
                                    boxShadow: `8px 8px 0 ${alpha(THEME.purple, 0.3)}`
                                }}
                            >
                                <Box sx={{ position: 'relative', zIndex: 2 }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontFamily: '"Comic Sans MS", cursive',
                                            fontWeight: 'bold',
                                            color: 'white',
                                            mb: 2,
                                            textShadow: '3px 3px 0 rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        Welcome, Editor {auth?.user?.name?.split(' ')[0]}! 📚
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontFamily: '"Comic Sans MS", cursive',
                                            color: THEME.accent,
                                            mb: 3
                                        }}
                                    >
                                        You have {pending.length} article {pending.length !== 1 ? 's' : ''} waiting for your magic touch!
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => setActiveNav('pending')}
                                        startIcon={<RocketIcon />}
                                        sx={{
                                            bgcolor: THEME.accent,
                                            color: THEME.purple,
                                            fontFamily: '"Comic Sans MS", cursive',
                                            fontSize: '1.2rem',
                                            py: 1.5,
                                            px: 4,
                                            borderRadius: 40,
                                            border: '3px solid white',
                                            '&:hover': {
                                                bgcolor: '#FFD93D',
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    >
                                        Start Reviewing
                                    </Button>
                                </Box>
                                
                                {/* Floating icons in banner */}
                                <Box sx={{ position: 'absolute', top: 20, right: 20, opacity: 0.2 }}>
                                    <ReviewsIcon sx={{ fontSize: 100, color: 'white' }} />
                                </Box>
                            </Paper>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: '"Comic Sans MS", cursive',
                                    fontWeight: 'bold',
                                    color: THEME.primary,
                                    mb: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}
                            >
                                <StarIcon sx={{ color: THEME.accent, fontSize: 40 }} />
                                Your Editor Stats
                                <StarIcon sx={{ color: THEME.accent, fontSize: 40 }} />
                            </Typography>

                            {/* Statistics Cards */}
                            <Grid container spacing={4} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Zoom in timeout={500}>
                                        <Card sx={{ 
                                            p: 3, 
                                            borderRadius: 8,
                                            background: `linear-gradient(135deg, ${alpha(THEME.orange, 0.2)} 0%, ${alpha(THEME.accent, 0.2)} 100%)`,
                                            border: `4px solid ${THEME.orange}`,
                                            boxShadow: `6px 6px 0 ${THEME.orange}`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-4px) translateX(-4px)',
                                                boxShadow: `10px 10px 0 ${THEME.orange}`
                                            }
                                        }}>
                                            <Box sx={{ position: 'absolute', top: 10, right: 10, fontSize: '3rem', opacity: 0.2 }}>
                                                ⏳
                                            </Box>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <HourglassEmptyIcon sx={{ fontSize: 40, color: THEME.orange, mr: 2 }} />
                                                    <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold', color: THEME.orange }}>
                                                        Pending Review
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h2" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold', color: THEME.orange, mb: 1 }}>
                                                    {pending.length}
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 2 }}>
                                                    article{pending.length !== 1 ? 's' : ''} waiting for review
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() => setActiveNav('pending')}
                                                    sx={{
                                                        bgcolor: THEME.orange,
                                                        color: 'white',
                                                        fontFamily: '"Comic Sans MS", cursive',
                                                        borderRadius: 40,
                                                        '&:hover': {
                                                            bgcolor: '#F97316',
                                                            transform: 'scale(1.05)'
                                                        }
                                                    }}
                                                >
                                                    Review Stories 🚀
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Zoom in timeout={700}>
                                        <Card sx={{ 
                                            p: 3, 
                                            borderRadius: 8,
                                            background: `linear-gradient(135deg, ${alpha(THEME.green, 0.2)} 0%, ${alpha(THEME.secondary, 0.2)} 100%)`,
                                            border: `4px solid ${THEME.green}`,
                                            boxShadow: `6px 6px 0 ${THEME.green}`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-4px) translateX(-4px)',
                                                boxShadow: `10px 10px 0 ${THEME.green}`
                                            }
                                        }}>
                                            <Box sx={{ position: 'absolute', top: 10, right: 10, fontSize: '3rem', opacity: 0.2 }}>
                                                ✨
                                            </Box>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <PublishedWithChangesIcon sx={{ fontSize: 40, color: THEME.green, mr: 2 }} />
                                                    <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold', color: THEME.green }}>
                                                        Published
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h2" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold', color: THEME.green, mb: 1 }}>
                                                    {published.length}
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 2 }}>
                                                    article{published.length !== 1 ? 's' : ''} published
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() => setActiveNav('published')}
                                                    sx={{
                                                        bgcolor: THEME.green,
                                                        color: 'white',
                                                        fontFamily: '"Comic Sans MS", cursive',
                                                        borderRadius: 40,
                                                        '&:hover': {
                                                            bgcolor: '#4CAF50',
                                                            transform: 'scale(1.05)'
                                                        }
                                                    }}
                                                >
                                                    View Published ✨
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            </Grid>

                            {/* Quick Actions */}
                            <Grow in timeout={900}>
                                <Card sx={{ 
                                    borderRadius: 8,
                                    border: `4px solid ${THEME.secondary}`,
                                    boxShadow: `6px 6px 0 ${THEME.secondary}`,
                                    bgcolor: 'white'
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold', color: THEME.primary, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <RocketIcon sx={{ color: THEME.accent }} />
                                            Quick Actions
                                            <RocketIcon sx={{ color: THEME.accent }} />
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={<HourglassEmptyIcon />}
                                                    onClick={() => setActiveNav('pending')}
                                                    sx={{
                                                        borderColor: THEME.orange,
                                                        borderWidth: 3,
                                                        color: THEME.orange,
                                                        fontFamily: '"Comic Sans MS", cursive',
                                                        fontSize: '1.1rem',
                                                        py: 2,
                                                        '&:hover': {
                                                            borderColor: '#F97316',
                                                            background: alpha(THEME.orange, 0.1),
                                                            transform: 'scale(1.02)'
                                                        }
                                                    }}
                                                >
                                                    Review Pending ({pending.length})
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={<PublishedWithChangesIcon />}
                                                    onClick={() => setActiveNav('published')}
                                                    sx={{
                                                        borderColor: THEME.green,
                                                        borderWidth: 3,
                                                        color: THEME.green,
                                                        fontFamily: '"Comic Sans MS", cursive',
                                                        fontSize: '1.1rem',
                                                        py: 2,
                                                        '&:hover': {
                                                            borderColor: '#4CAF50',
                                                            background: alpha(THEME.green, 0.1),
                                                            transform: 'scale(1.02)'
                                                        }
                                                    }}
                                                >
                                                    View Published ({published.length})
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grow>
                        </Box>
                    </Fade>
                );

            case 'pending':
                return (
                    <Fade in={activeNav === 'pending'} timeout={800}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: '"Comic Sans MS", cursive',
                                        fontWeight: 'bold',
                                        color: THEME.orange,
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    <HourglassEmptyIcon sx={{ fontSize: 40 }} />
                                    Stories Awaiting Review
                                    <HourglassEmptyIcon sx={{ fontSize: 40 }} />
                                </Typography>
                                <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 3 }}>
                                    {pending.length} article{pending.length !== 1 ? 's' : ''} need{pending.length === 1 ? 's' : ''} your editor's magic! ✨
                                </Typography>
                            </Box>

                            {categories.length > 0 && (
                                <Paper sx={{ 
                                    p: 2, 
                                    mb: 3, 
                                    borderRadius: 8,
                                    bgcolor: 'white',
                                    border: `3px solid ${THEME.secondary}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    flexWrap: 'wrap'
                                }}>
                                    <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.purple }}>
                                        🔍 Filter by category:
                                    </Typography>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
                                        displayEmpty
                                        sx={{
                                            minWidth: 200,
                                            fontFamily: '"Comic Sans MS", cursive',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: THEME.secondary,
                                                borderWidth: 2
                                            }
                                        }}
                                    >
                                        <MenuItem value="" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>All Categories 📚</MenuItem>
                                        {categories.map((c) => (
                                            <MenuItem key={c.id} value={c.id} sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                                {CATEGORY_ICONS[c.name.toLowerCase()] || '📖'} {c.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Paper>
                            )}

                            {pending.length === 0 ? (
                                <Paper sx={{ 
                                    p: 6,
                                    borderRadius: 8,
                                    background: `linear-gradient(135deg, ${alpha(THEME.accent, 0.2)} 0%, ${alpha(THEME.secondary, 0.2)} 100%)`,
                                    border: `4px solid ${THEME.accent}`,
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h3" sx={{ fontSize: '4rem', mb: 2 }}>
                                        🎉
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 2 }}>
                                        All caught up!
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                        No stories pending review. Time to grab a snack! 🍪
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {pending.filter(a => !selectedCategory || a.category?.id === selectedCategory).map((article, index) => (
                                        <Grid key={article.id} item xs={12}>
                                            <Grow in timeout={500 + index * 100}>
                                                <Card
                                                    sx={{
                                                        borderRadius: 8,
                                                        border: `4px solid ${THEME.orange}`,
                                                        boxShadow: `4px 4px 0 ${THEME.orange}`,
                                                        bgcolor: 'white',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateX(4px) translateY(-2px)',
                                                            boxShadow: `6px 6px 0 ${THEME.orange}`
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 2 }}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                                                    <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold', color: THEME.text }}>
                                                                        {article.title}
                                                                    </Typography>
                                                                    <Chip
                                                                        icon={<span>{STATUS_COLORS.submitted.icon}</span>}
                                                                        label="Pending Review"
                                                                        sx={{
                                                                            bgcolor: STATUS_COLORS.submitted.bg,
                                                                            color: STATUS_COLORS.submitted.text,
                                                                            fontWeight: 'bold',
                                                                            borderRadius: 20,
                                                                            fontFamily: '"Comic Sans MS", cursive'
                                                                        }}
                                                                    />
                                                                </Box>
                                                                
                                                                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Avatar sx={{ bgcolor: THEME.secondary, width: 32, height: 32 }}>
                                                                            {article.writer?.name?.charAt(0) || 'W'}
                                                                        </Avatar>
                                                                        <Typography variant="body2" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                                                            By: {article.writer?.name || 'Unknown Writer'}
                                                                        </Typography>
                                                                    </Box>
                                                                    
                                                                    <Chip
                                                                        label={`${CATEGORY_ICONS[article.category?.name?.toLowerCase()] || '📚'} ${article.category?.name || 'Uncategorized'}`}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: THEME.secondary,
                                                                            color: 'white',
                                                                            fontFamily: '"Comic Sans MS", cursive'
                                                                        }}
                                                                    />
                                                                </Box>

                                                                <Typography variant="caption" sx={{ color: THEME.text, fontFamily: '"Comic Sans MS", cursive' }}>
                                                                    Submitted: {new Date(article.created_at).toLocaleDateString()} at {new Date(article.created_at).toLocaleTimeString()}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                    <CardActions sx={{ p: 3, pt: 0, gap: 2 }}>
                                                        <Button
                                                            size="large"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => handleReview(article.id)}
                                                            sx={{
                                                                bgcolor: THEME.blue,
                                                                color: 'white',
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                px: 3,
                                                                '&:hover': {
                                                                    bgcolor: '#5A7DFF',
                                                                    transform: 'scale(1.05)'
                                                                }
                                                            }}
                                                        >
                                                            Read & Review
                                                        </Button>
                                                        <Button
                                                            size="large"
                                                            startIcon={<span>🔄</span>}
                                                            onClick={() => {
                                                                const comments = window.prompt('📝 Revision comments (required):');
                                                                if (comments && comments.trim()) {
                                                                    Inertia.post(route('editor.articles.requestRevision', article.id), { comments });
                                                                }
                                                            }}
                                                            sx={{
                                                                bgcolor: THEME.orange,
                                                                color: 'white',
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                px: 3,
                                                                '&:hover': {
                                                                    bgcolor: '#F97316',
                                                                    transform: 'scale(1.05)'
                                                                }
                                                            }}
                                                        >
                                                            Request Changes
                                                        </Button>
                                                        <Button
                                                            size="large"
                                                            startIcon={<span>✨</span>}
                                                            onClick={() => {
                                                                if (window.confirm('✨ Ready to publish this wonderful article?')) {
                                                                    Inertia.post(route('editor.articles.publish', article.id));
                                                                }
                                                            }}
                                                            sx={{
                                                                bgcolor: THEME.green,
                                                                color: 'white',
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                px: 3,
                                                                '&:hover': {
                                                                    bgcolor: '#4CAF50',
                                                                    transform: 'scale(1.05)'
                                                                }
                                                            }}
                                                        >
                                                            Publish
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grow>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Fade>
                );

            case 'published':
                return (
                    <Fade in={activeNav === 'published'} timeout={800}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: '"Comic Sans MS", cursive',
                                        fontWeight: 'bold',
                                        color: THEME.green,
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    <PublishedWithChangesIcon sx={{ fontSize: 40 }} />
                                    Published Stories
                                    <PublishedWithChangesIcon sx={{ fontSize: 40 }} />
                                </Typography>
                                <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 3 }}>
                                    {published.length} article{published.length !== 1 ? 's' : ''} shared with the world! 🌍
                                </Typography>
                            </Box>

                            {published.length === 0 ? (
                                <Paper sx={{ 
                                    p: 6,
                                    borderRadius: 8,
                                    background: `linear-gradient(135deg, ${alpha(THEME.accent, 0.2)} 0%, ${alpha(THEME.secondary, 0.2)} 100%)`,
                                    border: `4px solid ${THEME.accent}`,
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h3" sx={{ fontSize: '4rem', mb: 2 }}>
                                        📝
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 2 }}>
                                        No published stories yet
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                        Start reviewing pending stories to publish them! 🚀
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={4}>
                                    {published.map((article, index) => (
                                        <Grid key={article.id} item xs={12} sm={6}>
                                            <Zoom in timeout={500 + index * 100}>
                                                <Card
                                                    sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        borderRadius: 8,
                                                        border: `4px solid ${THEME.green}`,
                                                        boxShadow: `4px 4px 0 ${THEME.green}`,
                                                        bgcolor: 'white',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px) translateX(-2px)',
                                                            boxShadow: `6px 6px 0 ${THEME.green}`
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                                            <Typography variant="h6" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold', color: THEME.text }}>
                                                                {article.title}
                                                            </Typography>
                                                            <Chip
                                                                icon={<span>✨</span>}
                                                                label="Published"
                                                                sx={{
                                                                    bgcolor: STATUS_COLORS.published.bg,
                                                                    color: STATUS_COLORS.published.text,
                                                                    fontWeight: 'bold',
                                                                    borderRadius: 20,
                                                                    fontFamily: '"Comic Sans MS", cursive'
                                                                }}
                                                            />
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                            <Avatar sx={{ bgcolor: THEME.secondary, width: 24, height: 24 }}>
                                                                {article.writer?.name?.charAt(0) || 'W'}
                                                            </Avatar>
                                                            <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                                                {article.writer?.name || 'Unknown Writer'}
                                                            </Typography>
                                                        </Box>

                                                        <Chip
                                                            label={`${CATEGORY_ICONS[article.category?.name?.toLowerCase()] || '📚'} ${article.category?.name || 'Uncategorized'}`}
                                                            size="small"
                                                            
                                                        />

                                                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <ThumbUpIcon sx={{ fontSize: 16, color: THEME.primary }} />
                                                                <Typography variant="caption">{article.likes || 0}</Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <ReviewsIcon sx={{ fontSize: 16, color: THEME.blue }} />
                                                                <Typography variant="caption">{article.comments?.length || 0}</Typography>
                                                            </Box>
                                                        </Box>

                                                        <Typography variant="caption" sx={{ color: THEME.text, fontFamily: '"Comic Sans MS", cursive' }}>
                                                            Published: {new Date(article.updated_at).toLocaleDateString()}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Zoom>
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
        <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh', 
            background: `linear-gradient(135deg, ${THEME.background} 0%, ${alpha(THEME.accent, 0.1)} 100%)`,
            position: 'relative',
            overflow: 'hidden'
        }}>
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
                            color: [THEME.primary, THEME.secondary, THEME.accent, THEME.purple][Math.floor(Math.random() * 4)],
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

            {/* Header */}
            <AppBar
                position="fixed"
                sx={{
                    background: `linear-gradient(135deg, ${THEME.purple} 0%, ${THEME.blue} 100%)`,
                    borderBottom: `4px solid ${THEME.accent}`,
                    boxShadow: `0 8px 0 ${alpha(THEME.purple, 0.5)}`,
                    zIndex: 1201,
                    height: 80
                }}
            >
                <Toolbar sx={{ minHeight: 80, position: 'relative' }}>
                    <IconButton
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        sx={{
                            color: 'white',
                            mr: 2,
                            bgcolor: alpha(THEME.accent, 0.3),
                            '&:hover': { bgcolor: alpha(THEME.accent, 0.5) }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                        <Box
                            sx={{
                                bgcolor: THEME.accent,
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
                            <ReviewsIcon sx={{ fontSize: 30, color: THEME.purple }} />
                        </Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: '"Comic Sans MS", cursive',
                                fontWeight: 'bold',
                                color: 'white',
                                textShadow: '3px 3px 0 rgba(0,0,0,0.2)'
                            }}
                        >
                            Editor's Magic Workshop
                        </Typography>
                    </Box>

                    {/* Notification Bell */}
                    <IconButton
                        onClick={(e) => setNotificationAnchor(e.currentTarget)}
                        sx={{
                            color: 'white',
                            mr: 2,
                            width: 48,
                            height: 48,
                            bgcolor: alpha(THEME.accent, 0.3),
                            border: `2px solid ${THEME.accent}`,
                            '&:hover': {
                                bgcolor: alpha(THEME.accent, 0.5),
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <Badge
                            badgeContent={unreadCount}
                            sx={{
                                '& .MuiBadge-badge': {
                                    bgcolor: THEME.primary,
                                    color: 'white',
                                    fontSize: '0.6rem'
                                }
                            }}
                        >
                            {unreadCount > 0 ? (
                                <NotificationsIcon sx={{ fontSize: 24 }} />
                            ) : (
                                <NotificationsNoneIcon sx={{ fontSize: 24 }} />
                            )}
                        </Badge>
                    </IconButton>

                    {/* Home Button */}
                    <IconButton
                        onClick={() => Inertia.visit('/')}
                        sx={{
                            color: 'white',
                            mr: 2,
                            width: 48,
                            height: 48,
                            bgcolor: alpha(THEME.accent, 0.3),
                            border: `2px solid ${THEME.accent}`,
                            '&:hover': {
                                bgcolor: alpha(THEME.accent, 0.5),
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <HomeIcon sx={{ fontSize: 24 }} />
                    </IconButton>

                    {/* Profile Menu */}
                    <IconButton
                        onClick={(e) => setProfileAnchor(e.currentTarget)}
                        sx={{
                            color: 'white',
                            width: 48,
                            height: 48,
                            bgcolor: alpha(THEME.accent, 0.3),
                            border: `2px solid ${THEME.accent}`,
                            '&:hover': {
                                bgcolor: alpha(THEME.accent, 0.5),
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <Avatar sx={{
                            bgcolor: THEME.accent,
                            color: THEME.purple,
                            fontWeight: 'bold',
                            border: '2px solid white'
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
                                borderRadius: 8,
                                border: `3px solid ${THEME.secondary}`,
                                boxShadow: `4px 4px 0 ${THEME.primary}`,
                                bgcolor: 'white'
                            }
                        }}
                    >
                        <MenuItem disabled sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{auth?.user?.name}</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => {
                            setProfileAnchor(null);
                            Inertia.get(route('profile.edit'));
                        }}>
                            <AccountCircleIcon sx={{ mr: 1, fontSize: 18, color: THEME.blue }} />
                            <Typography sx={{ fontFamily: '"Comic Sans MS", cursive' }}>My Profile</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setProfileAnchor(null);
                            Inertia.post('/logout');
                        }}>
                            <LogoutIcon sx={{ mr: 1, fontSize: 18, color: THEME.primary }} />
                            <Typography sx={{ fontFamily: '"Comic Sans MS", cursive' }}>Log Out</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/switch/writer';
                            }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16, color: THEME.green }} />
                            <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', fontSize: '0.9rem' }}>
                                Switch to Writer Mode
                            </Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/switch/student';
                            }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16, color: THEME.purple }} />
                            <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', fontSize: '0.9rem' }}>
                                Switch to Reader Mode
                            </Typography>
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
                                borderRadius: 8,
                                border: `3px solid ${THEME.secondary}`,
                                boxShadow: `4px 4px 0 ${THEME.primary}`,
                                bgcolor: 'white'
                            }
                        }}
                    >
                        <MenuItem disabled>
                            <Typography variant="subtitle2" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 600, color: THEME.purple }}>
                                📬 Messages from Writers
                            </Typography>
                        </MenuItem>
                        <Divider />

                        {notifications?.length > 0 && (
                            <MenuItem
                                onClick={() => {
                                    const allNotificationIds = notifications.map(n => n.id);
                                    setReadNotifications(new Set(allNotificationIds));
                                    setNotificationAnchor(null);
                                }}
                                sx={{
                                    py: 1,
                                    bgcolor: alpha(THEME.accent, 0.2),
                                    '&:hover': { bgcolor: alpha(THEME.accent, 0.3) }
                                }}
                            >
                                <Typography variant="body2" sx={{ color: THEME.primary, fontWeight: 600, textAlign: 'center', width: '100%', fontFamily: '"Comic Sans MS", cursive' }}>
                                    ✨ Mark All as Read ✨
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
                                        if (notification.data.article_id) {
                                            Inertia.get(route('editor.articles.review', notification.data.article_id));
                                        }
                                    }}
                                    sx={{
                                        py: 2,
                                        borderBottom: '1px solid #f0f0f0',
                                        backgroundColor: readNotifications.has(notification.id) ? alpha(THEME.secondary, 0.05) : alpha(THEME.accent, 0.1),
                                        borderLeft: readNotifications.has(notification.id) ? `3px solid ${THEME.secondary}` : `3px solid ${THEME.primary}`,
                                        '&:hover': { backgroundColor: alpha(THEME.accent, 0.2) }
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="body2" sx={{ fontWeight: readNotifications.has(notification.id) ? 'normal' : 'bold', mb: 0.5, fontFamily: '"Comic Sans MS", cursive' }}>
                                            {notification.data.message}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                            <Avatar sx={{ width: 20, height: 20, fontSize: '0.8rem', bgcolor: THEME.secondary }}>
                                                {notification.data.writer_name?.charAt(0) || 'W'}
                                            </Avatar>
                                            <Typography variant="caption" sx={{ color: THEME.text, fontFamily: '"Comic Sans MS", cursive' }}>
                                                {notification.data.writer_name} • {new Date(notification.created_at).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>
                                <Typography variant="body2" sx={{ color: THEME.text, textAlign: 'center', py: 2, fontFamily: '"Comic Sans MS", cursive' }}>
                                    📭 No messages from writers yet
                                </Typography>
                            </MenuItem>
                        )}
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="persistent"
                anchor="left"
                open={sidebarOpen}
                sx={{
                    width: sidebarOpen ? DRAWER_WIDTH : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        background: `linear-gradient(135deg, ${alpha(THEME.background, 0.9)} 0%, white 100%)`,
                        borderRight: `4px solid ${THEME.accent}`,
                        mt: '80px',
                        backdropFilter: 'blur(10px)',
                        transition: 'width 0.3s ease'
                    },
                }}
            >
                <Box sx={{ p: 3 }}>
                    <List>
                        <ListItem
                            button
                            onClick={() => setActiveNav('dashboard')}
                            sx={{
                                borderRadius: 8,
                                mb: 1,
                                bgcolor: activeNav === 'dashboard' ? alpha(THEME.accent, 0.3) : 'transparent',
                                border: activeNav === 'dashboard' ? `2px solid ${THEME.purple}` : 'none',
                                '&:hover': { bgcolor: alpha(THEME.accent, 0.2) }
                            }}
                        >
                            <ListItemIcon>
                                <DashboardIcon sx={{ color: activeNav === 'dashboard' ? THEME.purple : THEME.text }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', color: activeNav === 'dashboard' ? THEME.purple : THEME.text }}>
                                        Editor Dashboard
                                    </Typography>
                                }
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('pending')}
                            sx={{
                                borderRadius: 8,
                                mb: 1,
                                bgcolor: activeNav === 'pending' ? alpha(THEME.accent, 0.3) : 'transparent',
                                border: activeNav === 'pending' ? `2px solid ${THEME.orange}` : 'none',
                                '&:hover': { bgcolor: alpha(THEME.accent, 0.2) }
                            }}
                        >
                            <ListItemIcon>
                                <HourglassEmptyIcon sx={{ color: activeNav === 'pending' ? THEME.orange : THEME.text }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', color: activeNav === 'pending' ? THEME.orange : THEME.text }}>
                                        Pending Review
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                        {pending.length} stories
                                    </Typography>
                                }
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('published')}
                            sx={{
                                borderRadius: 8,
                                bgcolor: activeNav === 'published' ? alpha(THEME.accent, 0.3) : 'transparent',
                                border: activeNav === 'published' ? `2px solid ${THEME.green}` : 'none',
                                '&:hover': { bgcolor: alpha(THEME.accent, 0.2) }
                            }}
                        >
                            <ListItemIcon>
                                <PublishedWithChangesIcon sx={{ color: activeNav === 'published' ? THEME.green : THEME.text }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', color: activeNav === 'published' ? THEME.green : THEME.text }}>
                                        Published
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                        {published.length} stories
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 3, borderColor: THEME.accent }} />

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                            ✨ Every article you review helps a writer grow! ✨
                        </Typography>
                    </Box>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: '80px',
                    p: 4,
                    transition: 'margin-left 0.3s ease',
                    ml: sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                    {renderMainContent()}
                </Container>
            </Box>

            {/* Back to Top Button */}
            <IconButton
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    bgcolor: THEME.accent,
                    color: THEME.purple,
                    width: 56,
                    height: 56,
                    border: `3px solid ${THEME.secondary}`,
                    '&:hover': {
                        bgcolor: THEME.orange,
                        color: 'white',
                        transform: 'scale(1.1) rotate(360deg)'
                    },
                    transition: 'all 0.5s ease',
                    zIndex: 1200
                }}
            >
                <RocketIcon />
            </IconButton>
        </Box>
    );
}