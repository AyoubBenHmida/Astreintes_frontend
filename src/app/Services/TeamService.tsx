import apiClient from "./apiClient";

export class TeamService {
    static async getTeams(): Promise<any[]> {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await apiClient.get(`/api/Team/GetTeams/protected`, {
          headers: {
            Authorization: `Bearer ${token}`, // Assurez-vous d'avoir un token valide
          },
        });
  
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des équipes :", error);
        throw error;
      }
    }
  }