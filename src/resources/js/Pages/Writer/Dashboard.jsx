import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import {
    Box,
    Container,
    TextField,
    Button,
    Select,
    MenuItem,
    Typography,
    Card,
    CardContent,
    CardActions,
    Grid,
    Chip,
    AppBar,
    Toolbar,
    Paper,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Fade,
    Alert,
    Menu,
    Avatar,
    IconButton,
    InputAdornment,
    Badge,
    LinearProgress,
    Stack,
    alpha,
    Tooltip,
    Zoom,
    Fab
} from '@mui/material';
import {
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    SwapHoriz as SwapHorizIcon,
    Home as HomeIcon,
    Edit as EditIcon,
    Send as SendIcon,
    Visibility as VisibilityIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Create as CreateIcon,
    Done as DoneIcon,
    MoreVert as MoreVertIcon,
    Dashboard as DashboardIcon,
    Notifications as NotificationsIcon,
    NotificationsNone as NotificationsNoneIcon,
    AutoStories as AutoStoriesIcon,
    Psychology as PsychologyIcon,
    Lightbulb as LightbulbIcon,
    RocketLaunch as RocketLaunchIcon,
    Save as SaveIcon,
    Publish as PublishIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
    TrendingUp as TrendingUpIcon,
    Timeline as TimelineIcon,
    MenuBook as MenuBookIcon,
    FormatQuote as FormatQuoteIcon,
    Brush as BrushIcon,
    EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import JoditEditor from 'jodit-react';

// Creative Writing Theme Color Palette
const THEME = {
    primary: '#FF6B6B',        // Coral Red - energetic and creative
    primaryLight: '#FF8E8E',
    primaryDark: '#E84545',
    secondary: '#4ECDC4',      // Mint - calm and focused
    secondaryLight: '#6FD1C9',
    secondaryDark: '#3AA89F',
    accent: '#FFE66D',         // Warm Yellow - inspiration
    accentLight: '#FFF0A5',
    accentDark: '#F7D44A',
    success: '#95E1D3',        // Soft Green - achievement
    warning: '#FFA07A',        // Light Salmon - attention
    error: '#FF6B6B',          // Coral - errors
    background: {
        main: '#FAF9F8',       // Warm White
        paper: '#FFFFFF',
        gradient: 'linear-gradient(135deg, #FFF9F5 0%, #F8F3F0 100%)'
    },
    text: {
        primary: '#2D4059',     // Deep Blue-Gray
        secondary: '#5C6B7E',
        light: '#8D9AA9',
        accent: '#FF6B6B'
    },
    gradient: {
        primary: 'linear-gradient(135deg, #FF6B6B 0%, #E84545 100%)',
        secondary: 'linear-gradient(135deg, #4ECDC4 0%, #3AA89F 100%)',
        accent: 'linear-gradient(135deg, #FFE66D 0%, #F7D44A 100%)',
        sunset: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)'
    }
};

const STATUS_COLORS = {
    draft: { 
        bg: '#F8F3F0', 
        text: '#2D4059', 
        border: '#E8E0DA',
        gradient: 'linear-gradient(135deg, #F8F3F0 0%, #ECE5E0 100%)',
        icon: <CreateIcon />
    },
    submitted: { 
        bg: '#E6F7F5', 
        text: '#4ECDC4', 
        border: '#C1F0EB',
        gradient: 'linear-gradient(135deg, #E6F7F5 0%, #D1F0EC 100%)',
        icon: <SendIcon />
    },
    needs_revision: { 
        bg: '#FFF3E6', 
        text: '#FFA07A', 
        border: '#FFE4D4',
        gradient: 'linear-gradient(135deg, #FFF3E6 0%, #FFE8DC 100%)',
        icon: <BrushIcon />
    },
    published: { 
        bg: '#F0F6FA', 
        text: '#5C6B7E', 
        border: '#E1E8F0',
        gradient: 'linear-gradient(135deg, #F0F6FA 0%, #E5EAF0)',
        icon: <RocketLaunchIcon />
    },
};

const DRAWER_WIDTH = 300;

