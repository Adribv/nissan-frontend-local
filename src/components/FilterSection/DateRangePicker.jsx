import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, TextField } from '@mui/material';

function DateRangePicker({ fromDate, toDate, onFromDateChange, onToDateChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        alignItems: 'center'
      }}>
        <DatePicker
          label="From Date"
          value={fromDate}
          onChange={onFromDateChange}
          maxDate={toDate || undefined}
          renderInput={(params) => (
            <TextField 
              {...params} 
              size="small"
              sx={{ width: 170 }}
            />
          )}
        />
        <DatePicker
          label="To Date"
          value={toDate}
          onChange={onToDateChange}
          minDate={fromDate || undefined}
          maxDate={new Date()}
          renderInput={(params) => (
            <TextField 
              {...params} 
              size="small"
              sx={{ width: 170 }}
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default DateRangePicker;