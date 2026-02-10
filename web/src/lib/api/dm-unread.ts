import { fetchApi } from "@/utils";
import { QueryResponse } from "../query-response";

export type DmUnreadResponse = Record<string, number>;

export function dmUnread() {
  return {
    key: ["dm", "unread"] as const,
    fetcher: (): Promise<QueryResponse<DmUnreadResponse>> =>
      fetchApi("GET", "/dm/unread"),
  };
}
