import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container,
  Grid,
  Typography,
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
  Link
} from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import { SentimentBarChart } from '../../components/Charts';

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    fontSize: '18px',
    textAlign: 'center'
  },
  dropdownContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px',
    gap: 2
  },
  dropdown: {
    width: '32%',
    padding: '8px',
    fontSize: '18px'
  },
  datatableContainer: {
    marginTop: '20px',
    overflowX: 'scroll'
  },
  datatable: {
    border: '1px solid black',
    fontSize: '16px'
  }
};

function Dashboard3() {
  const { data } = useAppContext();
  const [filters, setFilters] = useState({
    date: '',
    brand: '',
    model: []
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  // Extract unique values
  const dates = [...new Set(data?.map(item => item.date))].filter(Boolean);
  const brands = [...new Set(data?.map(item => item.brand))].filter(Boolean);
  const models = [...new Set(data?.filter(item => 
    item.brand === filters.brand
  ).map(item => item.model))].filter(Boolean);

  useEffect(() => {
    if (data && data.length > 0) {
      setFilters(prev => ({
        ...prev,
        date: dates[0] || '',
        brand: brands[0] || '',
        model: [models[0] || '']
      }));
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;

    const filtered = data.filter(item => 
      filters.model.includes(item.model) && 
      item.date === filters.date && 
      item.brand === filters.brand
    );
    setFilteredData(filtered);
  }, [filters, data]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterName]: value };
      if (filterName === 'brand') {
        newFilters.model = [];
      }
      return newFilters;
    });
  };

  const limitText = (text, limit = 10) => {
    if (typeof text === 'string') {
      const words = text.split(' ');
      if (words.length > limit) {
        return words.slice(0, limit).join(' ') + '...';
      }
    }
    return text;
  };

  const displayColumns = ['fact', 'Feature', 'Summary', 'feedback'];
  const navigate = useNavigate();
// In your Dashboard3 component, update the handleViewDetailedSummary function:
// ... existing code ...
const handleViewDetailedSummary = () => {
  if (selectedCategory && filters.model.length > 0) {
    const queryParams = new URLSearchParams({
      category: selectedCategory,
      models: filters.model.join(','),
      date: filters.date,
      brand: filters.brand
    });
    
    // Remove /api prefix from navigation
    navigate(`/detailed-summary?${queryParams.toString()}`);
  }
};
// ... existing code ...

  return (
    <Container maxWidth="xl" sx={styles.container}>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Data Analysis Dashboard
      </Typography>

      <Box sx={styles.dropdownContainer}>
        <FormControl sx={styles.dropdown}>
          <InputLabel>Date</InputLabel>
          <Select
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            label="Date"
          >
            {dates.map(date => (
              <MenuItem key={date} value={date}>{date}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={styles.dropdown}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            label="Brand"
          >
            {brands.map(brand => (
              <MenuItem key={brand} value={brand}>{brand}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={styles.dropdown}>
          <InputLabel>Model</InputLabel>
          <Select
            multiple
            value={filters.model}
            onChange={(e) => handleFilterChange('model', e.target.value)}
            label="Model"
          >
            {models.map(model => (
              <MenuItem key={model} value={model}>{model}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={styles.datatableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              {displayColumns.map(col => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                {displayColumns.map(col => (
                  <TableCell key={col}>
                    {col === 'Summary' ? limitText(row[col]) : row[col]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
      <SentimentBarChart 
          data={filteredData}
          onBarClick={setSelectedCategory}
        />
      </Box>

      {selectedCategory && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5">
            Summary for Category: {selectedCategory}
          </Typography>
          <Link
            component="button"
            onClick={handleViewDetailedSummary}
            sx={{ 
              fontSize: '18px', 
              display: 'block', 
              mt: 2,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            View Detailed Summary
          </Link>
        </Box>
      )}
    </Container>
  );
}

export default Dashboard3;