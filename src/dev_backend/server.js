require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// For Dev Only
class AnthropicClient {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
    });
    this.defaultModel = 'claude-3-5-sonnet-20240620';
  }

  async sendMessageWithBackoff(messages, systemPrompt = '', options = {}, maxRetries = 3, baseDelay = 1000) {
    const defaultOptions = {
      model: this.defaultModel,
      max_tokens: 1000,
    };
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      messages,
      system: systemPrompt
    };

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.messages.create(mergedOptions);
        return response.content[0].text;
      } catch (error) {
        if (attempt === maxRetries) {
          console.error(`All retries failed. Last error: ${error.message}`);
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async generateWithSystemPrompt(systemPrompt, userPrompt, options = {}) {
    const messages = [
      { role: 'user', content: userPrompt }
    ];
    return this.sendMessageWithBackoff(messages, systemPrompt, options);
  }

  async generateWithConversationHistory(messages, systemPrompt = '', options = {}) {
    return this.sendMessageWithBackoff(messages, systemPrompt, options);
  }

  setDefaultModel(model) {
    this.defaultModel = model;
  }

  async testConnection() {
    return this.sendMessageWithBackoff([{ role: 'user', content: 'Hello, Claude!' }], '', { max_tokens: 100 });
  }
}

const anthropicClient = new AnthropicClient();

let recipes = [];


// API Routes
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const systemPrompt = "You are a helpful assistant that generates random recipes. Respond with a JSON object containing 'name', 'cookTime', and 'description' fields. Ensure all string values are properly escaped.";
    const userPrompt = "Generate a random recipe. Respond only with a valid JSON object.";

    const response = await anthropicClient.generateWithSystemPrompt(systemPrompt, userPrompt, { temperature: 0.7 });

    console.log('Raw API response:', response);

    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in API response');
    }

    let recipeData;
    try {
      recipeData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      throw new Error('Invalid JSON in API response');
    }

    // Validate the parsed data
    if (!recipeData.name || !recipeData.cookTime || !recipeData.description) {
      throw new Error('Missing required fields in recipe data');
    }

    // Add an id and store the recipe
    recipeData.id = Date.now().toString();
    recipes.push(recipeData);

    res.json(recipeData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: `Failed to generate recipe: ${error.message}` });
  }
});

app.post('/api/generate-ingredients-and-instructions', async (req, res) => {
  try {
    const { recipeName, recipeDescription } = req.body;
    const systemPrompt = "You are a helpful assistant that generates ingredient lists and cooking instructions for recipes.";
    const userPrompt = `Generate a short list of ingredients in a tabulated markdown format and step-by-step quick instructions for the following recipe:
      
      Recipe Name: ${recipeName}
      Description: ${recipeDescription}
      
      Please format your response as follows:
      
      ## Ingredients
      
      [Tabulated markdown list of ingredients here]
      
      ## Instructions
      
      [Numbered list of quick, step-by-step instructions here]`;

    const content = await anthropicClient.generateWithSystemPrompt(systemPrompt, userPrompt, { temperature: 0.7 });
    const [ingredients, instructions] = content.split('## Instructions');

    res.json({
      ingredients: ingredients.replace('## Ingredients', '').trim(),
      instructions: instructions.trim()
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while generating ingredients and instructions.' });
  }
});

app.post('/api/test-connection', async (req, res) => {
  try {
    const response = await anthropicClient.testConnection();
    res.json({ message: response });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while testing the connection.' });
  }
});

app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});