import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Divider,
    Chip,
    Avatar,
    Fade,
    Select,
    MenuItem,
    Menu,
    IconButton,
    InputAdornment,
    Badge,
    Stack,
    alpha,
    Tooltip,
    Zoom,
    LinearProgress,
    Rating,
    useTheme
} from '@mui/material';
import {
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    SwapHoriz as SwapHorizIcon,
    Home as HomeIcon,
    Send as SendIcon,
    Comment as CommentIcon,
    Person as PersonIcon,
    MenuBook as MenuBookIcon,
    Chat as ChatIcon,
    Dashboard as DashboardIcon,
    Search as SearchIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Share as ShareIcon,
    Visibility as VisibilityIcon,
    CalendarToday as CalendarTodayIcon,
    TrendingUp as TrendingUpIcon,
    EmojiEvents as EmojiEventsIcon,
    AutoStories as AutoStoriesIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowForward as ArrowForwardIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { Inertia } from '@inertiajs/inertia';

// Student Dashboard Theme - Fresh & Engaging
const THEME = {
    primary: '#2A9D8F',      // Teal - calm and focused
    primaryLight: '#64B6AC',
    primaryDark: '#21867A',
    secondary: '#E76F51',    // Coral - energetic and engaging
    secondaryLight: '#F4A261',
    secondaryDark: '#E63946',
    accent: '#F4A261',        // Warm orange - highlights
    success: '#2A9D8F',
    warning: '#E9C46A',
    info: '#61A5C2',
    background: {
        main: '#F8F9FA',
        paper: '#FFFFFF',
        gradient: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
        card: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)'
    },
    text: {
        primary: '#264653',
        secondary: '#5A6B7A',
        light: '#8D9AA9'
    },
    gradient: {
        primary: 'linear-gradient(135deg, #2A9D8F 0%, #21867A 100%)',
        secondary: 'linear-gradient(135deg, #E76F51 0%, #E63946 100%)',
        accent: 'linear-gradient(135deg, #F4A261 0%, #E9C46A 100%)',
        card: 'linear-gradient(135deg, rgba(42, 157, 143, 0.05) 0%, rgba(231, 111, 81, 0.05) 100%)'
    }
};

const DRAWER_WIDTH = 280;

