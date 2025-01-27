import { Alert, Box } from '@mui/material';

function ErrorAlert({ message }) {
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}

export default ErrorAlert;