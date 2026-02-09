import { useWnStore } from "@/stores/use-wn-store";
import { fetchApi } from "@/utils";

export interface IsRainRequest {
  lat: number;
  lng: number;
}

export function isRain() {
  return {
    key: ["is-rain"],
    fetcher: (req: IsRainRequest) => {
      return fetchApi("GET", "/israin", req).then((res: boolean) => {
        useWnStore.getState().setIsRain(res);
        return res;
      });
    },
  };
}
