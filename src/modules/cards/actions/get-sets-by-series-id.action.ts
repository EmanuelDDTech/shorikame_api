import { tcgdexApi } from '#src/api/tcgdexApi';

export const getSetsBySeriesIdAction = async (seriesId: string, filters = {}) => {
  const { data } = await tcgdexApi.get(`/series/${seriesId}`, { params: filters });

  return data;
};
