import backendClient from '../clients/BackendClient';

class RecipeGenerationService {
    async generateRecipe() {
        try {
            const recipe = await backendClient.generateRecipe();
            return recipe;
        } catch (error) {
            console.error('Error generating recipe:', error);
            throw error;
        }
    }

    async generateIngredientsAndInstructions(recipeName, recipeDescription) {
        try {
            const result = await backendClient.generateIngredientsAndInstructions(recipeName, recipeDescription);
            return result;
        } catch (error) {
            console.error('Error generating ingredients and instructions:', error);
            throw error;
        }
    }

    async fetchRecipes() {
        try {
            const recipes = await backendClient.fetchRecipes();
            return recipes;
        } catch (error) {
            console.error('Error fetching recipes:', error);
            throw error;
        }
    }
}

export const recipeGenerationService = new RecipeGenerationService();
