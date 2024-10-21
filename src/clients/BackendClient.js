import axios from 'axios';

// TODO: add exponential backoff on failed requests
class BackendClient {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5000/api', // TODO: Update this to the deployed backend URL in production
    });
  }

  async generateRecipe() {
    try {
      const response = await this.api.post('/generate-recipe');
      return response.data;
    } catch (error) {
      console.error('Error generating recipe:', error);
      throw error;
    }
  }

  async generateIngredientsAndInstructions(recipeName, recipeDescription) {
    try {
      const response = await this.api.post('/generate-ingredients-and-instructions', {
        recipeName,
        recipeDescription
      });
      return response.data;
    } catch (error) {
      console.error('Error generating ingredients and instructions:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      const response = await this.api.post('/test-connection');
      return response.data.message;
    } catch (error) {
      console.error('Test connection error:', error);
      throw error;
    }
  }

  async fetchRecipes() {
    try {
      const response = await this.api.get('/recipes');
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }
}

const backendClient = new BackendClient();
export default backendClient;