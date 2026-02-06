import { MUTATION_STATUS } from "@/constants";

export type MutationResponse<T extends object = object> =
  | (T & {
      status: typeof MUTATION_STATUS.SUCCESS;
      message: string;
    })
  | { status: typeof MUTATION_STATUS.ERROR; message: string }
  | {
      status: typeof MUTATION_STATUS.VALIDATION;
      fieldErrors: Record<string, string>;
    };
