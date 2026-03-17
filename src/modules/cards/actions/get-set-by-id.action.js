import { tcgdexApi } from '#src/api/tcgdexApi.js';

export const getSetByIdAction = async (setId) => {
  const { data } = await tcgdexApi.get(`/sets/${setId}`);
  return data;
};
