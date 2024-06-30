import icons from 'url:../../img/icons.svg';
import View from "./View";
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _generateMarkup() {
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    const curPage = Number(this._data.page);
    //Page 1 : and there are other pages 
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton('next');
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton('prev');
    }
    if (curPage < numPages) {
      return `${this._generateMarkupButton('prev')} 
      ${this._generateMarkupButton('next')} `;
    }
    //Page 1) and no other pages
    return ``;


  }
  _generateMarkupButton(btnKind) {
    let curPage = Number(this._data.page);
    let iconKind = '';
    if (btnKind === 'next') {
      iconKind = 'right';
      return `
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--${btnKind}">
          <svg class="search__icon">
          <use href="${icons}#icon-arrow-${iconKind}"></use>
          </svg>
          <span>Page ${curPage + 1}</span>
        </button>`;

    }
    if (btnKind === 'prev') {
      iconKind = 'left';
      return `
      <button data-goto="${curPage - 1}" class=" btn--inline pagination__btn--${btnKind}">
          <svg class="search__icon">
          <use href="${icons}#icon-arrow-${iconKind}"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>`;

    }


  }
  _addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btnClicked = e.target.closest('.btn--inline');
      if (!btnClicked) return;
      const goToPage = btnClicked.dataset.goto;

      handler(goToPage);
    })
  }
}
export default new PaginationView();