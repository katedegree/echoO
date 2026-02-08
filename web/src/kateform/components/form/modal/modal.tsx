export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number;
}

export function Modal({ isOpen, onClose, children, zIndex = 50 }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
    >
      <div className="absolute inset-0 bg-label opacity-20" onClick={onClose} />
      <div className="absolute">{children}</div>
    </div>
  );
}
