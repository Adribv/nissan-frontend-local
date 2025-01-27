import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDataFetching } from '../../hooks/useDataFetching';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

function FeatureFeedbackPage() {
  const { feature } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useDataFetching(`/feature-feedback/${feature}`);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  const handleFeedbackClick = (feedback) => {
    navigate(`/feature-feedback/details/${feature}/${feedback.brand}/${feedback.model}`, { 
      state: { feedbackData: feedback } 
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/dashboard2')}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          Feedback for Feature: {feature}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Model</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Sentiment</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((feedback, index) => (
              <TableRow key={index} hover>
                <TableCell>{feedback.brand}</TableCell>
                <TableCell>{feedback.model}</TableCell>
                <TableCell>{new Date(feedback.date).toLocaleDateString()}</TableCell>
                <TableCell>{feedback.source}</TableCell>
                <TableCell>{feedback.sentiment}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleFeedbackClick(feedback)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default FeatureFeedbackPage;