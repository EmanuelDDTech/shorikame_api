import { tcgdexApi } from '#src/api/tcgdexApi.js';

export const getSetsBySeriesIdAction = async (seriesId, filters = {}) => {
  const { data } = await tcgdexApi.get(`/series/${seriesId}`, { params: filters });

  return data;
};
