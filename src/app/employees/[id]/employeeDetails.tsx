'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiClient from '@/app/Services/apiClient';
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Avatar, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';

interface Employee {
  id: number;
  name: string;
  email: string;
  memberTypeName: string;
  teamName: string;
}

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Aucun ID trouvé dans l'URL.");
      setLoading(false);
      return;
    }

    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError("Token d'authentification manquant.");
          setLoading(false);
          return;
        }

        const response = await apiClient.get(`/api/TeamMember/GetTeamMemberById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployee(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des détails de l'employé.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#e3f2fd">
        <CircularProgress size={70} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#ffebee">
        <Alert severity="error" sx={{ padding: 3, fontSize: '1.2rem', borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f2f5" padding={3}>
      <Paper elevation={5} sx={{ maxWidth: 550, width: '100%', padding: 4, borderRadius: 4, textAlign: 'center', backgroundColor: '#ffffff' }}>
        <Avatar sx={{ width: 90, height: 90, margin: '0 auto 16px', backgroundColor: '#1976d2' }}>
          <PersonIcon sx={{ fontSize: 50, color: '#ffffff' }} />
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600} color="#333">
          Détails de l'employé
        </Typography>
        <CardContent>
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem', color: '#555' }}>
            <strong>ID :</strong> {employee?.id}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem', color: '#555' }}>
            <strong>Nom :</strong> {employee?.name}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem', color: '#555' }}>
            <strong>Email :</strong> {employee?.email}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem', color: '#555' }}>
            <strong>Type :</strong> {employee?.memberTypeName}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem', color: '#555' }}>
            <strong>Équipe :</strong> {employee?.teamName}
          </Typography>
        </CardContent>
        <Button variant="contained" startIcon={<ArrowBackIcon />} sx={{ mt: 3, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }} onClick={() => window.history.back()}>
          Retour
        </Button>
      </Paper>
    </Box>
  );
};

export default EmployeeDetails;