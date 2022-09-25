import './scss/main.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ImgApiService from './img-service';

const refs = {
  searchForm: document.querySelector('#search-form'),
  divEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let isShown = 0;

const GalleryEl = new ImgApiService();
refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onFormSubmit(e) {
  e.preventDefault();

  GalleryEl.query = e.target.elements.searchQuery.value.trim();
  isShown = 0;
  refs.divEl.innerHTML = '';
  GalleryEl.resetPage();
  fetchGallery();
}

function onLoadMore() {
  GalleryEl.incrementPage();
  fetchGallery();
}

async function fetchGallery() {
  refs.loadMoreBtn.classList.add('is-hidden');

  const response = await GalleryEl.fetchGallery();
  const { hits, total } = response;

  if (!hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  renderGallery(hits);

  isShown += hits.length;

  if (isShown < total) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }
  if (isShown >= total) {
    Notiflix.Notify.info(
      'We re sorry, but you have reached the end of search results.'
    );
  }
}

function renderGallery(elements) {
  console.log(elements);
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
          <a class="card" href="${largeImageURL}">
                <div class="card__container">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="card__info">
                        <p class="card__info-item">
                            <b>Likes</b>
                             <span class="card__item-count">${likes}</span>
                        </p>
                        <p class="card__info-item">
                            <b>Views</b>
                             <span class="card__item-count">${views}</span>
                        </p>
                        <p class="card__info-item">
                            <b>Comments</b>
                             <span class="card__item-count">${comments}</span>
                        </p>
                        <p class="card__info-item">
                            <b>Downloads</b>
                             <span class="card__item-count">${downloads}</span>
                        </p>
                    </div>
                </div>
            </a>`;
      }
    )
    .join('');

  refs.divEl.insertAdjacentHTML('beforeend', markup);
  const simpleLightbox = new SimpleLightbox('.gallery a');
}
