export interface Task {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  winnersCount: number;
  members: string[];
}

export interface Member {
  name: string;
  checked: boolean;
}

export interface ThemeColor {
  hex: string;
  name: string;
}

export interface IconOption {
  name: string;
  label: string;
}
