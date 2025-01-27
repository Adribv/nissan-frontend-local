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
  Container,
  Grid,
  Rating,
  Tooltip,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { useEffect, useState } from 'react';

function FeedbackDetails() {
  const { model, index, date } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
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

  const getSentimentColor = (fact) => {
    if (fact.includes('Very Positive')) return theme.palette.success.dark;
    if (fact.includes('Positive')) return theme.palette.success.main;
    if (fact.includes('Neutral')) return theme.palette.grey[500];
    if (fact.includes('Negative')) return theme.palette.error.main;
    if (fact.includes('Very Negative')) return theme.palette.error.dark;
    return theme.palette.text.primary;
  };

  const getSentimentIcon = (fact) => {
    if (fact.includes('Very Positive')) return <SentimentVerySatisfiedIcon />;
    if (fact.includes('Positive')) return <SentimentSatisfiedIcon />;
    if (fact.includes('Neutral')) return <SentimentNeutralIcon />;
    if (fact.includes('Negative')) return <SentimentDissatisfiedIcon />;
    if (fact.includes('Very Negative')) return <SentimentVeryDissatisfiedIcon />;
    return null;
  };

  if (loading) {
    return (
      <Container sx={{ mt: 12, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 12, mb: 4 }}>
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
      <Container sx={{ mt: 12, mb: 4 }}>
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
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        mt: 5,
        position: 'sticky',  // Add sticky positioning
        top: 0,
        zIndex: 1000,
        backgroundColor: 'background.default'
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
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Feedback Details for {feedbackData.model}
        </Typography>
        <Tooltip title={feedbackData.fact}>
          <IconButton 
            sx={{ 
              color: getSentimentColor(feedbackData.fact),
              transform: 'scale(1.2)',
              '&:hover': {
                transform: 'scale(1.3)',
                transition: 'transform 0.2s ease-in-out'
              }
              }}
            >
              {getSentimentIcon(feedbackData.fact)}
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card 
              component={Paper} 
              elevation={3} 
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, color: theme.palette.primary.main }}>
                    Model Information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`Brand: ${feedbackData.brand}`}
                      sx={{ 
                        px: 1,
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText
                      }}
                    />
                    <Chip 
                      label={`Model: ${feedbackData.model}`}
                      sx={{ 
                        px: 1,
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.contrastText
                      }}
                    />
                    <Chip 
                      label={`Date: ${new Date(feedbackData.date).toLocaleDateString()}`}
                      sx={{ 
                        px: 1,
                        backgroundColor: theme.palette.info.light,
                        color: theme.palette.info.contrastText
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, color: theme.palette.primary.main }}>
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
                      label={feedbackData.fact}
                      sx={{ 
                        px: 1,
                        backgroundColor: getSentimentColor(feedbackData.fact),
                        color: '#fff'
                      }}
                      icon={getSentimentIcon(feedbackData.fact)}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, color: theme.palette.primary.main }}>
                    Feedback
                  </Typography>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      backgroundColor: theme.palette.grey[50],
                      borderRadius: 2
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{ 
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary,
                        fontStyle: 'italic'
                      }}
                    >
                      "{feedbackData.feedback}"
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, color: theme.palette.primary.main }}>
                    Summary
                  </Typography>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      backgroundColor: theme.palette.grey[50],
                      borderRadius: 2
                    }}
                  >
                    <Typography 
                      variant="body1"
                      sx={{ 
                        lineHeight: 1.8,
                        color: theme.palette.text.secondary
                      }}
                    >
                      {feedbackData.Summary}
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default FeedbackDetails;