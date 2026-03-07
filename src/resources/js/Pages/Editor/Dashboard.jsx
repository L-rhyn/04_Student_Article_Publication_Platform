import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
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
    ListItemButton,
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
    LinearProgress,
    Paper,
    Stack,
    alpha,
    Tooltip,
    Zoom,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ListItemAvatar,
    TextField
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
    EditNote as EditNoteIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    RateReview as RateReviewIcon,
    Timeline as TimelineIcon,
    TrendingUp as TrendingUpIcon,
    Star as StarIcon,
    Warning as WarningIcon,
    AutoStories as AutoStoriesIcon,
    MenuBook as MenuBookIcon,
    Psychology as PsychologyIcon,
    EmojiEvents as EmojiEventsIcon,
    PlaylistAddCheck as PlaylistAddCheckIcon,
    Comment as CommentIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';

const STATUS_COLORS = {
    submitted: { 
        bg: '#F3E8FF', 
        text: '#7E3AF2', 
        border: '#E0D4FC',
        gradient: 'linear-gradient(135deg, #F3E8FF 0%, #E0D4FC 100%)',
        icon: <EditNoteIcon />
    },
    needs_revision: { 
        bg: '#FFF3E0', 
        text: '#F97316', 
        border: '#FFE4B5',
        gradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFE4B5 100%)',
        icon: <WarningIcon />
    },
    published: { 
        bg: '#E6F7E6', 
        text: '#10B981', 
        border: '#C3E6CB',
        gradient: 'linear-gradient(135deg, #E6F7E6 0%, #C3E6CB 100%)',
        icon: <CheckCircleIcon />
    },
    under_review: {
        bg: '#E0F2FE',
        text: '#3B82F6',
        border: '#B8E0FE',
        gradient: 'linear-gradient(135deg, #E0F2FE 0%, #B8E0FE 100%)',
        icon: <RateReviewIcon />
    }
};

const PRIORITY_COLORS = {
    high: { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' },
    medium: { bg: '#FFFBEB', text: '#F59E0B', border: '#FDE68A' },
    low: { bg: '#ECFDF5', text: '#10B981', border: '#A7F3D0' }
};

const DRAWER_WIDTH = 300;
const THEME = {
    primary: '#6366F1',      // Indigo
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#8B5CF6',    // Purple
    secondaryLight: '#A78BFA',
    secondaryDark: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    surface: '#FFFFFF',
    background: '#F9FAFB',
    text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        light: '#9CA3AF'
    },
    gradient: {
        primary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        secondary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    }
};

