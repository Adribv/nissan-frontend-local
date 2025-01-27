import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider,
  Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';

function FeedbackDetails() {
  const { model, index, date } = useParams();
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/feedback/details/${model}/${index}/${date}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedback details');
        }
        const data = await response.json();
        setFeedbackData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackDetails();
  }, [model, index, date]);

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Box sx={{ p: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!feedbackData) {
    return (
      <Container sx={{ mt: 4 }}>
        <Box sx={{ p: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography>No feedback found for the selected criteria.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          mt: 5
        }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Feedback Details for {feedbackData.model}
          </Typography>
        </Box>

        <Card 
          component={Paper} 
          elevation={3} 
          sx={{ 
            mb: 4,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Model Information
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Brand: ${feedbackData.brand}`}
                  sx={{ px: 1 }}
                />
                <Chip 
                  label={`Model: ${feedbackData.model}`}
                  sx={{ px: 1 }}
                />
                <Chip 
                  label={`Date: ${new Date(feedbackData.date).toLocaleDateString()}`}
                  sx={{ px: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Category & Features
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Category: ${feedbackData.segment}`}
                  sx={{ px: 1 }}
                />
                <Chip 
                  label={`Feature: ${feedbackData.Feature}`}
                  sx={{ px: 1 }}
                />
                <Chip 
                  label={`Sentiment: ${feedbackData.fact}`}
                  color={feedbackData.fact.includes('Positive') ? 'success' : 'error'}
                  sx={{ px: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Feedback
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  lineHeight: 1.7,
                  color: 'text.secondary'
                }}
              >
                {feedbackData.feedback}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Summary
              </Typography>
              <Typography 
                variant="body1"
                sx={{ 
                  lineHeight: 1.7,
                  color: 'text.secondary'
                }}
              >
                {feedbackData.Summary}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default FeedbackDetails;