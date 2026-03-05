import { Link } from '@inertiajs/react';
import {
    Container,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    Typography,
    AppBar,
    Toolbar,
    Fade,
    Slide,
} from '@mui/material';
import { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
            sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'perspective(1000px) rotateY(-10deg)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)',
                },
            }}
        >
            <EditIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography
            variant="h6"
            sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
        >
            PublishHub
        </Typography>
    </Box>
);

export default function Welcome({ auth }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            {/* Navigation */}
            <AppBar
                position="static"
                sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Logo />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {auth.user ? (
                            <>
                                <Button
                                    variant="text"
                                    sx={{
                                        color: '#667eea',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '16px',
                                    }}
                                >
                                    {auth.user.name}
                                </Button>
                                <Button
                                    component={Link}
                                    href={route('dashboard')}
                                    variant="contained"
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                    }}
                                >
                                    Dashboard
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    component={Link}
                                    href={route('login')}
                                    variant="text"
                                    sx={{
                                        color: '#667eea',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '16px',
                                    }}
                                >
                                    Log in
                                </Button>
                                <Button
                                    component={Link}
                                    href={route('register')}
                                    variant="contained"
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                    }}
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Fade in={isVisible} timeout={1000}>
                    <Box sx={{ textAlign: 'center', mb: 12 }}>
                        <Slide direction="down" in={isVisible} timeout={800}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: { xs: '2rem', md: '3.5rem' },
                                }}
                            >
                                Publish Your Ideas. Share Your Voice.
                            </Typography>
                        </Slide>
                        <Fade in={isVisible} timeout={1200}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#64748b',
                                    mb: 4,
                                    fontSize: { xs: '1rem', md: '1.25rem' },
                                    fontWeight: 400,
                                }}
                            >
                                A collaborative platform for student writers, editors, and readers to create, refine, and
                                publish quality articles.
                            </Typography>
                        </Fade>
                        <Fade in={isVisible} timeout={1400}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                {!auth.user && (
                                    <>
                                        <Button
                                            component={Link}
                                            href={route('register')}
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                borderRadius: '10px',
                                                py: 1.5,
                                                px: 4,
                                                fontSize: '16px',
                                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)',
                                                },
                                            }}
                                        >
                                            Start Writing
                                        </Button>
                                        <Button
                                            component={Link}
                                            href={route('login')}
                                            variant="outlined"
                                            size="large"
                                            sx={{
                                                color: '#667eea',
                                                borderColor: '#667eea',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                borderRadius: '10px',
                                                py: 1.5,
                                                px: 4,
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: '#764ba2',
                                                    color: '#764ba2',
                                                    transform: 'translateY(-4px)',
                                                },
                                            }}
                                        >
                                            Sign In
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Fade>
                    </Box>
                </Fade>

                {/* Features Section */}
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {[
                        {
                            icon: <EditIcon sx={{ fontSize: 48, color: '#667eea' }} />,
                            title: 'For Writers',
                            description: 'Draft articles, submit for review, and revise based on editor feedback. Build your portfolio with published work.',
                        },
                        {
                            icon: <ReviewsIcon sx={{ fontSize: 48, color: '#764ba2' }} />,
                            title: 'For Editors',
                            description: 'Review submissions, request revisions, and publish quality content. Manage the editorial workflow seamlessly.',
                        },
                        {
                            icon: <ThumbUpIcon sx={{ fontSize: 48, color: '#667eea' }} />,
                            title: 'For Readers',
                            description: 'Discover published articles, engage with quality content, and share your thoughts through comments.',
                        },
                    ].map((feature, index) => (
                        <Fade key={index} in={isVisible} timeout={1600 + index * 200}>
                            <Grid item xs={12} md={4}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(102, 126, 234, 0.1)',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
                                            border: '1px solid rgba(102, 126, 234, 0.3)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                color: '#1e293b',
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#64748b',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Fade>
                    ))}
                </Grid>

                {/* CTA Section */}
                <Fade in={isVisible} timeout={2200}>
                    <Box
                        sx={{
                            mt: 12,
                            py: 6,
                            px: 4,
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            textAlign: 'center',
                            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 2,
                            }}
                        >
                            Ready to Share Your Stories?
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                mb: 3,
                            }}
                        >
                            Join PublishHub and become part of a vibrant community of writers and readers.
                        </Typography>
                        {!auth.user && (
                            <Button
                                component={Link}
                                href={route('register')}
                                variant="contained"
                                sx={{
                                    background: 'white',
                                    color: '#667eea',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    py: 1.2,
                                    px: 4,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                Get Started Now
                            </Button>
                        )}
                    </Box>
                </Fade>
            </Container>

            {/* Footer */}
            <Box
                sx={{
                    py: 4,
                    textAlign: 'center',
                    color: '#64748b',
                    borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                    mt: 8,
                }}
            >
                <Typography variant="body2">
                    © 2026 PublishHub. Empowering student writers and fostering collaborative publishing.
                </Typography>
            </Box>
        </Box>
    );
}
