import {
  ChevronsLeft,
  ChevronsRight,
  CircleUserRound,
  DoorOpenIcon,
  House,
  LockKeyhole,
  Mail,
  MessageCircle,
  RefreshCw,
  SquarePlus,
} from "lucide-react";

const icons = {
  home: House,
  message: MessageCircle,
  post: SquarePlus,
  login: DoorOpenIcon,
  left: ChevronsLeft,
  right: ChevronsRight,
  mail: Mail,
  user: CircleUserRound,
  password: LockKeyhole,
  refresh: RefreshCw,
} as const;

interface Props {
  size?: "sm" | "md" | "lg";
  name: keyof typeof icons;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
} as const;

export function Icon({ size = "md", name }: Props) {
  const IconComponent = icons[name];
  return <IconComponent size={sizeMap[size]} />;
}
