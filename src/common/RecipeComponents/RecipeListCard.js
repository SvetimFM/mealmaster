import React from 'react';
import PropTypes from 'prop-types';
import {
    truncateDescription
} from '../utils/RenderingUtils';


const WORD_LIMIT = 20;


const RecipeCard = ({ recipe, onSelect }) => {
    const { name, cookTime, description } = recipe;

    return (
        <div className="recipe-card">
            <h3>{name}</h3>
            <p>Cook time: {cookTime}</p>
            <p>{truncateDescription(description, WORD_LIMIT)}</p>
            <button onClick={() => onSelect(recipe)} aria-label={`View details for ${name}`}>
                View Details
            </button>
        </div>
    );
};


RecipeCard.propTypes = {
    recipe: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        cookTime: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
};


export default RecipeCard;