import { sequelize } from '#src/database/database.js';

const getProducts = async (req, res) => {
  const { existence, minPrice, maxPrice, page = 1, limit = 10, ...filters } = req.query;
  let query = ` SELECT DISTINCT 
                A.id AS id, 
                A.name AS name,
                A.sku AS sku,
                A.slug AS slug,
                A.price AS price,
                A.stock AS stock,
                A.stock_visible AS stock_visible,
                B.url AS url,
                B.product_id AS product_id,
                C.campaign_price AS discount
                FROM public.products AS A
	              INNER JOIN public.product_galleries AS B ON B.product_id = A.id
                LEFT JOIN public.campaign_products AS C ON C.product_id = A.id
                WHERE B.order = 1 
                AND A.active = true `;

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

  query += ` ORDER BY A.id ASC
            LIMIT ${limit} OFFSET ${(page - 1) * limit}; `;

  try {
    const products = await sequelize.query(query);

    const data = {
      data: products[0],
      nextPage: products[0].length === Number(limit) ? Number(page) + 1 : null,
      hasNextPage: products[0].length === Number(limit),
    };

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { getProducts };
