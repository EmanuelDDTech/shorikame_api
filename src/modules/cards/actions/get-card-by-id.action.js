import { tcgdexApi } from '#src/api/tcgdexApi.js';

export const getCardByIdAction = async (cardId) => {
  const { data } = await tcgdexApi.get(`/cards/${cardId}`);

  return data;
};
