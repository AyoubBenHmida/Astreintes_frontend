'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
  CardActions,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import apiClient from "@/app/Services/apiClient";
import { TeamService } from "@/app/Services/TeamService";

interface TeamMember {
  name: string;
  email: string;
  memberTypeId: number;
  teamId: number;
}

const CreateTeamMemberForm = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const [initialValues, setInitialValues] = useState<TeamMember>({
    name: "",
    email: "",
    memberTypeId: 1,
    teamId: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  console.log('Référent:', document.referrer);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await TeamService.getTeams();
        setTeams(data);

        if (data.length > 0) {
          setInitialValues((prevValues) => ({
            ...prevValues,
            teamId: data[0].id,
          }));
        }
      } catch (err) {
        setError("Erreur lors du chargement des équipes");
      }
    };

    fetchTeams();
  }, []);

  const createTeamMember = async (teamMember: TeamMember) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await apiClient.post("/api/TeamMember/AddTeamMember", teamMember, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Une erreur s'est produite");
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={6} sx={{ mt: 4, p: 4, borderRadius: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom color="primary">
          Ajouter un membre d'équipe
        </Typography>

        {message && <Alert severity={message.includes("succès") ? "success" : "error"}>{message}</Alert>}

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object({
            name: Yup.string().required("Le nom est requis"),
            email: Yup.string().email("Email invalide").required("L'email est requis"),
            memberTypeId: Yup.number().required("Le type de membre est requis"),
            teamId: Yup.number().required("L'équipe est requise"),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await createTeamMember(values);
              setMessage("Membre créé avec succès !");
              resetForm();
              setTimeout(() => router.push(`/teams/${values.teamId}`), 2000);
            } catch (error: any) {
              setMessage(error.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, handleChange, values }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Field name="name">
                    {({ field, meta }: any) => (
                      <TextField
                        {...field}
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                        sx={{ backgroundColor: "white" }}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field name="email">
                    {({ field, meta }: any) => (
                      <TextField
                        {...field}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                        sx={{ backgroundColor: "white" }}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12} sm={6}>
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
                        sx={{ backgroundColor: "white" }}
                      >
                        <MenuItem value={1}>TeamLeader</MenuItem>
                        <MenuItem value={2}>Employé</MenuItem>
                      </TextField>
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12} sm={6}>
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
                        sx={{ backgroundColor: "white" }}
                      >
                        {teams.map((team) => (
                          <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Field>
                </Grid>
              </Grid>
              <CardActions sx={{ mt: 3, justifyContent: "center" }}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Créer"}
                </Button>
              </CardActions>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default CreateTeamMemberForm;
