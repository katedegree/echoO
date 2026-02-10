import { fetchApi } from "@/utils";
import { QueryResponse } from "../query-response";

export interface WnIsRainRequest {
  lat: number;
  lng: number;
}

export type WnIsRainResponse = {
  isRain: boolean;
  isPosted: boolean;
};

export function wnIsRain() {
  return {
    fetcher: (req: WnIsRainRequest): Promise<QueryResponse<WnIsRainResponse>> =>
      fetchApi("GET", "/wn/israin", req),
  };
}
