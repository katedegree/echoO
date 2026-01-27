import { fetchMutation } from "../fetch-mutation";

export interface PostLikeResponse {
  id: number;
  user: {
    id: number;
    name: string;
    iconUrl: string | null;
  };
}

export function postLike(postId: number) {
  return {
    fetcher: () =>
      fetchMutation<{}, PostLikeResponse>("POST", `/posts/${postId}/like`),
  };
}
