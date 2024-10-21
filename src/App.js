import React from 'react';
import './styles/App.css';
import BrowseRecipesPage from './pages/BrowseRecipesPage/BrowseRecipesPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Meal Me Up</h1>
      </header>
      <BrowseRecipesPage />
    </div>
  );
}

export default App;