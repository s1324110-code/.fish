type Props = { onStart: () => void };

export default function TitleScreen({ onStart }: Props) {
  return (
    <main className="title-screen">
      <h1>Fish.</h1>
      <p>quiet aquarium care</p>
      <button onClick={onStart}>Start</button>
    </main>
  );
}
