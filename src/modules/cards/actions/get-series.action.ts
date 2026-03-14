import { tcgdexApi } from '#src/api/tcgdexApi';

export const getSeriesAction = async (filters = {}) => {
  const { data } = await tcgdexApi.get('/series', { params: filters });

  return data;
};
