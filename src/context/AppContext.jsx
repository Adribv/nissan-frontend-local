import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import moment from 'moment';
import { getSentimentCategory } from '../utils/dataProcessing';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [rawData, setRawData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    brands: ['All'],
    models: ['All'],
    features: ['All'],
    facts: ['All'],
    sources: ['All'],
    categories: ['All'],
    fromDate: null,
    toDate: null
  });

  // Predefined category options to match Dash app
  const categoryOptions = [
    { label: 'All', value: 'All' },
    { label: 'Segment', value: 'segment' },
    { label: 'Price', value: 'price' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/data');
        setRawData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRawData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (rawData) {
      const filteredData = filterData(rawData, filters);
      setData(filteredData);
    }
  }, [filters, rawData]);

// ... existing code ...

const getUniqueValues = (field) => {
  if (!rawData) return ['All'];
  
  const values = new Set(
    rawData
      .map(item => item[field])
      .filter(Boolean)
      .filter(value => {
        // Filter out specific invalid values based on field
        switch(field) {
          case 'brand':
            return value !== 'Very Negative';
          case 'Feature':
            return value !== '0';
          case 'source':
            return value !== '1500000';
          default:
            return true;
        }
      })
      .map(value => 
        typeof value === 'string' 
          ? value.trim()
          : value
      )
  );
  return ['All', ...Array.from(values).sort()];
};

// ... existing code ...

  const getModelsByBrand = (selectedBrands) => {
    if (!rawData || selectedBrands.includes('All')) {
      return getUniqueValues('model');
    }

    const models = new Set(
      rawData
        .filter(item => 
          selectedBrands.some(brand => 
            brand.toLowerCase() === (item.brand || '').toLowerCase()
          )
        )
        .map(item => item.model)
        .filter(Boolean)
    );

    return ['All', ...Array.from(models).sort()];
  };

  const filterData = (data, filters) => {
    if (!data) return [];

    return data.filter(item => {
      let itemPasses = true;
      
      // Category filter
      if (!filters.categories.includes('All')) {
        itemPasses = filters.categories.some(category => 
          category.toLowerCase() === (item.category || '').toLowerCase()
        );
        if (!itemPasses) return false;
      }
      // Brand filter
      if (itemPasses && !filters.brands.includes('All')) {
        itemPasses = filters.brands.some(brand => 
          brand.toLowerCase() === (item.brand || '').toLowerCase()
        );
      }

      // Model filter
      if (itemPasses && !filters.models.includes('All')) {
        itemPasses = filters.models.some(model => 
          model.toLowerCase() === (item.model || '').toLowerCase()
        );
      }

      // Feature filter
      if (itemPasses && !filters.features.includes('All')) {
        itemPasses = filters.features.includes(item.Feature);
      }

      // Fact/Sentiment filter
      if (itemPasses && !filters.facts.includes('All')) {
        const sentiment = getSentimentCategory(String(item.fact || ''));
        itemPasses = filters.facts.includes(sentiment);
      }

      // Source filter
      if (itemPasses && !filters.sources.includes('All')) {
        itemPasses = filters.sources.includes(item.source);
      }

      // Date range filter
      if (itemPasses && filters.fromDate) {
        const itemDate = moment(item.date);
        itemPasses = itemDate.isSameOrAfter(moment(filters.fromDate).startOf('day'));
      }
      if (itemPasses && filters.toDate) {
        const itemDate = moment(item.date);
        itemPasses = itemDate.isSameOrBefore(moment(filters.toDate).endOf('day'));
      }

      return itemPasses;
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      if (Array.isArray(value)) {
        // If selecting "All"
        if (value.includes('All') && !prev[filterType].includes('All')) {
          newFilters[filterType] = ['All'];
        }
        // If deselecting "All"
        else if (prev[filterType].includes('All')) {
          newFilters[filterType] = value.filter(v => v !== 'All');
        }
        // If no options selected, default to "All"
        else if (value.length === 0) {
          newFilters[filterType] = ['All'];
        }
        // Normal selection
        else {
          newFilters[filterType] = value;
        }

        // Reset models when brand selection changes
        if (filterType === 'brands') {
          newFilters.models = ['All'];
        }
      } else {
        newFilters[filterType] = value;
      }

      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      brands: ['All'],
      models: ['All'],
      features: ['All'],
      facts: ['All'],
      sources: ['All'],
      categories: ['All'],
      fromDate: null,
      toDate: null
    });
  };

  const value = {
    data,
    rawData,
    loading,
    error,
    filters,
    setFilters,
    handleFilterChange,
    clearFilters,
    getModelsByBrand,
    getUniqueValues,
    categoryOptions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}