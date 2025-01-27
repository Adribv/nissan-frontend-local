import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Select, MenuItem, styled } from '@mui/material';


const BackgroundContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
               url('https://i.ibb.co/5RHTzxx/Screenshot-2024-06-25-185451.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center 80px',
});

const NavContainer = styled(Box)({
  textAlign: 'center',
});

const LogoContainer = styled(Box)({
  marginBottom: '30px',
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
});

const Logo = styled('img')({
  height: '60px',
  objectFit: 'contain',
});

const StyledSelect = styled(Select)({
  minWidth: '300px',
  color: 'white',
  '& .MuiSelect-select': {
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: 'rgba(195, 0, 47, 0.9)', // Nissan red with opacity
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiSelect-icon': {
    color: 'white',
  },
});

const StyledMenuItem = styled(MenuItem)({
  fontSize: '16px',
});

function Home() {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState('');

  const handleChange = (event) => {
    const path = event.target.value;
    setSelectedPage(path);
    navigate(path);
  };

  return (
    <BackgroundContainer>
      <NavContainer>
       
        
        <StyledSelect
          value={selectedPage}
          onChange={handleChange}
          displayEmpty
          renderValue={(value) => value === '' ? 'Select Page' : value}
        >
          <StyledMenuItem value="" disabled>
            Select Page
          </StyledMenuItem>
          <StyledMenuItem value="/dashboard1">Dashboard 1</StyledMenuItem>
          <StyledMenuItem value="/dashboard2">Dashboard 2</StyledMenuItem>
          <StyledMenuItem value="/dashboard3">Dashboard 3</StyledMenuItem>
          <StyledMenuItem value="/dashboard4">Dashboard 4</StyledMenuItem>
        </StyledSelect>
      </NavContainer>
    </BackgroundContainer>
  );
}

export default Home;