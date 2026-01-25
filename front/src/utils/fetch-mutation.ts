import { MUTATION_STATUS } from "@/constants";
import { accessToken } from "@/utils/access-token";

export type MutationResponse<T extends object = {}> =
  | (T & {
      status: typeof MUTATION_STATUS.SUCCESS;
      message: string;
    })
  | { status: typeof MUTATION_STATUS.ERROR; message: string }
  | {
      status: typeof MUTATION_STATUS.VALIDATION;
      fieldErrors: Record<string, string>;
    };

export function fetchMutation<
  TReq extends object = {},
  TRes extends object = {},
>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  req: TReq,
): Promise<MutationResponse<TRes>> {
  let url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const token = accessToken.get();
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  };

  if (method === "DELETE") {
    options.body = undefined;
    const query = new URLSearchParams(req as Record<string, any>).toString();
    if (query) url += `?${query}`;
  }

  return fetch(url, options).then((res) => res.json());
}
