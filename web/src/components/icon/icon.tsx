import { s } from "framer-motion/client";
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
import { Spinner } from "./svgs/spinner";

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
  setting: Settings,
  spinner: Spinner,
} as const;

interface Props {
  size?: number;
  name: keyof typeof icons;
}

export function Icon({ size = 24, name }: Props) {
  const IconComponent = icons[name];
  return <IconComponent size={size} />;
}
