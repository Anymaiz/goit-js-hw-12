import SimpleLightbox from 'simplelightbox';
import iziToast from 'izitoast';

import { fetchPhoto } from './js/pixabay-api';
import { createImageCard } from './js/render-functions';

const searchFormEl = document.querySelector('.js-form');
const galleryEl = document.querySelector('.js-gallery');
const loadMoreBtn = document.querySelector('.js-load-more-btn');

let searchedQuery = ''; 
let page = 1;
const perPage = 15;

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

const onSearchFormSubmit = async event => {
    try {
      event.preventDefault();
  
const inputQuery = event.currentTarget.elements.searchQuery.value.trim();
  
    if (inputQuery === '') {
        iziToast.error({
          title: 'Error',
          message: `Please enter your request`,
        });
  
        return;
      }
    if (inputQuery !== searchedQuery) {
        searchedQuery = inputQuery;
        page = 1; 
        galleryEl.innerHTML = '';
        loadMoreBtn.classList.add(`hidden`);
      }

    const response = await fetchPhoto(searchedQuery, page);

    if (response.data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: `Sorry, your request is incorrect. Please try again!`,
      });

      return;
    }
    renderGallery(response.data.hits);
    iziToast.success({
      title: 'Success',
      message: `Found ${response.data.totalHits} images!`,
    });

    if (response.data.totalHits > perPage) {
      loadMoreBtn.classList.remove(`hidden`);
    }
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Sorry, there was an error. Please try again!',
    });
    console.log(err);
  }
};

const loadMoreBtnClick = async () => {
    try {
      page += 1; 
      loadMoreBtn.classList.add(`hidden`);
  
      const response = await fetchPhoto(searchedQuery, page);

      if (response.data.hits.length === 0) {
        iziToast.info({
          title: 'End',
          message: `We're sorry, but you've reached the end of search results.`,
        });
        loadMoreBtn.classList.add(`hidden`); 
        return;
      }
  
      renderGallery(response.data.hits);
  
      if (page * perPage >= response.data.totalHits) {
        iziToast.info({
          title: 'End',
          message: `We're sorry, but you've reached the end of search results.`,
        });
        loadMoreBtn.classList.add(`hidden`);
      } else {
        loadMoreBtn.classList.remove(`hidden`);
      }
  
      const { height: cardHeight } =
        galleryEl.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    } catch (err) {
      iziToast.error({
        title: 'Error',
        message: `An error occurred: the image could not be loaded. Please try again!`,
      });
      console.error(err);
    }
  };
  
  const renderGallery = images => {
    const galleryTemplate = images.map(createImageCard).join('');
    galleryEl.insertAdjacentHTML('beforeend', galleryTemplate);
    lightbox.refresh();
  };
  
  searchFormEl.addEventListener('submit', onSearchFormSubmit);
  loadMoreBtn.addEventListener('click', loadMoreBtnClick);
  