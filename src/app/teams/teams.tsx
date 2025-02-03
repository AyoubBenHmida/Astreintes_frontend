'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import apiClient from "../Services/apiClient";
import {
  Card, CardContent, CardHeader, Typography, Grid, Container,
  CircularProgress, Snackbar, Box, IconButton, Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, Paper, Tooltip
} from "@mui/material";
import { Visibility, Edit, Delete, Add, Warning } from "@mui/icons-material";
import { motion } from "framer-motion";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = (props: AlertProps) => <MuiAlert elevation={6} variant="filled" {...props} />;

type Team = {
  id: number;
  name: string;
};

const Teams = () => {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("Token manquant. Veuillez vous connecter.");
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
        const response = await apiClient.get("/api/Team/GetTeams/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des équipes.");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleAddTeam = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await apiClient.post(
        "/api/Team/AddTeam",
        { name: teamName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpenAddDialog(false);
      window.location.reload();
    } catch (err) {
      setError("Erreur lors de l'ajout de l'équipe.");
      setSnackbarOpen(true);
    }
  };

  const handleEditTeam = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (selectedTeam) {
        await apiClient.put(
          `/api/Team/EditTeam/`,
          { id: selectedTeam.id,
            name: teamName },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOpenEditDialog(false);
        window.location.reload();
      }
    } catch (err) {
      setError("Erreur lors de la modification de l'équipe.");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (selectedTeam) {
        await apiClient.delete(`/api/Team/DeleteTeam/${selectedTeam.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOpenDeleteDialog(false);
        window.location.reload();
      }
    } catch (err) {
      setError("Erreur lors de la suppression de l'équipe.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Paper sx={{ minHeight: "100vh", padding: 4, background: "#f4f6f8" }}>
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "#333" }}>
          Liste des Équipes
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setTeamName("");
              setOpenAddDialog(true);
            }}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
          >
            Ajouter une équipe
          </Button>
        </Box>

        {loading && <Container><CircularProgress sx={{ mt: 5 }} /></Container>}

        {!loading && teams.length === 0 && (
          <Typography variant="h6" sx={{ textAlign: "center", color: "#666", mt: 3 }}>
            Aucune équipe disponible.
          </Typography>
        )}

        <Grid container spacing={3}>
          {teams.map((team) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card sx={{ borderRadius: 3, background: "#fff", boxShadow: 3 }}>
                  <CardHeader title={<Typography variant="h6">{team.name}</Typography>} />
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Tooltip title="Voir les détails">
                        <Button
                          variant="contained"
                          color="info"
                          startIcon={<Visibility />}
                          onClick={() => router.push(`/teams/${team.id}`)}
                          sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                          Détails
                        </Button>
                      </Tooltip>

                      <Tooltip title="Modifier">
                        <IconButton
                          color="success"
                          onClick={() => {
                            setSelectedTeam(team);
                            setTeamName(team.name);
                            setOpenEditDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Supprimer">
                        <IconButton
                          color="error"
                          onClick={() => {
                            setSelectedTeam(team);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Dialog pour Ajouter une Équipe */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
  <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>
    Ajouter une équipe
  </DialogTitle>
  <DialogContent>
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <TextField
        autoFocus
        margin="dense"
        label="Nom de l'équipe"
        fullWidth
        variant="outlined"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        sx={{ width: "80%", marginBottom: 2 }}
      />
    </Box>
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center" }}>
    <Button onClick={() => setOpenAddDialog(false)} color="primary" variant="outlined">
      Annuler
    </Button>
    <Button onClick={handleAddTeam} color="primary" variant="contained">
      Ajouter
    </Button>
  </DialogActions>
</Dialog>

        {/* Dialog pour Modifier une Équipe */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Modifier une équipe</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom de l'équipe"
              fullWidth
              variant="outlined"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} color="primary">Annuler</Button>
            <Button onClick={handleEditTeam} color="primary" variant="contained">Modifier</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour Supprimer une Équipe */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle sx={{ color: "red" }}>
            Confirmation de Suppression
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Voulez-vous vraiment supprimer l'équipe "{selectedTeam?.name}" ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Annuler</Button>
            <Button onClick={handleDeleteTeam} color="error" variant="contained">Supprimer</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar pour les erreurs */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Paper>
  );
};

export default Teams;