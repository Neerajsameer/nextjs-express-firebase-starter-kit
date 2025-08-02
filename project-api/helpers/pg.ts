import * as pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

pg.types.setTypeParser(20, parseInt);
export const pgClient = new pg.Pool({
  connectionString: DATABASE_URL,
});
