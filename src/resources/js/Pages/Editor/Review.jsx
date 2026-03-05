import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    AppBar,
    Toolbar,
    Grid,
    Paper,
    Divider,
    Alert,
} from '@mui/material';
import { Inertia } from '@inertiajs/inertia';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import PublishIcon from '@mui/icons-material/Publish';

export default function Review({ article }) {
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);

    // Add error handling for missing article data
    if (!article) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    Article not found or unable to load article data.
                </Alert>
            </Container>
        );
    }

    const requestRevision = () => {
        if (!comments.trim()) {
            alert('Please provide comments for the revision request.');
            return;
        }
        setLoading(true);
        Inertia.post(route('editor.articles.requestRevision', article.id), { comments });
    };

    const publish = () => {
        if (!confirm('Are you sure you want to publish this article?')) {
            return;
        }
        setLoading(true);
        Inertia.post(route('editor.articles.publish', article.id));
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', pb: 4 }}>
            {/* Header */}
            <AppBar
                position="sticky"
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                }}
            >
                <Toolbar>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                        sx={{
                            color: 'white',
                            mr: 2,
                        }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Review Article
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            {article.title}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    {/* Article Content */}
                    <Grid item xs={12} md={8}>
                        <Card
                            sx={{
                                borderRadius: '12px',
                                background: 'white',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                overflow: 'hidden',
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#1e293b',
                                        mb: 1,
                                    }}
                                >
                                    {article.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Author:</strong> {article.writer?.name || 'Unknown'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Category:</strong> {article.category?.name || 'Uncategorized'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Submitted:</strong> {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Unknown date'}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 3 }} />
                                <Box
                                    sx={{
                                        '& p': { lineHeight: 1.8, color: '#475569' },
                                        '& img': { maxWidth: '100%', height: 'auto', my: 2 },
                                        '& strong': { fontWeight: 700 },
                                        '& em': { fontStyle: 'italic' },
                                    }}
                                >
                                    {article.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                                    ) : (
                                        <Typography color="textSecondary">
                                            No content available for this article.
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Review Panel */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: '12px',
                                background: 'white',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                position: 'sticky',
                                top: 100,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    mb: 2,
                                }}
                            >
                                Editor Actions
                            </Typography>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Choose to request revisions or publish this article.
                            </Alert>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    color: '#64748b',
                                }}
                            >
                                Revision Comments
                            </Typography>
                            <TextField
                                placeholder="Add comments for the writer (optional)"
                                fullWidth
                                multiline
                                rows={6}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                variant="outlined"
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                    },
                                }}
                            />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<SendIcon />}
                                    onClick={requestRevision}
                                    disabled={loading || !comments.trim()}
                                    sx={{
                                        color: '#e65100',
                                        borderColor: '#e65100',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        py: 1.2,
                                        '&:hover': {
                                            background: '#fff3e0',
                                        },
                                    }}
                                >
                                    Request Revision
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<PublishIcon />}
                                    onClick={publish}
                                    disabled={loading}
                                    sx={{
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        py: 1.2,
                                    }}
                                >
                                    Approve & Publish
                                </Button>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    color: '#94a3b8',
                                    textAlign: 'center',
                                }}
                            >
                                Article ID: {article.id}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
