import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Icon } from '@mui/material';
import Link from 'next/link';
import NavigationButton from './NavigationButton';

const HomePage: React.FC = () => {

  return (
    <Box sx={{ p: 4, backgroundColor: '#e3f2fd', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Bienvenue sur <Box component="span" color="primary.main">AstreinteManager</Box>
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
        Gérer efficacement vos astreintes grâce à une plateforme moderne et intuitive.
      </Typography>

      {/* Bouton de connexion */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
          <NavigationButton />
      </Box>

      {/* Grille des cartes */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Carte Employés */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 2, 
            boxShadow: 3, 
            ':hover': { transform: 'scale(1.05)', boxShadow: 6 }, 
            transition: 'transform 0.3s' 
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Icon sx={{ mr: 1 }}>person</Icon> Employés
                </Box>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Saisissez, modifiez ou supprimez vos astreintes rapidement et facilement.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Link href="/employee/astreintes" passHref>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ 
                      backgroundColor: '#1976d2', 
                      ':hover': { backgroundColor: '#1565c0' } 
                    }}
                  >
                    Gérer mes astreintes
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte Chefs d'équipe */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 2, 
            boxShadow: 3, 
            ':hover': { transform: 'scale(1.05)', boxShadow: 6 }, 
            transition: 'transform 0.3s' 
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Icon sx={{ mr: 1 }}>group</Icon> Chefs d'équipe
                </Box>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Consultez, validez ou ajoutez des commentaires sur les astreintes des employés.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Link href="/manager/validation" passHref>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth 
                    sx={{ ':hover': { backgroundColor: '#c62828' } }}
                  >
                    Gérer les validations
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          © 2025 AstreinteManager -{' '}
          <Link href="/legal" passHref>
            <Typography component="span" color="primary.main" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Mentions légales
            </Typography>
          </Link>
          .
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;