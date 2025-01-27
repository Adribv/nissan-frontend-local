import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchInitialData = async () => {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error('Error fetching initial data:', error);
    throw new Error('Failed to fetch data');
  }
};

export const fetchFeedbackDetails = async (model, index, date) => {
  try {
    const response = await api.get(`/feedback/${model}/${index}/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback details:', error);
    throw new Error('Failed to fetch feedback details');
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const fetchSources = async () => {
  try {
    const response = await api.get('/sources');
    return response.data;
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw new Error('Failed to fetch sources');
  }
};

export const fetchFeatures = async () => {
  try {
    const response = await api.get('/features');
    return response.data;
  } catch (error) {
    console.error('Error fetching features:', error);
    throw new Error('Failed to fetch features');
  }
};

// Add request interceptor
api.interceptors.request.use(
  config => {
    // Add any request preprocessing here
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        timestamp: new Date().getTime()
      };
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  response => {
    // Add any response preprocessing here
    return response;
  },
  error => {
    console.error('API Error:', error);
    // Add any error handling here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  getData: () => api.get('/data'),
  getCategories: () => api.get('/categories'),
  getSources: () => api.get('/sources'),
  getFeatures: () => api.get('/features'),
  getFeedbackDetails: (model, index, date) => api.get(`/feedback/${model}/${index}/${date}`),
  // Add more endpoints as needed
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error Handler:', error);
  let errorMessage = 'An unexpected error occurred';

  if (error.response) {
    // Server responded with error
    errorMessage = error.response.data.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    // No response received
    errorMessage = 'No response received from server';
  } else {
    // Request setup error
    errorMessage = error.message;
  }

  return errorMessage;
};

export default api;