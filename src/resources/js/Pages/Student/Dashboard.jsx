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
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HomeIcon from '@mui/icons-material/Home';
import { Inertia } from '@inertiajs/inertia';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';

const STATUS_COLORS = {
    published: { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' },
};

const DRAWER_WIDTH = 280;
const THEME = {
    primary: '#00b4d8',
    success: '#16a34a',
    surface: 'rgba(255, 255, 255, 0.95)',
    secondary: '#0077b6',
    dark: '#03045e',
};

export default function Dashboard({ articles, comments, categories: serverCategories, auth }) {
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

    const renderMainContent = () => {
        switch (activeNav) {
            case 'dashboard':
                return (
                    <Fade in={activeNav === 'dashboard'}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                    Welcome to Student Dashboard
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                    Your gateway to exploring published articles and engaging with the community
                                </Typography>
                            </Box>

                            {/* Statistics Cards */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card sx={{
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'visible'
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box>
                                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                                                        {articles.length}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                        Published Articles Available
                                                    </Typography>
                                                </Box>
                                                <MenuBookIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Card sx={{
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'visible'
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box>
                                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                                                        {comments.length}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                        Your Comments
                                                    </Typography>
                                                </Box>
                                                <ChatIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Card sx={{
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'visible'
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box>
                                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                                                        {categories.length}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                        Article Categories
                                                    </Typography>
                                                </Box>
                                                <PersonIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Quick Actions */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#374151' }}>
                                    Quick Actions
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<MenuBookIcon />}
                                            onClick={() => setActiveNav('articles')}
                                            sx={{
                                                p: 3,
                                                borderRadius: '12px',
                                                border: '2px solid #e2e8f0',
                                                color: '#374151',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    borderColor: '#667eea',
                                                    backgroundColor: '#f8fafc',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Browse Articles
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<ChatIcon />}
                                            onClick={() => setActiveNav('comments')}
                                            sx={{
                                                p: 3,
                                                borderRadius: '12px',
                                                border: '2px solid #e2e8f0',
                                                color: '#374151',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    borderColor: '#f5576c',
                                                    backgroundColor: '#fef2f2',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(245, 87, 108, 0.15)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            View My Comments
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<AccountCircleIcon />}
                                            onClick={() => Inertia.get(route('profile.edit'))}
                                            sx={{
                                                p: 3,
                                                borderRadius: '12px',
                                                border: '2px solid #e2e8f0',
                                                color: '#374151',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    borderColor: '#00b4d8',
                                                    backgroundColor: '#f0fdfa',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(0, 180, 216, 0.15)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Edit Profile
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Recent Activity */}
                            {comments.length > 0 && (
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#374151' }}>
                                        Recent Activity
                                    </Typography>
                                    <Paper sx={{
                                        borderRadius: '12px',
                                        p: 3,
                                        background: 'white',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                            Your latest comments on articles:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {comments.slice(0, 3).map((comment) => (
                                                <Box key={comment.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                                                    <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width: 32, height: 32 }}>
                                                        {auth?.user?.name?.charAt(0) || 'U'}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                                                            Commented on "{comment.article.title}"
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {new Date(comment.created_at).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Box>
                            )}
                        </Box>
                    </Fade>
                );

            case 'articles':
                return (
                    <Fade in={activeNav === 'articles'}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                    Published Articles
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                    Explore and comment on published articles
                                </Typography>
                            </Box>

                            {categories.length > 0 && (
                                <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ mr: 2 }}>Category:</Typography>
                                    <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')} displayEmpty sx={{ minWidth: 200 }}>
                                        <MenuItem value="">All Categories</MenuItem>
                                        {categories.map((c) => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            )}

                            {articles.length === 0 ? (
                                <Card sx={{ borderRadius: '12px' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                        <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                                            No published articles yet. Check back soon!
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Grid container spacing={3}>
                                    {articles.filter(a => !selectedCategory || a.category?.id === selectedCategory).map((article) => (
                                        <Grid key={article.id} item xs={12}>
                                            <Card
                                                sx={{
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateX(4px)',
                                                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.1)',
                                                    },
                                                }}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                        <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                                            {article.writer.name.charAt(0)}
                                                        </Avatar>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                                {article.title}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                By {article.writer.name} • {new Date(article.created_at).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                        <Chip label={article.category.name} size="small" />
                                                    </Box>
                                                    <Divider sx={{ my: 2 }} />
                                                    <Typography color="textSecondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: article.content.substring(0, 150) + '...',
                                                            }}
                                                        />
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        size="small"
                                                        startIcon={<CommentIcon />}
                                                        onClick={() => handleOpenDialog(article)}
                                                        sx={{
                                                            color: 'white',
                                                            background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                                                            fontWeight: 600,
                                                            borderRadius: '6px',
                                                        }}
                                                    >
                                                        Comment
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleOpenArticleModal(article)}
                                                        sx={{
                                                            ml: 1,
                                                            color: '#334155',
                                                            borderRadius: '6px',
                                                        }}
                                                    >
                                                        Read More
                                                    </Button>
                                                    <Typography variant="caption" color="textSecondary" sx={{ ml: 'auto' }}>
                                                        💬 {article.comments?.length || 0}
                                                    </Typography>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Fade>
                );

            case 'comments':
                return (
                    <Fade in={activeNav === 'comments'}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                    My Comments
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                    {comments.length} comment{comments.length !== 1 ? 's' : ''} you've made
                                </Typography>
                            </Box>

                            {comments.length === 0 ? (
                                <Card sx={{ borderRadius: '12px' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                        <Typography color="textSecondary">
                                            You haven't commented on any articles yet. Share your thoughts!
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Paper
                                    sx={{
                                        borderRadius: '12px',
                                        background: 'white',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {comments.map((comment, index) => (
                                        <Box
                                            key={comment.id}
                                            sx={{
                                                p: 3,
                                                borderBottom: index !== comments.length - 1 ? '1px solid #e2e8f0' : 'none',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                                    P
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                        {comment.article.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, pl: 7 }}>
                                                {comment.content}
                                            </Typography>
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
                        Student Dashboard
                    </Typography>
                    
                    {/* Home Button */}
                    <IconButton
                        onClick={() => Inertia.visit('/')}
                        sx={{ 
                            color: 'white', 
                            mr: 2,
                            width: 48,
                            height: 48,
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
                                window.location.href = '/sample/switch/editor';
                            }}
                            sx={{ fontSize: '0.85rem', color: '#667eea' }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16 }} />
                            Editor
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
                                background: activeNav === 'dashboard' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'dashboard' ? '#667eea' : '#64748b' }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Main Dashboard"
                                secondary="Overview & Stats"
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('articles')}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                background: activeNav === 'articles' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'articles' ? '#667eea' : '#64748b' }}>
                                <MenuBookIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Published Articles"
                                secondary={articles.length}
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('comments')}
                            sx={{
                                borderRadius: '8px',
                                background: activeNav === 'comments' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'comments' ? '#667eea' : '#64748b' }}>
                                <ChatIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="My Comments"
                                secondary={comments.length}
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

            {/* Comment Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)', color: 'white' }}>
                    Comment on: {selectedArticle?.title}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="Share your thoughts..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={postComment}
                        disabled={!commentText.trim()}
                        variant="contained"
                        startIcon={<SendIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                            fontWeight: 700,
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
                sx={{
                    '& .MuiDialog-paper': {
                        maxHeight: '90vh',
                        overflow: 'auto',
                    },
                }}
            >
                {selectedArticleForModal && (
                    <>
                        <DialogTitle
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                                color: 'white',
                                pb: 1
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Avatar sx={{ background: 'rgba(255,255,255,0.2)' }}>
                                    {selectedArticleForModal.writer.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {selectedArticleForModal.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                        By {selectedArticleForModal.writer.name} • {new Date(selectedArticleForModal.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={selectedArticleForModal.category.name}
                                    size="small"
                                    sx={{ ml: 'auto', background: 'rgba(255,255,255,0.2)', color: 'white' }}
                                />
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{ p: 3 }}>
                            {/* Article Content */}
                            <Paper
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0'
                                }}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: selectedArticleForModal.content,
                                    }}
                                />
                            </Paper>

                            {/* Comments Section */}
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#374151' }}>
                                    Comments ({selectedArticleForModal.comments?.length || 0})
                                </Typography>

                                {selectedArticleForModal.comments && selectedArticleForModal.comments.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {selectedArticleForModal.comments.map((comment) => (
                                            <Paper
                                                key={comment.id}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0',
                                                    backgroundColor: '#ffffff'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                                        {comment.user?.name?.charAt(0) || 'U'}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                {comment.user?.name || 'Anonymous'}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {new Date(comment.created_at).toLocaleDateString()}
                                                            </Typography>
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
                                                                />
                                                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        onClick={handleSaveEdit}
                                                                        disabled={!editCommentText.trim()}
                                                                        sx={{
                                                                            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
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
                                                            <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>
                                                                {comment.content}
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    {comment.user_id === auth?.user?.id && editingCommentId !== comment.id && (
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEditComment(comment)}
                                                                sx={{ color: '#64748b' }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                sx={{ color: '#dc2626' }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Box>
                                ) : (
                                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                                        <Typography color="textSecondary">
                                            No comments yet. Be the first to share your thoughts!
                                        </Typography>
                                    </Paper>
                                )}

                                {/* Add New Comment Section */}
                                <Paper sx={{ p: 3, mt: 3, borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Add a Comment
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
                                                background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Post Comment
                                        </Button>
                                    </Box>
                                </Paper>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                            <Button onClick={handleCloseArticleModal} variant="outlined">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