export default function Dashboard({ articles, comments, categories: serverCategories, auth }) {
    const theme = useTheme();
    const [activeNav, setActiveNav] = useState('dashboard');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories] = useState(serverCategories && serverCategories.length > 0 ? serverCategories : []);
    const [commentText, setCommentText] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [articleModalOpen, setArticleModalOpen] = useState(false);
    const [selectedArticleForModal, setSelectedArticleForModal] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
    const [likedArticles, setLikedArticles] = useState([]);

    const handleOpenDialog = (article) => {
        setSelectedArticle(article);
        setOpenDialog(true);
        setCommentText('');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedArticle(null);
        setCommentText('');
    };

    const handleOpenArticleModal = (article) => {
        setSelectedArticleForModal(article);
        setArticleModalOpen(true);
    };

    const handleCloseArticleModal = () => {
        setArticleModalOpen(false);
        setSelectedArticleForModal(null);
        setEditingCommentId(null);
        setEditCommentText('');
    };

    const handleEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.content);
    };

    const handleSaveEdit = () => {
        if (editingCommentId && editCommentText.trim()) {
            Inertia.put(
                route('comments.update', editingCommentId),
                { content: editCommentText },
                {
                    onSuccess: () => {
                        setEditingCommentId(null);
                        setEditCommentText('');
                    },
                }
            );
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditCommentText('');
    };

    const handleDeleteComment = (commentId) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            Inertia.delete(route('comments.destroy', commentId));
        }
    };

    const postComment = () => {
        if (selectedArticle && commentText.trim()) {
            Inertia.post(
                route('student.articles.comment', selectedArticle.id),
                { content: commentText },
                {
                    onSuccess: () => {
                        handleCloseDialog();
                    },
                }
            );
        }
    };

    const toggleBookmark = (articleId) => {
        setBookmarkedArticles(prev =>
            prev.includes(articleId)
                ? prev.filter(id => id !== articleId)
                : [...prev, articleId]
        );
    };

    const toggleLike = (articleId) => {
        setLikedArticles(prev =>
            prev.includes(articleId)
                ? prev.filter(id => id !== articleId)
                : [...prev, articleId]
        );
    };

    const getReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    const truncateText = (text, length = 120) => {
        if (!text) return '';
        const plainText = text.replace(/<[^>]*>/g, '');
        return plainText.length > length ? plainText.substring(0, length) + '...' : plainText;
    };

    const renderMainContent = () => {
        switch (activeNav) {
            case 'dashboard':
                return (
                    <Fade in={activeNav === 'dashboard'} timeout={500}>
                        <Box>
                            {/* Welcome Header */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    mb: 4,
                                    borderRadius: '16px',
                                    background: THEME.gradient.primary,
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                                        Welcome back, {auth?.user?.name?.split(' ')[0] || 'Student'}!
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                                        Discover new knowledge and engage with our community
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Chip
                                            icon={<AutoStoriesIcon />}
                                            label={`${articles.length} Articles Available`}
                                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                        />
                                        <Chip
                                            icon={<ChatIcon />}
                                            label={`${comments.length} Your Comments`}
                                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                        />
                                    </Stack>
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

                            {/* Statistics Cards */}
                            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: THEME.text.primary }}>
                                Reading Overview
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
                                                        <MenuBookIcon />
                                                    </Box>
                                                </Box>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                                    {articles.length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                    Total Articles
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={75}
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
                                                        <ChatIcon />
                                                    </Box>
                                                </Box>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                                    {comments.length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                    Your Comments
                                                </Typography>
                                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <TrendingUpIcon sx={{ fontSize: 16, color: THEME.success }} />
                                                    <Typography variant="caption" sx={{ color: THEME.text.secondary }}>
                                                        +{Math.floor(comments.length * 0.2)} this month
                                                    </Typography>
                                                </Box>
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
                                                border: `1px solid ${alpha(THEME.accent, 0.1)}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 24px ${alpha(THEME.accent, 0.15)}`
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
                                                            background: alpha(THEME.accent, 0.1),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: THEME.accent
                                                        }}
                                                    >
                                                        <EmojiEventsIcon />
                                                    </Box>
                                                </Box>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                                    {categories.length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                    Categories
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
                                                        <BookmarkIcon />
                                                    </Box>
                                                </Box>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                                    {bookmarkedArticles.length}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                    Bookmarked
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            </Grid>

                            {/* Featured Articles Section */}
                            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: THEME.text.primary }}>
                                Featured Articles
                            </Typography>

                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {articles.slice(0, 3).map((article, index) => (
                                    <Grid item xs={12} md={4} key={article.id}>
                                        <Zoom in timeout={700 + index * 100}>
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    height: '100%',
                                                    borderRadius: '16px',
                                                    background: THEME.background.card,
                                                    border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: `0 12px 24px ${alpha(THEME.primary, 0.15)}`,
                                                        borderColor: THEME.primary
                                                    }
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="160"
                                                    image={article.image_url || `https://source.unsplash.com/random/400x200?${index}`}
                                                    alt={article.title}
                                                    sx={{ objectFit: 'cover' }}
                                                />
                                                <CardContent sx={{ p: 3 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                        <Chip
                                                            label={article.category.name}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: alpha(THEME.primary, 0.1),
                                                                color: THEME.primary,
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => toggleBookmark(article.id)}
                                                                sx={{ color: bookmarkedArticles.includes(article.id) ? THEME.secondary : THEME.text.light }}
                                                            >
                                                                {bookmarkedArticles.includes(article.id) ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => toggleLike(article.id)}
                                                                sx={{ color: likedArticles.includes(article.id) ? '#E76F51' : THEME.text.light }}
                                                            >
                                                                {likedArticles.includes(article.id) ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: THEME.text.primary }}>
                                                        {article.title}
                                                    </Typography>

                                                    <Typography variant="body2" sx={{ color: THEME.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                        {truncateText(article.content, 100)}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 24,
                                                                height: 24,
                                                                bgcolor: alpha(THEME.secondary, 0.1),
                                                                fontSize: '0.75rem',
                                                                color: THEME.secondary
                                                            }}
                                                        >
                                                            {article.writer.name.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="caption" sx={{ color: THEME.text.secondary }}>
                                                            {article.writer.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: THEME.text.light }}>
                                                            • {getReadTime(article.content)} min read
                                                        </Typography>
                                                    </Box>

                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        endIcon={<ArrowForwardIcon />}
                                                        onClick={() => handleOpenArticleModal(article)}
                                                        sx={{
                                                            borderColor: alpha(THEME.primary, 0.3),
                                                            color: THEME.primary,
                                                            '&:hover': {
                                                                borderColor: THEME.primary,
                                                                bgcolor: alpha(THEME.primary, 0.04)
                                                            }
                                                        }}
                                                    >
                                                        Read Article
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Zoom>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Recent Activity */}
                            {comments.length > 0 && (
                                <Box>
                                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: THEME.text.primary }}>
                                        Recent Activity
                                    </Typography>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            borderRadius: '16px',
                                            p: 3,
                                            background: 'white',
                                            border: `1px solid ${alpha(THEME.primary, 0.1)}`
                                        }}
                                    >
                                        <Stack spacing={2}>
                                            {comments.slice(0, 5).map((comment) => (
                                                <Box
                                                    key={comment.id}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        bgcolor: alpha(THEME.primary, 0.02),
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            bgcolor: alpha(THEME.primary, 0.05)
                                                        }
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: alpha(THEME.secondary, 0.1),
                                                            color: THEME.secondary
                                                        }}
                                                    >
                                                        <ChatIcon fontSize="small" />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.text.primary }}>
                                                            Commented on "{comment.article.title}"
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: THEME.text.light }}>
                                                            {new Date(comment.created_at).toLocaleDateString()} • {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        size="small"
                                                        label="View"
                                                        onClick={() => handleOpenArticleModal(comment.article)}
                                                        sx={{
                                                            bgcolor: alpha(THEME.primary, 0.1),
                                                            color: THEME.primary,
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Paper>
                                </Box>
                            )}
                        </Box>
                    </Fade>
                );

            case 'articles':
                return (
                    <Fade in={activeNav === 'articles'} timeout={500}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                    Published Articles
                                </Typography>
                                <Typography variant="body1" sx={{ color: THEME.text.secondary }}>
                                    Explore our collection of insightful articles
                                </Typography>
                            </Box>

                            {/* Search and Filter Bar */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    mb: 4,
                                    borderRadius: '12px',
                                    bgcolor: 'white',
                                    border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <TextField
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    size="small"
                                    sx={{
                                        flex: 1,
                                        minWidth: 250,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            bgcolor: alpha(THEME.background.main, 0.5)
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: THEME.text.light }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                        Category:
                                    </Typography>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
                                        displayEmpty
                                        size="small"
                                        sx={{
                                            minWidth: 150,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: alpha(THEME.primary, 0.2)
                                            }
                                        }}
                                    >
                                        <MenuItem value="">All Categories</MenuItem>
                                        {categories.map((c) => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Paper>

                            {articles.length === 0 ? (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 6,
                                        borderRadius: '16px',
                                        bgcolor: 'white',
                                        textAlign: 'center',
                                        border: `1px solid ${alpha(THEME.primary, 0.1)}`
                                    }}
                                >
                                    <AutoStoriesIcon sx={{ fontSize: 60, color: THEME.text.light, mb: 2 }} />
                                    <Typography variant="h6" sx={{ color: THEME.text.primary, mb: 1 }}>
                                        No Articles Yet
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                        Check back soon for new content!
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {articles
                                        .filter(a => !selectedCategory || a.category?.id === selectedCategory)
                                        .filter(a => 
                                            searchQuery === '' || 
                                            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            a.writer.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((article, index) => (
                                            <Grid key={article.id} item xs={12}>
                                                <Zoom in timeout={300 + index * 100}>
                                                    <Card
                                                        elevation={0}
                                                        sx={{
                                                            borderRadius: '16px',
                                                            background: 'white',
                                                            border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'translateX(4px)',
                                                                boxShadow: `0 8px 16px ${alpha(THEME.primary, 0.15)}`,
                                                                borderColor: THEME.primary
                                                            }
                                                        }}
                                                    >
                                                        <CardContent sx={{ p: 3 }}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} md={8}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                                        <Avatar
                                                                            sx={{
                                                                                bgcolor: alpha(THEME.secondary, 0.1),
                                                                                color: THEME.secondary
                                                                            }}
                                                                        >
                                                                            {article.writer.name.charAt(0)}
                                                                        </Avatar>
                                                                        <Box>
                                                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: THEME.text.primary }}>
                                                                                {article.writer.name}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ color: THEME.text.light }}>
                                                                                {article.writer.email}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>

                                                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: THEME.text.primary }}>
                                                                        {article.title}
                                                                    </Typography>

                                                                    <Typography variant="body2" sx={{ color: THEME.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                                        {truncateText(article.content, 200)}
                                                                    </Typography>

                                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                                        <Chip
                                                                            label={article.category.name}
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor: alpha(THEME.primary, 0.1),
                                                                                color: THEME.primary
                                                                            }}
                                                                        />
                                                                        <Chip
                                                                            icon={<CalendarTodayIcon />}
                                                                            label={new Date(article.created_at).toLocaleDateString()}
                                                                            size="small"
                                                                            sx={{ bgcolor: alpha(THEME.text.light, 0.1), color: THEME.text.secondary }}
                                                                        />
                                                                    </Box>
                                                                </Grid>

                                                                <Grid item xs={12} md={4}>
                                                                    <Box sx={{ 
                                                                        display: 'flex', 
                                                                        flexDirection: 'column', 
                                                                        gap: 1.5,
                                                                        height: '100%',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'flex-end'
                                                                    }}>
                                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                                            <IconButton
                                                                size="small"
                                                                onClick={() => toggleBookmark(article.id)}
                                                                sx={{ color: bookmarkedArticles.includes(article.id) ? THEME.secondary : THEME.text.light }}
                                                            >
                                                                {bookmarkedArticles.includes(article.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => toggleLike(article.id)}
                                                                sx={{ color: likedArticles.includes(article.id) ? '#E76F51' : THEME.text.light }}
                                                            >
                                                                {likedArticles.includes(article.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                sx={{ color: THEME.text.light }}
                                                            >
                                                                <ShareIcon />
                                                            </IconButton>
                                                        </Box>

                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => handleOpenArticleModal(article)}
                                                            sx={{
                                                                background: THEME.gradient.primary,
                                                                color: 'white',
                                                                textTransform: 'none',
                                                                py: 1.5,
                                                                '&:hover': {
                                                                    boxShadow: `0 8px 16px ${alpha(THEME.primary, 0.3)}`
                                                                }
                                                            }}
                                                        >
                                                            Read Article
                                                        </Button>

                                                        <Button
                                                            fullWidth
                                                            variant="outlined"
                                                            startIcon={<CommentIcon />}
                                                            onClick={() => handleOpenDialog(article)}
                                                            sx={{
                                                                borderColor: alpha(THEME.secondary, 0.3),
                                                                color: THEME.secondary,
                                                                textTransform: 'none',
                                                                py: 1.5,
                                                                '&:hover': {
                                                                    borderColor: THEME.secondary,
                                                                    bgcolor: alpha(THEME.secondary, 0.04)
                                                                }
                                                            }}
                                                        >
                                                            Comment ({article.comments?.length || 0})
                                                        </Button>
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

            case 'comments':
                return (
                    <Fade in={activeNav === 'comments'} timeout={500}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: THEME.text.primary, mb: 1 }}>
                                    My Comments
                                </Typography>
                                <Typography variant="body1" sx={{ color: THEME.text.secondary }}>
                                    {comments.length} comment{comments.length !== 1 ? 's' : ''} you've shared with the community
                                </Typography>
                            </Box>

                            {comments.length === 0 ? (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 6,
                                        borderRadius: '16px',
                                        bgcolor: 'white',
                                        textAlign: 'center',
                                        border: `1px solid ${alpha(THEME.primary, 0.1)}`
                                    }}
                                >
                                    <ChatIcon sx={{ fontSize: 60, color: THEME.text.light, mb: 2 }} />
                                    <Typography variant="h6" sx={{ color: THEME.text.primary, mb: 1 }}>
                                        No Comments Yet
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                        Start engaging with articles by leaving your thoughts!
                                    </Typography>
                                </Paper>
                            ) : (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: '16px',
                                        bgcolor: 'white',
                                        border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                        overflow: 'hidden'
                                    }}
                                >
                                    {comments.map((comment, index) => (
                                        <Box
                                            key={comment.id}
                                            sx={{
                                                p: 3,
                                                borderBottom: index !== comments.length - 1 ? `1px solid ${alpha(THEME.primary, 0.1)}` : 'none',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    bgcolor: alpha(THEME.primary, 0.02)
                                                }
                                            }}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={8}>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: alpha(THEME.secondary, 0.1),
                                                                color: THEME.secondary
                                                            }}
                                                        >
                                                            {auth?.user?.name?.charAt(0) || 'U'}
                                                        </Avatar>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: THEME.text.primary }}>
                                                                    {auth?.user?.name}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: THEME.text.light }}>
                                                                    {new Date(comment.created_at).toLocaleDateString()} • {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </Typography>
                                                            </Box>

                                                            <Typography variant="body1" sx={{ color: THEME.text.primary, mb: 2, lineHeight: 1.6 }}>
                                                                {comment.content}
                                                            </Typography>

                                                            <Paper
                                                                sx={{
                                                                    p: 2,
                                                                    bgcolor: alpha(THEME.primary, 0.02),
                                                                    borderRadius: '8px',
                                                                    border: `1px solid ${alpha(THEME.primary, 0.1)}`
                                                                }}
                                                            >
                                                                <Typography variant="caption" sx={{ color: THEME.text.light, display: 'block', mb: 0.5 }}>
                                                                    On article:
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.primary }}>
                                                                    {comment.article.title}
                                                                </Typography>
                                                            </Paper>
                                                        </Box>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                        <Button
                                                            size="small"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => handleOpenArticleModal(comment.article)}
                                                            sx={{
                                                                color: THEME.primary,
                                                                '&:hover': {
                                                                    bgcolor: alpha(THEME.primary, 0.04)
                                                                }
                                                            }}
                                                        >
                                                            View Article
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            startIcon={<EditIcon />}
                                                            onClick={() => handleEditComment(comment)}
                                                            sx={{
                                                                color: THEME.text.secondary,
                                                                '&:hover': {
                                                                    bgcolor: alpha(THEME.primary, 0.04)
                                                                }
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            startIcon={<DeleteIcon />}
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            sx={{
                                                                color: THEME.secondaryDark,
                                                                '&:hover': {
                                                                    bgcolor: alpha(THEME.secondaryDark, 0.04)
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                </Paper>
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
                                Student Learning Portal
                            </Typography>
                            <Typography variant="caption" sx={{ color: THEME.text.secondary }}>
                                Explore, Learn, Engage
                            </Typography>
                        </Box>
                    </Box>
                    
                    {/* Search Bar */}
                    <TextField
                        placeholder="Search articles..."
                        size="small"
                        sx={{
                            width: 300,
                            mr: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                                bgcolor: alpha(THEME.primary, 0.05),
                                '&:hover': {
                                    bgcolor: alpha(THEME.primary, 0.1)
                                }
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: THEME.text.light }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
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
                                {auth?.user?.name?.charAt(0) || 'S'}
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
                            <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: THEME.secondaryDark }} />
                            Sign Out
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/sample/switch/writer';
                            }}
                            sx={{ color: THEME.secondary }}
                        >
                            <SwapHorizIcon sx={{ mr: 1.5, fontSize: 20 }} />
                            Switch to Writer
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/sample/switch/editor';
                            }}
                            sx={{ color: THEME.secondary }}
                        >
                            <SwapHorizIcon sx={{ mr: 1.5, fontSize: 20 }} />
                            Switch to Editor
                        </MenuItem>
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
                            secondary="Overview"
                            primaryTypographyProps={{
                                sx: { 
                                    fontWeight: activeNav === 'dashboard' ? 700 : 500,
                                    color: activeNav === 'dashboard' ? THEME.primary : THEME.text.primary
                                }
                            }}
                            secondaryTypographyProps={{
                                sx: { color: THEME.text.light }
                            }}
                        />
                    </ListItem>

                    <ListItem
                        button
                        onClick={() => setActiveNav('articles')}
                        sx={{
                            borderRadius: '12px',
                            mb: 1,
                            bgcolor: activeNav === 'articles' ? alpha(THEME.primary, 0.08) : 'transparent',
                            '&:hover': {
                                bgcolor: activeNav === 'articles' ? alpha(THEME.primary, 0.12) : alpha(THEME.primary, 0.04)
                            }
                        }}
                    >
                        <ListItemIcon>
                            <Badge badgeContent={articles.length} color="primary" max={99}>
                                <MenuBookIcon sx={{ color: activeNav === 'articles' ? THEME.primary : THEME.text.light }} />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText 
                            primary="Published Articles"
                            secondary={`${articles.length} available`}
                            primaryTypographyProps={{
                                sx: { 
                                    fontWeight: activeNav === 'articles' ? 700 : 500,
                                    color: activeNav === 'articles' ? THEME.primary : THEME.text.primary
                                }
                            }}
                            secondaryTypographyProps={{
                                sx: { color: THEME.text.light }
                            }}
                        />
                    </ListItem>

                    <ListItem
                        button
                        onClick={() => setActiveNav('comments')}
                        sx={{
                            borderRadius: '12px',
                            bgcolor: activeNav === 'comments' ? alpha(THEME.primary, 0.08) : 'transparent',
                            '&:hover': {
                                bgcolor: activeNav === 'comments' ? alpha(THEME.primary, 0.12) : alpha(THEME.primary, 0.04)
                            }
                        }}
                    >
                        <ListItemIcon>
                            <Badge badgeContent={comments.length} color="secondary" max={99}>
                                <ChatIcon sx={{ color: activeNav === 'comments' ? THEME.primary : THEME.text.light }} />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText 
                            primary="My Comments"
                            secondary={`${comments.length} total`}
                            primaryTypographyProps={{
                                sx: { 
                                    fontWeight: activeNav === 'comments' ? 700 : 500,
                                    color: activeNav === 'comments' ? THEME.primary : THEME.text.primary
                                }
                            }}
                            secondaryTypographyProps={{
                                sx: { color: THEME.text.light }
                            }}
                        />
                    </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Reading Tips */}
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: THEME.text.light, mb: 2 }}>
                        Reading Tips
                    </Typography>
                    <List dense>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <EmojiEventsIcon sx={{ fontSize: 16, color: THEME.accent }} />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Read actively" 
                                secondary="Take notes while reading"
                                secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }}
                            />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <EmojiEventsIcon sx={{ fontSize: 16, color: THEME.accent }} />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Engage with content" 
                                secondary="Leave thoughtful comments"
                                secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }}
                            />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <EmojiEventsIcon sx={{ fontSize: 16, color: THEME.accent }} />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Bookmark favorites" 
                                secondary="Save articles to read later"
                                secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }}
                            />
                        </ListItem>
                    </List>
                </Box>

                {/* Quick Stats */}
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: '12px',
                            background: THEME.gradient.card,
                            border: `1px solid ${alpha(THEME.primary, 0.1)}`
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.primary, mb: 1 }}>
                            Your Stats
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: THEME.text.secondary }}>Articles Read</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: THEME.primary }}>{Math.floor(articles.length * 0.3)}</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={30}
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

            {/* Comment Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontWeight: 700, 
                    background: THEME.gradient.primary, 
                    color: 'white',
                    py: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CommentIcon />
                        <Typography variant="h6">Share Your Thoughts</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 3, pb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: THEME.text.primary }}>
                        Commenting on: {selectedArticle?.title}
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="What are your thoughts on this article?"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                bgcolor: alpha(THEME.background.main, 0.5)
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: alpha(THEME.primary, 0.02) }}>
                    <Button 
                        onClick={handleCloseDialog}
                        sx={{ color: THEME.text.secondary }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={postComment}
                        disabled={!commentText.trim()}
                        variant="contained"
                        startIcon={<SendIcon />}
                        sx={{
                            background: THEME.gradient.primary,
                            fontWeight: 600,
                            '&:hover': {
                                boxShadow: `0 8px 16px ${alpha(THEME.primary, 0.3)}`
                            }
                        }}
                    >
                        Post Comment
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Article Modal */}
            <Dialog
                open={articleModalOpen}
                onClose={handleCloseArticleModal}
                maxWidth="md"
                fullWidth
                scroll="paper"
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        overflow: 'hidden',
                        maxHeight: '90vh'
                    }
                }}
            >
                {selectedArticleForModal && (
                    <>
                        <DialogTitle sx={{ 
                            p: 0,
                            background: THEME.gradient.primary,
                            color: 'white'
                        }}>
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Chip
                                        label={selectedArticleForModal.category.name}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                    />
                                    <IconButton onClick={handleCloseArticleModal} sx={{ color: 'white' }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                    {selectedArticleForModal.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                        {selectedArticleForModal.writer.name.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {selectedArticleForModal.writer.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                            Published on {new Date(selectedArticleForModal.created_at).toLocaleDateString()} • {getReadTime(selectedArticleForModal.content)} min read
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </DialogTitle>

                        <DialogContent sx={{ p: 3 }}>
                            {/* Article Content */}
                            <Paper
                                sx={{
                                    p: 3,
                                    mb: 4,
                                    borderRadius: '12px',
                                    bgcolor: alpha(THEME.background.main, 0.5),
                                    border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                    '& p': { lineHeight: 1.8, color: THEME.text.primary },
                                    '& h2': { fontSize: '1.5rem', fontWeight: 700, mt: 3, mb: 2 },
                                    '& img': { maxWidth: '100%', borderRadius: '8px', my: 2 }
                                }}
                            >
                                <div dangerouslySetInnerHTML={{ __html: selectedArticleForModal.content }} />
                            </Paper>

                            {/* Comments Section */}
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: THEME.text.primary }}>
                                    Comments ({selectedArticleForModal.comments?.length || 0})
                                </Typography>

                                {selectedArticleForModal.comments && selectedArticleForModal.comments.length > 0 ? (
                                    <Stack spacing={2}>
                                        {selectedArticleForModal.comments.map((comment) => (
                                            <Paper
                                                key={comment.id}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                                    bgcolor: alpha(THEME.background.main, 0.5)
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor: alpha(THEME.secondary, 0.1),
                                                            color: THEME.secondary
                                                        }}
                                                    >
                                                        {comment.user?.name?.charAt(0) || 'U'}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: THEME.text.primary }}>
                                                                    {comment.user?.name || 'Anonymous'}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: THEME.text.light }}>
                                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                                </Typography>
                                                            </Box>
                                                            {comment.user_id === auth?.user?.id && (
                                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleEditComment(comment)}
                                                                        sx={{ color: THEME.text.secondary }}
                                                                    >
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleDeleteComment(comment.id)}
                                                                        sx={{ color: THEME.secondaryDark }}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                        {editingCommentId === comment.id ? (
                                                            <Box sx={{ mt: 1 }}>
                                                                <TextField
                                                                    fullWidth
                                                                    multiline
                                                                    rows={3}
                                                                    value={editCommentText}
                                                                    onChange={(e) => setEditCommentText(e.target.value)}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{ mb: 1 }}
                                                                />
                                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        onClick={handleSaveEdit}
                                                                        disabled={!editCommentText.trim()}
                                                                        sx={{
                                                                            background: THEME.gradient.primary,
                                                                            fontWeight: 600
                                                                        }}
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        onClick={handleCancelEdit}
                                                                        sx={{ fontWeight: 600 }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" sx={{ color: THEME.text.secondary, lineHeight: 1.6 }}>
                                                                {comment.content}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Paper
                                        sx={{
                                            p: 4,
                                            textAlign: 'center',
                                            borderRadius: '12px',
                                            bgcolor: alpha(THEME.background.main, 0.5),
                                            border: `1px dashed ${alpha(THEME.primary, 0.3)}`
                                        }}
                                    >
                                        <ChatIcon sx={{ fontSize: 48, color: THEME.text.light, mb: 2 }} />
                                        <Typography variant="body1" sx={{ color: THEME.text.secondary, mb: 1 }}>
                                            No comments yet
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: THEME.text.light }}>
                                            Be the first to share your thoughts!
                                        </Typography>
                                    </Paper>
                                )}

                                {/* Add Comment Section */}
                                <Paper
                                    sx={{
                                        p: 3,
                                        mt: 3,
                                        borderRadius: '12px',
                                        border: `2px dashed ${alpha(THEME.secondary, 0.3)}`,
                                        bgcolor: alpha(THEME.secondary, 0.02)
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: THEME.secondary }}>
                                        Join the Discussion
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        placeholder="Share your thoughts about this article..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setCommentText('')}
                                            disabled={!commentText.trim()}
                                            sx={{ color: THEME.text.secondary }}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                if (commentText.trim()) {
                                                    Inertia.post(
                                                        route('student.articles.comment', selectedArticleForModal.id),
                                                        { content: commentText },
                                                        {
                                                            onSuccess: () => {
                                                                setCommentText('');
                                                            },
                                                        }
                                                    );
                                                }
                                            }}
                                            disabled={!commentText.trim()}
                                            startIcon={<SendIcon />}
                                            sx={{
                                                background: THEME.gradient.primary,
                                                fontWeight: 600,
                                                '&:hover': {
                                                    boxShadow: `0 8px 16px ${alpha(THEME.primary, 0.3)}`
                                                }
                                            }}
                                        >
                                            Post Comment
                                        </Button>
                                    </Box>
                                </Paper>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
}