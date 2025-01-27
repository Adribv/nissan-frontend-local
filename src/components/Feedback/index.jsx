import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton,
  Card,
  CardContent,
  Chip,
  Button,
  Pagination,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppContext } from '../../context/AppContext';
import { useState, useEffect } from 'react';

function Feedback() {
  const { model } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useAppContext();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Get the selected feature and isPositive from location state
  const selectedFeature = location.state?.selectedFeature;
  const isPositive = location.state?.isPositive;

  // Filter feedback for the specific model and feature/sentiment
  const modelFeedback = data?.filter(item => {
    const modelMatch = item.model?.toLowerCase() === model?.toLowerCase();
    
    if (selectedFeature && isPositive !== undefined) {
      const criticalRanking = parseFloat(item.CriticalRanking);
      return modelMatch && 
             item.Feature === selectedFeature && 
             (isPositive ? criticalRanking >= 0 : criticalRanking < 0);
    }
    
    return modelMatch;
  }) || [];

  const totalPages = Math.ceil(modelFeedback.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentFeedback = modelFeedback.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedFeature, isPositive]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleViewDetails = (index, date) => {
    const absoluteIndex = startIndex + index;
    navigate(`/feedback/details/${model}/${absoluteIndex}/${date}`);
  };

  if (modelFeedback.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography>No feedback found for {model} {selectedFeature ? `with feature ${selectedFeature}` : ''}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          Feedback for {model}
          {selectedFeature && ` - ${selectedFeature}`}
          {isPositive !== undefined && ` (${isPositive ? 'Positive' : 'Negative'})`}
        </Typography>
      </Box>

      {currentFeedback.map((item, index) => (
        <Card key={index} component={Paper} elevation={3} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Model Information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip label={`Brand: ${item.brand}`} />
                    <Chip label={`Model: ${item.model}`} />
                    <Chip label={`Date: ${new Date(item.date).toLocaleDateString()}`} />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Category & Features
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip label={`Category: ${item.segment}`} />
                    <Chip label={`Feature: ${item.Feature}`} />
                    <Chip 
                      label={`Rating: ${parseFloat(item.CriticalRanking).toFixed(2)}`}
                      color={parseFloat(item.CriticalRanking) >= 0 ? 'success' : 'error'}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {item.Summary}
                  </Typography>
                </Box>

                <Button 
                  variant="contained" 
                  onClick={() => handleViewDetails(index, item.date)}
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      {totalPages > 1 && (
        <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Stack>
      )}
    </Box>
  );
}

export default Feedback;