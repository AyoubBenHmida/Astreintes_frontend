'use client';

import { useEffect, useState } from "react";
import apiClient from "../Services/apiClient";
import { useRouter } from 'next/navigation';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Alert,
  Avatar,
  Box,
  CardHeader,
  Tooltip,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import { Person, Group, Work, Visibility, Edit, Delete, Add } from "@mui/icons-material";

type Employee = {
  id: number;
  name: string;
  email: string;
  memberTypeId: number;
  memberTypeName: string;
  teamId: number;
  teamName: string;
};

const Employees = () => {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  const handleOpen = (id: number) => {
    setSelectedEmployeeId(id);
    setOpen(true);
  };

  // Fermer la boîte de dialogue
  const handleClose = () => {
    setOpen(false);
    setSelectedEmployeeId(null);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("Token manquant. Veuillez vous connecter.");
          setLoading(false);
          return;
        }

        const response = await apiClient.get("/api/TeamMember/GetTeamMembers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEmployees(response.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Endpoint introuvable. Vérifiez l'URL.");
        } else if (err.response?.status === 401) {
          setError("Non autorisé. Vérifiez votre token JWT.");
        } else {
          setError("Erreur lors de la récupération des employés.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleViewDetails = (id: number) => {
    router.push(`/employees/${id}`);
  };

  const handleEditEmployee = (id: number) => {
    router.push(`/employees/${id}/edit`);
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await apiClient.delete(`/api/TeamMember/DeleteTeamMember/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      setError("Impossible de modifier le membre. Veuillez réessayer.");
    }
  };

  const handleAddEmployee = () => {
    router.push('/employees/create');
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress style={{ marginTop: "20px" }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" style={{ marginTop: "20px" }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Paper
      sx={{
        minHeight: "100vh",
        padding: 4,
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
      }}
    >
      <Container sx={{ mt: 5 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: "bold",
            textAlign: "center",
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Liste des Employés
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={handleAddEmployee}
          >
            Ajouter un Employé
          </Button>
        </Box>

        <Grid container spacing={3}>
          {employees.map((employee) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={employee.id}>
              <Tooltip title={`Membre de l'équipe: ${employee.teamName}`} arrow>
                <Card
                  sx={{
                    transition: "0.3s",
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#ff9800" }}>
                        {employee.memberTypeName === "Manager" ? (
                          <Work />
                        ) : employee.memberTypeName === "Developer" ? (
                          <Person />
                        ) : (
                          <Group />
                        )}
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
                        {employee.name}
                      </Typography>
                    }
                    subheader={
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        {employee.email}
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography variant="body2" sx={{ color: "#fff" }}>
                        <strong>Type de Membre :</strong> {employee.memberTypeName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff" }}>
                        <strong>Équipe :</strong> {employee.teamName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(employee.id)}
                      >
                        Détails
                      </Button>
                      <IconButton color="success" onClick={() => handleEditEmployee(employee.id)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpen(employee.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Tooltip>
              
              <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Voulez-vous vraiment supprimer cet employé ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={() => handleDeleteEmployee(employee.id)} color="error">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

            </Grid>
          ))}
        </Grid>

      </Container>
    </Paper>
  );
};

export default Employees;
