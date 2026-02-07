import { accessToken } from "@/utils/access-token";
import { MutationResponse } from "../mutation-response";

export interface MediaStoreRequest {
  media: File;
}

export function mediaStore() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/media`;
  const token = accessToken.get();

  return {
    fetcher: (
      req: MediaStoreRequest,
    ): Promise<MutationResponse<{ mediaId: number; mediaUrl: string }>> => {
      const form = new FormData();
      form.append("media", req.media);
      return fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      }).then((res) => res.json());
    },
  };
}
