import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  Chip
} from '@mui/material';

function FilterDropdown({ 
  label, 
  value = ['All'], 
  options = [], 
  onChange,
  disabled = false 
}) {
  const handleChange = (event) => {
    const selectedValues = Array.isArray(event.target.value) ? event.target.value : [];
    
    // If selecting "All"
    if (selectedValues.includes('All') && !value.includes('All')) {
      onChange(['All']);
      return;
    }

    // If deselecting "All"
    if (value.includes('All')) {
      const newValues = selectedValues.filter(v => v !== 'All');
      onChange(newValues.length ? newValues : ['All']);
      return;
    }

    // If nothing is selected, default to "All"
    if (selectedValues.length === 0) {
      onChange(['All']);
      return;
    }

    // Normal selection
    onChange(selectedValues);
  };

  const getChipColor = (val) => {
    if (!val) return '#e0e0e0';
    
    const valLower = val.toLowerCase();
    switch(valLower) {
      case 'price':
        return '#9c27b0';
      case 'segment':
        return '#2196f3';
      case 'very positive':
        return '#2e7d32';
      case 'positive':
        return '#4caf50';
      case 'very negative':
        return '#d32f2f';
      case 'negative':
        return '#f44336';
      case 'neutral':
        return '#ff9800';
      case 'all':
        return '#e0e0e0';
      default:
        return '#2196f3';
    }
  };

  // Handle both array and object options
  const renderOptions = () => {
    return options.map((option) => {
      const optionValue = typeof option === 'object' ? option.value : option;
      const optionLabel = typeof option === 'object' ? option.label : option;
      
      return (
        <MenuItem key={optionValue} value={optionValue}>
          <Checkbox 
            checked={value.includes(optionValue)}
            sx={{
              color: getChipColor(optionValue),
              '&.Mui-checked': {
                color: getChipColor(optionValue)
              }
            }}
          />
          <ListItemText primary={optionLabel} />
        </MenuItem>
      );
    });
  };

  return (
    <FormControl 
      sx={{ 
        m: 1, 
        minWidth: 200,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#e0e0e0',
          },
          '&:hover fieldset': {
            borderColor: '#2196f3',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#2196f3',
          },
        },
      }} 
      disabled={disabled}
    >
      <InputLabel 
        sx={{
          color: disabled ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0, 0, 0, 0.87)',
          '&.Mui-focused': {
            color: '#2196f3',
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((val) => (
              <Chip 
                key={val} 
                label={typeof val === 'object' ? val.label : val}
                sx={{ 
                  backgroundColor: getChipColor(val),
                  color: val.toLowerCase() === 'all' ? 'rgba(0, 0, 0, 0.87)' : 'white',
                  '& .MuiChip-deleteIcon': {
                    color: val.toLowerCase() === 'all' ? 'rgba(0, 0, 0, 0.26)' : 'white',
                    '&:hover': {
                      color: val.toLowerCase() === 'all' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
              width: 250,
            },
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
      >
        {renderOptions()}
      </Select>
    </FormControl>
  );
}

export default FilterDropdown;