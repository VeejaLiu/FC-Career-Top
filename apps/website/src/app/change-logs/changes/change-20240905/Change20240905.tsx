import Image from 'next/image';

export function Change20240905() {
  return (
    <div className="w-11/12 mb-8">
      <h1 className="text-2xl font-bold">First version:</h1>
      <h2 className="text-xl font-semibold mt-4">2024-09-05</h2>
      <p className="mt-2 font-bold">
        Maximize Your FC24 Manager Career Mode with Comprehensive Player
        Insights
      </p>
      <p className="mt-2">
        Elevate your gaming experience in FC24 Manager career mode by leveraging
        our powerful tools designed to support both player lists and player
        trends. Our solution is essential for dedicated managers aiming to build
        a winning team.
      </p>
      <h3 className="text-lg font-semibold mt-4">
        Key Features of Our FC24 Player Insights Tool:
      </h3>
      <ul className="list-disc list-inside mt-2">
        <li className="font-bold">Extensive Player List:</li>
        <ul className="list-disc list-inside ml-4">
          <li>
            Gain access to an exhaustive list of all players within your team.
            Our user-friendly interface allows you to easily view crucial player
            information, including:
          </li>
          <li>
            <strong>Name</strong>: Identify players with ease.
          </li>
          <li>
            <strong>Avatar</strong>: Visual representation for quick
            recognition.
          </li>
          <li>
            <strong>Position</strong>:
            {`Understand each player's role on the field.`}
          </li>
          <li>
            <strong>Player ID</strong>: Unique identifiers for seamless
            tracking.
          </li>
          <li>
            <strong>Age</strong>: Evaluate the experience and potential
            longevity of each player.
          </li>
          <li>
            <strong>Overall Rating</strong>: Assess the current skill level of
            players.
          </li>
          <li>
            <strong>Potential Rating</strong>: Discover the future capabilities
            of your players, aiding in long-term team strategy.
          </li>
        </ul>
        <li className="font-bold mt-2">Dynamic Player Trends:</li>
        <ul className="list-disc list-inside ml-4">
          <li>
            Stay ahead of the competition by analyzing player performance trends
            over time. Our tool provides:
          </li>
          <li>
            <strong>Overall Rating Trends</strong>: Track how players’ skills
            evolve throughout their careers.
          </li>
          <li>
            <strong>Potential Rating Trends</strong>: Monitor the potential
            growth of players, helping you make strategic decisions about
            training and transfers.
          </li>
          <li>
            <strong>Automatic Tracking</strong>: Our system automatically
            updates player statistics, ensuring you have the most current data
            at your fingertips.
          </li>
        </ul>
      </ul>
      <h3 className="text-lg font-semibold mt-4">System Requirements</h3>
      <p className="mt-2">
        To utilize these powerful features, you will need the{' '}
        <strong>FC24 Live Editor</strong> and <strong>LUA scripting</strong>{' '}
        capabilities. These tools enable real-time data updates and integration,
        ensuring a seamless experience while managing your team.
      </p>
      <h3 className="text-lg font-semibold mt-4">Why Choose Our Tool?</h3>
      <p className="mt-2">
        With the competitive landscape of FC24, having access to in-depth player
        analytics is crucial for success. Whether you’re managing a budding
        squad or a seasoned team, understanding player dynamics can
        significantly impact your gameplay strategy and outcomes. Our tool
        empowers you to make informed decisions, ultimately leading to enhanced
        performance in career mode.
      </p>
      <h3 className="text-lg font-semibold mt-4">Conclusion</h3>
      <p className="mt-2">
        Transform your FC24 Manager career mode with our advanced player
        insights. By utilizing our player list and trend analysis, you can
        strategically build and manage your team for optimal results. Don’t just
        play—dominate the game!
      </p>
      <Image
        width={800}
        height={400}
        src="/changelogs/20240905/player_list.webp"
        alt={'player list, Support FC24 and FC25 Manager career mode'}
        className="mt-4"
      />
      <Image
        width={800}
        height={400}
        src="/changelogs/20240905/player_trends.webp"
        alt={'player trends, Support FC24 and FC25 Manager career mode'}
        className="mt-4"
      />
    </div>
  );
}

export default Change20240905;
