interface Props {
  id: string;
}

export function Player({ id }: Props) {
  return (
    <div className="w-full max-w-3xl aspect-video bg-zinc-900 rounded-xl overflow-hidden">
      <div id={id} className="w-full h-full" />
    </div>
  );
}
