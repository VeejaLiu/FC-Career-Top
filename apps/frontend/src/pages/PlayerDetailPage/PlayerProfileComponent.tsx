import type {
  GameRecord,
  PlayerModel,
  PlayerProfile,
} from '../../service/PlayerApis';
import { featureLabel, roleLabel } from '../../constant/player-features';
import {
  LANGUAGE_LOCAL_STORAGE_KEY,
  normalizeLanguage,
} from '../../common/language';
import { DateUtils } from './profile-date';

interface Props {
  player: PlayerModel;
  profile?: PlayerProfile | null;
  locale: Record<string, string>;
}

function valueFrom(records: GameRecord[], names: string[]) {
  for (const name of names) {
    for (const record of records) {
      if (record[name] != null && record[name] !== '') return record[name];
    }
  }
  return null;
}

// EA's FC 26 PC formula; no FC 24/25 seven-type or unconfirmed FC 27 formula.
function accelerationType(record: GameRecord) {
  const { gender, height, agility, strength, acceleration } = record;
  if (
    ![gender, height, agility, strength, acceleration].every(
      (value) => typeof value === 'number',
    )
  )
    return null;
  if (gender !== 0 && gender !== 1) return null;
  const h = Number(height),
    a = Number(agility),
    s = Number(strength),
    speed = Number(acceleration);
  if (a >= 65 && a - s >= 10 && speed >= 80 && h <= (gender === 1 ? 162 : 182))
    return 'Explosive';
  if (s >= 65 && s - a >= 4 && speed >= 40 && h >= (gender === 1 ? 164 : 183))
    return 'Lengthy';
  return 'Controlled';
}

