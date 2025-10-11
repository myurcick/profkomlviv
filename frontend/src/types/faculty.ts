import { TeamMember} from './team';

export interface FacultyFormData {
  name: string;
  headId: number | null;
  address: string;
  room: string;
  schedule: string;
  summary: string;
  instagram_link: string;
  telegram_link: string;
  isActive: boolean;
  imageUrl: string;
}

export interface Faculty {
  id: number;
  name: string;
  headId: number | null;
  head?: TeamMember;
  imageUrl?: string;
  address?: string;
  room?: string;
  schedule?: string;
  summary?: string;
  instagram_link?: string;
  telegram_link?: string;
  isActive: boolean;
}