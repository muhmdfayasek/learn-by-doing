import Markdown from 'react-markdown'

function Recipe(props) {
  return (
    <section>
      <h2>Chef Qwen Recommends:</h2>
      <article className="suggested-recipe-container" aria-live="polite">
        <Markdown>{props.recipe}</Markdown>
      </article>
    </section>
  );
}

export default Recipe;
