import { tcgdexApi } from '#src/api/tcgdexApi.js';

export const getSeriesAction = async (filters = {}) => {
  const { data } = await tcgdexApi.get('/series', { params: filters });

  return data;
};
