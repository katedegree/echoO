import { accessToken } from "@/utils/access-token";
import { MutationResponse } from "../mutation-response";

export interface MediaStoreRequest {
  media: File;
}

export function mediaStore(req: MediaStoreRequest) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/media`;
  const token = accessToken.get();

  const form = new FormData();
  form.append("media", req.media);

  return {
    fetcher: (): Promise<
      MutationResponse<{ mediaId: number; mediaUrl: string }>
    > =>
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      }).then((res) => res.json()),
  };
}
