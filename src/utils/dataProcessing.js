import moment from 'moment';

export const getSentimentCategory = (fact) => {
  if (!fact || typeof fact !== 'string') return 'Neutral';
  
  const factLower = fact.toLowerCase();
  
  if (factLower.includes('very positive')) return 'Very Positive';
  if (factLower.includes('very negative')) return 'Very Negative';
  if (factLower.includes('positive') && !factLower.includes('very')) return 'Positive';
  if (factLower.includes('negative') && !factLower.includes('very')) return 'Negative';
  if (factLower.includes('neutral')) return 'Neutral';
  
  return 'Neutral';
};

export const processChartData = (data, filters) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  let processedData = [...data];

  // Apply filters
  if (filters) {
    // Category filter
    if (!filters.categories.includes('All')) {
      processedData = processedData.filter(item => 
        filters.categories.some(category => 
          category.toLowerCase() === (item.category || '').toLowerCase()
        )
      );
    }

    // Brand filter
    if (!filters.brands.includes('All')) {
      processedData = processedData.filter(item => 
        filters.brands.some(brand => 
          brand.toLowerCase() === (item.brand || '').toLowerCase()
        )
      );
    }

    // Model filter
    if (!filters.models.includes('All')) {
      processedData = processedData.filter(item => 
        filters.models.some(model => 
          model.toLowerCase() === (item.model || '').toLowerCase()
        )
      );
    }

    // Feature filter
    if (!filters.features.includes('All')) {
      processedData = processedData.filter(item => 
        filters.features.includes(item.Feature)
      );
    }

    // Fact/Sentiment filter
    if (!filters.facts.includes('All')) {
      processedData = processedData.filter(item => {
        const sentiment = getSentimentCategory(String(item.fact || ''));
        return filters.facts.includes(sentiment);
      });
    }

    // Source filter
    if (!filters.sources.includes('All')) {
      processedData = processedData.filter(item => 
        filters.sources.includes(item.source)
      );
    }

    // Date range filter
    if (filters.fromDate) {
      const fromDate = moment(filters.fromDate).startOf('day');
      processedData = processedData.filter(item => 
        moment(item.date).isSameOrAfter(fromDate)
      );
    }
    if (filters.toDate) {
      const toDate = moment(filters.toDate).endOf('day');
      processedData = processedData.filter(item => 
        moment(item.date).isSameOrBefore(toDate)
      );
    }
  }

  // Group data by model, category, and sentiment
  const groupedData = processedData.reduce((acc, item) => {
    const model = item.model || 'Unknown';
    const category = item.category || 'Unknown';
    const key = `${model}-${category}`;
    
    if (!acc[key]) {
      acc[key] = {
        model,
        category,
        'Very Positive': 0,
        'Positive': 0,
        'Neutral': 0,
        'Negative': 0,
        'Very Negative': 0,
        total: 0
      };
    }

    const sentiment = getSentimentCategory(String(item.fact || ''));
    acc[key][sentiment]++;
    acc[key].total++;

    return acc;
  }, {});

  // Convert to array and sort by category then total
  return Object.values(groupedData)
    .sort((a, b) => {
      // First sort by category
      if (a.category !== b.category) {
        return a.category === 'Price' ? -1 : 1;
      }
      // Then sort by total within each category
      return b.total - a.total;
    });
};

export const processTimeSeriesData = (data, filters) => {
  if (!data || !Array.isArray(data)) return [];

  let processedData = [...data];

  // Apply the same filters as in processChartData
  if (filters) {
    // Category filter
    if (!filters.categories.includes('All')) {
      processedData = processedData.filter(item => 
        filters.categories.some(category => 
          category.toLowerCase() === (item.category || '').toLowerCase()
        )
      );
    }

    // Apply other filters (same as in processChartData)
    if (!filters.brands.includes('All')) {
      processedData = processedData.filter(item => 
        filters.brands.some(brand => 
          brand.toLowerCase() === (item.brand || '').toLowerCase()
        )
      );
    }

    if (!filters.models.includes('All')) {
      processedData = processedData.filter(item => 
        filters.models.some(model => 
          model.toLowerCase() === (item.model || '').toLowerCase()
        )
      );
    }

    if (!filters.features.includes('All')) {
      processedData = processedData.filter(item => 
        filters.features.includes(item.Feature)
      );
    }

    if (!filters.facts.includes('All')) {
      processedData = processedData.filter(item => {
        const sentiment = getSentimentCategory(String(item.fact || ''));
        return filters.facts.includes(sentiment);
      });
    }

    if (!filters.sources.includes('All')) {
      processedData = processedData.filter(item => 
        filters.sources.includes(item.source)
      );
    }

    if (filters.fromDate) {
      const fromDate = moment(filters.fromDate).startOf('day');
      processedData = processedData.filter(item => 
        moment(item.date).isSameOrAfter(fromDate)
      );
    }
    if (filters.toDate) {
      const toDate = moment(filters.toDate).endOf('day');
      processedData = processedData.filter(item => 
        moment(item.date).isSameOrBefore(toDate)
      );
    }
  }

  // Group by date, category, and sentiment
  const groupedByDate = processedData.reduce((acc, item) => {
    const date = moment(item.date).format('YYYY-MM-DD');
    const category = item.category || 'Unknown';
    const sentiment = getSentimentCategory(String(item.fact || ''));

    const key = `${date}-${category}`;

    if (!acc[key]) {
      acc[key] = {
        date,
        category,
        'Very Positive': 0,
        'Positive': 0,
        'Neutral': 0,
        'Negative': 0,
        'Very Negative': 0
      };
    }

    acc[key][sentiment]++;
    return acc;
  }, {});

  // Convert to array and sort by date and category
  return Object.values(groupedByDate)
    .sort((a, b) => {
      const dateCompare = moment(a.date).diff(moment(b.date));
      if (dateCompare !== 0) return dateCompare;
      return a.category === 'Price' ? -1 : 1;
    });
};

export const calculateMovingAverages = (data, windowSize = 7) => {
  if (!data || data.length === 0) return [];

  const sortedData = [...data].sort((a, b) => moment(a.date).diff(moment(b.date)));

  return sortedData.map((day, index) => {
    const window = sortedData
      .slice(Math.max(0, index - windowSize + 1), index + 1)
      .filter(d => d.category === day.category);

    const averages = {
      date: day.date,
      category: day.category,
      'Very Positive': window.reduce((sum, d) => sum + d['Very Positive'], 0) / window.length,
      'Positive': window.reduce((sum, d) => sum + d['Positive'], 0) / window.length,
      'Neutral': window.reduce((sum, d) => sum + d['Neutral'], 0) / window.length,
      'Negative': window.reduce((sum, d) => sum + d['Negative'], 0) / window.length,
      'Very Negative': window.reduce((sum, d) => sum + d['Very Negative'], 0) / window.length
    };

    return averages;
  });
};