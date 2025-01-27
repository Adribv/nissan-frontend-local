import React from 'react';
import { Box, Button } from '@mui/material';
import FilterDropdown from './FilterDropdown';
import DateRangePicker from './DateRangePicker';
import { useAppContext } from '../../context/AppContext';

function FilterSection() {
  const { 
    filters, 
    handleFilterChange,
    clearFilters,
    getUniqueValues,
    getModelsByBrand,
    categoryOptions
  } = useAppContext();

  // Get models based on selected brands
  const availableModels = getModelsByBrand(filters.brands);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 2, 
      p: 2,
      backgroundColor: 'background.paper',
      borderRadius: 1,
      boxShadow: 1
    }}>
     

      <FilterDropdown
        label="Brand"
        value={filters.brands}
        options={getUniqueValues('brand')}
        onChange={(value) => handleFilterChange('brands', value)}
      />

      <FilterDropdown
        label="Model"
        value={filters.models}
        options={availableModels}
        onChange={(value) => handleFilterChange('models', value)}
        disabled={filters.brands.includes('All')}
      />

      <FilterDropdown
        label="Feature"
        value={filters.features}
        options={getUniqueValues('Feature')}
        onChange={(value) => handleFilterChange('features', value)}
      />

      <FilterDropdown
        label="Sentiment"
        value={filters.facts}
        options={[
          'All',
          'Very Positive',
          'Positive',
          'Neutral',
          'Negative',
          'Very Negative'
        ]}
        onChange={(value) => handleFilterChange('facts', value)}
      />

      <FilterDropdown
        label="Source"
        value={filters.sources}
        options={getUniqueValues('source')}
        onChange={(value) => handleFilterChange('sources', value)}
      />

      <DateRangePicker
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        onFromDateChange={(date) => handleFilterChange('fromDate', date)}
        onToDateChange={(date) => handleFilterChange('toDate', date)}
      />

      <Button 
        variant="outlined" 
        onClick={clearFilters}
        sx={{ 
          height: 'fit-content', 
          alignSelf: 'center',
          minWidth: '120px',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        Clear Filters
      </Button>
    </Box>
  );
}

export default FilterSection;