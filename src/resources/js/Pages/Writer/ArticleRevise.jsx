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
    Paper,
    Chip,
    AppBar,
    Toolbar,
    IconButton,
    Alert,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import JoditEditor from 'jodit-react';

const THEME = {
    primary: '#4f46e5',
    success: '#16a34a',
    warning: '#ea580c',
    surface: 'rgba(255, 255, 255, 0.95)',
};

const STATUS_COLORS = {
    draft: { bg: '#f0f4ff', text: '#4f46e5', border: '#e0e7ff' },
    submitted: { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' },
    needs_revision: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    published: { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
};

export default function ArticleRevise({ article, categories }) {
    const [form, setForm] = useState({
        content: article.content,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post(route('writer.articles.revise', article.id), form);
    };

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        onClick={() => window.history.back()}
                        sx={{ color: 'white', mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white' }}>
                        Revise Article
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Article Info */}
                <Paper sx={{ p: 4, mb: 4, borderRadius: '12px' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#111827' }}>
                        {article.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Chip 
                            label={article.category.name} 
                            size="small" 
                            sx={{ 
                                backgroundColor: '#f0f4ff',
                                color: '#4f46e5',
                                fontWeight: 600
                            }} 
                        />
                        <Chip
                            label={article.status.label}
                            sx={{
                                background: STATUS_COLORS[article.status.name]?.bg || '#f0f0f0',
                                color: STATUS_COLORS[article.status.name]?.text || '#666',
                                fontWeight: 600,
                            }}
                        />
                    </Box>
                </Paper>

                {/* Editor Comments Section */}
                {article.comments && article.comments.length > 0 ? (
                    <Paper sx={{ p: 4, mb: 4, borderRadius: '12px', border: '2px solid #fed7aa' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <CommentIcon sx={{ mr: 1, color: '#ea580c', fontSize: 28 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ea580c' }}>
                                Editor's Comments
                            </Typography>
                        </Box>
                        
                        {article.comments.map((comment, index) => (
                            <Card key={index} sx={{ mb: 2, backgroundColor: '#fff7ed' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#ea580c' }}>
                                        {comment.user?.name || 'Editor'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
                                        {comment.comment}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#9ca3af', mt: 1 }}>
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                ) : (
                    <Alert severity="info" sx={{ mb: 4 }}>
                        No revision comments from the editor. You can proceed with your revisions.
                    </Alert>
                )}

                {/* Revision Form */}
                <Paper sx={{ p: 4, borderRadius: '12px' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#111827' }}>
                        Make Revisions
                    </Typography>
                    
                    <form onSubmit={handleSubmit}>
                        <Typography sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
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
                                type="button"
                                variant="outlined"
                                onClick={() => window.history.back()}
                                sx={{
                                    borderColor: THEME.warning,
                                    color: THEME.warning,
                                    '&:hover': {
                                        backgroundColor: 'rgba(234, 88, 12, 0.05)',
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    background: THEME.success,
                                    '&:hover': {
                                        backgroundColor: '#15803d',
                                    }
                                }}
                            >
                                Submit Revision
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </>
    );
}
