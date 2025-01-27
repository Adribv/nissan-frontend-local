import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid,
  IconButton,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function FeatureFeedbackDetails() {
  const { feature, brand, model } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const feedbackData = location.state?.feedbackData;

  if (!feedbackData) {
    return <Typography>No feedback data available</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate(`/feature-feedback/${feature}`)}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          Feedback Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="textSecondary">Brand</Typography>
                  <Typography variant="body1">{feedbackData.brand}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="textSecondary">Model</Typography>
                  <Typography variant="body1">{feedbackData.model}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="textSecondary">Feature</Typography>
                  <Typography variant="body1">{feature}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Feedback Information</Typography>
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="textSecondary">Date</Typography>
                  <Typography variant="body1">
                    {new Date(feedbackData.date).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="textSecondary">Source</Typography>
                  <Typography variant="body1">{feedbackData.source}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="textSecondary">Sentiment</Typography>
                  <Typography variant="body1">{feedbackData.sentiment}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" color="textSecondary">Feedback</Typography>
                <Paper sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body1">{feedbackData.feedback}</Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FeatureFeedbackDetails;