import { useEffect, useMemo, useRef, useState } from 'react';
import Aquarium from './components/Aquarium';
import ControlPanel from './components/ControlPanel';
import EventText from './components/EventText';
import TitleScreen from './components/TitleScreen';
import { COLLAPSE_THRESHOLD, fishStageFromViolation, initialUpgrades, REVEAL_THRESHOLD, Screen, Upgrade } from './state/gameState';

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [coins, setCoins] = useState(12);
  const [upgrades, setUpgrades] = useState(initialUpgrades);
  const [violation, setViolation] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [darkFlash, setDarkFlash] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [eventTexts, setEventTexts] = useState<string[]>([]);
  const [ending, setEnding] = useState<string>('');

  const [fishes, setFishes] = useState([
    { id: 1, x: 22, y: 40, size: 72, vx: 0.16, vy: 0.03, pause: 0 },
    { id: 2, x: 60, y: 55, size: 62, vx: -0.14, vy: -0.02, pause: 0 },
  ]);

  const lastWatchRef = useRef<number[]>([]);
  const postRevealSafeTime = useRef(0);

  const fishStage = fishStageFromViolation(violation);
  const has = (id: Upgrade['id']) => upgrades.find((u) => u.id === id)?.unlocked;

  useEffect(() => {
    if (screen !== 'game') return;
    const t = setInterval(() => {
      setCoins((c) => c + 1);
      if (has('autoFeed')) setCoins((c) => c + 1);
      if (zoomActive) setViolation((v) => Math.min(100, v + 0.8));
      if (revealed && !zoomActive) postRevealSafeTime.current += 1;
      if (revealed && postRevealSafeTime.current > 22) {
        setEnding('見ない、という選択。');
        setScreen('ending');
      }
    }, 1000);
    return () => clearInterval(t);
  }, [screen, zoomActive, revealed, upgrades]);

  useEffect(() => {
    if (screen !== 'game') return;
    const t = setInterval(() => {
      setFishes((prev) =>
        prev.map((f) => {
          if (f.pause > 0) return { ...f, pause: f.pause - 1 };
          let vx = f.vx;
          let vy = f.vy;
          if (fishStage >= 2 && zoomActive) vx = vx > 0 ? -Math.abs(vx) : Math.abs(vx);
          if (fishStage >= 3) {
            vx *= 0.45;
            vy *= 0.45;
          }
          let nx = f.x + vx;
          let ny = f.y + vy;
          if (nx < 5 || nx > 95) vx *= -1;
          if (ny < 10 || ny > 88) vy *= -1;
          nx = Math.min(95, Math.max(5, nx));
          ny = Math.min(88, Math.max(10, ny));
          const pauseChance = fishStage === 1 ? 0.03 : fishStage >= 2 ? 0.06 : 0.01;
          const pause = Math.random() < pauseChance ? 15 : 0;
          return { ...f, x: nx, y: ny, vx, vy, pause };
        })
      );
    }, 50);
    return () => clearInterval(t);
  }, [screen, fishStage, zoomActive]);

  useEffect(() => {
    if (!revealed && violation >= REVEAL_THRESHOLD) {
      setDarkFlash(true);
      setTimeout(() => setDarkFlash(false), 350);
      setTimeout(() => {
        setRevealed(true);
        setEventTexts(['……また、見てたよね。', 'どうして、そこまで知ってるの？', 'これは、世話じゃない。']);
      }, 500);
    }
    if (violation >= COLLAPSE_THRESHOLD) {
      setEnding('通報を受理しました。');
      setScreen('ending');
    }
  }, [violation, revealed]);

  const addWatchViolation = (delta: number) => {
    const now = Date.now();
    lastWatchRef.current = [...lastWatchRef.current.filter((t) => now - t < 9000), now];
    const chainBonus = lastWatchRef.current.length >= 3 ? 2 : 0;
    setViolation((v) => Math.min(100, v + delta + chainBonus));
    if (revealed) {
      postRevealSafeTime.current = 0;
      if (delta > 0) {
        setEnding('あなたはまだ、見ている。');
      }
    }
  };

  const onBuyUpgrade = (id: Upgrade['id']) => {
    setUpgrades((prev) => {
      const found = prev.find((u) => u.id === id);
      if (!found || found.unlocked || coins < found.cost) return prev;
      setCoins((c) => c - found.cost);
      return prev.map((u) => (u.id === id ? { ...u, unlocked: true } : u));
    });
  };

  const endingTitle = useMemo(() => {
    if (ending === '見ない、という選択。') return 'End A: Stop';
    if (ending === 'あなたはまだ、見ている。') return 'End B: Observer';
    return 'End C: Collapse';
  }, [ending]);

  if (screen === 'title') return <TitleScreen onStart={() => setScreen('game')} />;
  if (screen === 'ending') {
    return (
      <main className="ending-screen">
        <h2>{endingTitle}</h2>
        <p>{ending}</p>
      </main>
    );
  }

  return (
    <main className={`game-root stage-${fishStage} ${revealed ? 'revealed-ui' : ''}`}>
      <Aquarium fishes={fishes} fishStage={fishStage} zoomActive={zoomActive} revealed={revealed} darkFlash={darkFlash} />
      <ControlPanel
        coins={coins}
        onFeed={() => {
          const feedGain = fishStage >= 2 ? 1 : 3;
          setCoins((c) => c + feedGain);
        }}
        onBuyUpgrade={onBuyUpgrade}
        upgrades={upgrades}
        onOpenLog={() => addWatchViolation(6)}
        onZoomToggle={() => {
          setZoomActive((z) => !z);
          addWatchViolation(5);
        }}
        onExternalCheck={() => addWatchViolation(10)}
        zoomActive={zoomActive}
        revealed={revealed}
      />
      <EventText texts={eventTexts} />
      {revealed && ending === 'あなたはまだ、見ている。' && <div className="observer-hint">監視は続いている。</div>}
    </main>
  );
}
