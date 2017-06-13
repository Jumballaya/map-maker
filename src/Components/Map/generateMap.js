/**
 * Make a 100 x 100 map
 *
 * Format:
 * Array of object representing rows and the cells inside the rows
 *
 * Game: [ row, row, row ]
 * Row: { id: ROW_ID, cells: [ cell, cell, cell ] }
 * Cell: { id: CELL_ID, type: TERRAIN_TYPE }
 *
 *
 * Terrain Types:
 *   - Forest
 *   - Land
 *   - Water
 */

const FOREST = 'forest';
const LAND = 'land';
const WATER = 'water';
const LAVA = 'lava';

const BASE_TERRAIN = [
  LAND,
  WATER,
];

const HELL_TERRAIN = [
  LAND,
  LAVA,
];


/**
 * Random Terrain Generator
 *
 * @description This returns a random type from the array of types you give it
 * @param {Array} types, array of tile types
 * @return {String} random type
 */
const randType = types => types[Math.floor(Math.random() * types.length)];

/**
 * Create Cell
 *
 * @param {String} id, unique id of the cell
 * @param {String} type, terrain type
 * @return {Object} cell, cell object
 */
const createCell = (id, type) => ({ id, type });

/**
 * Create Row
 *
 * @param {String} id, unique id of the row
 * @param {Array} cells, array of cell objects
 * @return {Object} row, row object
 */
const createRow = (id, cells) => ({ id, cells });



/**
 *                       *
 *       Filters         *
 *       Filters         *
 *       Filters         *
 *                       *
 */

/**
 * Cave Generation Filter
 *
 * @description Return a tile type based on the neighbors and the base rules
 * @param {String} type, tile type
 * @param {Array} neighbors, array of the tile's neighbors
 * @return {String} tile type
 */
const caveGenerationFilter = (type, neighbors) => {
  const isWater = type === WATER;
  const isLand = type === LAND;
  const testIsWater = neighbors.filter(n => n.type === WATER).length > 3;
  const testLandToWater = neighbors.filter(n => n.type === WATER).length > 4;
  if (isWater && testIsWater) {
    return WATER;
  } if (isLand && testLandToWater) {
    return WATER;
  } if (!isLand && !testLandToWater) {
    return LAND;
  }
  return type;
};

/**
 * Lava Filter
 *
 * @description Return a tile type based on the neighbors and the base rules
 * @param {String} type, tile type
 * @param {Array} neighbors, array of the tile's neighbors
 * @return {String} tile type
 */
const lavaFilter = (type, neighbors) => {
  const isLava = type === LAVA;
  const isLand = type === LAND;
  const testIsLava = neighbors.filter(n => n.type === LAVA).length > 3;
  const testLandToLava = neighbors.filter(n => n.type === LAVA).length > 4;
  if (isLava && testIsLava) {
    return LAVA;
  } if (isLand && testLandToLava) {
    return LAVA;
  } if (!isLand && !testLandToLava) {
    return LAND;
  }
  return type;
};

/**
 * Forest Filter
 *
 * @description Apply forest tiles over the thicker parts of the land
 * @param {String} type, tile type
 * @param {Array} neighbors, array of the tile's neighbors
 * @return {String} tile type
 */
const forestFilter = (type, neighbors) => {
  const isLand = type === LAND;
  const forestTest = neighbors.filter(n => n.type === LAND).length >= 8;
  if (isLand && forestTest) return FOREST;
  return type;
}

/**
 * Apply Cave Generation Filter
 *
 * @decription Apply the cellular automata like rules to the map
 * @param {Object} map, map object
 * @param {Number} count, number of times to apply filter
 * @return {Object} filtered map
 */
const applyForestFilter = map => {
  const { rows } = map;
  const newRows = rows.map(row => {
    const newCells = row.cells.map(cell => {
      // Get the neighbors of cell
      const neighbors = getNeighbors(cell.id, map);
      // Cave Generation tile filter
      const newType = forestFilter(cell.type, neighbors);
      return createCell(cell.id, newType);
    });
    return createRow(row.id, newCells);
  });
  const newMap = {
    rows: newRows,
    height: map.height,
    width: map.width,
  };
  return newMap;
}


/**
 * Apply Cave Generation Filter
 *
 * @decription Apply the cellular automata like rules to the map
 * @param {Object} map, map object
 * @param {Number} count, number of times to apply filter
 * @return {Object} filtered map
 */
const applyCaveGenerationFilter = (map, count) => {
  if (count <= 0) return map;
  const { rows } = map;
  const newRows = rows.map(row => {
    const newCells = row.cells.map(cell => {
      // Get the neighbors of cell
      const neighbors = getNeighbors(cell.id, map);
      // Cave Generation tile filter
      const newType = caveGenerationFilter(cell.type, neighbors);
      return createCell(cell.id, newType);
    });
    return createRow(row.id, newCells);
  });
  const newMap = {
    rows: newRows,
    height: map.height,
    width: map.width,
  };
  return applyCaveGenerationFilter(newMap, count - 1);
}


