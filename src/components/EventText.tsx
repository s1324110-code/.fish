type Props = { texts: string[] };

export default function EventText({ texts }: Props) {
  if (!texts.length) return null;
  return (
    <div className="event-text">
      {texts.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </div>
  );
}
