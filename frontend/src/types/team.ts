export type MemberType = "Aparat" | "Profburo" | "Viddil";

export const MemberTypeDisplay: Record<MemberType, string> = {
  Aparat: "Член Апарату Профкому",
  Profburo: "Голова Профбюро",
  Viddil: "Голова Відділу",
};

export interface TeamFormData {
  name: string;
  position: string;
  type: number;
  orderInd: number;
  isActive: boolean;
  email?: string;
  imageUrl?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  type: number;
  orderInd: number;
  isActive: boolean;
  createdAt: string;
  email?: string;
  imageUrl?: string;
  isChoosed: boolean;
}

export const APARAT_TYPE  = 0;
export const PROFBURO_HEAD_TYPE = 1;
export const VIDDIL_HEAD_TYPE  = 2;