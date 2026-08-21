import {
  Folder,
  ShieldCheck,
  Building2,
  Zap,
  Receipt,
  Briefcase,
  FileCheck,
  Plane,
  GraduationCap,
  UserCheck,
  Monitor,
  Shield,
  Landmark,
  Home,
  Scale,
  Truck,
  ShoppingBag,
  Share2,
  Cpu,
  Code,
} from "lucide-react";

export const AVAILABLE_CATEGORY_ICONS = [
  { name: "Folder", icon: Folder },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Building2", icon: Building2 },
  { name: "Zap", icon: Zap },
  { name: "Receipt", icon: Receipt },
  { name: "Briefcase", icon: Briefcase },
  { name: "FileCheck", icon: FileCheck },
  { name: "Plane", icon: Plane },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "UserCheck", icon: UserCheck },
  { name: "Monitor", icon: Monitor },
  { name: "Shield", icon: Shield },
  { name: "Landmark", icon: Landmark },
  { name: "Home", icon: Home },
  { name: "Scale", icon: Scale },
  { name: "Truck", icon: Truck },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Share2", icon: Share2 },
  { name: "Cpu", icon: Cpu },
  { name: "Code", icon: Code },
];

export function renderCategoryIcon(iconName?: string, className = "h-4 w-4") {
  const found = AVAILABLE_CATEGORY_ICONS.find((item) => item.name === iconName);
  const IconComponent = found ? found.icon : Folder;
  return <IconComponent className={className} />;
}
