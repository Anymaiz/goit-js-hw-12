const APIKey = '48573229-d00ec4466a1952407b35369c3';
const URLBase = 'https://pixabay.com/api/';

export async function fetchPhotos(query, page = 1) {
  const url = `${URLBase}?key=${APIKey}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=15`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Sorry, there was an error loading. Please try again!');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
