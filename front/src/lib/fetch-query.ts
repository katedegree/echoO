import { accessToken } from "@/utils/access-token";

export type QueryResponse<T extends object, Extra extends object> = {
  data: T;
} & Extra;

export function fetchQuery<
  TReq extends object = {},
  TRes extends object = {},
  Extra extends object = {},
>(path: string, req?: TReq): Promise<QueryResponse<TRes, Extra>> {
  let url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const token = accessToken.get();

  const query = new URLSearchParams(req as Record<string, any>).toString();
  if (query) url += `?${query}`;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}
