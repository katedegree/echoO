export type QueryResponse<T extends object = {}, Extra extends object = {}> = {
  data: T;
} & Extra;
