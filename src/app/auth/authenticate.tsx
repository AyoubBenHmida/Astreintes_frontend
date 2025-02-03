'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { login } from '../Services/LoginService'; 

const Authenticate: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    setError(''); // Réinitialiser les erreurs
    setSuccess(''); // Réinitialiser les messages de succès

    // Validation des champs
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await login({ email, password }); 
      setSuccess('Connexion réussie !');
      console.log('Token:', response.token); 
      localStorage.setItem("jwtToken", response.token);
      window.location.href = "/teams"; 
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#e3f2fd',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Connexion
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            gutterBottom
          >
            Entrez vos identifiants pour accéder à la plateforme.
          </Typography>

          {/* Champ Email */}
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error && !email}
              helperText={!email && error ? 'Email requis.' : ''}
            />
          </Box>

          {/* Champ Mot de Passe */}
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error && !password}
              helperText={!password && error ? 'Mot de passe requis.' : ''}
            />
          </Box>

          {/* Message de succès */}
          {success && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">{success}</Alert>
            </Box>
          )}

          {/* Message d'erreur global */}
          {error && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {/* Bouton de connexion */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5 }}
              onClick={handleLogin} // Appel à la méthode handleLogin
            >
              Se connecter
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Authenticate;