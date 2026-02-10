import { useMediaModalStore } from "@/stores/use-media-modal-store";
import { Modal } from "@kateform/components";
import Image from "next/image";
import { Icon } from "../icon/icon";

export function MediaModal() {
  const { urls, index, close, next, prev } = useMediaModalStore();

  const isFirst = index === 0;
  const isLast = index === urls.length - 1;

  return (
    <Modal zIndex={60} isOpen={urls.length > 0} onClose={close}>
      <div className="relative bg-main p-lg rounded-base w-[320px]">
        <Image src={urls[index] || ""} alt="media" width={600} height={600} />

        {!isFirst && (
          <button
            className="absolute p-lg left-0 top-1/2 -translate-y-1/2 bg-main/50 rounded-full -ml-xl"
            onClick={prev}
          >
            <Icon name="left" />
          </button>
        )}

        {!isLast && (
          <button
            className="absolute p-lg right-0 top-1/2 -translate-y-1/2 bg-main/50 rounded-full -mr-xl"
            onClick={next}
          >
            <Icon name="right" />
          </button>
        )}
      </div>
    </Modal>
  );
}
