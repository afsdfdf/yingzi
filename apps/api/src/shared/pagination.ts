import type { PageQuery } from "./types.js";

export function paginate<T>(items: T[], query: PageQuery) {
  const page = query.page && query.page > 0 ? query.page : 1;
  const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
  const start = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    total: items.length,
    items: items.slice(start, start + pageSize)
  };
}
