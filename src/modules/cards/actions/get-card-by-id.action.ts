import { tcgdexApi } from '#src/api/tcgdexApi';

export const getCardByIdAction = async (cardId: string) => {
  const { data } = await tcgdexApi.get(`/cards/${cardId}`);

  return data;
};
