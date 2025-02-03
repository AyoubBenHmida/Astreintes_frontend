'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const NavigationButton = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/auth'); 
  };

  return (
    <Button 
            onClick={handleNavigation}
            variant="contained" 
            color="primary" 
            sx={{
              backgroundColor: '#1976d2',
              ':hover': { backgroundColor: '#1565c0' },
              px: 4,
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            Connexion
    </Button>
  );
};

export default NavigationButton;