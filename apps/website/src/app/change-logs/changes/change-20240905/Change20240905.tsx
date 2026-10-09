import Image from 'next/image';

export default function Change20240905() {
  return (
    <article className="mb-10">
      <h2 className="text-2xl font-bold">
        First release: squad lists and player growth charts
      </h2>
      <p className="mt-3">
        <time dateTime="2024-09-05">2024-09-05</time>
      </p>
      <p className="mt-4">
        The first version introduced squad snapshots and growth tracking for FC
        24 Manager Career Mode with Live Editor and a Lua script.
      </p>
      <h3 className="text-lg font-semibold mt-4">Squad overview</h3>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li>View player names, avatars, positions, IDs and ages.</li>
        <li>Compare overall ratings and potential to plan your squad.</li>
      </ul>
      <h3 className="text-lg font-semibold mt-4">Player development history</h3>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li>Follow overall rating and potential across career dates.</li>
        <li>
          Automatically collect snapshots while the tracking script is active.
        </li>
      </ul>
      <Image
        width={1125}
        height={1045}
        src="/changelogs/20240905/player_list.webp"
        alt="First-release squad list with player names, positions, ages, ratings and potential"
        className="mt-4 rounded-lg w-full h-auto"
      />
      <Image
        width={1125}
        height={1045}
        src="/changelogs/20240905/player_trends.webp"
        alt="First-release player growth charts for overall rating and potential"
        className="mt-4 rounded-lg w-full h-auto"
      />
    </article>
  );
}
