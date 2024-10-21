import React, { useState, useEffect, useCallback } from 'react';
import { recipeGenerationService } from '../../services/RecipeGenerationService';
import RecipeList from '../../common/RecipeComponents/RecipeList';
import RecipeDetail from '../../common/RecipeComponents/RecipeDetailCard';
import { generateRandomId } from '../../dev_backend/utils';

const BrowseRecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);

    const fetchRecipes = useCallback(async () => {
        if (isLoading || recipes.length >= 30) return;
        setIsLoading(true);
        try {
            const newRecipes = await Promise.all(
                Array(6).fill().map(() => recipeGenerationService.generateRecipe())
            );
            setRecipes(prevRecipes => {
                const updatedRecipes = [
                    ...prevRecipes,
                    ...newRecipes.map(recipe => ({ ...recipe, id: generateRandomId() }))
                ];
                setHasMore(updatedRecipes.length < 30);
                return updatedRecipes.slice(0, 30);
            });
            setPage(prevPage => prevPage + 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, recipes.length]);

    useEffect(() => {
        if (page === 0) fetchRecipes();
    }, [fetchRecipes, page]);

    const handleSelectRecipe = (recipe) => {
        setSelectedRecipe(recipe);
    };

    const handleBackToList = () => {
        setSelectedRecipe(null);
    };

    const handleLoadMore = () => {
        fetchRecipes();
    };

    if (error) {
        return (
            <div className="error-message">
                {error}
                <button onClick={() => fetchRecipes()}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="browse-recipes-page">
            {!selectedRecipe ? (
                <RecipeList
                    recipes={recipes}
                    onSelectRecipe={handleSelectRecipe}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    isLoading={isLoading}
                />
            ) : (
                <RecipeDetail recipe={selectedRecipe} onBack={handleBackToList} />
            )}
        </div>
    );
};

export default BrowseRecipesPage;