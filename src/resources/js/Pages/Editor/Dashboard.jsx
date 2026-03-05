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
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Inertia } from '@inertiajs/inertia';
import ReviewsIcon from '@mui/icons-material/Reviews';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const STATUS_COLORS = {
    submitted: { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' },
    needs_revision: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    published: { bg: '#f0f4ff', text: '#4f46e5', border: '#e0e7ff' },
};

const DRAWER_WIDTH = 280;
const THEME = {
    primary: '#4f46e5',
    success: '#16a34a',
    warning: '#ea580c',
    surface: 'rgba(255, 255, 255, 0.95)',
};

export default function Dashboard({ pending, published, categories: serverCategories, auth }) {
    const [activeNav, setActiveNav] = useState('pending');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [categories] = useState(serverCategories && serverCategories.length > 0 ? serverCategories : []);

    const handleReview = (articleId) => {
        Inertia.get(route('editor.articles.review', articleId));
    };

    const renderMainContent = () => {
        switch (activeNav) {
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
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, #614ce1 100%)`,
                    boxShadow: '0 8px 32px rgba(79, 70, 229, 0.15)',
                    zIndex: 1201,
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>
                        Editor Dashboard
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
                                window.location.href = '/sample/switch/student';
                            }}
                            sx={{ fontSize: '0.85rem', color: '#667eea' }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16 }} />
                            Student
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
        </Box>
    );
}
