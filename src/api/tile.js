const router = require('express-async-router').AsyncRouter();
const db_query = require('../util/db_query');

router.get('/', async (req, res) => {
  const {
    collections,
    x,
    y,
    z,
  } = req.query;

  const required_features = JSON.parse(collections).reduce((acc, collection) => {
    const coll = collection.split('-')[0];
    const category = coll == 'admterr' ? '\'admtype\'' :
                    coll == 'land' ? '\'landcategory_id\'' :
                    '\'category\'';
    return acc += `(coll = '${coll}' ${collection.split('-').length == 2 ? 'and doc->>'+ category +' = \'' + collection.split('-')[1] + '\')' : ')'} or `;
  }, '');

  const sql = `with feature_cte as (
    select id, doc, coll, st_asmvtgeom(st_transform(geom, 3857), tilebbox($1, $2, $3, 3857), 4096, 64, true) as mvtgeom
      from feature
      where geom && tilebbox($1, $2, $3, 4326)
      and (${required_features.slice(0, -4)})
      order by st_area(geom::box2d) desc
      limit 600
    )
    select st_asmvt(feature_cte, 'features', 4096, 'mvtgeom') tile
    from feature_cte
  `;
  
  const [{ tile }] = await db_query(sql, [z, x, y]);

  return res.send(tile);
});

module.exports = router;
