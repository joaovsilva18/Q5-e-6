declare interface PGClient {
  query: import("pg").PoolClient["query"];
}
