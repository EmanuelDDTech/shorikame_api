import { sequelize } from '../database/database.js';

const getProducts = async (req, res) => {
  const { existence, minPrice, maxPrice, ...filters } = req.query;
  let query = ` SELECT DISTINCT 
                A.id AS id, 
                A.name AS name,
                A.sku AS sku,
                A.slug AS slug,
                A.price AS price,
                A.stock AS stock,
                B.url AS url,
                B.product_id AS product_id
                FROM public.products AS A
	              INNER JOIN public.product_galleries AS B ON B.product_id = A.id
                WHERE B.order = 1 `;

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '') {
      let valueString = '';

      if (Array.isArray(value)) {
        valueString = value.map((filterValue) => `'${filterValue}'`).join(', ');
      } else {
        valueString = `'${value}'`;
      }

      query += ` AND A.id IN (SELECT "productId" FROM public.filter_value_products AS D 
                  INNER JOIN public.filter_values AS E ON E.id = D."filterValueId"
                  INNER JOIN public.filter_groups AS F ON F.id = E."filterGroupId"
                  WHERE F.slug = '${key}'
                  AND E.slug IN (${valueString})
                ) `;
    }
  });

  if (existence) {
    query += ` AND A.stock > 0 `;
  }

  if (minPrice && maxPrice) {
    query += ` AND A.price >= '${minPrice}' AND A.price <= '${maxPrice}' `;
  }

  query += ` ORDER BY A.id ASC; `;

  try {
    const products = await sequelize.query(query);

    return res.json(products[0]);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { getProducts };
