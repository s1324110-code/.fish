import Fish from './Fish';

type FishEntity = { id: number; x: number; y: number; size: number; vx: number; vy: number; pause: number };

type Props = {
  fishes: FishEntity[];
  fishStage: number;
  zoomActive: boolean;
  revealed: boolean;
  darkFlash: boolean;
};

export default function Aquarium({ fishes, fishStage, zoomActive, revealed, darkFlash }: Props) {
  return (
    <section className={`aquarium ${zoomActive ? 'zoom' : ''} ${revealed ? 'revealed' : ''} ${darkFlash ? 'flash' : ''}`}>
      <div className="water" />
      {fishes.map((f) => (
        <Fish
          key={f.id}
          x={f.x}
          y={f.y}
          size={f.size}
          facingRight={f.vx >= 0}
          stage={fishStage}
          revealed={revealed}
        />
      ))}
    </section>
  );
}
