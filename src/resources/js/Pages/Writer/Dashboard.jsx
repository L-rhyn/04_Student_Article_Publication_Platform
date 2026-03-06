import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
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
    ListItemText as MuiListItemText,
    Zoom,
    Grow,
    Slide,
    alpha
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
    Brush as BrushIcon,
    AutoStories as AutoStoriesIcon,
    EmojiEmotions as EmojiIcon,
    Rocket as RocketIcon,
    Celebration as CelebrationIcon,
    Star as StarIcon,
    Forest as ForestIcon,
    Pets as PetsIcon,
    Cake as CakeIcon,
    MusicNote as MusicIcon,
    ThumbUp as ThumbUpIcon,
    Lightbulb as LightbulbIcon,
    WbSunny as SunIcon,
    Cloud as CloudIcon,
    Menu as MenuIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const STATUS_COLORS = {
    draft: { bg: '#FFE66D', text: '#FF6B6B', border: '#FF9F1C', icon: '✏️' },
    submitted: { bg: '#4ECDC4', text: '#FFFFFF', border: '#6BAA6B', icon: '🚀' },
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

// Fun character icons for categories
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

export default function Dashboard({ articles, categories, auth, notifications }) {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [form, setForm] = useState({ title: '', content: '', category_id: '' });
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [categorySearch, setCategorySearch] = useState('');
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [readNotifications, setReadNotifications] = useState(new Set());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [floatingIcons] = useState(() => {
        const icons = [
            <BrushIcon />, <PetsIcon />, <CakeIcon />, <MusicIcon />,
            <StarIcon />, <ForestIcon />, <SunIcon />, <CloudIcon />
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

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post(route('writer.articles.store'), form);
    };

    const handleSubmitArticle = (articleId) => {
        Inertia.post(route('writer.articles.submit', articleId));
    };

    // Calculate unread notifications count
    const unreadCount = notifications?.filter(n => !readNotifications.has(n.id)).length || 0;

    const draftArticles = articles.filter(a => a.status.name === 'draft');
    const submittedArticles = articles.filter(a => a.status.name === 'submitted');
    const revisedArticles = articles.filter(a => a.status.name === 'needs_revision');
    const publishedArticles = articles.filter(a => a.status.name === 'published');

    // Filter draft articles by search (title or category)
    const filteredDraftArticles = draftArticles.filter(article => 
        categorySearch === '' || 
        article.category.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
        article.title.toLowerCase().includes(categorySearch.toLowerCase())
    );

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
                                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.purple} 100%)`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: `4px solid ${THEME.accent}`,
                                    boxShadow: `8px 8px 0 ${alpha(THEME.primary, 0.3)}`
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
                                        Welcome back, {auth?.user?.name?.split(' ')[0]}! 🎨
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontFamily: '"Comic Sans MS", cursive',
                                            color: THEME.accent,
                                            mb: 3
                                        }}
                                    >
                                        Your imagination is the limit. What article will you create today?
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => setActiveNav('create')}
                                        startIcon={<RocketIcon />}
                                        sx={{
                                            bgcolor: THEME.accent,
                                            color: THEME.primary,
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
                                        Start New Article
                                    </Button>
                                </Box>
                                
                                {/* Floating icons in banner */}
                                <Box sx={{ position: 'absolute', top: 20, right: 20, opacity: 0.2 }}>
                                    <AutoStoriesIcon sx={{ fontSize: 100, color: 'white' }} />
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
                                Your Article Stats
                                <StarIcon sx={{ color: THEME.accent, fontSize: 40 }} />
                            </Typography>
                            
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={500}>
                                        <Card sx={{ 
                                            p: 3, 
                                            borderRadius: 8,
                                            textAlign: 'center',
                                            background: `linear-gradient(135deg, ${THEME.blue}20 0%, ${THEME.secondary}20 100%)`,
                                            border: `4px solid ${THEME.blue}`,
                                            boxShadow: `6px 6px 0 ${THEME.blue}`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-4px) translateX(-4px)',
                                                boxShadow: `10px 10px 0 ${THEME.blue}`
                                            }
                                        }}>
                                            <Box sx={{ position: 'absolute', top: 10, right: 10, fontSize: '2rem' }}>
                                                📝
                                            </Box>
                                            <CardContent>
                                                <Typography variant="h2" sx={{ color: THEME.blue, mb: 2, fontWeight: 'bold' }}>
                                                    {draftArticles.length}
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                                    Drafts in Progress
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                                
                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={700}>
                                        <Card sx={{ 
                                            p: 3, 
                                            borderRadius: 8,
                                            textAlign: 'center',
                                            background: `linear-gradient(135deg, ${THEME.orange}20 0%, ${THEME.accent}20 100%)`,
                                            border: `4px solid ${THEME.orange}`,
                                            boxShadow: `6px 6px 0 ${THEME.orange}`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-4px) translateX(-4px)',
                                                boxShadow: `10px 10px 0 ${THEME.orange}`
                                            }
                                        }}>
                                            <Box sx={{ position: 'absolute', top: 10, right: 10, fontSize: '2rem' }}>
                                                🚀
                                            </Box>
                                            <CardContent>
                                                <Typography variant="h2" sx={{ color: THEME.orange, mb: 2, fontWeight: 'bold' }}>
                                                    {submittedArticles.length}
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                                    Under Review
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                                
                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={900}>
                                        <Card sx={{ 
                                            p: 3, 
                                            borderRadius: 8,
                                            textAlign: 'center',
                                            background: `linear-gradient(135deg, ${THEME.primary}20 0%, ${THEME.pink}20 100%)`,
                                            border: `4px solid ${THEME.primary}`,
                                            boxShadow: `6px 6px 0 ${THEME.primary}`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-4px) translateX(-4px)',
                                                boxShadow: `10px 10px 0 ${THEME.primary}`
                                            }
                                        }}>
                                            <Box sx={{ position: 'absolute', top: 10, right: 10, fontSize: '2rem' }}>
                                                🔄
                                            </Box>
                                            <CardContent>
                                                <Typography variant="h2" sx={{ color: THEME.primary, mb: 2, fontWeight: 'bold' }}>
                                                    {revisedArticles.length}
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                                    Need Revision
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={1100}>
                                        <Card sx={{ 
                                            p: 3, 
                                            borderRadius: 8,
                                            textAlign: 'center',
                                            background: `linear-gradient(135deg, ${THEME.green}20 0%, ${THEME.secondary}20 100%)`,
                                            border: `4px solid ${THEME.green}`,
                                            boxShadow: `6px 6px 0 ${THEME.green}`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-4px) translateX(-4px)',
                                                boxShadow: `10px 10px 0 ${THEME.green}`
                                            }
                                        }}>
                                            <Box sx={{ position: 'absolute', top: 10, right: 10, fontSize: '2rem' }}>
                                                ✨
                                            </Box>
                                            <CardContent>
                                                <Typography variant="h2" sx={{ color: THEME.green, mb: 2, fontWeight: 'bold' }}>
                                                    {publishedArticles.length}
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                                    Published Stories
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            </Grid>
                            
                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                <Grid item xs={12}>
                                    <Grow in timeout={1300}>
                                        <Card sx={{ 
                                            p: 4, 
                                            borderRadius: 8,
                                            background: `linear-gradient(135deg, ${THEME.accent}20 0%, ${THEME.secondary}20 100%)`,
                                            border: `4px solid ${THEME.accent}`,
                                            boxShadow: `6px 6px 0 ${THEME.accent}`
                                        }}>
                                            <CardContent>
                                                <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold', color: THEME.text, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <CelebrationIcon sx={{ color: THEME.primary }} />
                                                    Your Writing Journey
                                                    <CelebrationIcon sx={{ color: THEME.primary }} />
                                                </Typography>
                                                
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white', borderRadius: 4 }}>
                                                        <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 600 }}>
                                                            Total Stories Created
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Typography variant="h3" sx={{ color: THEME.blue, fontWeight: 'bold' }}>
                                                                {articles.length}
                                                            </Typography>
                                                            <span style={{ fontSize: '2rem' }}>📚</span>
                                                        </Box>
                                                    </Paper>
                                                    
                                                    <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white', borderRadius: 4 }}>
                                                        <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 600 }}>
                                                            Stories Published
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Typography variant="h3" sx={{ color: THEME.green, fontWeight: 'bold' }}>
                                                                {publishedArticles.length}
                                                            </Typography>
                                                            <span style={{ fontSize: '2rem' }}>✨</span>
                                                        </Box>
                                                    </Paper>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grow>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                );

            case 'create':
                return (
                    <Fade in={activeNav === 'create'} timeout={800}>
                        <Paper
                            sx={{
                                p: 4,
                                borderRadius: 8,
                                background: THEME.background,
                                boxShadow: `8px 8px 0 ${THEME.primary}`,
                                border: `4px solid ${THEME.secondary}`,
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: '"Comic Sans MS", cursive',
                                    fontWeight: 'bold',
                                    color: THEME.primary,
                                    mb: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}
                            >
                                <BrushIcon sx={{ fontSize: 40 }} />
                                Create a New Article
                                <BrushIcon sx={{ fontSize: 40 }} />
                            </Typography>
                            <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 4 }}>
                                Let your imagination run wild! ✨
                            </Typography>
                            
                            <Box component="form" onSubmit={handleSubmit}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontFamily: '"Comic Sans MS", cursive',
                                            color: THEME.purple,
                                            mb: 1,
                                            ml: 1
                                        }}
                                    >
                                        📖 Article Title
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Give your article a magical title..."
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: 'white',
                                                borderRadius: 40,
                                                border: `3px solid ${THEME.secondary}`,
                                                fontFamily: '"Comic Sans MS", cursive',
                                                '&:hover fieldset': { borderColor: THEME.primary },
                                                '&.Mui-focused fieldset': { borderColor: THEME.accent },
                                            },
                                        }}
                                        required
                                        variant="outlined"
                                    />
                                </Box>

                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontFamily: '"Comic Sans MS", cursive',
                                            color: THEME.purple,
                                            mb: 1,
                                            ml: 1
                                        }}
                                    >
                                        🎭 Article Category
                                    </Typography>
                                    <Select
                                        fullWidth
                                        value={form.category_id}
                                        onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : '' })}
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return <Typography sx={{ color: '#9ca3af', fontFamily: '"Comic Sans MS", cursive' }}>Pick a category for your article</Typography>;
                                            }
                                            const category = categories.find(cat => cat.id === selected);
                                            return category ? `${CATEGORY_ICONS[category.name.toLowerCase()] || '📚'} ${category.name}` : '';
                                        }}
                                        sx={{
                                            bgcolor: 'white',
                                            borderRadius: 40,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: THEME.secondary, borderWidth: 3 },
                                                '&:hover fieldset': { borderColor: THEME.primary },
                                                '&.Mui-focused fieldset': { borderColor: THEME.accent },
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <Typography sx={{ fontFamily: '"Comic Sans MS", cursive' }}>Select a category</Typography>
                                        </MenuItem>
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.id} sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                                {CATEGORY_ICONS[cat.name.toLowerCase()] || '📚'} {cat.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>

                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontFamily: '"Comic Sans MS", cursive',
                                            color: THEME.purple,
                                            mb: 2,
                                            ml: 1
                                        }}
                                    >
                                        ✍️ Write Your Article
                                    </Typography>
                                    <Paper
                                        sx={{
                                            border: `3px solid ${THEME.secondary}`,
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            bgcolor: 'white',
                                        }}
                                    >
                                        <textarea
                                            placeholder="Once upon a time..."
                                            value={form.content}
                                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                                            style={{
                                                width: '100%',
                                                minHeight: 300,
                                                padding: '20px',
                                                border: 'none',
                                                fontFamily: '"Comic Sans MS", cursive',
                                                fontSize: '1rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </Paper>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        startIcon={<SaveIcon />}
                                        sx={{
                                            bgcolor: THEME.secondary,
                                            color: 'white',
                                            fontFamily: '"Comic Sans MS", cursive',
                                            fontSize: '1.1rem',
                                            py: 1.5,
                                            px: 4,
                                            borderRadius: 40,
                                            border: `3px solid ${THEME.accent}`,
                                            '&:hover': {
                                                bgcolor: THEME.blue,
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    >
                                        Save to Drafts 📝
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        size="large"
                                        startIcon={<RocketIcon />}
                                        onClick={(e) => {
                                            Inertia.post(route('writer.articles.store'), { ...form, submit: true });
                                        }}
                                        sx={{
                                            bgcolor: THEME.green,
                                            color: 'white',
                                            fontFamily: '"Comic Sans MS", cursive',
                                            fontSize: '1.1rem',
                                            py: 1.5,
                                            px: 4,
                                            borderRadius: 40,
                                            border: `3px solid ${THEME.accent}`,
                                            '&:hover': {
                                                bgcolor: '#4CAF50',
                                                transform: 'scale(1.05)'
                                            },
                                        }}
                                    >
                                        Submit for Review 🚀
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Fade>
                );

            case 'drafts':
                return (
                    <Fade in={activeNav === 'drafts'} timeout={800}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: '"Comic Sans MS", cursive',
                                        fontWeight: 'bold',
                                        color: THEME.primary,
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    <CreateIcon sx={{ fontSize: 40 }} />
                                    My Article Drafts
                                    <CreateIcon sx={{ fontSize: 40 }} />
                                </Typography>
                                <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 3 }}>
                                    You have {draftArticles.length} magical article{draftArticles.length !== 1 ? 's' : ''} in progress!
                                </Typography>
                                
                                <TextField
                                    fullWidth
                                    placeholder="🔍 Search your drafts..."
                                    value={categorySearch}
                                    onChange={(e) => setCategorySearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: THEME.secondary }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: 'white',
                                            borderRadius: 40,
                                            border: `3px solid ${THEME.secondary}`,
                                            fontFamily: '"Comic Sans MS", cursive',
                                            '&:hover fieldset': { borderColor: THEME.primary },
                                            '&.Mui-focused fieldset': { borderColor: THEME.accent },
                                        },
                                    }}
                                    variant="outlined"
                                />
                            </Box>

                            {filteredDraftArticles.length === 0 ? (
                                <Paper sx={{ 
                                    p: 6,
                                    borderRadius: 8,
                                    background: `linear-gradient(135deg, ${THEME.accent}20 0%, ${THEME.secondary}20 100%)`,
                                    border: `4px solid ${THEME.accent}`,
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h3" sx={{ fontSize: '4rem', mb: 2 }}>
                                        {categorySearch ? '🔍' : '📝'}
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                        {categorySearch ? 'No drafts found matching your search!' : 'No drafts yet. Start your first article!'}
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={4}>
                                    {filteredDraftArticles.map((article, index) => (
                                        <Grid key={article.id} item xs={12} md={4}>
                                            <Zoom in timeout={500 + index * 100}>
                                                <Card
                                                    sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        borderRadius: 8,
                                                        border: `4px solid ${THEME.secondary}`,
                                                        boxShadow: `6px 6px 0 ${THEME.primary}`,
                                                        bgcolor: 'white',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px) translateX(-4px)',
                                                            boxShadow: `10px 10px 0 ${THEME.primary}`
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                                            <Chip
                                                                icon={<span>{STATUS_COLORS.draft.icon}</span>}
                                                                label="Draft"
                                                                sx={{
                                                                    bgcolor: STATUS_COLORS.draft.bg,
                                                                    color: STATUS_COLORS.draft.text,
                                                                    fontWeight: 'bold',
                                                                    borderRadius: 20,
                                                                    fontFamily: '"Comic Sans MS", cursive'
                                                                }}
                                                            />
                                                            <Typography variant="caption" sx={{ color: THEME.text }}>
                                                                {new Date(article.updated_at).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>

                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                fontWeight: 'bold',
                                                                color: THEME.primary,
                                                                mb: 2,
                                                                minHeight: 56
                                                            }}
                                                        >
                                                            {article.title}
                                                        </Typography>

                                                        <Chip
                                                            label={`${CATEGORY_ICONS[article.category.name.toLowerCase()] || '📚'} ${article.category.name}`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: THEME.secondary,
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                borderRadius: 20,
                                                                mb: 2
                                                            }}
                                                        />

                                                        <Typography variant="body2" sx={{ color: THEME.text, mb: 2 }}>
                                                            {article.excerpt ? article.excerpt.substring(0, 80) + '...' : 'No preview available...'}
                                                        </Typography>
                                                    </CardContent>

                                                    <CardActions sx={{ p: 3, pt: 0, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        <Button
                                                            size="small"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => window.location.href = route('writer.articles.show', article.id)}
                                                            sx={{
                                                                color: THEME.blue,
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                '&:hover': { bgcolor: alpha(THEME.blue, 0.1) }
                                                            }}
                                                        >
                                                            Read
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            startIcon={<EditIcon />}
                                                            onClick={() => window.location.href = route('writer.articles.show', article.id)}
                                                            sx={{
                                                                color: THEME.orange,
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                '&:hover': { bgcolor: alpha(THEME.orange, 0.1) }
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            startIcon={<RocketIcon />}
                                                            onClick={() => handleSubmitArticle(article.id)}
                                                            sx={{
                                                                color: THEME.green,
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                '&:hover': { bgcolor: alpha(THEME.green, 0.1) }
                                                            }}
                                                        >
                                                            Submit
                                                        </Button>
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
                    <Fade in={activeNav === 'submitted'} timeout={800}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: '"Comic Sans MS", cursive',
                                        fontWeight: 'bold',
                                        color: THEME.primary,
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    <RocketIcon sx={{ fontSize: 40 }} />
                                    Stories Under Review
                                    <RocketIcon sx={{ fontSize: 40 }} />
                                </Typography>
                                <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                    {submittedArticles.length} waiting for review, {revisedArticles.length} need your attention
                                </Typography>
                            </Box>

                            {submittedArticles.length === 0 && revisedArticles.length === 0 ? (
                                <Paper sx={{ 
                                    p: 6,
                                    borderRadius: 8,
                                    background: `linear-gradient(135deg, ${THEME.accent}20 0%, ${THEME.secondary}20 100%)`,
                                    border: `4px solid ${THEME.accent}`,
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h3" sx={{ fontSize: '4rem', mb: 2 }}>
                                        🚀
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                        No articles under review yet. Submit your first article!
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {[...submittedArticles, ...revisedArticles].map((article, index) => (
                                        <Grid key={article.id} item xs={12}>
                                            <Grow in timeout={500 + index * 100}>
                                                <Card
                                                    sx={{
                                                        borderRadius: 8,
                                                        border: `4px solid ${article.status.name === 'needs_revision' ? THEME.primary : THEME.green}`,
                                                        boxShadow: `4px 4px 0 ${article.status.name === 'needs_revision' ? THEME.primary : THEME.green}`,
                                                        bgcolor: 'white'
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Typography variant="h6" sx={{ fontFamily: '"Comic Sans MS", cursive', fontWeight: 'bold', color: THEME.text }}>
                                                                    {article.title}
                                                                </Typography>
                                                                <Chip
                                                                    icon={<span>{STATUS_COLORS[article.status.name]?.icon}</span>}
                                                                    label={article.status.label}
                                                                    sx={{
                                                                        bgcolor: STATUS_COLORS[article.status.name]?.bg,
                                                                        color: STATUS_COLORS[article.status.name]?.text,
                                                                        fontWeight: 'bold',
                                                                        borderRadius: 20,
                                                                        fontFamily: '"Comic Sans MS", cursive'
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Typography variant="caption" sx={{ color: THEME.text }}>
                                                                {new Date(article.updated_at).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>

                                                        <Chip
                                                            label={`${CATEGORY_ICONS[article.category.name.toLowerCase()] || '📚'} ${article.category.name}`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: THEME.secondary,
                                                                color: 'white',
                                                                borderRadius: 20,
                                                                mb: 2
                                                            }}
                                                        />

                                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                                            <Button
                                                                size="small"
                                                                startIcon={<VisibilityIcon />}
                                                                onClick={() => window.location.href = route('writer.articles.show', article.id)}
                                                                sx={{
                                                                    color: THEME.blue,
                                                                    fontFamily: '"Comic Sans MS", cursive'
                                                                }}
                                                            >
                                                                Read Article
                                                            </Button>
                                                            {article.status.name === 'needs_revision' && (
                                                                <Button
                                                                    size="small"
                                                                    startIcon={<EditIcon />}
                                                                    onClick={() => window.location.href = route('writer.articles.revise.page', article.id)}
                                                                    sx={{
                                                                        color: THEME.orange,
                                                                        fontFamily: '"Comic Sans MS", cursive',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    Revise Article
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grow>
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
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.purple} 100%)`,
                    borderBottom: `4px solid ${THEME.accent}`,
                    boxShadow: `0 8px 0 ${alpha(THEME.primary, 0.5)}`,
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
                            <AutoStoriesIcon sx={{ fontSize: 30, color: THEME.primary }} />
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
                            Writer's Studio
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
                            color: THEME.primary,
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
                            window.location.href = route('profile.edit');
                        }}>
                            <AccountCircleIcon sx={{ mr: 1, fontSize: 18, color: THEME.blue }} />
                            <Typography sx={{ fontFamily: '"Comic Sans MS", cursive' }}>My Profile</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setProfileAnchor(null);
                            window.location.href = '/logout';
                        }}>
                            <LogoutIcon sx={{ mr: 1, fontSize: 18, color: THEME.primary }} />
                            <Typography sx={{ fontFamily: '"Comic Sans MS", cursive' }}>Log Out</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/switch/editor';
                            }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16, color: THEME.green }} />
                            <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', fontSize: '0.9rem' }}>
                                Switch to Editor Mode
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
                                📬 Messages from Editors
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
                                        setReadNotifications(prev => new Set([...prev, notification.id]));
                                    }}
                                    sx={{
                                        py: 2,
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        whiteSpace: 'normal',
                                        borderLeft: readNotifications.has(notification.id) ? `3px solid ${THEME.secondary}` : `3px solid ${THEME.primary}`,
                                        bgcolor: readNotifications.has(notification.id) ? 'white' : alpha(THEME.accent, 0.1)
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: THEME.text, fontFamily: '"Comic Sans MS", cursive' }}>
                                            {notification.data.message}
                                        </Typography>

                                        {notification.data.type === 'revision_requested' && (
                                            <Box sx={{ mt: 1, p: 1.5, bgcolor: alpha(THEME.primary, 0.1), borderRadius: 4, border: `2px solid ${THEME.primary}` }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: THEME.primary, display: 'block', mb: 0.5, fontFamily: '"Comic Sans MS", cursive' }}>
                                                    Editor says:
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: THEME.text, fontStyle: 'italic', fontFamily: '"Comic Sans MS", cursive' }}>
                                                    "{notification.data.comments}"
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: THEME.text, display: 'block', mt: 0.5, fontFamily: '"Comic Sans MS", cursive' }}>
                                                    — {notification.data.editor_name}
                                                </Typography>
                                            </Box>
                                        )}

                                        {notification.data.type === 'article_published' && (
                                            <Box sx={{ mt: 1, p: 1.5, bgcolor: alpha(THEME.green, 0.1), borderRadius: 4, border: `2px solid ${THEME.green}` }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: THEME.green, display: 'block', mb: 0.5, fontFamily: '"Comic Sans MS", cursive' }}>
                                                    ✨ Published by: {notification.data.editor_name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: THEME.text, fontFamily: '"Comic Sans MS", cursive' }}>
                                                    Your article is now live for everyone to read!
                                                </Typography>
                                            </Box>
                                        )}

                                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1, fontFamily: '"Comic Sans MS", cursive' }}>
                                            {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString()}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>
                                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2, fontFamily: '"Comic Sans MS", cursive' }}>
                                    📭 No messages from editors yet
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
                                border: activeNav === 'dashboard' ? `2px solid ${THEME.primary}` : 'none',
                                '&:hover': { bgcolor: alpha(THEME.accent, 0.2) }
                            }}
                        >
                            <ListItemIcon>
                                <DashboardIcon sx={{ color: activeNav === 'dashboard' ? THEME.primary : THEME.text }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', color: activeNav === 'dashboard' ? THEME.primary : THEME.text }}>
                                        Article Dashboard
                                    </Typography>
                                }
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('create')}
                            sx={{
                                borderRadius: 8,
                                mb: 1,
                                bgcolor: activeNav === 'create' ? alpha(THEME.accent, 0.3) : 'transparent',
                                border: activeNav === 'create' ? `2px solid ${THEME.primary}` : 'none',
                                '&:hover': { bgcolor: alpha(THEME.accent, 0.2) }
                            }}
                        >
                            <ListItemIcon>
                                <AddIcon sx={{ color: activeNav === 'create' ? THEME.primary : THEME.text }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', color: activeNav === 'create' ? THEME.primary : THEME.text }}>
                                        Write New Aticle
                                    </Typography>
                                }
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('drafts')}
                            sx={{
                                borderRadius: 8,
                                mb: 1,
                                bgcolor: activeNav === 'drafts' ? alpha(THEME.accent, 0.3) : 'transparent',
                                border: activeNav === 'drafts' ? `2px solid ${THEME.primary}` : 'none',
                                '&:hover': { bgcolor: alpha(THEME.accent, 0.2) }
                            }}
                        >
                            <ListItemIcon>
                                <CreateIcon sx={{ color: activeNav === 'drafts' ? THEME.primary : THEME.text }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', color: activeNav === 'drafts' ? THEME.primary : THEME.text }}>
                                        My Drafts
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                        {draftArticles.length} stories
                                    </Typography>
                                }
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('submitted')}
                            sx={{
                                borderRadius: 8,
                                bgcolor: activeNav === 'submitted' ? alpha(THEME.accent, 0.3) : 'transparent',
                                border: activeNav === 'submitted' ? `2px solid ${THEME.primary}` : 'none',
                                '&:hover': { bgcolor: alpha(THEME.accent, 0.2) }
                            }}
                        >
                            <ListItemIcon>
                                <DoneIcon sx={{ color: activeNav === 'submitted' ? THEME.primary : THEME.text }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', color: activeNav === 'submitted' ? THEME.primary : THEME.text }}>
                                        Under Review
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                        {submittedArticles.length + revisedArticles.length} stories
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 3, borderColor: THEME.accent }} />

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                            ✨ Keep writing! Your stories inspire others ✨
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
                    color: THEME.primary,
                    width: 56,
                    height: 56,
                    border: `3px solid ${THEME.secondary}`,
                    '&:hover': {
                        bgcolor: THEME.primary,
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