export default function Dashboard({ pending, published, categories: serverCategories, auth, notifications }) {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [readNotifications, setReadNotifications] = useState(new Set());
    const [revisionPopover, setRevisionPopover] = useState({
        open: false,
        articleId: null,
        anchorEl: null,
        comments: ''
    });
    const [articleModal, setArticleModal] = useState({
        open: false,
        article: null
    });
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [categories] = useState(serverCategories && serverCategories.length > 0 ? serverCategories : []);
    const [stats, setStats] = useState({
        pendingToday: 0,
        avgReviewTime: '2.5h',
        completionRate: '85%',
        qualityScore: '4.8'
    });

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

        // Simulate stats calculation
        setStats({
            pendingToday: pending.filter(p => {
                const today = new Date();
                const submittedDate = new Date(p.created_at);
                return submittedDate.toDateString() === today.toDateString();
            }).length,
            avgReviewTime: '2.5h',
            completionRate: published.length > 0 ? Math.round((published.length / (pending.length + published.length)) * 100) + '%' : '0%',
            qualityScore: (4.5 + Math.random() * 0.5).toFixed(1)
        });
    }, [notifications, pending, published]);

    const handleReview = (articleId) => {
        Inertia.get(route('editor.articles.review', articleId));
    };

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

    const handleArticleModalOpen = (article) => {
        setArticleModal({
            open: true,
            article: article
        });
    };

    const handleArticleModalClose = () => {
        setArticleModal({
            open: false,
            article: null
        });
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment.id);
        setEditContent(comment.content || comment.comment);
    };

    const handleSaveEdit = async (commentId) => {
        try {
            // Make API call to update comment
            const response = await axios.put(route('comments.update', commentId), {
                content: editContent
            });
            
            // Update the article modal to reflect the edit immediately
            if (articleModal.article) {
                const updatedComments = articleModal.article.comments.map(c => 
                    c.id === commentId ? { 
                        ...c, 
                        content: editContent, 
                        comment: editContent,
                        updated_at: new Date().toISOString()
                    } : c
                );
                
                setArticleModal(prev => ({
                    ...prev,
                    article: {
                        ...prev.article,
                        comments: updatedComments
                    }
                }));
            }
            
            // Exit edit mode
            setEditingComment(null);
            setEditContent('');
            
            console.log('Comment updated successfully:', response.data);
            
            // Optional: Show success message
            // alert('Comment updated successfully!');
            
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('Failed to update comment. Please try again.');
            
            // Don't exit edit mode on error so user can retry
        }
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setEditContent('');
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(route('comments.delete', commentId));
            
            // Update the article modal to reflect the deletion
            if (articleModal.article) {
                const updatedComments = articleModal.article.comments.filter(c => c.id !== commentId);
                setArticleModal({
                    ...articleModal,
                    article: {
                        ...articleModal.article,
                        comments: updatedComments,
                        comments_count: updatedComments.length
                    }
                });
            }
            
            console.log('Comment deleted successfully');
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment. Please try again.');
        }
    };

    const getPriority = (article) => {
        // Simple priority calculation based on time
        const submittedDate = new Date(article.created_at);
        const now = new Date();
        const hoursDiff = (now - submittedDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 48) return 'high';
        if (hoursDiff > 24) return 'medium';
        return 'low';
    };

    const renderMainContent = () => {
        switch (activeNav) {
            case 'dashboard':
                return (
                    <Fade in={activeNav === 'dashboard'} timeout={500}>
                        <Box>
                            {/* Header */}
                            <Box sx={{ mb: 4 }}>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: THEME.text.primary,
                                        letterSpacing: '-0.02em',
                                        mb: 1,
                                        fontSize: { xs: '1.75rem', md: '2.125rem' }
                                    }}
                                >
                                    Welcome back, {auth?.user?.name?.split(' ')[0] || 'Editor'}!
                                </Typography>
                                <Typography variant="body1" sx={{ color: THEME.text.secondary }}>
                                    Here's your editorial overview for today
                                </Typography>
                            </Box>

                            {/* Stats Grid */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={300}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: '16px',
                                                background: 'white',
                                                border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 24px ${alpha(THEME.primary, 0.15)}`,
                                                    borderColor: alpha(THEME.primary, 0.2)
                                                }
                                            }}
                                        >
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
                                                    <HourglassEmptyIcon />
                                                </Box>
                                                <Chip
                                                    label={`${stats.pendingToday} today`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha(THEME.warning, 0.1),
                                                        color: THEME.warning,
                                                        fontWeight: 600
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {pending.length}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                Pending Reviews
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(stats.pendingToday / (pending.length || 1)) * 100}
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
                                        </Paper>
                                    </Zoom>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={400}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: '16px',
                                                background: 'white',
                                                border: `1px solid ${alpha(THEME.secondary, 0.1)}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 24px ${alpha(THEME.secondary, 0.15)}`,
                                                    borderColor: alpha(THEME.secondary, 0.2)
                                                }
                                            }}
                                        >
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
                                                    <PublishedWithChangesIcon />
                                                </Box>
                                                <Chip
                                                    label={`${published.length} total`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha(THEME.success, 0.1),
                                                        color: THEME.success,
                                                        fontWeight: 600
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {published.length}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                Published Articles
                                            </Typography>
                                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <TimelineIcon sx={{ fontSize: 16, color: THEME.success }} />
                                                <Typography variant="caption" sx={{ color: THEME.text.secondary }}>
                                                    +{Math.floor(published.length * 0.2)} this month
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Zoom>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={500}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: '16px',
                                                background: 'white',
                                                border: `1px solid ${alpha(THEME.success, 0.1)}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 24px ${alpha(THEME.success, 0.15)}`,
                                                    borderColor: alpha(THEME.success, 0.2)
                                                }
                                            }}
                                        >
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
                                                    <AssignmentTurnedInIcon />
                                                </Box>
                                            </Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {stats.completionRate}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                Completion Rate
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={parseInt(stats.completionRate) || 0}
                                                sx={{
                                                    mt: 2,
                                                    height: 4,
                                                    borderRadius: 2,
                                                    bgcolor: alpha(THEME.success, 0.1),
                                                    '& .MuiLinearProgress-bar': {
                                                        background: THEME.gradient.success,
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Paper>
                                    </Zoom>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Zoom in timeout={600}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: '16px',
                                                background: 'white',
                                                border: `1px solid ${alpha(THEME.warning, 0.1)}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 24px ${alpha(THEME.warning, 0.15)}`,
                                                    borderColor: alpha(THEME.warning, 0.2)
                                                }
                                            }}
                                        >
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
                                                    <StarIcon />
                                                </Box>
                                            </Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {stats.qualityScore}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                                Quality Score
                                            </Typography>
                                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarIcon
                                                        key={star}
                                                        sx={{
                                                            fontSize: 16,
                                                            color: star <= Math.floor(parseFloat(stats.qualityScore)) 
                                                                ? THEME.warning 
                                                                : alpha(THEME.warning, 0.2)
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Paper>
                                    </Zoom>
                                </Grid>
                            </Grid>

                            {/* Quick Actions */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            background: THEME.gradient.primary,
                                            color: 'white',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                Priority Queue
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                                                {pending.filter(a => getPriority(a) === 'high').length} articles waiting over 48 hours
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => setActiveNav('pending')}
                                                sx={{
                                                    bgcolor: '#ffffff',
                                                    color: THEME.primary,
                                                    '&:hover': {
                                                        bgcolor: alpha('#ffffff', 0.9)
                                                    }
                                                }}
                                            >
                                                Review Now
                                            </Button>
                                        </Box>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -20,
                                                right: -20,
                                                width: 120,
                                                height: 120,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.1)',
                                                zIndex: 0
                                            }}
                                        />
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            background: THEME.gradient.secondary,
                                            color: 'white',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                Achievement Unlocked
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                                                You've reviewed {published.length} articles this month!
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <EmojiEventsIcon />
                                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                                    Top Editor
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: -20,
                                                right: -20,
                                                width: 120,
                                                height: 120,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.1)',
                                                zIndex: 0
                                            }}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                );

            case 'pending':
                return (
                    <Fade in={activeNav === 'pending'} timeout={500}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: THEME.text.primary,
                                        letterSpacing: '-0.02em',
                                        mb: 1
                                    }}
                                >
                                    Review Queue
                                </Typography>
                                <Typography variant="body1" sx={{ color: THEME.text.secondary }}>
                                    {pending.length} article{pending.length !== 1 ? 's' : ''} awaiting your editorial review
                                </Typography>
                            </Box>

                            {categories.length > 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        borderRadius: '12px',
                                        bgcolor: 'white',
                                        border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.text.primary }}>
                                        Filter by Category:
                                    </Typography>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
                                        displayEmpty
                                        size="small"
                                        sx={{
                                            minWidth: 200,
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
                                </Paper>
                            )}

                            {pending.length === 0 ? (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 6,
                                        borderRadius: '16px',
                                        bgcolor: 'white',
                                        textAlign: 'center',
                                        border: `1px solid ${alpha(THEME.success, 0.2)}`
                                    }}
                                >
                                    <CheckCircleIcon sx={{ fontSize: 60, color: THEME.success, mb: 2 }} />
                                    <Typography variant="h6" sx={{ color: THEME.text.primary, mb: 1 }}>
                                        All Caught Up!
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                        No pending articles in your queue. Take a well-deserved break!
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {pending
                                        .filter(a => !selectedCategory || a.category?.id === selectedCategory)
                                        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                                        .map((article, index) => {
                                            const priority = getPriority(article);
                                            return (
                                                <Grid key={article.id} item xs={12}>
                                                    <Zoom in timeout={300 + index * 100}>
                                                        <Card
                                                            elevation={0}
                                                            sx={{
                                                                borderRadius: '16px',
                                                                border: `1px solid ${alpha(THEME.primary, 0.1)}`,
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'translateX(4px)',
                                                                    boxShadow: `0 12px 24px ${alpha(THEME.primary, 0.15)}`,
                                                                    borderColor: alpha(THEME.primary, 0.3)
                                                                }
                                                            }}
                                                        >
                                                            <CardContent sx={{ p: 3 }}>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={12} md={8}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                                            <Chip
                                                                                icon={STATUS_COLORS.submitted.icon}
                                                                                label="Pending Review"
                                                                                size="small"
                                                                                sx={{
                                                                                    bgcolor: STATUS_COLORS.submitted.bg,
                                                                                    color: STATUS_COLORS.submitted.text,
                                                                                    fontWeight: 600,
                                                                                    border: `1px solid ${STATUS_COLORS.submitted.border}`
                                                                                }}
                                                                            />
                                                                            <Chip
                                                                                label={`Priority: ${priority}`}
                                                                                size="small"
                                                                                sx={{
                                                                                    bgcolor: PRIORITY_COLORS[priority].bg,
                                                                                    color: PRIORITY_COLORS[priority].text,
                                                                                    fontWeight: 600,
                                                                                    border: `1px solid ${PRIORITY_COLORS[priority].border}`
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                        
                                                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: THEME.text.primary }}>
                                                                            {article.title}
                                                                        </Typography>
                                                                        
                                                                        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                                                                            <Box>
                                                                                <Typography variant="caption" sx={{ color: THEME.text.light, display: 'block' }}>
                                                                                    Author
                                                                                </Typography>
                                                                                <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.text.primary }}>
                                                                                    {article.writer.name}
                                                                                </Typography>
                                                                            </Box>
                                                                            <Box>
                                                                                <Typography variant="caption" sx={{ color: THEME.text.light, display: 'block' }}>
                                                                                    Category
                                                                                </Typography>
                                                                                <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.text.primary }}>
                                                                                    {article.category.name}
                                                                                </Typography>
                                                                            </Box>
                                                                            <Box>
                                                                                <Typography variant="caption" sx={{ color: THEME.text.light, display: 'block' }}>
                                                                                    Submitted
                                                                                </Typography>
                                                                                <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.text.primary }}>
                                                                                    {new Date(article.created_at).toLocaleDateString()}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Stack>
                                                                    </Grid>
                                                                    
                                                                    <Grid item xs={12} md={4}>
                                                                        <Box sx={{ 
                                                                            display: 'flex', 
                                                                            flexDirection: 'column', 
                                                                            gap: 1.5,
                                                                            height: '100%',
                                                                            justifyContent: 'center'
                                                                        }}>
                                                                            <Button
                                                                                fullWidth
                                                                                variant="contained"
                                                                                startIcon={<RateReviewIcon />}
                                                                                onClick={() => handleReview(article.id)}
                                                                                sx={{
                                                                                    background: THEME.gradient.primary,
                                                                                    color: 'white',
                                                                                    fontWeight: 600,
                                                                                    textTransform: 'none',
                                                                                    py: 1.5,
                                                                                    borderRadius: '10px',
                                                                                    '&:hover': {
                                                                                        boxShadow: `0 8px 16px ${alpha(THEME.primary, 0.3)}`
                                                                                    }
                                                                                }}
                                                                            >
                                                                                Begin Review
                                                                            </Button>
                                                                            <Button
                                                                                fullWidth
                                                                                variant="outlined"
                                                                                startIcon={<WarningIcon />}
                                                                                onClick={() => handleReview(article.id)}
                                                                                sx={{
                                                                                    borderColor: alpha(THEME.warning, 0.5),
                                                                                    color: THEME.warning,
                                                                                    textTransform: 'none',
                                                                                    py: 1.5,
                                                                                    borderRadius: '10px',
                                                                                    '&:hover': {
                                                                                        borderColor: THEME.warning,
                                                                                        bgcolor: alpha(THEME.warning, 0.04)
                                                                                    }
                                                                                }}
                                                                            >
                                                                                Request Revision
                                                                            </Button>
                                                                        </Box>
                                                                    </Grid>
                                                                </Grid>
                                                            </CardContent>
                                                        </Card>
                                                    </Zoom>
                                                </Grid>
                                            );
                                        })}
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
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: THEME.text.primary,
                                        letterSpacing: '-0.02em',
                                        mb: 1
                                    }}
                                >
                                    Published Works
                                </Typography>
                                <Typography variant="body1" sx={{ color: THEME.text.secondary }}>
                                    {published.length} article{published.length !== 1 ? 's' : ''} successfully published
                                </Typography>
                            </Box>

                            {published.length === 0 ? (
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
                                    <MenuBookIcon sx={{ fontSize: 60, color: THEME.text.light, mb: 2 }} />
                                    <Typography variant="h6" sx={{ color: THEME.text.primary, mb: 1 }}>
                                        No Published Articles Yet
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                                        Articles you approve will appear here
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {published.map((article, index) => (
                                        <Grid key={article.id} item xs={12} sm={6} lg={4}>
                                            <Zoom in timeout={300 + index * 100}>
                                                <Card
                                                    elevation={0}
                                                    onClick={() => handleArticleModalOpen(article)}
                                                    sx={{
                                                        height: '100%',
                                                        borderRadius: '16px',
                                                        border: `1px solid ${alpha(THEME.success, 0.2)}`,
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: `0 12px 24px ${alpha(THEME.success, 0.15)}`,
                                                            borderColor: alpha(THEME.success, 0.4)
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    bgcolor: alpha(THEME.success, 0.1),
                                                                    color: THEME.success
                                                                }}
                                                            >
                                                                {article.writer.name.charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.text.primary }}>
                                                                {article.writer.name}
                                                            </Typography>
                                                        </Box>

                                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: THEME.text.primary }}>
                                                            {article.title}
                                                        </Typography>

                                                        <Chip
                                                            icon={<CheckCircleIcon />}
                                                            label="Published"
                                                            size="small"
                                                            sx={{
                                                                mb: 2,
                                                                bgcolor: STATUS_COLORS.published.bg,
                                                                color: STATUS_COLORS.published.text,
                                                                fontWeight: 600,
                                                                border: `1px solid ${STATUS_COLORS.published.border}`
                                                            }}
                                                        />

                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Box>
                                                                <Typography variant="caption" sx={{ color: THEME.text.light, display: 'block' }}>
                                                                    Published on
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 500, color: THEME.text.primary }}>
                                                                    {new Date(article.updated_at).toLocaleDateString()}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <CommentIcon sx={{ fontSize: 16, color: THEME.text.light }} />
                                                                <Typography variant="body2" sx={{ color: THEME.text.primary }}>
                                                                    {article.comments_count || 0}
                                                                </Typography>
                                                            </Box>
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
            bgcolor: THEME.background
        }}>
            {/* Header */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${alpha(THEME.primary, 0.1)}`,
                    zIndex: 1201,
                    height: 80
                }}
            >
                <Toolbar sx={{ minHeight: 80 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '12px',
                                background: THEME.gradient.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <AutoStoriesIcon sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 800, 
                                color: THEME.text.primary,
                                letterSpacing: '-0.5px'
                            }}
                        >
                            Editorial Review Panel
                        </Typography>
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
                            <Badge badgeContent={unreadCount} color="error" max={99}>
                                {unreadCount > 0 ? (
                                    <NotificationsIcon sx={{ color: THEME.primary }} />
                                ) : (
                                    <NotificationsNoneIcon sx={{ color: THEME.text.secondary }} />
                                )}
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    
                    {/* Home Button */}
                    <Tooltip title="Go to Home">
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
                            fontWeight: 'bold'
                        }}>
                            {auth?.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>

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
                                window.location.href = '/sample/switch/writer';
                            }}
                            sx={{ color: THEME.secondary }}
                        >
                            <SwapHorizIcon sx={{ mr: 1.5, fontSize: 20 }} />
                            Switch to Writer View
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
                    
                    {/* Notification Menu */}
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
                                Notifications
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
                                        flexDirection: 'column', 
                                        alignItems: 'flex-start',
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: '#f8fafc' }
                                    }}
                                    onClick={() => {
                                        // Mark notification as read
                                        markNotificationAsRead(notification.id);
                                        
                                        // Close notification menu
                                        setNotificationAnchor(null);
                                        
                                        // Redirect based on notification type
                                        if (notification.data.type === 'revision_requested') {
                                            // Redirect to revise page for articles needing revision
                                            window.location.href = route('writer.articles.revise.page', notification.data.article_id);
                                        } else if (notification.data.type === 'article_published') {
                                            // Redirect to view page for published articles
                                            window.location.href = route('writer.articles.show', notification.data.article_id);
                                        }
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {notification.data?.title || 'Notification'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                            {notification.data?.message || notification.content}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled sx={{ py: 3 }}>
                                <Typography variant="body2" sx={{ color: THEME.text.light, textAlign: 'center', width: '100%' }}>
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
                        bgcolor: 'white',
                        borderRight: `1px solid ${alpha(THEME.primary, 0.1)}`,
                        mt: '80px',
                        p: 2
                    }
                }}
            >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
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
                                secondary="Overview & Stats"
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
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => setActiveNav('pending')}
                            sx={{
                                borderRadius: '12px',
                                mb: 1,
                                bgcolor: activeNav === 'pending' ? alpha(THEME.warning, 0.08) : 'transparent',
                                '&:hover': {
                                    bgcolor: activeNav === 'pending' ? alpha(THEME.warning, 0.12) : alpha(THEME.primary, 0.04)
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Badge badgeContent={pending.length} color="warning">
                                    <HourglassEmptyIcon sx={{ color: activeNav === 'pending' ? THEME.warning : THEME.text.light }} />
                                </Badge>
                            </ListItemIcon>
                            <ListItemText 
                                primary="Review Queue"
                                secondary={`${pending.length} pending`}
                                primaryTypographyProps={{
                                    sx: { 
                                        fontWeight: activeNav === 'pending' ? 700 : 500,
                                        color: activeNav === 'pending' ? THEME.warning : THEME.text.primary
                                    }
                                }}
                                secondaryTypographyProps={{
                                    sx: { color: activeNav === 'pending' ? THEME.warning : THEME.text.light }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => setActiveNav('published')}
                            sx={{
                                borderRadius: '12px',
                                bgcolor: activeNav === 'published' ? alpha(THEME.success, 0.08) : 'transparent',
                                '&:hover': {
                                    bgcolor: activeNav === 'published' ? alpha(THEME.success, 0.12) : alpha(THEME.primary, 0.04)
                                }
                            }}
                        >
                            <ListItemIcon>
                                <PublishedWithChangesIcon sx={{ color: activeNav === 'published' ? THEME.success : THEME.text.light }} />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Published"
                                secondary={`${published.length} articles`}
                                primaryTypographyProps={{
                                    sx: { 
                                        fontWeight: activeNav === 'published' ? 700 : 500,
                                        color: activeNav === 'published' ? THEME.success : THEME.text.primary
                                    }
                                }}
                                secondaryTypographyProps={{
                                    sx: { color: activeNav === 'published' ? THEME.success : THEME.text.light }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: THEME.text.light, mb: 2 }}>
                        Editorial Guidelines
                    </Typography>
                    <List dense>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircleIcon sx={{ fontSize: 16, color: THEME.success }} />
                            </ListItemIcon>
                            <ListItemText primary="Check for plagiarism" secondaryTypographyProps={{ sx: { fontSize: '0.75rem' } }} />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircleIcon sx={{ fontSize: 16, color: THEME.success }} />
                            </ListItemIcon>
                            <ListItemText primary="Verify facts and sources" secondaryTypographyProps={{ sx: { fontSize: '0.75rem' } }} />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircleIcon sx={{ fontSize: 16, color: THEME.success }} />
                            </ListItemIcon>
                            <ListItemText primary="Check grammar & style" secondaryTypographyProps={{ sx: { fontSize: '0.75rem' } }} />
                        </ListItem>
                    </List>
                </Box>

                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: '12px',
                            background: THEME.gradient.primary,
                            color: 'white'
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                            Quick Tip
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
                            High-priority articles are highlighted in orange. Try to review them within 24 hours.
                        </Typography>
                        <PsychologyIcon sx={{ fontSize: 32, opacity: 0.3 }} />
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
                    bgcolor: THEME.background
                }}
            >
                <Container maxWidth="xl" sx={{ height: '100%' }}>
                    {renderMainContent()}
                </Container>
            </Box>

            {/* Article Content Modal */}
            <Dialog
                open={articleModal.open}
                onClose={handleArticleModalClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        maxHeight: '90vh'
                    }
                }}
            >
                {articleModal.article && (
                    <>
                        <DialogTitle
                            sx={{
                                pb: 1,
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                color: 'white',
                                borderRadius: '20px 20px 0 0'
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        {articleModal.article.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'rgba(255,255,255,0.2)' }}>
                                                {articleModal.article.writer.name.charAt(0)}
                                            </Avatar>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                By {articleModal.article.writer.name}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            Published {new Date(articleModal.article.updated_at).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Chip
                                    label="Published"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 600
                                    }}
                                />
                            </Box>
                        </DialogTitle>

                        <DialogContent sx={{ p: 0 }}>
                            <Box sx={{ p: 4, pb: 2 }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        lineHeight: 1.8,
                                        color: '#374151',
                                        fontSize: '1.1rem'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: articleModal.article.content }}
                                />
                            </Box>

                            <Divider />

                            <Box sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#111827' }}>
                                    Comments ({articleModal.article.comments_count || 0})
                                </Typography>

                                {articleModal.article.comments && articleModal.article.comments.length > 0 ? (
                                    <List sx={{ width: '100%' }}>
                                        {articleModal.article.comments.map((comment) => (
                                            <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: alpha(THEME.primary, 0.1), color: THEME.primary }}>
                                                        {comment.user?.name?.charAt(0) || 'C'}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#111827' }}>
                                                                {comment.user?.name || 'Anonymous Commentator'}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                                                    {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                                </Typography>
                                                                {editingComment === comment.id ? (
                                                                    <>
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{ 
                                                                                color: THEME.success,
                                                                                '&:hover': { bgcolor: alpha(THEME.success, 0.1) }
                                                                            }}
                                                                            onClick={() => handleSaveEdit(comment.id)}
                                                                        >
                                                                            <CheckCircleIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{ 
                                                                                color: THEME.error,
                                                                                '&:hover': { bgcolor: alpha(THEME.error, 0.1) }
                                                                            }}
                                                                            onClick={handleCancelEdit}
                                                                        >
                                                                            <CancelIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{ 
                                                                                color: THEME.primary,
                                                                                '&:hover': { bgcolor: alpha(THEME.primary, 0.1) }
                                                                            }}
                                                                            onClick={() => handleEditComment(comment)}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{ 
                                                                                color: THEME.error,
                                                                                '&:hover': { bgcolor: alpha(THEME.error, 0.1) }
                                                                            }}
                                                                            onClick={() => handleDeleteComment(comment.id)}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    }
                                                    secondary={
                                                        editingComment === comment.id ? (
                                                            <TextField
                                                                fullWidth
                                                                multiline
                                                                rows={3}
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && e.ctrlKey) {
                                                                        e.preventDefault();
                                                                        handleSaveEdit(comment.id);
                                                                    }
                                                                    if (e.key === 'Escape') {
                                                                        e.preventDefault();
                                                                        handleCancelEdit();
                                                                    }
                                                                }}
                                                                sx={{
                                                                    mt: 1,
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderRadius: 2,
                                                                        bgcolor: 'rgba(99, 102, 241, 0.02)'
                                                                    }
                                                                }}
                                                                autoFocus
                                                                placeholder="Edit your comment..."
                                                                helperText="Ctrl+Enter to save, Esc to cancel"
                                                            />
                                                        ) : (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: '#374151',
                                                                    mt: 1,
                                                                    lineHeight: 1.6,
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                {comment.content || comment.comment}
                                                            </Typography>
                                                        )
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                            No comments yet. This article hasn't received any feedback from readers.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </DialogContent>

                        <DialogActions sx={{ p: 3, pt: 0 }}>
                            <Button
                                onClick={handleArticleModalClose}
                                variant="outlined"
                                sx={{
                                    borderRadius: '10px',
                                    px: 3,
                                    textTransform: 'none'
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}