export default function PlayerProfileComponent({
  player,
  profile,
  locale,
}: Props) {
  const language = normalizeLanguage(
    localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) || navigator.language,
  );
  const format = (value: unknown) => {
    if (value == null || value === '') return '—';
    if (typeof value === 'boolean') return value ? locale.Yes : locale.No;
    return typeof value === 'number' ? value.toLocaleString() : String(value);
  };
  const row = (label: string, value: unknown) => (
    <div className="player-stat" key={label}>
      <span>{label}</span>
      <span>{format(value)}</span>
    </div>
  );
  if (!profile)
    return (
      <section className="player-profile-note">{locale.CopyNewScript}</section>
    );
  const unreadable = new Set(profile.unreadableFields || []);
  const raw = Object.fromEntries(
    Object.entries(profile.player || {}).filter(
      ([key]) => !unreadable.has(key),
    ),
  );
  const referenceRosters: Record<number, string> = {
    24: '240050',
    25: '250044',
    26: '260046',
    27: '270004',
  };
  const related = profile.related || {};
  const contracts = related.career_playercontract || [];
  const links = related.teamplayerlinks || [];
  const other = Object.values(related).flat();
  const all = [raw, ...contracts, ...other];
  const get = (...names: string[]) => valueFrom(all, names);
  const knownBody = Number(raw.bodytypecode);
  const bodyNames = [locale.Lean, locale.Normal, locale.Stocky];
  const body =
    knownBody >= 1 && knownBody <= 9
      ? `${bodyNames[(knownBody - 1) % 3]} (${knownBody})`
      : raw.bodytypecode == null
        ? null
        : `${locale.GameCode} ${raw.bodytypecode}`;
  const roles = Object.entries(raw)
    .filter(
      ([key, value]) =>
        /^role\d+$/.test(key) && value != null && Number(value) > 0,
    )
    .sort(([a], [b]) => Number(a.slice(4)) - Number(b.slice(4)))
    .map(([, code]) => ({
      code: Number(code),
      label: roleLabel(Number(code), profile.gameVersion, language),
    }));
  const observedAcceleration = get(
    'accelerationtype',
    'acceleratetype',
    'accelerationtypecode',
  );
  const derivedAcceleration =
    profile.gameVersion === 26 ? accelerationType(raw) : null;
  const accelerationLabel =
    observedAcceleration != null
      ? typeof observedAcceleration === 'string'
        ? observedAcceleration
        : `${locale.GameCode} ${observedAcceleration}`
      : derivedAcceleration
        ? `${locale[derivedAcceleration]} · ${locale.Calculated}`
        : null;
  const joined = get('playerjointeamdate', 'joineddate');
  const joinedDate =
    typeof joined === 'number' && joined > 0
      ? DateUtils.fromGameDays(joined)
      : joined;
  const liveState = other.filter(
    (record) =>
      record.playerid === player.player_id ||
      record.player_id === player.player_id,
  );
  const career = (...names: string[]) => valueFrom([raw, ...liveState], names);
  const extraCareer = Object.entries(raw).filter(([key]) =>
    /growth|develop|form|morale|fitness|injur|rank|dynamic.*overall|baseline.*overall/i.test(
      key,
    ),
  );
  return (
    <div className="player-profile-grid">
      <section className="attribute-section">
        <h2>{locale.Profile}</h2>
        {row(
          locale.Birthday,
          typeof raw.birthdate === 'number'
            ? DateUtils.fromGameDays(raw.birthdate)
            : null,
        )}
        {row(locale.Reputation, raw.internationalrep)}
        {row(locale.BodyType, body)}
        {row(
          locale.RealFace,
          raw.hashighqualityhead == null
            ? null
            : Number(raw.hashighqualityhead) === 1,
        )}
        {row(
          locale.Gender,
          raw.gender === 0
            ? locale.Male
            : raw.gender === 1
              ? locale.Female
              : null,
        )}
        {row(locale.Nationality, raw.nationality)}
        {row(
          locale.SecondNationality,
          get('nationality2', 'secondnationality'),
        )}
        {row(locale.AccelerationType, accelerationLabel)}
        <p className="profile-help">{locale.DerivedNote}</p>
        <a
          href={`https://sofifa.com/player/${player.player_id}/${referenceRosters[profile.gameVersion]}/`}
          target="_blank"
          rel="noreferrer"
          className="profile-reference-link"
        >
          {locale.SoFIFAReference}
        </a>
      </section>
      <section className="attribute-section">
        <h2>{locale.Roles}</h2>
        {profile.gameVersion < 25 ? (
          <p className="profile-help">{locale.NoRolesInVersion}</p>
        ) : !profile.availability.roles ? (
          <p className="profile-help">{locale.NotAvailable}</p>
        ) : roles.length === 0 ? (
          <p className="profile-help">{locale.NoRoles}</p>
        ) : (
          <div className="profile-badges">
            {roles.map(({ code, label }, index) => (
              <span key={`${code}-${index}`}>
                {label || `${locale.GameCode} ${code}`}
              </span>
            ))}
          </div>
        )}
        <h3>{locale.HiddenTraits}</h3>
        {!profile.availability.playStyles ? (
          <p className="profile-help">{locale.NotAvailable}</p>
        ) : !profile.traits?.length ? (
          <p className="profile-help">{locale.NoTraits}</p>
        ) : (
          <div className="profile-badges">
            {profile.traits.map((trait) => (
              <span key={trait}>{featureLabel(trait, language)}</span>
            ))}
          </div>
        )}
        {profile.unknownPlayStyleBits && (
          <p className="profile-help">{locale.UnknownBits}</p>
        )}
      </section>
      <section className="attribute-section">
        <h2>{locale.Contract}</h2>
        {row(locale.Joined, joinedDate)}
        {row(
          locale.ContractUntil,
          get('contractvaliduntil', 'contractendyear'),
        )}
        {row(locale.Wage, get('wage', 'weeklywage', 'currentwage'))}
        {row(locale.ReleaseClause, get('releaseclause', 'release_clause'))}
        {row(locale.Value, get('player_value', 'playervalue', 'marketvalue'))}
        {row(locale.Jersey, valueFrom(links, ['jerseynumber']))}
        {row(
          locale.Club,
          valueFrom(contracts.length ? contracts : links, [
            'teamName',
            'teamid',
          ]),
        )}
        <p className="profile-help">{locale.MoneyNote}</p>
      </section>
      <section className="attribute-section">
        <h2>{locale.CareerState}</h2>
        {row(locale.DatabaseOverall, player.overallrating)}
        {profile.gameVersion >= 27 && (
          <>
            {row(
              locale.DynamicOverall,
              career('dynamicoverallrating', 'dynamicovr', 'dynamicoverall'),
            )}
            {row(
              locale.BaselineOverall,
              career(
                'baselineoverallrating',
                'baselineovr',
                'baseoverallrating',
              ),
            )}
            {row(
              locale.GrowthProfile,
              career('growthprofile', 'growthprofileid', 'growthprofiletype'),
            )}
            {row(locale.SquadRank, career('squadrank', 'squadrankid'))}
          </>
        )}
        {row(locale.Form, career('form', 'playerform'))}
        {row(locale.Morale, career('morale', 'playermorale'))}
        {row(locale.Fitness, career('fitness', 'matchfitness'))}
        {row(locale.Injury, career('injury', 'injuryid', 'injurytype'))}
        {row(locale.InjuryDays, career('injuryduration', 'injurydays'))}
        <p className="profile-help">{locale.CareerNote}</p>
        {extraCareer.length > 0 && (
          <details className="profile-details">
            <summary>{locale.OtherCareerFields}</summary>
            {extraCareer.map(([key, value]) => row(key, value))}
          </details>
        )}
      </section>
      <section className="attribute-section profile-season">
        <h2>{locale.SeasonStats}</h2>
        {!profile.availability.seasonStats ? (
          <p className="profile-help">{locale.NotAvailable}</p>
        ) : !profile.seasonStats?.length ? (
          <p className="profile-help">{locale.NoMatches}</p>
        ) : (
          <div className="profile-stat-table-wrapper">
            <table className="profile-stat-table">
              <thead>
                <tr>
                  {[
                    locale.Competition,
                    locale.Appearances,
                    locale.Goals,
                    locale.Assists,
                    locale.Average,
                    locale.CleanSheets,
                    locale.Saves,
                    locale.Conceded,
                    locale.Yellow,
                    locale.DoubleYellow,
                    locale.Red,
                    locale.MOTM,
                  ].map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profile.seasonStats.map((stat, index) => (
                  <tr key={`${stat.compobjid}-${index}`}>
                    <td>{format(stat.compname || stat.compobjid)}</td>
                    {[
                      stat.app,
                      stat.goals,
                      stat.assists,
                      typeof stat.averageRating === 'number'
                        ? stat.averageRating.toFixed(2)
                        : null,
                      stat.clean_sheets,
                      stat.saves,
                      stat.goals_conceded,
                      stat.yellow,
                      stat.two_yellow,
                      stat.red,
                      stat.motm,
                    ].map((value, column) => (
                      <td key={column}>{format(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="profile-help">{locale.SeasonNote}</p>
      </section>
      <details className="attribute-section profile-details profile-raw">
        <summary>{locale.AllCapturedData}</summary>
        <p className="profile-help">{locale.RawNote}</p>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </details>
    </div>
  );
}
