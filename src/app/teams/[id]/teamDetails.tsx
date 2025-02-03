'use client';

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { deepPurple, lightBlue, amber, green, grey, red } from "@mui/material/colors";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import apiClient from "@/app/Services/apiClient";
import { useParams, useRouter } from "next/navigation";

interface Employee {
  id: number;
  name: string;
  email: string;
}

interface TeamLeader {
  id: number;
  name: string;
  email: string;
}

interface TeamDetails {
  id: number;
  name: string;
  teamLeader: {
    id: number;
    name: string;
    email: string;
  };
  employees: Employee[];
}

const TeamDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  const handleOpen = (id: number) => {
    setSelectedEmployeeId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployeeId(null);
  };

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await apiClient.get<TeamDetails>(
          `/api/Team/GetTeamDetailsById/${id}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeamDetails(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des détails de l'équipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [id]);

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

  useEffect(() => {
    if (!loading && teamDetails && (teamDetails.teamLeader == null)) {
      setError("Vous devez ajouter un TeamLeader avant");
      const timeout = setTimeout(() => router.push(`/employees/create`), 1000);
      return () => clearTimeout(timeout);
    }
  }, [loading, teamDetails]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: `linear-gradient(135deg, ${grey[200]}, ${lightBlue[100]})` }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: `linear-gradient(135deg, ${grey[200]}, ${amber[100]})` }}
      >
        <Alert
          severity="error"
          sx={{
            backgroundColor: amber[50],
            color: deepPurple[800],
            borderRadius: "12px",
            boxShadow: 3,
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 900,
        margin: "20px auto",
        padding: "20px",
        background: `linear-gradient(135deg, ${grey[50]}, ${lightBlue[50]})`,
        borderRadius: "16px",
        boxShadow: 4,
      }}
    >
      {/* Bouton de retour */}
      <Box mb={3} display="flex" justifyContent="flex-start">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/teams")}
          sx={{
            textTransform: "none",
            color: deepPurple[700],
            fontWeight: "bold",
            "&:hover": { backgroundColor: grey[300] },
          }}
        >
          Retour à la liste des équipes
        </Button>
      </Box>

      <Card sx={{ borderRadius: "16px", boxShadow: 5, backgroundColor: grey[100] }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
                color: "white",
                width: 56,
                height: 56,
                fontSize: "1.5rem",
              }}
            >
              {teamDetails?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              sx={{ color: deepPurple[700] }}
            >
              Détails de l'équipe : {teamDetails?.name}
            </Typography>
          </Stack>

          <Box mt={3}>
            <Typography variant="body1" gutterBottom>
              <strong>Team Leader :</strong> {teamDetails?.teamLeader?.name} (
              {teamDetails?.teamLeader?.email})
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Edit />}
                onClick={() => router.push(`/employees/${teamDetails?.teamLeader.id}/edit`)}
              >
                Modifier
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => teamDetails?.teamLeader.id && handleOpen(teamDetails.teamLeader.id)}
              >
                Supprimer
              </Button>
            </Stack>
          </Box>

          <Box mt={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: deepPurple[500] }}
            >
              Employés :
            </Typography>
            {teamDetails?.employees.length ? (
              <TableContainer
                component={Paper}
                sx={{ borderRadius: "12px", boxShadow: 3 }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: lightBlue[100] }}>
                      <TableCell sx={{ fontWeight: "bold", color: deepPurple[700] }}>
                        Nom
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: deepPurple[700] }}>
                        Email
                      </TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamDetails.employees.map((employee) => (
                      <TableRow
                        key={employee.id}
                        sx={{ "&:hover": { backgroundColor: lightBlue[200] } }}
                      >
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton
                              color="primary"
                              onClick={() => router.push(`/employees/${employee.id}/edit`)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleOpen(employee.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Stack>
                        </TableCell>

                        <Dialog open={open} onClose={handleClose}>
                          <DialogTitle>Confirmation</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Voulez-vous vraiment supprimer cet employé ?
                            </DialogContentText>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2">Aucun employé</Typography>
            )}
          </Box>

          <Box mt={3} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${green[400]}, ${green[600]})`,
                color: "white",
                boxShadow: 3,
                "&:hover": { background: `linear-gradient(135deg, ${green[600]}, ${green[800]})` },
              }}
              onClick={() => router.push("/employees/create")}
            >
              Ajouter un Employé
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeamDetails;