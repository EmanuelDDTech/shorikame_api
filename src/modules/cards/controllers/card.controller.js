import TCGdex from '@tcgdex/sdk';
import { getSeriesAction, getSetByIdAction, getSetsBySeriesIdAction, getCardByIdAction } from '../actions/index.js';

const tcgdex = new TCGdex('en');

const getSeries = async (req, res) => {
  const { page = 1, itemsPerPage = 10 } = req.query;

  try {
    const series = await getSeriesAction({
      'sort:field': 'releaseDate',
      'sort:order': 'DESC',
      'pagination:page': page,
      'pagination:itemsPerPage': itemsPerPage,
      name: 'notlike:Pocket',
      logo: 'notnull:',
    });

    const formattedSeries = series.map((s) => ({
      id: s.id,
      name: s.name,
      logo: `${s.logo}.webp`,
    }));

    res.json(formattedSeries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSetsBySeriesId = async (req, res) => {
  const { seriesId } = req.params;
  const { page = 1, itemsPerPage = 10 } = req.query;

  try {
    const setsData = await getSetsBySeriesIdAction(seriesId, {
      'sort:field': 'releaseDate',
      'sort:order': 'DESC',
      'pagination:page': page,
      'pagination:itemsPerPage': itemsPerPage,
    });

    setsData.logo = `${setsData.logo}.webp`;

    setsData.sets = setsData.sets.reverse().map((set) => ({
      ...set,
      logo: `${set.logo}.webp`,
      symbol: `${set.symbol}.webp`,
    }));

    res.json(setsData);
  } catch (error) {
    console.log('Error fetching sets by series ID:', error);
    res.status(500).json({ error: error.message });
  }
};

const getSets = async (req, res) => {
  const { seriesId } = req.params;
  const { page = 1, itemsPerPage = 10 } = req.query;

  try {
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSetById = async (req, res) => {
  const { setId } = req.params;

  try {
    const setData = await getSetByIdAction(setId);

    setData.logo = `${setData.logo}.webp`;
    setData.cards = setData.cards.map((card) => ({
      ...card,
      image: `${card.image}/low.webp`,
    }));

    res.json(setData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCardById = async (req, res) => {
  const { cardId } = req.params;

  try {
    const cardData = await getCardByIdAction(cardId);

    cardData.image = `${cardData.image}/high.webp`;

    res.json(cardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getSeries, getSetsBySeriesId, getSetById, getSets, getCardById };
