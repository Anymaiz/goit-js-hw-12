import axios from 'axios';


export const fetchPhoto = (searchedQuery, currentPage) => {
  const axiosOptions = {
    params: {
      key: `48573229-d00ec4466a1952407b35369c3`,
      q: searchedQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: currentPage,
      per_page: 15,
    },
  };

  return axios.get(`https://pixabay.com/api/`, axiosOptions);
};