/**
 * Apply Lava Filter
 *
 * @decription Apply the lava rules to the map
 * @param {Object} map, map object
 * @param {Number} count, number of times to apply filter
 * @return {Object} filtered map
 */
const applyLavaFilter = (map, count = 0) => {
  if (count <= 0) return map;
  const { rows } = map;
  const newRows = rows.map(row => {
    const newCells = row.cells.map(cell => {
      // Get the neighbors of cell
      const neighbors = getNeighbors(cell.id, map);
      // Cave Generation tile filter
      const newType = lavaFilter(cell.type, neighbors);
      return createCell(cell.id, newType);
    });
    return createRow(row.id, newCells);
  });
  const newMap = {
    rows: newRows,
    height: map.height,
    width: map.width,
  };
  return applyLavaFilter(newMap, count - 1);
}


/**
 * Get Neighbors
 *
 * @param {String} id, id of the tile you want neighbors for
 * @param {Number} height, height in tiles of the map
 * @param {Number} width, width in tiles of the map
 * @return {Array} array of valid neighbor ids
 */
const getNeighborIds = (id, height, width) => {
  const rowId = Number(id.split('-')[0]);
  const cellId = Number(id.split('-')[1]);
  const neighbors = [
    // Top Left
    {
      rowId: rowId - 1,
      cellId: cellId - 1,
    },
    // Top Middle
    {
      rowId: rowId - 1,
      cellId: cellId,
    },
    // Top Right
    {
      rowId: rowId - 1,
      cellId: cellId + 1,
    },
    // Middle Left
    {
      rowId: rowId,
      cellId: cellId - 1,
    },
    // Middle Right
    {
      rowId: rowId,
      cellId: cellId + 1,
    },
    // Bottom Left
    {
      rowId: rowId + 1,
      cellId: cellId - 1,
    },
    // Bottom Middle
    {
      rowId: rowId + 1,
      cellId: cellId,
    },
    // Bottom Right
    {
      rowId: rowId + 1,
      cellId: cellId + 1,
    },
  ];

  /* Cells that do not contain numbers under 0/0 or over height/width */
  return neighbors.filter(neighbor =>
    (neighbor.rowId >= 0 && neighbor.rowId < height)
    && (neighbor.cellId >= 0 && neighbor.cellId < width))
    .map(neighbor => `${neighbor.rowId}-${neighbor.cellId}`);
}


/**
 * Get Neighbors
 */
const getNeighbors = (id, map) => {
  const { height, width } = map;
  const neighborIds = getNeighborIds(id, height, width);
  return neighborIds.map(n => {
    const row = Number(n.split('-')[0]);
    const cell = Number(n.split('-')[1]);
    return map.rows[row].cells[cell];
  });
}


/**
 * Generate Random Map
 *
 * @param {Number} height, height of map
 * @param {Number} width, width of map
 * @return {Object} map, map object { rows, height, width }
 */
const generateRandomMap = (height, width, terrain = BASE_TERRAIN) => {
  const rows = Array(height).fill(0)
    .map((row, rowId) =>
      createRow(rowId,
        Array(width).fill(0).map((cell, cellId) =>
          createCell(`${rowId}-${cellId}`, randType(terrain))
      ))
  );
  return { rows, width, height, terrain };
}

/**
 * Create Forest Map
 *
 * @description Run map through the initial normalizing filters
 * @param {Object} map, map object
 * @return {Object} map, map object
 */
export const createForestMap = map => {
  const mapOpts = {
    height: map.height,
    width: map.width,
  };
  return applyForestFilter(applyCaveGenerationFilter(createMap(mapOpts), 8));
};

/**
 * Create Lava Map
 *
 * @description Run map through the initial normalizing filters
 * @param {Object} map, map object
 * @return {Object} map, map object
 */
export const createLavaMap = map => {
  const mapOpts = {
    height: map.height,
    width: map.width,
    terrain: HELL_TERRAIN,
  };
  return applyLavaFilter(createMap(mapOpts), 8);
};


/**
 * Create Map
 *
 * @description Create a random map from the input given
 * @param {Object} options, object containing the parameters for the map
 * @param {Number} options.height, height of the map in tiles
 * @param {Number} options.width, width of the map in tiles
 * @return {Object} map object after going through the filters
 */
const createMap = (options) => {
  const { height, width, terrain } = options;
  const randomMap = generateRandomMap(height, width, terrain);
  return randomMap;
}

export default createMap;
