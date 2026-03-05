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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
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

export default function ArticleView({ article, categories }) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        title: article.title,
        content: article.content,
        category_id: article.category_id,
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setForm({
            title: article.title,
            content: article.content,
            category_id: article.category_id,
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        Inertia.put(route('writer.articles.update', article.id), form);
    };

    const handleSubmit = () => {
        Inertia.post(route('writer.articles.submit', article.id));
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            {/* Header */}
            <AppBar
                position="fixed"
                sx={{
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, #614ce1 100%)`,
                    boxShadow: '0 8px 32px rgba(79, 70, 229, 0.15)',
                    zIndex: 1201,
                }}
            >
                <Toolbar>
                    <IconButton
                        onClick={() => window.location.href = route('writer.dashboard')}
                        sx={{ color: 'white', mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>
                        {isEditing ? 'Edit Article' : 'View Article'}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: '64px',
                    p: 3,
                }}
            >
                <Container maxWidth="lg">
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
                        {/* Status and Category */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                            <Chip
                                label={article.status.label}
                                sx={{
                                    background: STATUS_COLORS[article.status.name]?.bg || '#f0f0f0',
                                    color: STATUS_COLORS[article.status.name]?.text || '#666',
                                    fontWeight: 600,
                                }}
                            />
                            <Chip label={article.category.name} size="small" />
                        </Box>

                        {isEditing ? (
                            <Box component="form" onSubmit={handleSave}>
                                <TextField
                                    label="Article Title"
                                    fullWidth
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
                                        mb: 3,
                                        borderRadius: '10px',
                                        backgroundColor: '#f9fafb',
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: THEME.primary },
                                            '&.Mui-focused fieldset': { borderColor: THEME.primary },
                                        },
                                    }}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                    ))}
                                </Select>

                                <Typography sx={{ mb: 2, fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                                    Article Content
                                </Typography>
                                <Paper
                                    sx={{
                                        mb: 3,
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

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        sx={{
                                            background: THEME.primary,
                                            '&:hover': { background: '#4338ca' },
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={handleCancel}
                                        sx={{ color: '#667eea' }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#111827' }}>
                                    {article.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                                    Category: {article.category.name} | Last updated: {new Date(article.updated_at).toLocaleDateString()}
                                </Typography>
                                <Paper
                                    sx={{
                                        p: 3,
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        backgroundColor: '#ffffff',
                                    }}
                                >
                                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                                </Paper>
                            </Box>
                        )}

                        {/* Action Buttons for Drafts */}
                        {!isEditing && article.status.name === 'draft' && (
                            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    onClick={handleEdit}
                                    sx={{
                                        background: THEME.primary,
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        borderRadius: '10px',
                                        py: 1.5,
                                        fontSize: '1rem',
                                        boxShadow: `0 4px 15px rgba(79, 70, 229, 0.3)`,
                                        '&:hover': {
                                            boxShadow: `0 6px 25px rgba(79, 70, 229, 0.4)`,
                                        },
                                    }}
                                >
                                    Edit Article
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SendIcon />}
                                    onClick={handleSubmit}
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
                                    Submit for Review
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
}