export default function Dashboard({ articles, categories, auth, notifications }) {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [form, setForm] = useState({ title: '', content: '', category_id: '' });
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [categorySearch, setCategorySearch] = useState('');
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [readNotifications, setReadNotifications] = useState(new Set());
    const [writingProgress, setWritingProgress] = useState(0);
    const [inspirationQuote, setInspirationQuote] = useState('');

    // Inspirational quotes for writers
    const quotes = [
        "The art of writing is the art of discovering what you believe.",
        "Start writing, no matter what. The water does not flow until the faucet is turned on.",
        "You can always edit a bad page. You can't edit a blank page.",
        "The scariest moment is always just before you start.",
        "Fill your paper with the breathings of your heart.",
        "Write what should not be forgotten.",
        "The first draft is just you telling yourself the story."
    ];

    useEffect(() => {
        // Set random inspirational quote
        setInspirationQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    useEffect(() => {
        // Calculate writing progress based on content length
        if (form.content) {
            const wordCount = form.content.split(/\s+/).length;
            const progress = Math.min((wordCount / 500) * 100, 100);
            setWritingProgress(progress);
        } else {
            setWritingProgress(0);
        }
    }, [form.content]);

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post(route('writer.articles.store'), form);
    };

    const handleSubmitArticle = (articleId) => {
        Inertia.post(route('writer.articles.submit', articleId));
    };

    // Calculate unread notifications count
    const unreadCount = notifications?.filter(n => !readNotifications.has(n.id)).length || 0;

    // Initialize read notifications from actual read status
    useEffect(() => {
        if (notifications) {
            const readIds = new Set();
            notifications.forEach(notification => {
                if (notification.read_at) {
                    readIds.add(notification.id);
                }
            });
            setReadNotifications(readIds);
        }
    }, [notifications]);

    const draftArticles = articles.filter(a => a.status.name === 'draft');
    const submittedArticles = articles.filter(a => a.status.name === 'submitted');
    const revisedArticles = articles.filter(a => a.status.name === 'needs_revision');
    const publishedArticles = articles.filter(a => a.status.name === 'published');

    const markNotificationAsRead = async (notificationId) => {
        try {
            await axios.post(route('notifications.mark-read'), {
                notification_id: notificationId
            });
            setReadNotifications(prev => new Set(prev).add(notificationId));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            await axios.post(route('notifications.mark-all-read'));
            if (notifications) {
                const allIds = notifications.map(n => n.id);
                setReadNotifications(new Set(allIds));
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Filter draft articles by search (title or category)
    const filteredDraftArticles = draftArticles.filter(article => 
        categorySearch === '' || 
        article.category.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
        article.title.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const getWordCount = (content) => {
        return content ? content.split(/\s+/).length : 0;
    };

    const getReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = getWordCount(content);
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min read`;
    };

    const renderMainContent = () => {
        switch (activeNav) {
            case 'dashboard':
                return (
                    <Fade in={activeNav === 'dashboard'} timeout={500}>
                        <Box>
                            {/* Welcome Header with Quote */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    mb: 4,
                                    borderRadius: '16px',
                                    background: THEME.gradient.sunset,
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Playfair Display", serif' }}>
                                        Welcome back, {auth?.user?.name?.split(' ')[0] || 'Writer'}!
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontStyle: 'italic' }}>
                                        "{inspirationQuote}"
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Chip
                                            icon={<EmojiEventsIcon />}
                                            label={`${publishedArticles.length} Articles Published`}
                                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                        />
                                        <Chip
                                            icon={<TrendingUpIcon />}
                                            label={`${draftArticles.length} Works in Progress`}
                                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                        />
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -20,
                                        right: -20,
                                        width: 200,
                                        height: 200,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        zIndex: 0
                                    }}
                                />
                            </Paper>

                            {/* Quick Stats */}
                            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: THEME.text.primary }}>
                                Your Writing Studio
                            </Typography>
                            
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={300}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: '16px',
                                                background: 'white',
                                                border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 24px ${alpha(THEME.primary, 0.15)}`
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: '12px',
                                                            background: alpha(THEME.primary, 0.1),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: THEME.primary
                                                        }}
                                                    >
                                                        <CreateIcon />
                                                    </Box>
                                                    <Chip
                                                        label="Drafts"
                                                        size="small"
                                                        sx={{ bgcolor: alpha(THEME.primary, 0.1), color: THEME.primary }}
                                                    />
                                                </Box>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                                    {draftArticles.length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                    Works in Progress
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(draftArticles.length / (articles.length || 1)) * 100}
                                                    sx={{
                                                        mt: 2,
                                                        height: 4,
                                                        borderRadius: 2,
                                                        bgcolor: alpha(THEME.primary, 0.1),
                                                        '& .MuiLinearProgress-bar': {
                                                            background: THEME.gradient.primary,
                                                            borderRadius: 2
                                                        }
                                                    }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={400}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: '16px',
                                                background: 'white',
                                                border: `1px solid ${alpha(THEME.secondary, 0.1)}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 24px ${alpha(THEME.secondary, 0.15)}`
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: '12px',
                                                            background: alpha(THEME.secondary, 0.1),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: THEME.secondary
                                                        }}
                                                    >
                                                        <SendIcon />
                                                    </Box>
                                                    <Chip
                                                        label="Submitted"
                                                        size="small"
                                                        sx={{ bgcolor: alpha(THEME.secondary, 0.1), color: THEME.secondary }}
                                                    />
                                                </Box>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                                    {submittedArticles.length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                    Under Review
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={500}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: '16px',
                                                background: 'white',
                                                border: `1px solid ${alpha(THEME.warning, 0.1)}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 24px ${alpha(THEME.warning, 0.15)}`
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: '12px',
                                                            background: alpha(THEME.warning, 0.1),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: THEME.warning
                                                        }}
                                                    >
                                                        <BrushIcon />
                                                    </Box>
                                                    <Chip
                                                        label="Need Revision"
                                                        size="small"
                                                        sx={{ bgcolor: alpha(THEME.warning, 0.1), color: THEME.warning }}
                                                    />
                                                </Box>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                                    {revisedArticles.length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                    Awaiting Edits
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={600}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: '16px',
                                                background: 'white',
                                                border: `1px solid ${alpha(THEME.success, 0.1)}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 24px ${alpha(THEME.success, 0.15)}`
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: '12px',
                                                            background: alpha(THEME.success, 0.1),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: THEME.success
                                                        }}
                                                    >
                                                        <RocketLaunchIcon />
                                                    </Box>
                                                    <Chip
                                                        label="Published"
                                                        size="small"
                                                        sx={{ bgcolor: alpha(THEME.success, 0.1), color: THEME.success }}
                                                    />
                                                </Box>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                                    {publishedArticles.length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                    Live Articles
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            </Grid>

                            {/* Writing Tips & Inspiration */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: '16px',
                                            background: 'white',
                                            border: `1px solid ${alpha(THEME.accent, 0.2)}`,
                                            p: 3
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.text.primary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LightbulbIcon sx={{ color: THEME.accent }} />
                                            Today's Writing Prompt
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: THEME.text.secondary, mb: 3, fontStyle: 'italic' }}>
                                            "Write about a moment that changed your perspective on creativity."
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<CreateIcon />}
                                            onClick={() => setActiveNav('create')}
                                            sx={{
                                                borderColor: THEME.accent,
                                                color: THEME.text.primary,
                                                '&:hover': {
                                                    borderColor: THEME.accentDark,
                                                    bgcolor: alpha(THEME.accent, 0.1)
                                                }
                                            }}
                                        >
                                            Start Writing
                                        </Button>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: '16px',
                                            background: 'white',
                                            border: `1px solid ${alpha(THEME.secondary, 0.2)}`,
                                            p: 3
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.text.primary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TimelineIcon sx={{ color: THEME.secondary }} />
                                            Your Writing Journey
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>Articles Written</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.secondary }}>{articles.length}</Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(articles.length / 20) * 100}
                                                    sx={{
                                                        height: 6,
                                                        borderRadius: 3,
                                                        bgcolor: alpha(THEME.secondary, 0.1),
                                                        '& .MuiLinearProgress-bar': {
                                                            background: THEME.gradient.secondary,
                                                            borderRadius: 3
                                                        }
                                                    }}
                                                />
                                            </Box>
                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>Publication Rate</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.success }}>
                                                        {articles.length ? Math.round((publishedArticles.length / articles.length) * 100) : 0}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={articles.length ? (publishedArticles.length / articles.length) * 100 : 0}
                                                    sx={{
                                                        height: 6,
                                                        borderRadius: 3,
                                                        bgcolor: alpha(THEME.success, 0.1),
                                                        '& .MuiLinearProgress-bar': {
                                                            background: THEME.gradient.primary,
                                                            borderRadius: 3
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                );

            case 'create':
                return (
                    <Fade in={activeNav === 'create'} timeout={500}>
                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: '16px',
                                    background: 'white',
                                    border: `1px solid ${alpha(THEME.primary, 0.1)}`
                                }}
                            >
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                        Create New Story
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: THEME.text.secondary, mb: 3 }}>
                                        Let your creativity flow. Start writing your next masterpiece.
                                    </Typography>
                                    
                                    {/* Writing Progress */}
                                    {writingProgress > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                    Writing Progress
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.primary }}>
                                                    {Math.round(writingProgress)}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={writingProgress}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 3,
                                                    bgcolor: alpha(THEME.primary, 0.1),
                                                    '& .MuiLinearProgress-bar': {
                                                        background: THEME.gradient.primary,
                                                        borderRadius: 3
                                                    }
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                <Box component="form" onSubmit={handleSubmit}>
                                    <TextField
                                        label="Article Title"
                                        fullWidth
                                        placeholder="Enter a compelling title that captures attention..."
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        sx={{
                                            mb: 3,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: alpha(THEME.background.main, 0.5),
                                                '&:hover fieldset': { borderColor: THEME.primary },
                                                '&.Mui-focused fieldset': { borderColor: THEME.primary },
                                            },
                                        }}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EditIcon sx={{ color: THEME.primary }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Select
                                        fullWidth
                                        value={form.category_id}
                                        onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : '' })}
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return <Typography sx={{ color: THEME.text.light }}>Choose a category for your story</Typography>;
                                            }
                                            const category = categories.find(cat => cat.id === selected);
                                            return category ? category.name : '';
                                        }}
                                        sx={{
                                            mb: 4,
                                            borderRadius: '12px',
                                            backgroundColor: alpha(THEME.background.main, 0.5),
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': { borderColor: THEME.primary },
                                                '&.Mui-focused fieldset': { borderColor: THEME.primary },
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <Typography sx={{ color: THEME.text.light }}>Select a category</Typography>
                                        </MenuItem>
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                        ))}
                                    </Select>

                                    <Typography sx={{ mb: 2, fontWeight: 700, color: THEME.text.primary, fontSize: '0.95rem' }}>
                                        Your Story
                                    </Typography>
                                    
                                    <Paper
                                        sx={{
                                            mb: 4,
                                            border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            backgroundColor: alpha(THEME.background.main, 0.5),
                                        }}
                                    >
                                        <JoditEditor
                                            value={form.content}
                                            onBlur={(newContent) => setForm({ ...form, content: newContent })}
                                            config={{
                                                buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'font', 'fontsize', '|', 'image', 'table', 'link', '|', 'align', '|', 'undo', 'redo'],
                                                theme: 'dark',
                                                showCharsCounter: true,
                                                showWordsCounter: true,
                                                showXPathInStatusbar: false,
                                            }}
                                        />
                                    </Paper>

                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            startIcon={<SaveIcon />}
                                            sx={{
                                                background: THEME.gradient.secondary,
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: '10px',
                                                py: 1.5,
                                                px: 4,
                                                '&:hover': {
                                                    boxShadow: `0 8px 16px ${alpha(THEME.secondary, 0.3)}`
                                                }
                                            }}
                                        >
                                            Save as Draft
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="contained"
                                            size="large"
                                            startIcon={<RocketLaunchIcon />}
                                            onClick={(e) => {
                                                Inertia.post(route('writer.articles.store'), { ...form, submit: true });
                                            }}
                                            sx={{
                                                background: THEME.gradient.primary,
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: '10px',
                                                py: 1.5,
                                                px: 4,
                                                '&:hover': {
                                                    boxShadow: `0 8px 16px ${alpha(THEME.primary, 0.3)}`
                                                }
                                            }}
                                        >
                                            Submit for Review
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </Fade>
                );

            case 'drafts':
                return (
                    <Fade in={activeNav === 'drafts'} timeout={500}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                    My Drafts
                                </Typography>
                                <Typography variant="body1" sx={{ color: THEME.text.secondary, mb: 3 }}>
                                    You have {draftArticles.length} work{draftArticles.length !== 1 ? 's' : ''} in progress
                                </Typography>
                                
                                <TextField
                                    fullWidth
                                    placeholder="Search your drafts by title or category..."
                                    value={categorySearch}
                                    onChange={(e) => setCategorySearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: THEME.text.light }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: 'white',
                                            '&:hover fieldset': { borderColor: THEME.primary },
                                            '&.Mui-focused fieldset': { borderColor: THEME.primary },
                                        },
                                    }}
                                    variant="outlined"
                                />
                            </Box>

                            {filteredDraftArticles.length === 0 ? (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 6,
                                        borderRadius: '16px',
                                        background: 'white',
                                        textAlign: 'center',
                                        border: `1px solid ${alpha(THEME.primary, 0.1)}`
                                    }}
                                >
                                    <CreateIcon sx={{ fontSize: 60, color: THEME.text.light, mb: 2 }} />
                                    <Typography variant="h6" sx={{ color: THEME.text.primary, mb: 1 }}>
                                        {categorySearch ? 'No drafts found' : 'Start Your First Draft'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: THEME.text.secondary, mb: 3 }}>
                                        {categorySearch ? 'Try a different search term' : 'Begin writing your first article'}
                                    </Typography>
                                    {!categorySearch && (
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => setActiveNav('create')}
                                            sx={{
                                                background: THEME.gradient.primary,
                                                color: 'white',
                                                '&:hover': {
                                                    boxShadow: `0 8px 16px ${alpha(THEME.primary, 0.3)}`
                                                }
                                            }}
                                        >
                                            Create New Article
                                        </Button>
                                    )}
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {filteredDraftArticles.map((article, index) => (
                                        <Grid key={article.id} item xs={12} md={6} lg={4}>
                                            <Zoom in timeout={300 + index * 100}>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        borderRadius: '16px',
                                                        background: STATUS_COLORS.draft.gradient,
                                                        border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: `0 12px 24px ${alpha(THEME.primary, 0.15)}`,
                                                            borderColor: THEME.primary
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                            <Chip
                                                                icon={<CreateIcon />}
                                                                label="Draft"
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha(THEME.primary, 0.1),
                                                                    color: THEME.primary,
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                            <Typography variant="caption" sx={{ color: THEME.text.light }}>
                                                                {getReadTime(article.content)}
                                                            </Typography>
                                                        </Box>

                                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: THEME.text.primary }}>
                                                            {article.title}
                                                        </Typography>

                                                        <Chip
                                                            label={article.category.name}
                                                            size="small"
                                                            sx={{
                                                                mb: 2,
                                                                bgcolor: alpha(THEME.secondary, 0.1),
                                                                color: THEME.secondary
                                                            }}
                                                        />

                                                        <Box sx={{ mt: 2 }}>
                                                            <Typography variant="caption" sx={{ color: THEME.text.light, display: 'block', mb: 0.5 }}>
                                                                Last edited
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                                {new Date(article.updated_at).toLocaleDateString()} at {new Date(article.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </Typography>
                                                        </Box>

                                                        {/* Writing Progress for this draft */}
                                                        {article.content && (
                                                            <Box sx={{ mt: 2 }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                    <Typography variant="caption" sx={{ color: THEME.text.light }}>
                                                                        Progress
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ color: THEME.primary }}>
                                                                        {Math.min(Math.round((getWordCount(article.content) / 500) * 100), 100)}%
                                                                    </Typography>
                                                                </Box>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={Math.min((getWordCount(article.content) / 500) * 100, 100)}
                                                                    sx={{
                                                                        height: 4,
                                                                        borderRadius: 2,
                                                                        bgcolor: alpha(THEME.primary, 0.1),
                                                                        '& .MuiLinearProgress-bar': {
                                                                            background: THEME.gradient.primary,
                                                                            borderRadius: 2
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        )}
                                                    </CardContent>

                                                    <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                                                        <Tooltip title="Continue Writing">
                                                            <Button
                                                                fullWidth
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<EditIcon />}
                                                                onClick={() => window.location.href = route('writer.articles.show', article.id)}
                                                                sx={{
                                                                    borderColor: alpha(THEME.primary, 0.3),
                                                                    color: THEME.text.primary,
                                                                    '&:hover': {
                                                                        borderColor: THEME.primary,
                                                                        bgcolor: alpha(THEME.primary, 0.04)
                                                                    }
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip title="Submit for Review">
                                                            <Button
                                                                fullWidth
                                                                size="small"
                                                                variant="contained"
                                                                startIcon={<SendIcon />}
                                                                onClick={() => handleSubmitArticle(article.id)}
                                                                sx={{
                                                                    background: THEME.gradient.secondary,
                                                                    color: 'white',
                                                                    '&:hover': {
                                                                        boxShadow: `0 4px 12px ${alpha(THEME.secondary, 0.3)}`
                                                                    }
                                                                }}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </Tooltip>
                                                    </CardActions>
                                                </Card>
                                            </Zoom>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Fade>
                );

            case 'submitted':
                return (
                    <Fade in={activeNav === 'submitted'} timeout={500}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                    Submitted Articles
                                </Typography>
                                <Typography variant="body1" sx={{ color: THEME.text.secondary }}>
                                    {submittedArticles.length} under review, {revisedArticles.length} awaiting your revisions
                                </Typography>
                            </Box>

                            {submittedArticles.length === 0 && revisedArticles.length === 0 ? (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 6,
                                        borderRadius: '16px',
                                        background: 'white',
                                        textAlign: 'center',
                                        border: `1px solid ${alpha(THEME.secondary, 0.1)}`
                                    }}
                                >
                                    <SendIcon sx={{ fontSize: 60, color: THEME.text.light, mb: 2 }} />
                                    <Typography variant="h6" sx={{ color: THEME.text.primary, mb: 1 }}>
                                        No Submitted Articles
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                        When you submit articles for review, they'll appear here
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {/* Articles Under Review */}
                                    {submittedArticles.map((article, index) => (
                                        <Grid key={article.id} item xs={12}>
                                            <Zoom in timeout={300 + index * 100}>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: '16px',
                                                        background: 'white',
                                                        border: `1px solid ${alpha(THEME.secondary, 0.2)}`,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateX(4px)',
                                                            boxShadow: `0 8px 16px ${alpha(THEME.secondary, 0.15)}`,
                                                            borderColor: THEME.secondary
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12} md={8}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                                    <Chip
                                                                        icon={<SendIcon />}
                                                                        label="Under Review"
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: alpha(THEME.secondary, 0.1),
                                                                            color: THEME.secondary,
                                                                            fontWeight: 600
                                                                        }}
                                                                    />
                                                                    <Chip
                                                                        label={article.category.name}
                                                                        size="small"
                                                                        sx={{ bgcolor: alpha(THEME.primary, 0.1), color: THEME.primary }}
                                                                    />
                                                                </Box>
                                                                
                                                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: THEME.text.primary }}>
                                                                    {article.title}
                                                                </Typography>
                                                                
                                                                <Typography variant="body2" sx={{ color: THEME.text.secondary, mb: 1 }}>
                                                                    Submitted on {new Date(article.created_at).toLocaleDateString()}
                                                                </Typography>
                                                            </Grid>
                                                            
                                                            <Grid item xs={12} md={4}>
                                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                                    <Tooltip title="View Article">
                                                                        <Button
                                                                            variant="outlined"
                                                                            startIcon={<VisibilityIcon />}
                                                                            onClick={() => window.location.href = route('writer.articles.show', article.id)}
                                                                            sx={{
                                                                                borderColor: alpha(THEME.secondary, 0.3),
                                                                                color: THEME.text.primary
                                                                            }}
                                                                        >
                                                                            View
                                                                        </Button>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Zoom>
                                        </Grid>
                                    ))}

                                    {/* Articles Needing Revision */}
                                    {revisedArticles.map((article, index) => (
                                        <Grid key={article.id} item xs={12}>
                                            <Zoom in timeout={300 + index * 100}>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: '16px',
                                                        background: 'white',
                                                        border: `1px solid ${alpha(THEME.warning, 0.2)}`,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateX(4px)',
                                                            boxShadow: `0 8px 16px ${alpha(THEME.warning, 0.15)}`,
                                                            borderColor: THEME.warning
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12} md={8}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                                    <Chip
                                                                        icon={<BrushIcon />}
                                                                        label="Needs Revision"
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: alpha(THEME.warning, 0.1),
                                                                            color: THEME.warning,
                                                                            fontWeight: 600
                                                                        }}
                                                                    />
                                                                    <Chip
                                                                        label={article.category.name}
                                                                        size="small"
                                                                        sx={{ bgcolor: alpha(THEME.primary, 0.1), color: THEME.primary }}
                                                                    />
                                                                </Box>
                                                                
                                                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: THEME.text.primary }}>
                                                                    {article.title}
                                                                </Typography>
                                                                
                                                                {article.latest_feedback && (
                                                                    <Paper
                                                                        sx={{
                                                                            p: 2,
                                                                            mt: 2,
                                                                            bgcolor: alpha(THEME.warning, 0.05),
                                                                            borderRadius: '8px',
                                                                            border: `1px solid ${alpha(THEME.warning, 0.1)}`
                                                                        }}
                                                                    >
                                                                        <Typography variant="caption" sx={{ color: THEME.warning, fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                                            Editor's Feedback:
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ color: THEME.text.secondary, fontStyle: 'italic' }}>
                                                                            "{article.latest_feedback.comments}"
                                                                        </Typography>
                                                                    </Paper>
                                                                )}
                                                            </Grid>
                                                            
                                                            <Grid item xs={12} md={4}>
                                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                                    <Tooltip title="Revise Article">
                                                                        <Button
                                                                            variant="contained"
                                                                            startIcon={<EditIcon />}
                                                                            onClick={() => window.location.href = route('writer.articles.revise.page', article.id)}
                                                                            sx={{
                                                                                background: THEME.gradient.warning,
                                                                                color: 'white',
                                                                                '&:hover': {
                                                                                    boxShadow: `0 4px 12px ${alpha(THEME.warning, 0.3)}`
                                                                                }
                                                                            }}
                                                                        >
                                                                            Revise Now
                                                                        </Button>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
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

            case 'published':
                return (
                    <Fade in={activeNav === 'published'} timeout={500}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                    Published Articles
                                </Typography>
                                <Typography variant="body1" sx={{ color: THEME.text.secondary }}>
                                    {publishedArticles.length} article{publishedArticles.length !== 1 ? 's' : ''} published and available for readers
                                </Typography>
                            </Box>

                            {publishedArticles.length === 0 ? (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 6,
                                        borderRadius: '16px',
                                        background: 'white',
                                        textAlign: 'center',
                                        border: `1px solid ${alpha(THEME.success, 0.1)}`
                                    }}
                                >
                                    <RocketLaunchIcon sx={{ fontSize: 60, color: THEME.text.light, mb: 2 }} />
                                    <Typography variant="h6" sx={{ color: THEME.text.primary, mb: 1 }}>
                                        No Published Articles Yet
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                        Keep writing! Your published works will appear here
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {publishedArticles.map((article, index) => (
                                        <Grid key={article.id} item xs={12} md={6}>
                                            <Zoom in timeout={300 + index * 100}>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        height: '100%',
                                                        borderRadius: '16px',
                                                        background: 'white',
                                                        border: `1px solid ${alpha(THEME.success, 0.2)}`,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: `0 12px 24px ${alpha(THEME.success, 0.15)}`,
                                                            borderColor: THEME.success
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                            <Chip
                                                                icon={<RocketLaunchIcon />}
                                                                label="Published"
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha(THEME.success, 0.1),
                                                                    color: THEME.success,
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Tooltip title="Views">
                                                                    <Chip
                                                                        icon={<VisibilityIcon />}
                                                                        label={article.views || 0}
                                                                        size="small"
                                                                        sx={{ bgcolor: alpha(THEME.primary, 0.1), color: THEME.primary }}
                                                                    />
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>

                                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: THEME.text.primary }}>
                                                            {article.title}
                                                        </Typography>

                                                        <Chip
                                                            label={article.category.name}
                                                            size="small"
                                                            sx={{
                                                                mb: 2,
                                                                bgcolor: alpha(THEME.secondary, 0.1),
                                                                color: THEME.secondary
                                                            }}
                                                        />

                                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="caption" sx={{ color: THEME.text.light }}>
                                                                Published on {new Date(article.updated_at).toLocaleDateString()}
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                endIcon={<VisibilityIcon />}
                                                                onClick={() => window.location.href = route('writer.articles.show', article.id)}
                                                                sx={{
                                                                    color: THEME.primary,
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                Read
                                                            </Button>
                                                        </Box>
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
            background: THEME.background.gradient
        }}>
            {/* Header */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${alpha(THEME.primary, 0.1)}`,
                    zIndex: 1201,
                    height: 80
                }}
            >
                <Toolbar sx={{ minHeight: 80 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                background: THEME.gradient.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 4px 12px ${alpha(THEME.primary, 0.3)}`
                            }}
                        >
                            <AutoStoriesIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.text.primary, letterSpacing: '-0.5px' }}>
                                Creative Writing Studio
                            </Typography>
                            <Typography variant="caption" sx={{ color: THEME.text.secondary }}>
                                Where words come to life
                            </Typography>
                        </Box>
                    </Box>
                    
                    {/* Notification Bell */}
                    <Tooltip title="Notifications">
                        <IconButton
                            onClick={(e) => setNotificationAnchor(e.currentTarget)}
                            sx={{ 
                                mr: 2,
                                width: 48,
                                height: 48,
                                bgcolor: alpha(THEME.primary, 0.05),
                                '&:hover': {
                                    bgcolor: alpha(THEME.primary, 0.1)
                                }
                            }}
                        >
                            <Badge 
                                badgeContent={unreadCount} 
                                sx={{
                                    '& .MuiBadge-badge': {
                                        bgcolor: THEME.primary,
                                        color: 'white'
                                    }
                                }}
                            >
                                {unreadCount > 0 ? (
                                    <NotificationsIcon sx={{ color: THEME.primary }} />
                                ) : (
                                    <NotificationsNoneIcon sx={{ color: THEME.text.secondary }} />
                                )}
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    
                    {/* Home Button */}
                    <Tooltip title="Home">
                        <IconButton
                            onClick={() => Inertia.visit('/')}
                            sx={{ 
                                mr: 2,
                                width: 48,
                                height: 48,
                                bgcolor: alpha(THEME.primary, 0.05),
                                '&:hover': {
                                    bgcolor: alpha(THEME.primary, 0.1)
                                }
                            }}
                        >
                            <HomeIcon sx={{ color: THEME.primary }} />
                        </IconButton>
                    </Tooltip>
                    
                    {/* Profile Button */}
                    <Tooltip title="Profile">
                        <IconButton
                            onClick={(e) => setProfileAnchor(e.currentTarget)}
                            sx={{ 
                                width: 48,
                                height: 48,
                                background: THEME.gradient.primary,
                                '&:hover': {
                                    boxShadow: `0 8px 16px ${alpha(THEME.primary, 0.3)}`
                                }
                            }}
                        >
                            <Avatar sx={{ 
                                width: 40, 
                                height: 40,
                                bgcolor: 'white',
                                color: THEME.primary,
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}>
                                {auth?.user?.name?.charAt(0) || 'W'}
                            </Avatar>
                        </IconButton>
                    </Tooltip>

                    {/* Profile Menu */}
                    <Menu
                        anchorEl={profileAnchor}
                        open={Boolean(profileAnchor)}
                        onClose={() => setProfileAnchor(null)}
                        PaperProps={{
                            sx: {
                                minWidth: 250,
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                mt: 1
                            }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.text.primary }}>
                                {auth?.user?.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: THEME.text.secondary }}>
                                {auth?.user?.email}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={() => {
                            setProfileAnchor(null);
                            Inertia.get(route('profile.edit'));
                        }}>
                            <AccountCircleIcon sx={{ mr: 1.5, fontSize: 20, color: THEME.primary }} />
                            Profile Settings
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setProfileAnchor(null);
                            Inertia.post('/logout');
                        }}>
                            <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: THEME.error }} />
                            Sign Out
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/sample/switch/editor';
                            }}
                            sx={{ color: THEME.secondary }}
                        >
                            <SwapHorizIcon sx={{ mr: 1.5, fontSize: 20 }} />
                            Switch to Editor View
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/sample/switch/student';
                            }}
                            sx={{ color: THEME.secondary }}
                        >
                            <SwapHorizIcon sx={{ mr: 1.5, fontSize: 20 }} />
                            Switch to Student View
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
                                border: `1px solid ${alpha(THEME.primary, 0.1)}`
                            }
                        }}
                    >
                        <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(THEME.primary, 0.1)}` }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.text.primary }}>
                                Notifications from Editors
                            </Typography>
                        </Box>
                        
                        {notifications?.length > 0 && (
                            <MenuItem
                                onClick={async () => {
                                    await markAllNotificationsAsRead();
                                    setNotificationAnchor(null);
                                }}
                                sx={{ 
                                    py: 1.5,
                                    bgcolor: alpha(THEME.primary, 0.02),
                                    borderBottom: `1px solid ${alpha(THEME.primary, 0.1)}`
                                }}
                            >
                                <Typography variant="body2" sx={{ color: THEME.primary, fontWeight: 600, textAlign: 'center', width: '100%' }}>
                                    Mark All as Read
                                </Typography>
                            </MenuItem>
                        )}
                        
                        {notifications?.length > 0 ? (
                            notifications.map((notification) => (
                                <MenuItem 
                                    key={notification.id} 
                                    sx={{ 
                                        py: 2, 
                                        px: 2,
                                        flexDirection: 'column', 
                                        alignItems: 'flex-start',
                                        cursor: 'pointer',
                                        borderBottom: `1px solid ${alpha(THEME.primary, 0.05)}`,
                                        bgcolor: readNotifications.has(notification.id) ? 'transparent' : alpha(THEME.primary, 0.02),
                                        '&:hover': { bgcolor: alpha(THEME.primary, 0.04) }
                                    }}
                                    onClick={() => {
                                        markNotificationAsRead(notification.id);
                                        setNotificationAnchor(null);
                                        if (notification.data.type === 'revision_requested') {
                                            window.location.href = route('writer.articles.revise.page', notification.data.article_id);
                                        } else if (notification.data.type === 'article_published') {
                                            window.location.href = route('writer.articles.show', notification.data.article_id);
                                        }
                                    }}
                                >
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            fontWeight: readNotifications.has(notification.id) ? 400 : 700,
                                            color: THEME.text.primary,
                                            mb: 0.5
                                        }}
                                    >
                                        {notification.data.message}
                                    </Typography>
                                    
                                    {notification.data.type === 'revision_requested' && notification.data.comments && (
                                        <Paper
                                            sx={{
                                                p: 1.5,
                                                mt: 1,
                                                width: '100%',
                                                bgcolor: alpha(THEME.warning, 0.05),
                                                borderRadius: '8px',
                                                border: `1px solid ${alpha(THEME.warning, 0.2)}`
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ fontWeight: 600, color: THEME.warning, display: 'block', mb: 0.5 }}>
                                                Editor's Comments:
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: THEME.text.secondary, fontStyle: 'italic' }}>
                                                "{notification.data.comments}"
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: THEME.warning, display: 'block', mt: 0.5 }}>
                                                — {notification.data.editor_name}
                                            </Typography>
                                        </Paper>
                                    )}
                                    
                                    {notification.data.type === 'article_published' && (
                                        <Paper
                                            sx={{
                                                p: 1.5,
                                                mt: 1,
                                                width: '100%',
                                                bgcolor: alpha(THEME.success, 0.05),
                                                borderRadius: '8px',
                                                border: `1px solid ${alpha(THEME.success, 0.2)}`
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ color: THEME.success }}>
                                                🎉 Your article is now live and available for readers!
                                            </Typography>
                                        </Paper>
                                    )}
                                    
                                    <Typography variant="caption" sx={{ color: THEME.text.light, display: 'block', mt: 1 }}>
                                        {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled sx={{ py: 3 }}>
                                <Typography variant="body2" sx={{ color: THEME.text.light, textAlign: 'center', width: '100%' }}>
                                    No notifications from editors
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
                        bgcolor: 'white',
                        borderRight: `1px solid ${alpha(THEME.primary, 0.1)}`,
                        mt: '80px',
                        p: 2
                    }
                }}
            >
                <List>
                    <ListItem
                        button
                        onClick={() => setActiveNav('dashboard')}
                        sx={{
                            borderRadius: '12px',
                            mb: 1,
                            bgcolor: activeNav === 'dashboard' ? alpha(THEME.primary, 0.08) : 'transparent',
                            '&:hover': {
                                bgcolor: activeNav === 'dashboard' ? alpha(THEME.primary, 0.12) : alpha(THEME.primary, 0.04)
                            }
                        }}
                    >
                        <ListItemIcon>
                            <DashboardIcon sx={{ color: activeNav === 'dashboard' ? THEME.primary : THEME.text.light }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Dashboard"
                            primaryTypographyProps={{
                                sx: { 
                                    fontWeight: activeNav === 'dashboard' ? 700 : 500,
                                    color: activeNav === 'dashboard' ? THEME.primary : THEME.text.primary
                                }
                            }}
                        />
                    </ListItem>

                    <ListItem
                        button
                        onClick={() => setActiveNav('create')}
                        sx={{
                            borderRadius: '12px',
                            mb: 1,
                            bgcolor: activeNav === 'create' ? alpha(THEME.primary, 0.08) : 'transparent',
                            '&:hover': {
                                bgcolor: activeNav === 'create' ? alpha(THEME.primary, 0.12) : alpha(THEME.primary, 0.04)
                            }
                        }}
                    >
                        <ListItemIcon>
                            <AddIcon sx={{ color: activeNav === 'create' ? THEME.primary : THEME.text.light }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Create Article"
                            primaryTypographyProps={{
                                sx: { 
                                    fontWeight: activeNav === 'create' ? 700 : 500,
                                    color: activeNav === 'create' ? THEME.primary : THEME.text.primary
                                }
                            }}
                        />
                    </ListItem>

                    <ListItem
                        button
                        onClick={() => setActiveNav('drafts')}
                        sx={{
                            borderRadius: '12px',
                            mb: 1,
                            bgcolor: activeNav === 'drafts' ? alpha(THEME.primary, 0.08) : 'transparent',
                            '&:hover': {
                                bgcolor: activeNav === 'drafts' ? alpha(THEME.primary, 0.12) : alpha(THEME.primary, 0.04)
                            }
                        }}
                    >
                        <ListItemIcon>
                            <Badge badgeContent={draftArticles.length} color="primary">
                                <CreateIcon sx={{ color: activeNav === 'drafts' ? THEME.primary : THEME.text.light }} />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText 
                            primary="My Drafts"
                            secondary={`${draftArticles.length} in progress`}
                            primaryTypographyProps={{
                                sx: { 
                                    fontWeight: activeNav === 'drafts' ? 700 : 500,
                                    color: activeNav === 'drafts' ? THEME.primary : THEME.text.primary
                                }
                            }}
                            secondaryTypographyProps={{
                                sx: { color: THEME.text.light }
                            }}
                        />
                    </ListItem>

                    <ListItem
                        button
                        onClick={() => setActiveNav('submitted')}
                        sx={{
                            borderRadius: '12px',
                            mb: 1,
                            bgcolor: activeNav === 'submitted' ? alpha(THEME.primary, 0.08) : 'transparent',
                            '&:hover': {
                                bgcolor: activeNav === 'submitted' ? alpha(THEME.primary, 0.12) : alpha(THEME.primary, 0.04)
                            }
                        }}
                    >
                        <ListItemIcon>
                            <Badge 
                                badgeContent={submittedArticles.length + revisedArticles.length} 
                                color={revisedArticles.length > 0 ? 'warning' : 'secondary'}
                            >
                                <SendIcon sx={{ color: activeNav === 'submitted' ? THEME.primary : THEME.text.light }} />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText 
                            primary="Submitted Articles"
                            secondary={`${submittedArticles.length} under review, ${revisedArticles.length} need revision`}
                            primaryTypographyProps={{
                                sx: { 
                                    fontWeight: activeNav === 'submitted' ? 700 : 500,
                                    color: activeNav === 'submitted' ? THEME.primary : THEME.text.primary
                                }
                            }}
                            secondaryTypographyProps={{
                                sx: { color: THEME.text.light }
                            }}
                        />
                    </ListItem>

                    <ListItem
                        button
                        onClick={() => setActiveNav('published')}
                        sx={{
                            borderRadius: '12px',
                            bgcolor: activeNav === 'published' ? alpha(THEME.primary, 0.08) : 'transparent',
                            '&:hover': {
                                bgcolor: activeNav === 'published' ? alpha(THEME.primary, 0.12) : alpha(THEME.primary, 0.04)
                            }
                        }}
                    >
                        <ListItemIcon>
                            <RocketLaunchIcon sx={{ color: activeNav === 'published' ? THEME.primary : THEME.text.light }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Published Articles"
                            secondary={`${publishedArticles.length} live`}
                            primaryTypographyProps={{
                                sx: { 
                                    fontWeight: activeNav === 'published' ? 700 : 500,
                                    color: activeNav === 'published' ? THEME.primary : THEME.text.primary
                                }
                            }}
                            secondaryTypographyProps={{
                                sx: { color: THEME.text.light }
                            }}
                        />
                    </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Writing Tips */}
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: THEME.text.light, mb: 2 }}>
                        Writing Tips
                    </Typography>
                    <List dense>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <LightbulbIcon sx={{ fontSize: 16, color: THEME.accent }} />
                            </ListItemIcon>
                            <ListItemText primary="Write without editing" secondary="Let your ideas flow first" secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }} />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <LightbulbIcon sx={{ fontSize: 16, color: THEME.accent }} />
                            </ListItemIcon>
                            <ListItemText primary="Set daily word goals" secondary="500 words a day adds up" secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }} />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <LightbulbIcon sx={{ fontSize: 16, color: THEME.accent }} />
                            </ListItemIcon>
                            <ListItemText primary="Read aloud" secondary="Hear how your writing sounds" secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }} />
                        </ListItem>
                    </List>
                </Box>

                {/* Quick Quote */}
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: '12px',
                            background: THEME.gradient.accent,
                            color: THEME.text.primary
                        }}
                    >
                        <FormatQuoteIcon sx={{ fontSize: 20, opacity: 0.5, mb: 1 }} />
                        <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic' }}>
                            "The first draft is just you telling yourself the story."
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                            — Terry Pratchett
                        </Typography>
                    </Paper>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: '80px',
                    p: 4,
                    minHeight: 'calc(100vh - 80px)',
                    bgcolor: THEME.background.gradient
                }}
            >
                <Container maxWidth="xl" sx={{ height: '100%' }}>
                    {renderMainContent()}
                </Container>
            </Box>

            {/* Floating Action Button for Quick Create */}
            {activeNav !== 'create' && (
                <Tooltip title="Quick Create" arrow>
                    <Fab
                        color="primary"
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            background: THEME.gradient.primary,
                            '&:hover': {
                                boxShadow: `0 8px 20px ${alpha(THEME.primary, 0.4)}`
                            }
                        }}
                        onClick={() => setActiveNav('create')}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>
            )}
        </Box>
    );
}