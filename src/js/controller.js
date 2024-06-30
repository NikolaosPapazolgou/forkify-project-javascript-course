
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js'
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import bookmarksView from './views/bookmarksView.js';

if (module.hot) {
  module.hot.accept();
}


const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    //Rendering the loading spinner
    recipeView.renderSpinner();
    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1)Loading recipe
    await model.loadRecipe(id);
    //2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();

  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load search results 
    await model.loadSearchResults(query);
    //3)Render results
    resultsView.render(model.getSearchResultsPage());
    //4) Render  the initial pagination buttons 
    paginationView.render(model.state.search);


  } catch (err) {
    console.log(err);

  }
}
const controlPagination = function (page) {

  resultsView.renderSpinner();
  //1)Render the coresponding page
  resultsView.render(model.getSearchResultsPage(page));
  //2)Render the pagination buttons depending on the current state of the page
  paginationView.render(model.state.search);



}
const controlServings = function (newServings) {

  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the view 
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}
const controlAddBookmark = function () {
  // Add/Remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);

  }
  else {
    model.deleteBookmark(model.state.recipe.id);

  }
  //Update recipeView
  recipeView.update(model.state.recipe);
  //Render bokmarks
  bookmarksView.render(model.state.bookmarks);

}
const controllBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show lodaing spinner
    addRecipeView.renderSpinner();
    //Upload recipe data
    await model.uploadRecipe(newRecipe);
    //Render recipe 
    recipeView.render(model.state.recipe);
    //Success message 
    addRecipeView.renderMessage();
    //Render bookmarkview
    bookmarksView.render(model.state.bookmarks);
    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close form window 
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('💥💥💥', err);
    addRecipeView.renderError(err.message);
  }
}
const init = function () {
  bookmarksView.addHandlerRender(controllBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmarks(controlAddBookmark);
  paginationView._addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();




