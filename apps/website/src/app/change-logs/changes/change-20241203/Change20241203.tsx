import Image from 'next/image';

export function Change20241203() {
  return (
    <article className="mb-10">
      <h2 className="text-2xl font-bold">
        New Feature:{' '}
        <span role="img" aria-label="gold medal">
          🏅
        </span>{' '}
        Position-ranking medals
      </h2>
      <p className="mt-3">
        <time dateTime="2024-12-03">2024-12-03</time>
      </p>
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
        width={987}
        height={428}
        src={'/changelogs/20241203/golden_player.webp'}
        alt="Gold, silver and bronze badges for the top three players at each position"
        className="mt-4 rounded-lg w-full h-auto"
      />
    </article>
  );
}

export default Change20241203;
