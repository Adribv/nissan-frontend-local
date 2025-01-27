import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Nissan Analytics
        </Typography>
        <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        <Button color="inherit" onClick={() => navigate('/dashboard1')}>Dashboard 1</Button>
        <Button color="inherit" onClick={() => navigate('/dashboard2')}>Dashboard 2</Button>
        <Button color="inherit" onClick={() => navigate('/dashboard3')}>Dashboard 3</Button>
<Button color="inherit" onClick={() => navigate('/dashboard4')}>
  Dashboard 4
</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;