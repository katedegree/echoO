import { ToastType } from "@/components/toast/toast";
import { addKateFormToast } from "@kateform/utils";

export function addToast(type: ToastType, message: string) {
  return addKateFormToast(type, message);
}
