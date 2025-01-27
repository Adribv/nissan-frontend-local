import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Checkbox,
  ListItemText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import { useDataFetching } from '../../hooks/useDataFetching';

// Styled Components
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  margin: theme.spacing(1),
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: 'calc(100vh - 250px)',
  overflow: 'auto',
  backgroundColor: '#fff',
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius * 2,
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[1],
}));

const DatePickerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  '& .MuiTextField-root': {
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function Dashboard4() {
  // Use the custom hook for data fetching
  const { data: apiData, loading, error } = useDataFetching('/data');
  
  // State for dropdowns with multiple selection
  const [selectedBrands, setSelectedBrands] = useState(['all']);
  const [selectedModels, setSelectedModels] = useState(['all']);
  const [selectedFacts, setSelectedFacts] = useState(['all']);
  const [selectedCountries, setSelectedCountries] = useState(['all']);
  const [selectedSources, setSelectedSources] = useState(['all']);
  const [dateRange, setDateRange] = useState([null, null]);
  
  // State for dropdown options
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [facts, setFacts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [sources, setSources] = useState([]);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Process API data when it's received
  // ... existing code ...

  // Process API data when it's received
  useEffect(() => {
    if (apiData) {
      const processedData = apiData.map((item, index) => ({
        ...item,
        date: moment(item.date, 'DD-MM-YYYY'),
        id: index + 1
      }));

      // Filter out invalid values when setting dropdown options
      setBrands(['all', ...new Set(processedData
        .map(item => item.brand)
        .filter(brand => brand && brand !== 'Very Negative')
      )].filter(Boolean));

      setFacts(['all', ...new Set(processedData
        .map(item => item.fact)
        .filter(fact => fact && fact !== '0')
      )].filter(Boolean));

      setSources(['all', ...new Set(processedData
        .map(item => item.source)
        .filter(source => source && source !== '1500000')
      )].filter(Boolean));

      const uniqueCountries = [...new Set(processedData.map(item => item.country))].filter(Boolean);
      setCountries(['all', ...uniqueCountries]);
      
      // Initialize models based on selected brands
      updateModels(processedData, ['all']);
    }
  }, [apiData]);

  // Update the updateModels function to also filter invalid values
// ... existing code ...

const updateModels = (data, brands) => {
  if (brands.includes('all')) {
    setModels(['all', ...new Set(data
      .map(item => item.model)
      .filter(model => model && model !== 'Climate Control')
    )]);
  } else {
    setModels(['all', ...new Set(data
      .filter(item => brands.includes(item.brand))
      .map(item => item.model)
      .filter(model => model && model !== 'Climate Control')
    )]);
  }
  setSelectedModels(['all']); // Reset model selection when brands change
};

// ... existing code ...


  // Handle brand change
  const handleBrandChange = (event) => {
    const values = event.target.value;
    const newSelection = values.includes('all') ? ['all'] : values.filter(v => v !== 'all');
    setSelectedBrands(newSelection);
    updateModels(apiData, newSelection);
  };

  // Generic handler for multiple select changes
  const handleMultipleSelect = (setter) => (event) => {
    const values = event.target.value;
    setter(values.includes('all') ? ['all'] : values.filter(v => v !== 'all'));
  };

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!apiData) return [];
    
    let result = [...apiData];

    if (!selectedBrands.includes('all')) {
      result = result.filter(item => selectedBrands.includes(item.brand));
    }
    if (!selectedModels.includes('all')) {
      result = result.filter(item => selectedModels.includes(item.model));
    }
    if (!selectedFacts.includes('all')) {
      result = result.filter(item => selectedFacts.includes(item.fact));
    }
    if (!selectedCountries.includes('all')) {
      result = result.filter(item => selectedCountries.includes(item.country));
    }
    if (!selectedSources.includes('all')) {
      result = result.filter(item => selectedSources.includes(item.source));
    }
    if (dateRange[0] && dateRange[1]) {
      result = result.filter(item => 
        moment(item.date).isBetween(dateRange[0], dateRange[1], 'day', '[]')
      );
    }

    return result;
  }, [apiData, selectedBrands, selectedModels, selectedFacts, selectedCountries, selectedSources, dateRange]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error loading data: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#1976d2' }}>
        Dashboard
      </Typography>
      
      <FiltersContainer>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={2}>
            <StyledFormControl fullWidth>
              <InputLabel>Brand</InputLabel>
              <Select
                multiple
                value={selectedBrands}
                onChange={handleBrandChange}
                label="Brand"
                renderValue={(selected) => selected.includes('all') ? 'All Brands' : selected.join(', ')}
                MenuProps={MenuProps}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    <Checkbox checked={selectedBrands.indexOf(brand) > -1} />
                    <ListItemText primary={brand === 'all' ? 'All Brands' : brand} />
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            <StyledFormControl fullWidth>
              <InputLabel>Model</InputLabel>
              <Select
                multiple
                value={selectedModels}
                onChange={handleMultipleSelect(setSelectedModels)}
                label="Model"
                disabled={!models.length}
                renderValue={(selected) => selected.includes('all') ? 'All Models' : selected.join(', ')}
                MenuProps={MenuProps}
              >
                {models.map((model) => (
                  <MenuItem key={model} value={model}>
                    <Checkbox checked={selectedModels.indexOf(model) > -1} />
                    <ListItemText primary={model === 'all' ? 'All Models' : model} />
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            <StyledFormControl fullWidth>
              <InputLabel>Fact</InputLabel>
              <Select
                multiple
                value={selectedFacts}
                onChange={handleMultipleSelect(setSelectedFacts)}
                label="Fact"
                renderValue={(selected) => selected.includes('all') ? 'All Facts' : selected.join(', ')}
                MenuProps={MenuProps}
              >
                {facts.map((fact) => (
                  <MenuItem key={fact} value={fact}>
                    <Checkbox checked={selectedFacts.indexOf(fact) > -1} />
                    <ListItemText primary={fact === 'all' ? 'All Facts' : fact} />
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
      <StyledFormControl fullWidth>
        <InputLabel>Country</InputLabel>
        <Select
          multiple
          value={selectedCountries}
          onChange={(event) => {
            const values = event.target.value;
            setSelectedCountries(values.includes('all') ? ['all'] : values.filter(v => v !== 'all'));
          }}
          label="Country"
          renderValue={(selected) => selected.includes('all') ? 'All Countries' : selected.join(', ')}
          MenuProps={MenuProps}
        >
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              <Checkbox checked={selectedCountries.indexOf(country) > -1} />
              <ListItemText primary={country === 'all' ? 'All Countries' : country} />
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
    </Grid>

          <Grid item xs={12} md={6} lg={2}>
            <StyledFormControl fullWidth>
              <InputLabel>Source</InputLabel>
              <Select
                multiple
                value={selectedSources}
                onChange={handleMultipleSelect(setSelectedSources)}
                label="Source"
                renderValue={(selected) => selected.includes('all') ? 'All Sources' : selected.join(', ')}
                MenuProps={MenuProps}
              >
                {sources.map((source) => (
                  <MenuItem key={source} value={source}>
                    <Checkbox checked={selectedSources.indexOf(source) > -1} />
                    <ListItemText primary={source === 'all' ? 'All Sources' : source} />
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>

          <Grid item xs={12}>
            <DatePickerContainer>
              <DatePicker
                label="Start Date"
                value={dateRange[0]}
                onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={dateRange[1]}
                onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                renderInput={(params) => <TextField {...params} />}
              />
            </DatePickerContainer>
          </Grid>
        </Grid>
      </FiltersContainer>

      <StyledPaper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Brand</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Model</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Feedback</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.brand}</TableCell>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.feedback}</TableCell>
                    <TableCell>{moment(row.date).format('DD-MM-YYYY')}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      </StyledPaper>
    </Container>
  );
}

export default Dashboard4;