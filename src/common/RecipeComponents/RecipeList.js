import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import RecipeCard from './RecipeListCard';

const Loader = () => <h4>Loading...</h4>;
const EndMessage = () => <p>No more recipes to load.</p>;

const RecipeList = ({ recipes, onSelectRecipe, onLoadMore, hasMore, isLoading }) => {
    return (
        <InfiniteScroll
            dataLength={recipes.length}
            next={onLoadMore}
            hasMore={hasMore}
            loader={<Loader />}
            endMessage={<EndMessage />}
        >
            <div className="recipe-grid">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onSelect={() => onSelectRecipe(recipe)}
                    />
                ))}
            </div>
        </InfiniteScroll>
    );
};

RecipeList.propTypes = {
    recipes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        cookTime: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    })).isRequired,
    onSelectRecipe: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
};

export default RecipeList;