import Image from 'next/image';

export function Change20241203() {
  return (
    <div className="w-11/12 mb-8">
      <h1 className="text-2xl font-bold">
        New Feature:{' '}
        <span role="img" aria-label="gold medal">
          🏅
        </span>{' '}
        Golden player.
      </h1>
      <h2 className="text-xl font-semibold mt-4">2024-12-03</h2>
      <p className="mt-2">
        I often wonder who the most promising players are in my team for a
        specific position, and who currently has the highest ability rating.
      </p>
      <p className="mt-2">
        This feature sets a gold medal marker for the player with the highest
        ability or potential in a specific position, making it easy for you to
        notice them quickly.
      </p>
      <p className="mt-2">
        In fact, we will set markers for the top three players in a position,
        which are gold, silver, and bronze medals.
      </p>
      <Image
        width={800}
        height={400}
        src={'/changelogs/20241203/golden_player.webp'}
        alt={'golden player'}
        className="mt-4"
      />
    </div>
  );
}

export default Change20241203;
