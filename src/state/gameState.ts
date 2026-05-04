export type Screen = 'title' | 'game' | 'ending';
export type EndingType = 'A_STOP' | 'B_OBSERVER' | 'C_COLLAPSE' | null;

export type UpgradeId = 'autoFeed' | 'behaviorLog' | 'cameraZoom' | 'externalCheck';

export interface Upgrade {
  id: UpgradeId;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
}

export const REVEAL_THRESHOLD = 55;
export const COLLAPSE_THRESHOLD = 95;

export const initialUpgrades: Upgrade[] = [
  { id: 'autoFeed', name: '自動給餌', description: '魚の生活を快適にする', cost: 18, unlocked: false },
  { id: 'behaviorLog', name: '行動ログ', description: '健康管理のために行動を記録する', cost: 28, unlocked: false },
  { id: 'cameraZoom', name: 'カメラズーム', description: '魚の様子をより詳しく見る', cost: 38, unlocked: false },
  { id: 'externalCheck', name: '外部確認', description: '外出中の魚の様子も確認する', cost: 52, unlocked: false },
];

export const fishStageFromViolation = (v: number) => {
  if (v >= 45) return 3;
  if (v >= 30) return 2;
  if (v >= 15) return 1;
  return 0;
};
