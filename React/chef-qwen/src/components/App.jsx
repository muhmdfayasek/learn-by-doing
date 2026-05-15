import { useRef, useState } from "react";
import Ingredients from "./ingredients";
import { getRecipeFromMistral } from "../ai";
import Recipe from "./recipe";
import Loader from "./loader";
import { useEffect } from "react";

function App() {
  const [ingredients, setIngredients] = useState(["chicken","all the main spices","corn","heavy cream","pasta"]);
  const [recipe, setRecipe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recipeSection = useRef(null);

  useEffect(() => {
    if (recipe !== '' && recipeSection !== null){
      recipeSection.current.scrollIntoView();
    }
  }, [recipe]);

  async function getRecipe() {

    setRecipe(false);
    setIsLoading(true);

    try{
      const recipeMarkdown = await getRecipeFromMistral(ingredients);
      // console.log(recipeMarkdown);
      setRecipe(recipeMarkdown);
    } finally{
      setIsLoading(false);
    }

  }

  const addIngredient = (formData) => {
    const newIngredient = formData.get("ingredient");

    if (!newIngredient) {
      alert("Empty");
    } else {
      setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
      // console.log(ingredients);
    }
  };

  return (
    <main>
      <form action={addIngredient} className="add-ingredient-form">
        <input
          type="text"
          placeholder="something..."
          aria-label="Add ingredient"
          name="ingredient"
        />
        <button>Add ingredient</button>
      </form>

      {ingredients.length > 0 && 
        <Ingredients 
          ref={recipeSection}
          ingredients={ingredients}
          toggleRecipeShown={getRecipe}
          isLoading={isLoading}
        />}
      {isLoading && <Loader />}
      {recipe && <Recipe recipe={recipe}/>}
    </main>
  );
}

export default App;
