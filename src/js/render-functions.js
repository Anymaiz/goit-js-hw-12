export function createImageCard({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  }) {
    return `
        <a href="${largeImageURL}" class="gallery-item">
            <img src="${webformatURL}" alt="${tags}" class="gallery-image" />
            <div class="info">
                <p class="text-image"><b>Likes:</b> ${likes}</p>
                <p class="text-image"><b>Views:</b> ${views}</p>
                <p class="text-image"><b>Comments:</b> ${comments}</p>
                <p class="text-image"><b>Downloads:</b> ${downloads}</p>
            </div>
        </a>
    `;
  }