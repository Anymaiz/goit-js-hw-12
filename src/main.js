import SimpleLightbox from 'simplelightbox';
import iziToast from 'izitoast';


import { fetchPhotos } from './js/pixabay-api.js';

import {
    createGallery,
    renderLoadMoreBtn,
    addGallery,
    clearGallery,
  } from './js/render-functions.js';

import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
  
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#search-form');
    const input = form.querySelector('input');

    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Load more';
    loadMoreBtn.classList.add('load-more', 'hidden');

    document.querySelector('div').appendChild(loadMoreBtn);
  
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const query = input.value.trim();
  
      if (!query) {
        iziToast.error({
          title: 'Error',
          message: 'Please enter your request.',
        });
        clearGallery();
        renderLoadMoreBtn(false);
        return;
      }
  
      currentQuery = query;
      currentPage = 1;

      document.querySelector('.loader').classList.remove('hidden');

      try {
        const images = await fetchPhotos(currentQuery, currentPage);
        totalHits = images.totalHits;
        clearGallery();
  
        if (images.hits.length === 0) {
          iziToast.info({
            title: 'No Results',
            message: 'Sorry, your request is incorrect. Please try again!',
          });
          renderLoadMoreBtn(false);
        } else {
          createGallery(images.hits);
          const lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
          });
          lightbox.refresh();
          renderLoadMoreBtn(images.hits.length === 15);
        }
      } 
      catch (error) {
        iziToast.error({ 
            title: 'Error', 
            message: 'Sorry, there was an error. Please try again!' });
      } 
      finally {
        document.querySelector('.loader').classList.add('hidden');
      }
    });
  
    function smoothscroll() {
      const gallery = document.querySelector('.gallery');
      const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    
      window.scrollBy({
        top: cardHeight * 4,
        behavior: 'smooth',
      });
    }

    loadMoreBtn.addEventListener('click', async () => {
      currentPage += 1;
      document.querySelector('.loader').classList.remove('hidden');
      try {
        const images = await fetchPhotos(currentQuery, currentPage);
        addGallery(images.hits);
        lightbox.refresh();
        smoothscroll();
  
        if (currentPage * 15 >= totalHits || images.hits.length < 15) {
          renderLoadMoreBtn(false);
          iziToast.info({
            title: 'End of results',
            message: "We're sorry, but you've reached the end of search results.",
          });
        }
      } catch (error) {
        iziToast.error({ 
            title: 'Error', 
            message: 'An error occurred: the image could not be loaded. Please try again!' });
      } finally {
        document.querySelector('.loader').classList.add('hidden');
      }
    });
  });