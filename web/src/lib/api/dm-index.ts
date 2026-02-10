import { fetchApi } from "@/utils";
import { QueryResponse } from "../query-response";

export type DmIndexResponse = {
  id: number;
  content: string; // 最新のメッセージ
  user: {
    id: number;
    name: string;
    iconUrl: string | null;
  };
  unreadCount: number;
}[];

export function dmIndex() {
  return {
    key: ["dm"] as const,
    fetcher: (): Promise<QueryResponse<DmIndexResponse>> =>
      fetchApi("GET", "/dm"),
  };
}
