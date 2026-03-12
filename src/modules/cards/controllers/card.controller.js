import TCGdex from '@tcgdex/sdk';
import { getSeriesAction } from '../actions/get-series.action.js';

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

    res.json(series);
  } catch (error) {
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

export { getSeries, getSets };
