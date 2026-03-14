import { tcgdexApi } from '#src/api/tcgdexApi';

export const getSetByIdAction = async (setId: string) => {
  const { data } = await tcgdexApi.get(`/sets/${setId}`);
  return data;
};
