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
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HomeIcon from '@mui/icons-material/Home';
import JoditEditor from 'jodit-react';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import DoneIcon from '@mui/icons-material/Done';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const STATUS_COLORS = {
    draft: { bg: '#e3f2fd', text: '#00b4d8', border: '#b3e5fc' },
    submitted: { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' },
    needs_revision: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    published: { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
};

const DRAWER_WIDTH = 280;
const THEME = {
    primary: '#00b4d8',
    secondary: '#0077b6',
    success: '#16a34a',
    warning: '#ea580c',
    surface: 'rgba(255, 255, 255, 0.95)',
    dark: '#03045e',
};

export default function Dashboard({ articles, categories, auth, notifications }) {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [form, setForm] = useState({ title: '', content: '', category_id: '' });
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [categorySearch, setCategorySearch] = useState('');
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [readNotifications, setReadNotifications] = useState(new Set());

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
                    <Fade in={activeNav === 'dashboard'}>
                        <Container maxWidth="lg">
                            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: '#111827' }}>
                                Article Statistics
                            </Typography>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        p: 3, 
                                        borderRadius: '12px', 
                                        textAlign: 'center',
                                        background: 'linear-gradient(135deg, #f0fdff 0%, #e6fffa 100%)',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <CardContent>
                                            <Typography variant="h2" sx={{ color: '#4f46e5', mb: 2 }}>
                                                {draftArticles.length}
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
                                                Draft Articles
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Articles you're currently working on
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        p: 3, 
                                        borderRadius: '12px', 
                                        textAlign: 'center',
                                        background: 'linear-gradient(135deg, #f0fdff 0%, #e6fffa 100%)',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <CardContent>
                                            <Typography variant="h2" sx={{ color: '#16a34a', mb: 2 }}>
                                                {submittedArticles.length}
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
                                                Submitted Articles
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Articles under review
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        p: 3, 
                                        borderRadius: '12px', 
                                        textAlign: 'center',
                                        background: 'linear-gradient(135deg, #f0fdff 0%, #e6fffa 100%)',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <CardContent>
                                            <Typography variant="h2" sx={{ color: '#ea580c', mb: 2 }}>
                                                {revisedArticles.length}
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
                                                Need Revision
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Articles requiring changes
                                            </Typography>
                                        </CardContent>
                                    </Card>
                            </Grid>
                            
                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                <Grid item xs={12}>
                                    <Card sx={{ 
                                        p: 4, 
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #f0fdff 0%, #e6fffa 100%)',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#111827' }}>
                                                Recent Activity
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        Total Articles Created
                                                    </Typography>
                                                    <Typography variant="h4" sx={{ color: '#4f46e5' }}>
                                                        {articles.length}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#f0f4ff', borderRadius: '8px' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        Articles Published
                                                    </Typography>
                                                    <Typography variant="h4" sx={{ color: '#16a34a' }}>
                                                        {articles.filter(a => a.status.name === 'published').length}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            </Grid>
                        </Container>
                    </Fade>
                );
                

            case 'create':
                return (
                    <Fade in={activeNav === 'create'}>
                        <Paper
                            sx={{
                                p: 4,
                                borderRadius: '16px',
                                background: THEME.surface,
                                boxShadow: '0 10px 40px rgba(31, 41, 55, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                Create New Article
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 4, color: '#6b7280' }}>
                                Share your thoughts with the world
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    label="Article Title"
                                    fullWidth
                                    placeholder="Enter a compelling title..."
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            backgroundColor: '#f9fafb',
                                            '&:hover fieldset': { borderColor: THEME.primary },
                                            '&.Mui-focused fieldset': { borderColor: THEME.primary },
                                        },
                                    }}
                                    required
                                    variant="outlined"
                                />

                                <Select
                                    fullWidth
                                    value={form.category_id}
                                    onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : '' })}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (!selected) {
                                            return <Typography sx={{ color: '#9ca3af' }}>Select a category</Typography>;
                                        }
                                        const category = categories.find(cat => cat.id === selected);
                                        return category ? category.name : '';
                                    }}
                                    sx={{
                                        mb: 4,
                                        borderRadius: '10px',
                                        backgroundColor: '#f9fafb',
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: THEME.primary },
                                            '&.Mui-focused fieldset': { borderColor: THEME.primary },
                                        },
                                    }}
                                >
                                    <MenuItem value="">
                                        <Typography sx={{ color: '#9ca3af' }}>Select a category</Typography>
                                    </MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                    ))}
                                </Select>

                                <Typography sx={{ mb: 2, fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                                    Article Content
                                </Typography>
                                <Paper
                                    sx={{
                                        mb: 4,
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        backgroundColor: '#fafbfc',
                                    }}
                                >
                                    <JoditEditor
                                        value={form.content}
                                        onBlur={(newContent) => setForm({ ...form, content: newContent })}
                                    />
                                </Paper>

                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            borderRadius: '10px',
                                            py: 1.5,
                                            fontSize: '1rem',
                                            boxShadow: `0 4px 15px rgba(0, 180, 216, 0.3)`,
                                            '&:hover': {
                                                boxShadow: `0 6px 25px rgba(0, 180, 216, 0.4)`,
                                            },
                                        }}
                                    >
                                        Save as Draft
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        size="large"
                                        onClick={(e) => {
                                            Inertia.post(route('writer.articles.store'), { ...form, submit: true });
                                        }}
                                        sx={{
                                            background: THEME.success,
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            borderRadius: '10px',
                                            py: 1.5,
                                            fontSize: '1rem',
                                            boxShadow: `0 4px 15px rgba(22, 163, 74, 0.3)`,
                                            '&:hover': {
                                                boxShadow: `0 6px 25px rgba(22, 163, 74, 0.4)`,
                                            },
                                        }}
                                    >
                                        Save & Submit for Review
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Fade>
                );

            case 'drafts':
                return (
                    <Fade in={activeNav === 'drafts'}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                    Drafts
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 3, color: '#6b7280' }}>
                                    You have {draftArticles.length} draft{draftArticles.length !== 1 ? 's' : ''}
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Search by title or category..."
                                    value={categorySearch}
                                    onChange={(e) => setCategorySearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: '#9ca3af' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            backgroundColor: '#f9fafb',
                                            '&:hover fieldset': { borderColor: THEME.primary },
                                            '&.Mui-focused fieldset': { borderColor: THEME.primary },
                                        },
                                    }}
                                    variant="outlined"
                                />
                            </Box>
                            {filteredDraftArticles.length === 0 ? (
                                <Card sx={{ 
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #f0fdff 0%, #e6fffa 100%)',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                        <Typography color="textSecondary">
                                            {categorySearch ? ' No drafts found matching your search.' : ' No drafts yet. Start creating!'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Grid
                                    container
                                    spacing={3}
                                >
                                    {filteredDraftArticles.map((article) => (
                                        <Grid
                                            key={article.id}
                                            item
                                            xs={12}
                                            md={4}   // ALWAYS 3 per row on md+
                                            sx={{
                                                display: 'flex',
                                            }}
                                        >
                                            <Card
                                                sx={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    borderRadius: '14px',
                                                    border: '1px solid #e2e8f0',
                                                    minHeight: 340, // FORCE equal height
                                                    transition: 'all 0.25s ease',
                                                    background: 'linear-gradient(135deg, #f0fdff 0%, #e6fffa 50%, #f0fdfa 100%)',
                                                    '&:hover': {
                                                        transform: 'translateY(-6px)',
                                                        boxShadow: '0 12px 30px rgba(0, 180, 216, 0.15)',
                                                        border: '1px solid #00b4d8',
                                                    },
                                                }}
                                            >
                                                {/* TOP CONTENT */}
                                                <CardContent
                                                    sx={{
                                                        flexGrow: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        p: 3,
                                                    }}
                                                >
                                                    {/* TITLE (fixed height block) */}
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 700,
                                                            fontSize: '1.05rem',
                                                            lineHeight: 1.4,
                                                            minHeight: 56, // SAME height for all titles
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            mb: 2,
                                                        }}
                                                    >
                                                        {article.title}
                                                    </Typography>

                                                    {/* CATEGORY */}
                                                    <Chip
                                                        label={article.category.name}
                                                        size="small"
                                                        sx={{
                                                            alignSelf: 'flex-start',
                                                            mb: 2,
                                                            backgroundColor: '#f0f4ff',
                                                            color: '#4f46e5',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    />

                                                    {/* DATE */}
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: '#6b7280', mb: 2 }}
                                                    >
                                                        Last edited:{" "}
                                                        {new Date(article.updated_at).toLocaleDateString()}
                                                    </Typography>

                                                    {/* PUSH STATUS TO BOTTOM */}
                                                    <Box sx={{ mt: 'auto' }}>
                                                        <Chip
                                                            label="Draft"
                                                            sx={{
                                                                width: '100%',
                                                                background: STATUS_COLORS.draft.bg,
                                                                color: STATUS_COLORS.draft.text,
                                                                fontWeight: 600,
                                                                justifyContent: 'center',
                                                            }}
                                                        />
                                                    </Box>
                                                </CardContent>

                                                {/* ACTION BUTTONS */}
                                                <CardActions
                                                    sx={{
                                                        flexDirection: 'column',
                                                        gap: 1,
                                                        px: 2,
                                                        pb: 2,
                                                    }}
                                                >
                                                    <Button
                                                        fullWidth
                                                        size="small"
                                                        startIcon={<VisibilityIcon />}
                                                        sx={{ justifyContent: 'flex-start' }}
                                                        onClick={() =>
                                                            (window.location.href = route(
                                                                'writer.articles.show',
                                                                article.id
                                                            ))
                                                        }
                                                    >
                                                        View
                                                    </Button>

                                                    <Button
                                                        fullWidth
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        sx={{ justifyContent: 'flex-start' }}
                                                        onClick={() =>
                                                            (window.location.href = route(
                                                                'writer.articles.show',
                                                                article.id
                                                            ))
                                                        }
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        fullWidth
                                                        size="small"
                                                        startIcon={<SendIcon />}
                                                        onClick={() => handleSubmitArticle(article.id)}
                                                        sx={{ justifyContent: 'flex-start', fontWeight: 600 }}
                                                    >
                                                        Submit
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

            case 'submitted':
                return (
                    <Fade in={activeNav === 'submitted'}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                                    Submitted Articles
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                    {submittedArticles.length} under review, {revisedArticles.length} awaiting revision
                                </Typography>
                            </Box>
                            {submittedArticles.length === 0 && revisedArticles.length === 0 ? (
                                <Card sx={{ 
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #f0fdff 0%, #e6fffa 100%)',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                        <Typography color="textSecondary">
                                            📤 No submitted articles yet.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Grid container spacing={3}>
                                    {[...submittedArticles, ...revisedArticles].map((article) => (
                                        <Grid key={article.id} item xs={12}>
                                            <Card
                                                sx={{
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    transition: 'all 0.3s ease',
                                                    background: 'linear-gradient(135deg, #f0fdff 0%, #e6fffa 50%, #f0fdfa 100%)',
                                                    '&:hover': {
                                                        transform: 'translateX(4px)',
                                                        boxShadow: '0 8px 20px rgba(0, 180, 216, 0.15)',
                                                        border: '1px solid #00b4d8',
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                            {article.title}
                                                        </Typography>
                                                        <Chip label={article.category.name} size="small" sx={{ mb: 2 }} />
                                                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                                            Status: {article.status.label}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={article.status.label}
                                                        sx={{
                                                            background: STATUS_COLORS[article.status.name]?.bg || '#f0f0f0',
                                                            color: STATUS_COLORS[article.status.name]?.text || '#666',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </CardContent>
                                                <CardActions>
                                                    <Button 
                                                        size="small" 
                                                        startIcon={<VisibilityIcon />} 
                                                        sx={{ color: '#667eea' }}
                                                        onClick={() => window.location.href = route('writer.articles.show', article.id)}
                                                    >
                                                        View
                                                    </Button>
                                                    {article.status.name === 'needs_revision' && (
                                                        <Button 
                                                            size="small" 
                                                            startIcon={<EditIcon />} 
                                                            sx={{ color: '#e65100', fontWeight: 600 }}
                                                            onClick={() => window.location.href = route('writer.articles.revise.page', article.id)}
                                                        >
                                                            Revise
                                                        </Button>
                                                    )}
                                                </CardActions>
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
                         Writer Dashboard
                    </Typography>
                    
                    {/* Notification Bell */}
                    <IconButton
                        onClick={(e) => setNotificationAnchor(e.currentTarget)}
                        sx={{ 
                            color: 'white', 
                            mr: 2,
                            width: 48,
                            height: 48,
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.25)',
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                            },
                            '&:active': {
                                transform: 'scale(0.95)',
                            }
                        }}
                    >
                        <Badge 
                            badgeContent={unreadCount} 
                            color="error"
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: '0.6rem',
                                    height: 16,
                                    minWidth: 16,
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
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.25)',
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                            }
                        }}
                        title="Home"
                    >
                        <HomeIcon sx={{ fontSize: 24 }} />
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
                            window.location.href = route('profile.edit');
                        }}>
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
                                window.location.href = '/sample/switch/editor';
                            }}
                            sx={{ fontSize: '0.85rem', color: '#667eea' }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16 }} />
                            Editor
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
                            }
                        }}
                    >
                        <MenuItem disabled>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Notifications from Editors
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
                                        // Mark this notification as read
                                        setReadNotifications(prev => new Set([...prev, notification.id]));
                                    }}
                                    sx={{ 
                                        py: 2,
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        whiteSpace: 'normal',
                                        '&:hover': {
                                            backgroundColor: '#f8fafc',
                                        },
                                        opacity: readNotifications.has(notification.id) ? 0.6 : 1,
                                        borderLeft: readNotifications.has(notification.id) ? '3px solid #e5e7eb' : '3px solid #4f46e5'
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#111827' }}>
                                            {notification.data.message}
                                        </Typography>
                                        
                                        {notification.data.type === 'revision_requested' && (
                                            <Box sx={{ mt: 1, p: 1.5, backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#92400e', display: 'block', mb: 0.5 }}>
                                                    Editor Comments:
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#78350f', fontStyle: 'italic' }}>
                                                    "{notification.data.comments}"
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#92400e', display: 'block', mt: 0.5 }}>
                                                    — {notification.data.editor_name}
                                                </Typography>
                                            </Box>
                                        )}
                                        
                                        {notification.data.type === 'article_published' && (
                                            <Box sx={{ mt: 1, p: 1.5, backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#166534', display: 'block' }}>
                                                    Published by: {notification.data.editor_name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#166534' }}>
                                                    Your article is now live and available for students to read!
                                                </Typography>
                                            </Box>
                                        )}
                                        
                                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                                            {new Date(notification.created_at).toLocaleDateString()} • {new Date(notification.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>
                                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
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
                            <ListItemText primary="Dashboard" />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('create')}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                background: activeNav === 'create' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'create' ? '#667eea' : '#64748b' }}>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary="Create Article" />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('drafts')}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                background: activeNav === 'drafts' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'drafts' ? '#667eea' : '#64748b' }}>
                                <CreateIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="My Drafts"
                                secondary={draftArticles.length}
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('submitted')}
                            sx={{
                                borderRadius: '8px',
                                background: activeNav === 'submitted' ? '#f3e5f5' : 'transparent',
                                '&:hover': { background: '#f5f5f5' },
                            }}
                        >
                            <ListItemIcon sx={{ color: activeNav === 'submitted' ? '#667eea' : '#64748b' }}>
                                <DoneIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Submitted Articles"
                                secondary={submittedArticles.length + revisedArticles.length}
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

