'use client';

import { useRouter, useParams } from 'next/navigation';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  MenuItem,
  CircularProgress,
  CardActions,
  Snackbar,
  Alert,
  InputAdornment,
  Divider,
  Backdrop,
} from "@mui/material";
import { useState, useEffect } from 'react';
import apiClient from '@/app/Services/apiClient';
import { TeamService } from '@/app/Services/TeamService';
import { Email, Person, Groups } from "@mui/icons-material";

interface TeamMemberEditRequest {
  id: number;
  name: string;
  email: string;
  memberTypeId: number;
  teamId: number;
}

const EditEmployee = () => {
  const router = useRouter();
  const { id } = useParams();
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const [initialData, setInitialData] = useState<TeamMemberEditRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await apiClient.get(`/api/TeamMember/GetTeamMemberById/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;

        setInitialData({
          id: data.id,
          name: data.name,
          email: data.email,
          memberTypeId: data.memberTypeId,
          teamId: data.teamId,
        });
      } catch (error) {
        setErrorMessage("Impossible de récupérer les données du membre.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMember();
  }, [id]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await TeamService.getTeams();
        setTeams(data);
      } catch {
        setErrorMessage("Erreur lors du chargement des équipes.");
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (values: TeamMemberEditRequest) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('jwtToken');
      await apiClient.put(`/api/TeamMember/EditTeamMember`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Membre modifié avec succès !");
      setTimeout(() => router.push(`/teams/${initialData?.teamId}`), 2000);
    } catch {
      setErrorMessage("Impossible de modifier le membre.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="primary" />
      </Backdrop>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ mt: 5, p: 4, borderRadius: 3, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" color="primary" gutterBottom>
          Modifier un membre d'équipe
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {errorMessage && (
          <Snackbar open autoHideDuration={4000} onClose={() => setErrorMessage(null)}>
            <Alert severity="error">{errorMessage}</Alert>
          </Snackbar>
        )}
        {successMessage && (
          <Snackbar open autoHideDuration={4000} onClose={() => setSuccessMessage(null)}>
            <Alert severity="success">{successMessage}</Alert>
          </Snackbar>
        )}

        <Formik
          enableReinitialize
          initialValues={initialData!}
          validationSchema={Yup.object({
            name: Yup.string().required("Le nom est requis"),
            email: Yup.string().email("Email invalide").required("L'email est requis"),
            memberTypeId: Yup.number().required("Le type de membre est requis"),
            teamId: Yup.number().required("L'équipe est requise"),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleChange }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field name="name">
                    {({ field, meta }: any) => (
                      <TextField
                        {...field}
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Field name="email">
                    {({ field, meta }: any) => (
                      <TextField
                        {...field}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Field name="memberTypeId">
                    {({ field, meta }: any) => (
                      <TextField
                        select
                        label="Type de membre"
                        {...field}
                        onChange={handleChange}
                        fullWidth
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      >
                        <MenuItem value={1}>TeamLeader</MenuItem>
                        <MenuItem value={2}>Employé</MenuItem>
                      </TextField>
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Field name="teamId">
                    {({ field, meta }: any) => (
                      <TextField
                        select
                        label="Équipe"
                        {...field}
                        onChange={handleChange}
                        fullWidth
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Groups color="action" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {teams.map((team) => (
                          <MenuItem key={team.id} value={team.id}>
                            {team.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Field>
                </Grid>
              </Grid>

              <CardActions sx={{ mt: 3, justifyContent: "center" }}>
                <Button variant="contained" color="secondary" onClick={() => router.push(`/teams/${initialData?.teamId}`)}>
                  Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                  {submitting ? <CircularProgress size={24} color="inherit" /> : "Modifier"}
                </Button>
              </CardActions>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default EditEmployee;