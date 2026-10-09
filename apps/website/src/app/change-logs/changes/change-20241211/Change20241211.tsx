import Image from 'next/image';

export function Change20241211() {
  return (
    <article className="mb-10">
      <h2 className="text-2xl font-bold">Player development notifications</h2>
      <p className="mt-3">
        <time dateTime="2024-12-11">2024-12-11</time>
      </p>
      <p className="mt-2">
        {`We’ve just added an exciting new feature that tracks all changes for your players in FC24 Manager career mode! Stay updated on their progress anytime and discover how they're improving in real time.`}
      </p>
      <h3 className="text-lg font-semibold mt-4">
        {`Key Player Metrics You Can Monitor:`}
      </h3>
      <ul className="list-disc list-inside mt-2">
        <li>
          <strong>Overall</strong>
        </li>
        <li>
          <strong>Potential</strong>
        </li>
        <li>
          <strong>Weak Foot</strong>
        </li>
        <li>
          <strong>Skill Moves</strong>
        </li>
      </ul>
      <p className="mt-2">
        {`Receive quick notifications on your players' evolving stats, helping you make strategic decisions for your lineup.`}
      </p>
      <p className="mt-2">{`Don't miss out on this powerful feature! Support FC24 and FC25 versions.`}</p>
      <Image
        width={1280}
        height={718}
        src="/changelogs/20241211/notifications.webp"
        alt="Track Changes for FC24/FC25 Player Progress"
        className="mt-4 rounded-lg w-full h-auto"
      />
    </article>
  );
}

export default Change20241211;
