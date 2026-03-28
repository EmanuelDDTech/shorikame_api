import axios from 'axios';

const tcgdexApi = axios.create({
  baseURL: 'https://api.tcgdex.net/v2/en',
});

export { tcgdexApi };
