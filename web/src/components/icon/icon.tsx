import {
  ChevronsLeft,
  ChevronsRight,
  CircleUserRound,
  DoorOpenIcon,
  Heart,
  House,
  LockKeyhole,
  Mail,
  MessageCircle,
  RefreshCw,
  Settings,
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
  heart: Heart,
  setting: Settings
} as const;

interface Props {
  size?: number;
  name: keyof typeof icons;
}

export function Icon({ size = 24, name }: Props) {
  const IconComponent = icons[name];
  return <IconComponent size={size} />;
}
