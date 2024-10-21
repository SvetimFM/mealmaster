import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { recipeGenerationService } from '../../services/RecipeGenerationService'


const RecipeDetail = ({ recipe, onBack }) => {
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchIngredientsAndInstructions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await recipeGenerationService.generateIngredientsAndInstructions(recipe.name, recipe.description); // TODO: retrieve from the DDB
        setIngredients(result.ingredients); // TODO: IngredientList should be its own component
        setInstructions(result.instructions); // TODO: Instructions should be its own component
      } catch (error) {
        console.error('Error fetching ingredients and instructions:', error);
        setError('Failed to load ingredients and instructions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredientsAndInstructions();
  }, [recipe.name, recipe.description]);


  const handleAddToCart = () => {
    window.open('https://www.amazon.com/alm/storefront?almBrandId=QW1hem9uIEZyZXNo', '_blank', 'noopener,noreferrer');
  };


  return (
    <div className="recipe-detail">
      <button onClick={onBack} aria-label="Back to Recipes">Back to Recipes</button>
      <h2>{recipe.name}</h2>
      <p>Cook time: {recipe.cookTime}</p>
      <h3>Description</h3>
      <p>{recipe.description}</p>
      {isLoading ? (
        <p>Loading ingredients and instructions...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <h3>Ingredients</h3>
          <ReactMarkdown className="ingredients-list">{ingredients}</ReactMarkdown>
          <h3>Instructions</h3>
          <ReactMarkdown className="instructions-list">{instructions}</ReactMarkdown>
        </>
      )}
      <button className="add-to-cart" onClick={handleAddToCart} aria-label="Add Ingredients to Cart">
        Add Ingredients to Cart
      </button>
    </div>
  );
};


RecipeDetail.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    cookTime: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};


export default RecipeDetail;