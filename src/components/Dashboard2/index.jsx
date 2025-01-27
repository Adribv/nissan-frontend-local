import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useMemo } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppContext } from '../../context/AppContext';
import { BarChart } from '../Charts';
import moment from 'moment';

function Dashboard2() {
  const navigate = useNavigate();
  const { data } = useAppContext();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: [],
    model: [],
    fact: [],
    country: [],
    source: [],
    startDate: null,
    endDate: null
  });

  // Extract unique values for dropdowns with filtering
  const brands = [...new Set(data?.map(item => item.brand))]
    .filter(Boolean)  // Remove null/undefined
    .filter(brand => 
      // Filter out sentiment values and ensure it's a valid brand
      !['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'].includes(brand)
    )
    .sort();  // Sort alphabetically

  const models = useMemo(() => {
    if (!data) return [];
    
    let filteredModels;
    // If no brand is selected or 'All' is selected, show all models
    if (!filters.brand.length || filters.brand.includes('All')) {
      filteredModels = [...new Set(data.map(item => item.model))];
    } else {
      // Otherwise, filter models based on selected brands
      filteredModels = [...new Set(
        data
          .filter(item => filters.brand.includes(item.brand))
          .map(item => item.model)
      )];
    }

    return filteredModels
      .filter(Boolean)  // Remove null/undefined
      .filter(model => 
        // Filter out unwanted values
        typeof model === 'string' && 
        !model.includes('Climate Control') &&
        !['0', '1', '2', '3', '4', '5'].includes(model)
      )
      .sort();  // Sort alphabetically
  }, [data, filters.brand]);

  const facts = [...new Set(data?.map(item => item.fact))]
    .filter(Boolean)  // Remove null/undefined
    .filter(fact => 
      // Filter out numeric values and ensure it's a valid fact
      typeof fact === 'string' && 
      !['0', '1', '2', '3', '4', '5'].includes(fact)
    )
    .sort();  // Sort alphabetically

  
    const countries = useMemo(() => {
      if (!data) return [];
      
      const uniqueCountries = [...new Set(data.map(item => item.country))].filter(Boolean);
      return ['All', ...uniqueCountries];
    }, [data]); // Sort alphabetically

  const sources = [...new Set(data?.map(item => item.source))]
    .filter(Boolean)  // Remove null/undefined
    .filter(source => 
      // Filter out numeric values and ensure it's a valid source
      typeof source === 'string' && 
      !['0', '1500000', '2000000'].includes(source) &&
      isNaN(Number(source))  // Filter out any numeric strings
    )
    .sort();  // Sort alphabetically

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterName]: value };
      // Reset model selection when brand changes
      if (filterName === 'brand') {
        newFilters.model = [];
      }
      return newFilters;
    });
  };

  const getFilteredData = () => {
    if (!data) return [];
  
    return data.filter(item => {
      const brandMatch = !filters.brand.length || filters.brand.includes('All') || 
                        filters.brand.includes(item.brand);
      const modelMatch = !filters.model.length || filters.model.includes('All') || 
                        filters.model.includes(item.model);
      const factMatch = !filters.fact.length || filters.fact.includes('All') || 
                       filters.fact.includes(item.fact);
      const countryMatch = !filters.country.length || filters.country.includes('All') || 
                          filters.country.includes(item.country);
      const sourceMatch = !filters.source.length || filters.source.includes('All') || 
                         filters.source.includes(item.source);
      
      // Updated date filtering logic using moment
      const itemDate = moment(item.date, 'DD-MM-YYYY');
      const dateMatch = (!filters.startDate || itemDate.isSameOrAfter(moment(filters.startDate), 'day')) &&
                       (!filters.endDate || itemDate.isSameOrBefore(moment(filters.endDate), 'day'));
  
      return brandMatch && modelMatch && factMatch && countryMatch && sourceMatch && dateMatch;
    });
  };

  const getFeedbackForFeature = (feature) => {
    if (!data || !feature) return [];
    
    return data
      .filter(item => item.Feature === feature)
      .map(item => ({
        model: item.model,
        feedback: item.feedback
      }))
      .slice(0, 10); // Get top 10 feedbacks
  };

  const handleBarClick = (feature) => {
    setSelectedFeature(feature);
    setFeedbackOpen(true);
  };

  const FilterDropdown = ({ label, value, options, onChange, disabled }) => (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        disabled={disabled}
      >
        <MenuItem value="All">All</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Model Analysis Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <FilterDropdown
                label="Brand"
                value={filters.brand}
                options={brands}
                onChange={(value) => handleFilterChange('brand', value)}
              />
              <FilterDropdown
                label="Model"
                value={filters.model}
                options={models}
                onChange={(value) => handleFilterChange('model', value)}
                disabled={!filters.brand.length || (filters.brand.length === 1 && filters.brand[0] === 'All')}
              />
              <FilterDropdown
                label="Fact"
                value={filters.fact}
                options={facts}
                onChange={(value) => handleFilterChange('fact', value)}
              />
            <FilterDropdown
  label="Country"
  value={filters.country}
  options={countries.filter(country => country !== 'All')} // Remove 'All' from options since it's handled in MenuItem
  onChange={(value) => handleFilterChange('country', value)}
/>
              <FilterDropdown
                label="Source"
                value={filters.source}
                options={sources}
                onChange={(value) => handleFilterChange('source', value)}
              />
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    sx: { mb: 2 }
                  } 
                }}
              />
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true
                  } 
                }}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <BarChart 
                data={getFilteredData()} 
                onBarClick={handleBarClick}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Feedback Dialog */}
        <Dialog
          open={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5">
              Feedback for Feature: {selectedFeature}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Model</TableCell>
                    <TableCell>Feedback</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFeedbackForFeature(selectedFeature).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>{item.feedback}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export default Dashboard2;