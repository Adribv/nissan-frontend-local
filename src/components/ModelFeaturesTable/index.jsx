import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Typography,
  Link
} from '@mui/material';
import { useAppContext } from '../../context/AppContext';

function ModelFeaturesTable() {
  const navigate = useNavigate();
  const { data, filters } = useAppContext();
  
  const processModelFeatures = (data, filters) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
  
    let processedData = [...data];

    processedData = processedData.filter(item => 
      item.model && 
      item.model !== 'Unknown' && 
      item.model !== 'Climate Control'
    );
  
    // Apply filters (brand, model, etc.) if needed
    if (filters?.brands?.length && !filters.brands.includes('All')) {
      processedData = processedData.filter(item => 
        filters.brands.map(b => b.toLowerCase()).includes(item.brand?.toLowerCase())
      );
    }
    // Add other filters as needed...
  
    // Group features by model
    const modelFeatures = processedData.reduce((acc, item) => {
      const model = item.model || 'Unknown';
      if (!acc[model]) {
        acc[model] = {
          positive: {},
          negative: {}
        };
      }
  
      const feature = item.Feature;
      const criticalRanking = parseFloat(item.CriticalRanking);
  
      // Skip if CriticalRanking is not a valid number
      if (isNaN(criticalRanking)) return acc;
  
      // Categorize as positive or negative based on CriticalRanking
      if (criticalRanking >= 0) {
        if (!acc[model].positive[feature]) {
          acc[model].positive[feature] = {
            count: 0,
            totalRanking: 0
          };
        }
        acc[model].positive[feature].count++;
        acc[model].positive[feature].totalRanking += criticalRanking;
      } else {
        if (!acc[model].negative[feature]) {
          acc[model].negative[feature] = {
            count: 0,
            totalRanking: 0
          };
        }
        acc[model].negative[feature].count++;
        acc[model].negative[feature].totalRanking += criticalRanking;
      }
  
      return acc;
    }, {});
  
    // Convert to array and sort features
    return Object.entries(modelFeatures).map(([model, features]) => ({
      model,
      positiveFeatures: Object.entries(features.positive)
        .map(([feature, data]) => ({
          Feature: feature,
          count: data.count,
          averageRanking: data.totalRanking / data.count
        }))
        .sort((a, b) => b.averageRanking - a.averageRanking)
        .slice(0, 3),
      negativeFeatures: Object.entries(features.negative)
        .map(([feature, data]) => ({
          Feature: feature,
          count: data.count,
          averageRanking: data.totalRanking / data.count
        }))
        .sort((a, b) => a.averageRanking - b.averageRanking)
        .slice(0, 3)
    }));
  };

  const modelFeatures = processModelFeatures(data, filters);

  const handleFeatureClick = (model, feature, isPositive) => {
    // Filter the data for this specific model and feature
    const filteredData = data.filter(item => 
      item.model?.toLowerCase() === model?.toLowerCase() &&
      item.Feature === feature &&
      // Check CriticalRanking
      (isPositive ? parseFloat(item.CriticalRanking) >= 0 : parseFloat(item.CriticalRanking) < 0)
    );

    if (filteredData.length > 0) {
      navigate(`/feedback/${model}`, {
        state: { 
          selectedFeature: feature,
          isPositive: isPositive
        }
      });
    }
  };

  if (!modelFeatures?.length) {
    return (
      <Typography align="center" sx={{ mt: 2 }}>
        No features available for the selected filters
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell>Top Positive Features</TableCell>
            <TableCell>Top Negative Features</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {modelFeatures.map(({ model, positiveFeatures, negativeFeatures }) => (
            <TableRow key={model}>
              <TableCell>{model}</TableCell>
              <TableCell>
                {positiveFeatures.map((feature, index) => (
                  <Link
                    key={index}
                    component="button"
                    onClick={() => handleFeatureClick(model, feature.Feature, true)}
                    sx={{ display: 'block', color: 'success.main', mb: 1 }}
                  >
                    {feature.Feature} ({feature.count}) [Rating: {feature.averageRanking.toFixed(2)}]
                  </Link>
                ))}
              </TableCell>
              <TableCell>
                {negativeFeatures.map((feature, index) => (
                  <Link
                    key={index}
                    component="button"
                    onClick={() => handleFeatureClick(model, feature.Feature, false)}
                    sx={{ display: 'block', color: 'error.main', mb: 1 }}
                  >
                    {feature.Feature} ({feature.count}) [Rating: {feature.averageRanking.toFixed(2)}]
                  </Link>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ModelFeaturesTable;