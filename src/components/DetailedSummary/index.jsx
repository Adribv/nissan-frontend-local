import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box,
  IconButton,
  Card,
  CardContent,
  Divider,
  Grid,
  CircularProgress,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(10),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  color: 'white',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  borderRadius: theme.spacing(1),
}));

const NavigationButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const NavButton = styled(Button)(({ theme }) => ({
  minWidth: '120px',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[500],
  },
}));

function DetailedSummary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [summaryData, setSummaryData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = searchParams.get('category');
  const models = searchParams.get('models');
  const date = searchParams.get('date');
  const brand = searchParams.get('brand');

  // ... existing imports and code ...

useEffect(() => {
  const fetchDetailedSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      // We already have these values from searchParams above
      if (!category || !models || !date || !brand) {
        throw new Error('Missing required parameters');
      }

      if (!category || !models || !date || !brand) {
        throw new Error('Missing required parameters');
      }

      const response = await fetch(
        `http://localhost:3001/api/detailed-summary?category=${encodeURIComponent(category)}&models=${encodeURIComponent(models)}&date=${encodeURIComponent(date)}&brand=${encodeURIComponent(brand)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Check if result.data exists, otherwise use result directly
      setSummaryData(result.data || result);
    } catch (err) {
      console.error('Error fetching detailed summary:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchDetailedSummary();
}, [searchParams]);

// ... rest of your code stays exactly the same ...
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, summaryData.length - 1));
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!summaryData.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const currentItem = summaryData[currentIndex];

  return (
    <StyledContainer maxWidth="lg">
      <HeaderBox>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            color: 'white', 
            marginRight: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Detailed Summary
        </Typography>
      </HeaderBox>

      <StyledCard>
        <CardContent>
          <Box mb={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Model Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography color="textSecondary" gutterBottom>Brand</Typography>
                <Typography variant="body1">{currentItem.brand}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography color="textSecondary" gutterBottom>Model</Typography>
                <Typography variant="body1">{currentItem.model}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography color="textSecondary" gutterBottom>Date</Typography>
                <Typography variant="body1">
                  {new Date(currentItem.date).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          

          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ backgroundColor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {currentItem.Summary}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>

      <NavigationButtons>
        <NavButton
          startIcon={<NavigateBeforeIcon />}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </NavButton>
        <Typography variant="body1" sx={{ alignSelf: 'center' }}>
          {currentIndex + 1} of {summaryData.length}
        </Typography>
        <NavButton
          endIcon={<NavigateNextIcon />}
          onClick={handleNext}
          disabled={currentIndex === summaryData.length - 1}
        >
          Next
        </NavButton>
      </NavigationButtons>
    </StyledContainer>
  );
}

export default DetailedSummary;