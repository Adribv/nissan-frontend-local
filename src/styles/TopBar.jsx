import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import nissanLogo from '../components/nissan.png';
import analyticsLogo from '../components/srm.png';
import { useAuth } from './AuthContext';

const Logo = styled('img')({
  height: '50px',
  objectFit: 'contain',
});

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '30px',
  minWidth: '200px', // Reserve space for logos
});

const NavContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1, // Take remaining space for center alignment
});

const NavButton = styled(Button)(({ theme, active }) => ({
  color: '#ffffff',
  marginLeft: '10px',
  marginRight: '10px',
  fontSize: '16px',
  textTransform: 'none',
  borderBottom: active ? '3px solid #ffffff' : '3px solid transparent',
  borderRadius: 0,
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottom: '3px solid #ffffff',
  },
}));

const StyledToolbar = styled(Toolbar)({
  height: '80px',
  justifyContent: 'space-between',
});

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };



  const handleLogout = () => {
    try {
      // Clear any auth tokens from localStorage
      logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear any other auth-related data
      sessionStorage.clear();
      
      // Optional: Clear any cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Redirect to signin page
      navigate('/signin', { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      // Optionally show an error message to user
    }
  };

  return (
    <AppBar position="fixed">
      <StyledToolbar>
        <LogoContainer>
          <Logo 
            src={nissanLogo} 
            alt="Nissan Logo" 
            sx={{ height: '60px' }}
          />
          <Logo 
            src={analyticsLogo} 
            alt="Analytics Logo"
            sx={{ height: '55px' }}
          />
        </LogoContainer>
        
        <NavContainer>
          <NavButton 
            active={isActive('/home')} 
            onClick={() => navigate('/home')}
            startIcon={<HomeIcon />}
          >
            Home
          </NavButton>
          <NavButton 
            active={isActive('/dashboard1')} 
            onClick={() => navigate('/dashboard1')}
          >
            Dashboard 1
          </NavButton>
          <NavButton 
            active={isActive('/dashboard2')} 
            onClick={() => navigate('/dashboard2')}
          >
            Dashboard 2
          </NavButton>
          <NavButton 
            active={isActive('/dashboard3')} 
            onClick={() => navigate('/dashboard3')}
          >
            Dashboard 3
          </NavButton>
          <NavButton 
            active={isActive('/dashboard4')} 
            onClick={() => navigate('/dashboard4')}
          >
            Dashboard 4
          </NavButton>
        </NavContainer>

        <Box sx={{ minWidth: '200px', display: 'flex', justifyContent: 'flex-end' }}>
          <NavButton 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </NavButton>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
}

export default TopBar;