import { Upgrade } from '../state/gameState';

type Props = {
  coins: number;
  onFeed: () => void;
  onBuyUpgrade: (id: Upgrade['id']) => void;
  upgrades: Upgrade[];
  onOpenLog: () => void;
  onZoomToggle: () => void;
  onExternalCheck: () => void;
  zoomActive: boolean;
  revealed: boolean;
};

export default function ControlPanel(props: Props) {
  const { coins, onFeed, upgrades, onBuyUpgrade, onOpenLog, onZoomToggle, onExternalCheck, zoomActive, revealed } = props;
  const has = (id: Upgrade['id']) => upgrades.find((u) => u.id === id)?.unlocked;

  return (
    <aside className={`panel ${revealed ? 'panel-surveil' : ''}`}>
      <h2>Aquarium</h2>
      <div className="coins">Coins: {coins}</div>
      <button onClick={onFeed}>餌をあげる</button>

      <div className="upgrades">
        <h3>アップグレード</h3>
        {upgrades.map((u, idx) => {
          const prevUnlocked = idx === 0 || upgrades[idx - 1].unlocked;
          if (!prevUnlocked) return null;
          return (
            <button key={u.id} disabled={u.unlocked || coins < u.cost} onClick={() => onBuyUpgrade(u.id)}>
              {u.unlocked ? `✓ ${u.name}` : `${u.name} (${u.cost})`}
            </button>
          );
        })}
      </div>

      {has('behaviorLog') && <button onClick={onOpenLog}>行動ログを見る</button>}
      {has('cameraZoom') && <button onClick={onZoomToggle}>{zoomActive ? 'ズーム解除' : 'ズーム'}</button>}
      {has('externalCheck') && <button onClick={onExternalCheck}>外部確認</button>}
    </aside>
  );
}
