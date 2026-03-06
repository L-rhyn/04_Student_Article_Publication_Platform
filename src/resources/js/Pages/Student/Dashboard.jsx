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
    Badge,
    Zoom,
    Grow,
    alpha
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
    AutoStories as AutoStoriesIcon,
    EmojiEmotions as EmojiIcon,
    Rocket as RocketIcon,
    Celebration as CelebrationIcon,
    Star as StarIcon,
    ThumbUp as ThumbUpIcon,
    Menu as MenuIcon,
    Brush as BrushIcon,
    Pets as PetsIcon,
    MusicNote as MusicIcon,
    Forest as ForestIcon,
    WbSunny as SunIcon,
    Bookmark as BookmarkIcon,
    Favorite as FavoriteIcon,
    Share as ShareIcon
} from '@mui/icons-material';
import { Inertia } from '@inertiajs/inertia';

const STATUS_COLORS = {
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

export default function Dashboard({ articles, comments, categories: serverCategories, auth }) {
    const [activeNav, setActiveNav] = useState('articles');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories] = useState(serverCategories && serverCategories.length > 0 ? serverCategories : []);
    const [commentText, setCommentText] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [floatingIcons] = useState(() => {
        const icons = [
            <BrushIcon />, <PetsIcon />, <MusicIcon />, <StarIcon />,
            <ForestIcon />, <EmojiIcon />, <RocketIcon />, <CelebrationIcon />,
            <SunIcon />
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
                    <Fade in={activeNav === 'articles'} timeout={800}>
                        <Box>
                            {/* Welcome Banner */}
                            <Paper
                                sx={{
                                    p: 4,
                                    mb: 4,
                                    borderRadius: 8,
                                    background: `linear-gradient(135deg, ${THEME.blue} 0%, ${THEME.green} 100%)`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: `4px solid ${THEME.accent}`,
                                    boxShadow: `8px 8px 0 ${alpha(THEME.blue, 0.3)}`
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
                                        Welcome, {auth?.user?.name?.split(' ')[0]}! 📚
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontFamily: '"Comic Sans MS", cursive',
                                            color: THEME.accent,
                                            mb: 3
                                        }}
                                    >
                                        {articles.length} amazing articles{articles.length !== 1 ? 's' : ''} waiting for you to explore!
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Chip
                                            icon={<span>📖</span>}
                                            label={`${articles.length} Articles`}
                                            sx={{
                                                bgcolor: 'white',
                                                color: THEME.blue,
                                                fontFamily: '"Comic Sans MS", cursive',
                                                fontSize: '1rem',
                                                p: 2
                                            }}
                                        />
                                        <Chip
                                            icon={<span>💬</span>}
                                            label={`${comments.length} Comments`}
                                            sx={{
                                                bgcolor: 'white',
                                                color: THEME.green,
                                                fontFamily: '"Comic Sans MS", cursive',
                                                fontSize: '1rem',
                                                p: 2
                                            }}
                                        />
                                    </Box>
                                </Box>
                                
                                {/* Floating icons in banner */}
                                <Box sx={{ position: 'absolute', top: 20, right: 20, opacity: 0.2 }}>
                                    <AutoStoriesIcon sx={{ fontSize: 100, color: 'white' }} />
                                </Box>
                            </Paper>

                            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: '"Comic Sans MS", cursive',
                                        fontWeight: 'bold',
                                        color: THEME.primary,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    <MenuBookIcon sx={{ fontSize: 40, color: THEME.accent }} />
                                    Article Library
                                    <MenuBookIcon sx={{ fontSize: 40, color: THEME.accent }} />
                                </Typography>

                                {categories.length > 0 && (
                                    <Paper sx={{ 
                                        p: 1, 
                                        borderRadius: 8,
                                        bgcolor: 'white',
                                        border: `3px solid ${THEME.secondary}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.purple, ml: 1 }}>
                                            🔍 Explore:
                                        </Typography>
                                        <Select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
                                            displayEmpty
                                            sx={{
                                                minWidth: 200,
                                                fontFamily: '"Comic Sans MS", cursive',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none'
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
                            </Box>

                            {articles.length === 0 ? (
                                <Paper sx={{ 
                                    p: 6,
                                    borderRadius: 8,
                                    background: `linear-gradient(135deg, ${alpha(THEME.accent, 0.2)} 0%, ${alpha(THEME.secondary, 0.2)} 100%)`,
                                    border: `4px solid ${THEME.accent}`,
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h3" sx={{ fontSize: '4rem', mb: 2 }}>
                                        📚
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 2 }}>
                                        No articles yet!
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                        Check back soon for amazing adventures! ✨
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={4}>
                                    {articles.filter(a => !selectedCategory || a.category?.id === selectedCategory).map((article, index) => (
                                        <Grid key={article.id} item xs={12}>
                                            <Grow in timeout={500 + index * 100}>
                                                <Card
                                                    sx={{
                                                        borderRadius: 8,
                                                        border: `4px solid ${THEME.secondary}`,
                                                        boxShadow: `6px 6px 0 ${THEME.primary}`,
                                                        bgcolor: 'white',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateX(4px) translateY(-4px)',
                                                            boxShadow: `8px 8px 0 ${THEME.primary}`
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 4 }}>
                                                        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 60,
                                                                    height: 60,
                                                                    bgcolor: THEME.secondary,
                                                                    border: `3px solid ${THEME.accent}`
                                                                }}
                                                            >
                                                                {article.writer?.name?.charAt(0) || 'W'}
                                                            </Avatar>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                                                                    <Typography
                                                                        variant="h5"
                                                                        sx={{
                                                                            fontFamily: '"Comic Sans MS", cursive',
                                                                            fontWeight: 'bold',
                                                                            color: THEME.text
                                                                        }}
                                                                    >
                                                                        {article.title}
                                                                    </Typography>
                                                                    <Chip
                                                                        icon={<span>✨</span>}
                                                                        label="Published"
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: STATUS_COLORS.published.bg,
                                                                            color: STATUS_COLORS.published.text,
                                                                            fontFamily: '"Comic Sans MS", cursive'
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                                                    By {article.writer?.name || 'Unknown Author'} • {new Date(article.created_at).toLocaleDateString()}
                                                                </Typography>
                                                            </Box>
                                                            <Chip
                                                                icon={<span>{CATEGORY_ICONS[article.category?.name?.toLowerCase()] || '📚'}</span>}
                                                                label={article.category?.name || 'Uncategorized'}
                                                                sx={{
                                                                    bgcolor: THEME.blue,
                                                                    color: 'white',
                                                                    fontFamily: '"Comic Sans MS", cursive',
                                                                    fontWeight: 'bold',
                                                                    px: 2
                                                                }}
                                                            />
                                                        </Box>

                                                        <Divider sx={{ mb: 3, borderColor: THEME.accent, borderWidth: 2 }} />

                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                color: THEME.text,
                                                                lineHeight: 1.8,
                                                                mb: 3
                                                            }}
                                                        >
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: article.content.substring(0, 200) + '...',
                                                                }}
                                                            />
                                                        </Typography>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Badge
                                                                badgeContent={article.comments?.length || 0}
                                                                color="primary"
                                                                sx={{
                                                                    '& .MuiBadge-badge': {
                                                                        bgcolor: THEME.secondary,
                                                                        color: 'white',
                                                                        fontFamily: '"Comic Sans MS", cursive'
                                                                    }
                                                                }}
                                                            >
                                                                <ChatIcon sx={{ color: THEME.primary }} />
                                                            </Badge>
                                                            <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                                                {article.comments?.length || 0} comment{article.comments?.length !== 1 ? 's' : ''}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>

                                                    <CardActions sx={{ p: 4, pt: 0, gap: 2, flexWrap: 'wrap' }}>
                                                        <Button
                                                            size="large"
                                                            startIcon={<CommentIcon />}
                                                            onClick={() => handleOpenDialog(article)}
                                                            sx={{
                                                                bgcolor: THEME.blue,
                                                                color: 'white',
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                fontSize: '1rem',
                                                                px: 3,
                                                                '&:hover': {
                                                                    bgcolor: '#5A7DFF',
                                                                    transform: 'scale(1.05)'
                                                                }
                                                            }}
                                                        >
                                                            Add Comment 💬
                                                        </Button>
                                                        <Button
                                                            size="large"
                                                            startIcon={<span>📖</span>}
                                                            onClick={() => Inertia.get(route('articles.show', article.id))}
                                                            sx={{
                                                                bgcolor: THEME.secondary,
                                                                color: 'white',
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                fontSize: '1rem',
                                                                px: 3,
                                                                '&:hover': {
                                                                    bgcolor: '#3DBEB4',
                                                                    transform: 'scale(1.05)'
                                                                }
                                                            }}
                                                        >
                                                            Read Full Article
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

            case 'comments':
                return (
                    <Fade in={activeNav === 'comments'} timeout={800}>
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
                                    <ChatIcon sx={{ fontSize: 40 }} />
                                    My Comment Collection
                                    <ChatIcon sx={{ fontSize: 40 }} />
                                </Typography>
                                <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 3 }}>
                                    You've shared {comments.length} thought{comments.length !== 1 ? 's' : ''}! Keep it up! 🌟
                                </Typography>
                            </Box>

                            {comments.length === 0 ? (
                                <Paper sx={{ 
                                    p: 6,
                                    borderRadius: 8,
                                    background: `linear-gradient(135deg, ${alpha(THEME.accent, 0.2)} 0%, ${alpha(THEME.secondary, 0.2)} 100%)`,
                                    border: `4px solid ${THEME.accent}`,
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h3" sx={{ fontSize: '4rem', mb: 2 }}>
                                        💭
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 2 }}>
                                        No comments yet!
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                                        Start sharing your thoughts on articles! 🎨
                                    </Typography>
                                </Paper>
                            ) : (
                                <Paper
                                    sx={{
                                        borderRadius: 8,
                                        border: `4px solid ${THEME.green}`,
                                        boxShadow: `6px 6px 0 ${THEME.green}`,
                                        bgcolor: 'white',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {comments.map((comment, index) => (
                                        <Zoom in timeout={500 + index * 100} key={comment.id}>
                                            <Box
                                                sx={{
                                                    p: 4,
                                                    borderBottom: index !== comments.length - 1 ? `2px solid ${THEME.accent}` : 'none',
                                                    '&:hover': {
                                                        bgcolor: alpha(THEME.accent, 0.1)
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: THEME.purple,
                                                            width: 50,
                                                            height: 50,
                                                            border: `3px solid ${THEME.accent}`
                                                        }}
                                                    >
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontFamily: '"Comic Sans MS", cursive',
                                                                fontWeight: 'bold',
                                                                color: THEME.blue,
                                                                mb: 1
                                                            }}
                                                        >
                                                            {comment.article?.title || 'Unknown Article'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <CalendarIcon sx={{ fontSize: 14 }} />
                                                            {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        icon={<span>💬</span>}
                                                        label="Your Comment"
                                                        sx={{
                                                            bgcolor: THEME.green,
                                                            color: 'white',
                                                            fontFamily: '"Comic Sans MS", cursive'
                                                        }}
                                                    />
                                                </Box>
                                                <Paper
                                                    sx={{
                                                        p: 3,
                                                        ml: 8,
                                                        bgcolor: alpha(THEME.secondary, 0.1),
                                                        borderRadius: 4,
                                                        border: `2px dashed ${THEME.secondary}`,
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontFamily: '"Comic Sans MS", cursive',
                                                            color: THEME.text,
                                                            fontStyle: 'italic'
                                                        }}
                                                    >
                                                        "{comment.content}"
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        </Zoom>
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
                    background: `linear-gradient(135deg, ${THEME.green} 0%, ${THEME.blue} 100%)`,
                    borderBottom: `4px solid ${THEME.accent}`,
                    boxShadow: `0 8px 0 ${alpha(THEME.green, 0.5)}`,
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
                            <AutoStoriesIcon sx={{ fontSize: 30, color: THEME.green }} />
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
                            Article Explorer's Club
                        </Typography>
                    </Box>

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
                            color: THEME.green,
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
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16, color: THEME.orange }} />
                            <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', fontSize: '0.9rem' }}>
                                Become a Writer ✍️
                            </Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setProfileAnchor(null);
                                window.location.href = '/switch/editor';
                            }}
                        >
                            <SwapHorizIcon sx={{ mr: 1, fontSize: 16, color: THEME.purple }} />
                            <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', fontSize: '0.9rem' }}>
                                Become an Editor 📝
                            </Typography>
                        </MenuItem>
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
                            onClick={() => setActiveNav('articles')}
                            sx={{
                                borderRadius: 8,
                                mb: 1,
                                bgcolor: activeNav === 'articles' ? alpha(THEME.accent, 0.3) : 'transparent',
                                border: activeNav === 'articles' ? `2px solid ${THEME.blue}` : 'none',
                                '&:hover': { bgcolor: alpha(THEME.accent, 0.2) }
                            }}
                        >
                            <ListItemIcon>
                                <MenuBookIcon sx={{ color: activeNav === 'articles' ? THEME.blue : THEME.text }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', color: activeNav === 'articles' ? THEME.blue : THEME.text }}>
                                        Article Library
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                        {articles.length} articles
                                    </Typography>
                                }
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => setActiveNav('comments')}
                            sx={{
                                borderRadius: 8,
                                bgcolor: activeNav === 'comments' ? alpha(THEME.accent, 0.3) : 'transparent',
                                border: activeNav === 'comments' ? `2px solid ${THEME.green}` : 'none',
                                '&:hover': { bgcolor: alpha(THEME.accent, 0.2) }
                            }}
                        >
                            <ListItemIcon>
                                <ChatIcon sx={{ color: activeNav === 'comments' ? THEME.green : THEME.text }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontFamily: '"Comic Sans MS", cursive', color: activeNav === 'comments' ? THEME.green : THEME.text }}>
                                        My Comments
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                        {comments.length} comments
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 3, borderColor: THEME.accent }} />

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text }}>
                            ✨ Every comment makes a writer smile! ✨
                        </Typography>
                    </Box>

                    {/* Reading Stats */}
                    <Paper sx={{ mt: 3, p: 2, bgcolor: alpha(THEME.accent, 0.2), borderRadius: 4 }}>
                        <Typography variant="subtitle2" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.purple, mb: 2, textAlign: 'center' }}>
                            📊 Your Reading Stats
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.blue }}>
                                    {articles.length}
                                </Typography>
                                <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                    Articles Read
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.green }}>
                                    {comments.length}
                                </Typography>
                                <Typography variant="caption" sx={{ fontFamily: '"Comic Sans MS", cursive' }}>
                                    Comments
                                </Typography>
                            </Box>
                        </Box>
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

            {/* Comment Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 8,
                        border: `4px solid ${THEME.secondary}`,
                        boxShadow: `8px 8px 0 ${THEME.primary}`,
                        bgcolor: THEME.background
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontFamily: '"Comic Sans MS", cursive',
                    fontWeight: 'bold',
                    background: `linear-gradient(135deg, ${THEME.blue} 0%, ${THEME.purple} 100%)`,
                    color: 'white',
                    borderBottom: `4px solid ${THEME.accent}`,
                    fontSize: '1.5rem'
                }}>
                    💬 Share Your Thoughts
                </DialogTitle>
                <DialogContent sx={{ pt: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontFamily: '"Comic Sans MS", cursive', color: THEME.text, mb: 2 }}>
                        On: {selectedArticle?.title}
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="What did you think about this story? ✨"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: '"Comic Sans MS", cursive',
                                '& fieldset': {
                                    borderColor: THEME.secondary,
                                    borderWidth: 3
                                },
                                '&:hover fieldset': {
                                    borderColor: THEME.primary
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: THEME.accent
                                }
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={handleCloseDialog}
                        sx={{
                            fontFamily: '"Comic Sans MS", cursive',
                            color: THEME.text,
                            border: `2px solid ${THEME.secondary}`,
                            borderRadius: 40,
                            px: 3
                        }}
                    >
                        Maybe Later
                    </Button>
                    <Button
                        onClick={postComment}
                        disabled={!commentText.trim()}
                        variant="contained"
                        startIcon={<SendIcon />}
                        sx={{
                            bgcolor: THEME.green,
                            color: 'white',
                            fontFamily: '"Comic Sans MS", cursive',
                            fontSize: '1.1rem',
                            borderRadius: 40,
                            px: 4,
                            '&:hover': {
                                bgcolor: '#4CAF50',
                                transform: 'scale(1.05)'
                            },
                            '&:disabled': {
                                bgcolor: '#ccc'
                            }
                        }}
                    >
                        Post Comment ✨
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Back to Top Button */}
            <IconButton
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    bgcolor: THEME.accent,
                    color: THEME.green,
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