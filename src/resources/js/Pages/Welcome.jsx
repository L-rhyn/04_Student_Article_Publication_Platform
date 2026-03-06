import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Button,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Paper,
    AppBar,
    Toolbar,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Avatar,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    Fade,
    Backdrop,
    Modal,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    ListItemSecondaryAction,
    Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    RateReview as ReviewIcon,
    Publish as PublishIcon,
    Comment as CommentIcon,
    CreateNewFolder as CreateIcon,
    Dashboard as DashboardIcon,
    CheckCircle as CheckIcon,
    Article as ArticleIcon,
    Group as GroupIcon,
    TrendingUp,
    School as SchoolIcon,
    AutoStories,
    Psychology,
    Lightbulb,
    Star,
    ThumbUp,
    ArrowBackIos,
    ArrowForwardIos,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Send as SendIcon
} from '@mui/icons-material';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [articles, setArticles] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [articleModalOpen, setArticleModalOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [postingComment, setPostingComment] = useState(false);

    useEffect(() => {
        fetchLatestArticles();
    }, []);

    const fetchLatestArticles = async () => {
        try {
            const response = await axios.get('/api/latest-articles');
            setArticles(response.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % articles.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
    };

    const getVisibleArticles = () => {
        return articles.length > 0 ? [articles[currentSlide]] : [];
    };

    useEffect(() => {
        if (articles.length > 1) {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000); // Auto-slide every 5 seconds
            return () => clearInterval(interval);
        }
    }, [currentSlide, articles.length]);

    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
    };

    const handleArticleClick = (article) => {
        setSelectedArticle(article);
        setArticleModalOpen(true);
        fetchComments(article.id);
    };

    const handleCloseArticleModal = () => {
        setArticleModalOpen(false);
        setSelectedArticle(null);
        setComments([]);
        setNewComment('');
        setEditingComment(null);
        setEditCommentText('');
    };

    const fetchComments = async (articleId) => {
        try {
            const response = await axios.get(`/api/articles/${articleId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !auth.user || postingComment) return;

        setPostingComment(true);
        
        try {
            const response = await axios.post(`/api/articles/${selectedArticle.id}/comments`, {
                content: newComment,
                user_id: auth.user.id
            });
            
            // Add the new comment to the list
            setComments([response.data, ...comments]);
            setNewComment('');
            
            // Update the article's comment count in the articles list
            setArticles(articles.map(article => 
                article.id === selectedArticle.id 
                    ? { ...article, comments_count: article.comments_count + 1 }
                    : article
            ));
            
            // Update the selected article's comment count
            setSelectedArticle({
                ...selectedArticle,
                comments_count: selectedArticle.comments_count + 1
            });
            
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to post comment. Please try again.');
        } finally {
            setPostingComment(false);
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment.id);
        setEditCommentText(comment.content);
    };

    const handleUpdateComment = async (commentId) => {
        try {
            const response = await axios.put(`/api/comments/${commentId}`, {
                content: editCommentText
            });
            setComments(comments.map(comment => 
                comment.id === commentId ? response.data : comment
            ));
            setEditingComment(null);
            setEditCommentText('');
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await axios.delete(`/api/comments/${commentId}`);
            
            // Remove the comment from the list
            setComments(comments.filter(comment => comment.id !== commentId));
            
            // Update the article's comment count in the articles list
            setArticles(articles.map(article => 
                article.id === selectedArticle.id 
                    ? { ...article, comments_count: Math.max(0, article.comments_count - 1) }
                    : article
            ));
            
            // Update the selected article's comment count
            setSelectedArticle({
                ...selectedArticle,
                comments_count: Math.max(0, selectedArticle.comments_count - 1)
            });
            
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment. Please try again.');
        }
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setEditCommentText('');
    };

    return (
        <>
            <Head title="Welcome - Article Publication Platform" />

            {/* Enhanced Navigation Bar */}
            <AppBar position="static" sx={{ 
                background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                boxShadow: '0 4px 20px rgba(0, 180, 216, 0.2)'
            }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AutoStories sx={{ fontSize: 32, color: 'white' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                            Article Publication Platform
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {!auth.user ? (
                            <>
                                <Button
                                    component={Link}
                                    href={route('login')}
                                    variant="outlined"
                                    sx={{ color: 'white', borderColor: 'white' }}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={Link}
                                    href={route('register')}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'grey.100',
                                        }
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        ) : (
                            <Button
                                component={Link}
                                href={route('dashboard')}
                                variant="contained"
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'grey.100',
                                    }
                                }}
                            >
                                Go to Dashboard
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Hero Section with Enhanced Background */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 50%, #03045e 100%)',
                    minHeight: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.3
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Hero Content */}
                    <Box sx={{ 
                        py: 6, 
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 'calc(100vh - 64px)'
                    }}>
                        <Fade in timeout={1000}>
                            <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
                                <Typography
                                    variant="h2"
                                    component="h1"
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: 3,
                                        color: 'white',
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                        lineHeight: 1.2,
                                        textAlign: 'center'
                                    }}
                                >
                                    Share Your Knowledge with World
                                </Typography>
                                
                                <Typography
                                    variant="h4"
                                    sx={{
                                        mb: 6,
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        maxWidth: '700px',
                                        mx: 'auto',
                                        lineHeight: 1.6,
                                        textAlign: 'center'
                                    }}
                                >
                                    Join our collaborative platform where writers create, editors refine, and readers engage with quality content.
                                </Typography>

                                {!auth.user && (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        gap: 2, 
                                        justifyContent: 'center', 
                                        flexWrap: 'wrap',
                                        alignItems: 'center'
                                    }}>
                                        <Button
                                            component={Link}
                                            href={route('register')}
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                backgroundColor: 'white',
                                                color: 'primary.main',
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                '&:hover': {
                                                    backgroundColor: 'grey.100',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Get Started
                                        </Button>
                                        <Button
                                            component={Link}
                                            href={route('login')}
                                            variant="outlined"
                                            size="large"
                                            sx={{
                                                color: 'white',
                                                borderColor: 'white',
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    borderColor: 'white',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Sign In
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Fade>
                    </Box>

                    {/* Latest Articles Carousel */}
                    <Box sx={{ 
                        py: 6, 
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Slide in timeout={2000} direction="up">
                            <Box sx={{ maxWidth: '1000px', mx: 'auto', mb: 6 }}>
                                <Typography
                                    variant="h4"
                                    sx={{ 
                                        fontWeight: 'bold', 
                                        mb: 3, 
                                        textAlign: 'center', 
                                        color: 'white',
                                        fontSize: { xs: '2rem', md: '2.5rem' }
                                    }}
                                >
                                    Latest Published Articles
                                </Typography>
                            </Box>
                        </Slide>

                        {!loading && articles.length > 0 && (
                            <Box sx={{ position: 'relative', maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 4, md: 6 }, py: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
                                    <Button
                                        onClick={prevSlide}
                                        sx={{
                                            position: 'absolute',
                                            left: { xs: 10, sm: 20, md: 40 },
                                            zIndex: 2,
                                            backgroundColor: 'rgba(0, 180, 216, 0.9)',
                                            color: 'white',
                                            minWidth: 50,
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            '&:hover': {
                                                backgroundColor: '#0077b6',
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        <ArrowBackIos />
                                    </Button>

                                    <Box sx={{ width: '100%', maxWidth: '600px' }}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        {getVisibleArticles().map((article, index) => (
                                            <Slide in timeout={300} direction="left" key={article.id}>
                                                <Card sx={{ 
                                                    height: '100%', 
                                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                                                    transition: 'all 0.3s ease',
                                                    background: 'rgba(255, 255, 255, 0.95)',
                                                    backdropFilter: 'blur(10px)',
                                                    cursor: 'pointer',
                                                    '&:hover': { 
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                                                    }
                                                }}
                                                onClick={() => handleArticleClick(article)}
                                                >
                                                    <CardContent sx={{ p: { xs: 4, sm: 5, md: 6 } }}>
                                                        <Typography variant="h4" sx={{ 
                                                            fontWeight: 'bold', 
                                                            mb: 3, 
                                                            color: 'primary.main',
                                                            lineHeight: 1.3,
                                                            fontSize: { xs: '1.3rem', md: '1.5rem' }
                                                        }}>
                                                            {article.title}
                                                        </Typography>
                                                        
                                                        <Typography variant="body1" sx={{ 
                                                            mb: 3, 
                                                            color: 'text.secondary', 
                                                            lineHeight: 1.7,
                                                            fontSize: '1rem',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: { xs: 4, sm: 5, md: 6 },
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {article.excerpt || stripHtml(article.content).substring(0, 200) + '...'}
                                                        </Typography>

                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                                                By {article.writer || 'Anonymous'}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ 
                                                                backgroundColor: 'primary.light', 
                                                                color: 'white', 
                                                                px: 2, 
                                                                py: 0.5, 
                                                                borderRadius: 2,
                                                                fontSize: '0.875rem'
                                                            }}>
                                                                {article.category || 'General'}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                 {article.comments_count || 0} comments
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                {article.updated_at}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Slide>
                                        ))}
                                    </Box>

                                    <Button
                                        onClick={nextSlide}
                                        sx={{
                                            position: 'absolute',
                                            right: -20,
                                            zIndex: 2,
                                            backgroundColor: 'rgba(0, 180, 216, 0.9)',
                                            color: 'white',
                                            minWidth: 50,
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            '&:hover': {
                                                backgroundColor: '#0077b6',
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        <ArrowForwardIos />
                                    </Button>
                                </Box>

                                {/* Slide indicators */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1.5 }}>
                                    {articles.map((_, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: currentSlide === index ? 32 : 8,
                                                height: 8,
                                                backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.4)',
                                                borderRadius: 4,
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setCurrentSlide(index)}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {loading && (
                            <Box sx={{ textAlign: 'center', color: 'white' }}>
                                <Typography>Loading latest articles...</Typography>
                            </Box>
                        )}

                        {!loading && articles.length === 0 && (
                            <Box sx={{ textAlign: 'center', color: 'white' }}>
                                <Typography>No published articles available yet.</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Features Section */}
                    <Box sx={{ 
                        py: 6, 
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Slide in timeout={2000} direction="up">
                            <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 6 }}>
                                <Typography
                                    variant="h4"
                                    sx={{ 
                                        fontWeight: 'bold', 
                                        mb: 3, 
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: { xs: '2rem', md: '2.5rem' }
                                    }}
                                >
                                    Why Choose Our Platform?
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: { xs: '1rem', md: '1.1rem' },
                                        fontWeight: 400,
                                        maxWidth: '600px',
                                        mx: 'auto',
                                        textAlign: 'center'
                                    }}
                                >
                                    Discover the features that make our platform the preferred choice for content creators and readers
                                </Typography>
                            </Box>
                        </Slide>

                        <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ maxWidth: '1400px', mx: 'auto' }}>
                            {/* First Row - 3 cards */}
                            <Grid item xs={12} sm={6} md={4}>
                                <Slide in timeout={2100} direction="up">
                                    <Card sx={{
                                        p: { xs: 4, sm: 5, md: 6 },
                                        textAlign: 'center',
                                        height: '100%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: 3,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            transform: 'translateY(-4px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                                            borderRadius: '50%',
                                            width: 80,
                                            height: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
                                        }}>
                                            <Lightbulb sx={{ fontSize: 40, color: '#1e3c72' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'white', fontSize: '1.2rem' }}>
                                            Knowledge Sharing
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                                            Share your expertise and learn from others in a collaborative environment
                                        </Typography>
                                    </Card>
                                </Slide>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Slide in timeout={2200} direction="up">
                                    <Card sx={{
                                        p: { xs: 4, sm: 5, md: 6 },
                                        textAlign: 'center',
                                        height: '100%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: 3,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            transform: 'translateY(-4px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '50%',
                                            width: 80,
                                            height: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                                        }}>
                                            <Psychology sx={{ fontSize: 40, color: 'white' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'white', fontSize: '1.2rem' }}>
                                            Quality Content
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                                            Professional editorial process ensures high-quality, accurate content
                                        </Typography>
                                    </Card>
                                </Slide>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Slide in timeout={2300} direction="up">
                                    <Card sx={{
                                        p: { xs: 4, sm: 5, md: 6 },
                                        textAlign: 'center',
                                        height: '100%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: 3,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            transform: 'translateY(-4px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                            borderRadius: '50%',
                                            width: 80,
                                            height: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
                                        }}>
                                            <GroupIcon sx={{ fontSize: 40, color: 'white' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'white', fontSize: '1.2rem' }}>
                                            Community Driven
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                                            Engage with a community of passionate writers, editors, and readers
                                        </Typography>
                                    </Card>
                                </Slide>
                            </Grid>

                            {/* Second Row - 2 cards */}
                            <Grid item xs={12} sm={6} md={6}>
                                <Slide in timeout={2400} direction="up">
                                    <Card sx={{
                                        p: { xs: 4, sm: 5, md: 6 },
                                        textAlign: 'center',
                                        height: '100%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: 3,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            transform: 'translateY(-4px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                                            borderRadius: '50%',
                                            width: 80,
                                            height: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
                                        }}>
                                            <Star sx={{ fontSize: 40, color: 'white' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'white', fontSize: '1.2rem' }}>
                                            Expert Writers
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                                            Learn from industry experts and thought leaders in various fields
                                        </Typography>
                                    </Card>
                                </Slide>
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <Slide in timeout={2500} direction="up">
                                    <Card sx={{
                                        p: { xs: 4, sm: 5, md: 6 },
                                        textAlign: 'center',
                                        height: '100%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: 3,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            transform: 'translateY(-4px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #20bf6b 0%, #26de81 100%)',
                                            borderRadius: '50%',
                                            width: 80,
                                            height: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            boxShadow: '0 8px 25px rgba(32, 191, 107, 0.3)'
                                        }}>
                                            <TrendingUp sx={{ fontSize: 40, color: 'white' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'white', fontSize: '1.2rem' }}>
                                            Grow Together
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                                            Build your portfolio and grow your influence in the community
                                        </Typography>
                                    </Card>
                                </Slide>
                            </Grid>

                            {/* Third Row - 1 centered card */}
                            <Grid item xs={12} md={12}>
                                <Slide in timeout={2600} direction="up">
                                    <Card sx={{
                                        p: { xs: 4, sm: 5, md: 6 },
                                        textAlign: 'center',
                                        height: '100%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: 3,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            transform: 'translateY(-4px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                                            borderRadius: '50%',
                                            width: 80,
                                            height: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)'
                                        }}>
                                            <SchoolIcon sx={{ fontSize: 40, color: 'white' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'white', fontSize: '1.2rem' }}>
                                            Learning Platform
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                                            Access educational resources and improve your skills continuously
                                        </Typography>
                                    </Card>
                                </Slide>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Call to Action */}
                    <Box sx={{
                        py: 8,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Slide in timeout={2200} direction="up">
                            <Paper sx={{
                                p: 6,
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 4,
                                maxWidth: '700px',
                                mx: 'auto'
                            }}>
                                <Typography variant="h4" sx={{ mb: 3, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                    Ready to Get Started?
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' }}>
                                    Join our community of writers, editors, and readers today. Start creating, reviewing, or exploring quality content.
                                </Typography>
                            </Paper>
                        </Slide>
                    </Box>
                </Container>
            </Box>

            {/* Article Modal */}
            <Dialog
                open={articleModalOpen}
                onClose={handleCloseArticleModal}
                maxWidth="md"
                fullWidth
                scroll="paper"
                TransitionComponent={Slide}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 3,
                        overflow: 'hidden'
                    }
                }}
            >
                {selectedArticle && (
                    <>
                        <DialogTitle sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            pb: 2
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    {selectedArticle.writer?.[0] || 'A'}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {selectedArticle.writer || 'Anonymous'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedArticle.updated_at}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton onClick={handleCloseArticleModal}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        
                        <DialogContent dividers sx={{ p: 4 }}>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 'bold',
                                mb: 3,
                                color: 'primary.main'
                            }}>
                                {selectedArticle.title}
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        color: 'white',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 2,
                                        display: 'inline-block',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {selectedArticle.category || 'General'}
                                </Typography>
                            </Box>

                            <Typography variant="body1" sx={{ 
                                lineHeight: 1.8,
                                mb: 4,
                                '& p': { mb: 2 }
                            }}>
                                {selectedArticle.content}
                            </Typography>

                            {/* Comments Section */}
                            <Divider sx={{ my: 3 }} />
                            
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Comments ({selectedArticle.comments_count || 0})
                            </Typography>

                            {/* Add Comment */}
                            {auth.user ? (
                                <Box sx={{ mb: 4 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleAddComment}
                                            disabled={!newComment.trim() || postingComment}
                                            startIcon={<SendIcon />}
                                        >
                                            {postingComment ? 'Posting...' : 'Post Comment'}
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ mb: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Please <Link href={route('login')}>login</Link> to comment
                                    </Typography>
                                </Box>
                            )}

                            {/* Comments List */}
                            <List sx={{ p: 0 }}>
                                {comments.map((comment) => (
                                    <ListItem key={comment.id} sx={{ 
                                        flexDirection: 'column', 
                                        alignItems: 'flex-start',
                                        p: 2,
                                        mb: 2,
                                        bgcolor: 'grey.50',
                                        borderRadius: 2
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                                            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'secondary.main' }}>
                                                {comment.user?.name?.[0] || 'U'}
                                            </Avatar>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                {comment.user?.name || 'Anonymous'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                                {comment.updated_at}
                                            </Typography>
                                        </Box>
                                        
                                        {editingComment === comment.id ? (
                                            <Box sx={{ width: '100%' }}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    value={editCommentText}
                                                    onChange={(e) => setEditCommentText(e.target.value)}
                                                    sx={{ mb: 1 }}
                                                />
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() => handleUpdateComment(comment.id)}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={handleCancelEdit}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <>
                                                <Typography variant="body2" sx={{ mb: 1, width: '100%' }}>
                                                    {comment.content}
                                                </Typography>
                                                {auth.user && comment.user_id === auth.user.id && (
                                                    <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEditComment(comment)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </ListItem>
                                ))}
                            </List>

                            {comments.length === 0 && (
                                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    <Typography>No comments yet. Be the first to comment!</Typography>
                                </Box>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>

            {/* Footer */}
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    py: 4,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary">
                        © 2026 Article Publication Platform Group3. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </>
    );
}
