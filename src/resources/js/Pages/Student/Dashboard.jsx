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
import { Inertia } from '@inertiajs/inertia';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChatIcon from '@mui/icons-material/Chat';

const STATUS_COLORS = {
    published: { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' },
};

const DRAWER_WIDTH = 280;
const THEME = {
    primary: '#4f46e5',
    success: '#16a34a',
    warning: '#ea580c',
    surface: 'rgba(255, 255, 255, 0.95)',
};

export default function Dashboard({ articles, comments, categories: serverCategories, auth }) {
    const [activeNav, setActiveNav] = useState('articles');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories] = useState(serverCategories && serverCategories.length > 0 ? serverCategories : []);
    const [commentText, setCommentText] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [profileAnchor, setProfileAnchor] = useState(null);

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
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            fontWeight: 600,
                                                            borderRadius: '6px',
                                                        }}
                                                    >
                                                        Comment
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        onClick={() => Inertia.get(route('articles.show', article.id))}
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
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, #614ce1 100%)`,
                    boxShadow: '0 8px 32px rgba(79, 70, 229, 0.15)',
                    zIndex: 1201,
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>
                        Student Dashboard
                    </Typography>
                    <IconButton
                        onClick={(e) => setProfileAnchor(e.currentTarget)}
                        sx={{ color: 'white', ml: 2 }}
                    >
                        <Avatar sx={{ background: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                            {auth?.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={profileAnchor}
                        open={Boolean(profileAnchor)}
                        onClose={() => setProfileAnchor(null)}
                    >
                        <MenuItem disabled>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{auth?.user?.name}</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => setProfileAnchor(null)}>
                            <AccountCircleIcon sx={{ mr: 1, fontSize: 18 }} />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setProfileAnchor(null);
                            window.location.href = '/sample/logout';
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
                        mt: '64px',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <List>
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
                    mt: '64px',
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
                <DialogTitle sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
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
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontWeight: 700,
                        }}
                    >
                        Post Comment
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
