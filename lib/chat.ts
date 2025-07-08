// Central chat configuration

export const CHAT_ROLES = ['DOCTOR', 'SECRETARY', 'ADMIN'] as const;
export type ChatRole = typeof CHAT_ROLES[number];

export const roleLabels: Record<ChatRole, string> = {
  DOCTOR: 'docteurs',
  SECRETARY: 'secrétaires',
  ADMIN: 'administrateurs',
}; 