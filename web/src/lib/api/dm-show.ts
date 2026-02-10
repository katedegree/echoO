import { fetchApi } from "@/utils";
import { QueryResponse } from "../query-response";

export interface DmShowRequest {
  limit: number;
  cursor: string | null;
}

export type DmShowResponse = {
  id: number;
  content: string;
  media: string[];
  isMe: boolean;
}[];

type DmShowPageData = QueryResponse<DmShowResponse, { cursor: string | null }>;

export function dmShow(userId: number) {
  return {
    key: ["dm", userId] as const,
    infiniteKey:
      (_pageIndex: number, previousPageData: DmShowPageData | null) => {
        if (previousPageData && !previousPageData.data.length) return null;
        const cursor = previousPageData?.cursor ?? null;
        return ["dm", userId, cursor] as const;
      },
    fetcher: (req: DmShowRequest): Promise<DmShowPageData> =>
      fetchApi("GET", `/dm/${userId}`, req),
  };
}
