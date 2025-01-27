import { Box, Grid, Typography, Paper } from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import FilterSection from '../FilterSection';
import StackedBarChart from '../Charts/StackedBarChart';
import ModelFeaturesTable from '../ModelFeaturesTable';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

function Dashboard() {
  const { loading, error } = useAppContext();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h1" 
        align="center" 
        gutterBottom
        sx={{ mb: 4 }}
      >
        Sentiment Analysis Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper 
            elevation={3} 
            sx={{ p: 2, borderRadius: 2 }}
          >
            <FilterSection />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Paper 
            elevation={3} 
            sx={{ p: 2, mb: 3, borderRadius: 2 }}
          >
            <StackedBarChart />
          </Paper>
          
          <Paper 
            elevation={3} 
            sx={{ p: 2, borderRadius: 2 }}
          >
            <ModelFeaturesTable />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;