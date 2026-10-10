import type { GameVersion } from './game-versions';

// Compared against the original SoFIFA player/customize pages on 2026-10-10.
// The reference combined mask has a 30-item first segment for FC 24/25 and
// a reordered 32-item segment for FC 26/27. Lua uses actual field metadata or
// compatible native enums to resolve the editor's binary layout.
export interface PlayerFeature {
  id: string;
  group: number;
  bit: number;
  kind: 'playstyle' | 'trait';
}

const legacyStyles = [
  'Finesse_Shot',
  'Chip_Shot',
  'Power_Shot',
  'Dead_Ball',
  'Power_Header',
  'Incisive_Pass',
  'Pinged_Pass',
  'Long_Ball_Pass',
  'Tiki_Taka',
  'Whipped_Pass',
  'Jockey',
  'Block',
  'Intercept',
  'Anticipate',
  'Slide_Tackle',
  'Bruiser',
  'Technical',
  'Rapid',
  'Flair',
  'First_Touch',
  'Trickster',
  'Press_Proven',
  'Quick_Step',
  'Relentless',
  'Trivela',
  'Acrobatic',
  'Long_Throw',
  'Aerial',
  'Far_Throw',
  'Footwork',
];
const modernStyles = [
  'Finesse_Shot',
  'Chip_Shot',
  'Power_Shot',
  'Dead_Ball',
  'Precision_Header',
  'Acrobatic',
  'Low_Driven_Shot',
  'Gamechanger',
  'Incisive_Pass',
  'Pinged_Pass',
  'Long_Ball_Pass',
  'Tiki_Taka',
  'Whipped_Pass',
  'Inventive',
  'Jockey',
  'Block',
  'Intercept',
  'Anticipate',
  'Slide_Tackle',
  'Aerial_Fortress',
  'Technical',
  'Rapid',
  'First_Touch',
  'Trickster',
  'Press_Proven',
  'Quick_Step',
  'Relentless',
  'Long_Throw',
  'Bruiser',
  'Enforcer',
  'Far_Throw',
  'Footwork',
];
const hiddenTraits = [
  'Long_Shot_Taker_CPU',
  'Early_Crosser_CPU',
  'Solid_Player',
  'Team_Player',
  'One_Club_Player',
  'Injury_Prone',
  'Leadership',
];

export function getPlayerFeatures(version: GameVersion): PlayerFeature[] {
  const modern = version >= 26;
  const keeper = [
    'Cross_Claimer',
    version === 25 ? '1v1_Close_Down' : 'Rush_Out',
    'Far_Reach',
    version === 24 ? 'Quick_Reflexes' : 'Deflector',
  ];
  return [
    ...(modern ? modernStyles : legacyStyles).map((id, bit) => ({
      id,
      group: 1,
      bit,
      kind: 'playstyle' as const,
    })),
    ...keeper.map((id, bit) => ({
      id,
      group: 2,
      bit,
      kind: 'playstyle' as const,
    })),
    ...(modern ? hiddenTraits.slice(2) : hiddenTraits).map((id, index) => ({
      id,
      group: 2,
      bit: index + 4,
      kind: 'trait' as const,
    })),
  ];
}

// Position-specific role IDs; + uses the base ID and ++ uses base ID + 100.
// The four new FC 26 role types occupy five IDs because wingbacks have sides.
export const PLAYER_ROLES = [
  '',
  'GK Goalkeeper',
  'GK Sweeper Keeper',
  'RB Fullback',
  'RB Falseback',
  'RB Wingback',
  'RB Attacking Wingback',
  'LB Fullback',
  'LB Falseback',
  'LB Wingback',
  'LB Attacking Wingback',
  'CB Defender',
  'CB Stopper',
  'CB Ball-Playing Defender',
  'CDM Holding',
  'CDM Centre-Half',
  'CDM Deep-Lying Playmaker',
  'CDM Wide Half',
  'CM Box-to-Box',
  'CM Holding',
  'CM Deep-Lying Playmaker',
  'CM Playmaker',
  'CM Half-Winger',
  'RM Winger',
  'RM Wide Midfielder',
  'RM Wide Playmaker',
  'RM Inside Forward',
  'LM Winger',
  'LM Wide Midfielder',
  'LM Wide Playmaker',
  'LM Inside Forward',
  'CAM Playmaker',
  'CAM Shadow Striker',
  'CAM Half-Winger',
  'CAM Classic 10',
  'RW Winger',
  'RW Inside Forward',
  'RW Wide Playmaker',
  'LW Winger',
  'LW Inside Forward',
  'LW Wide Playmaker',
  'ST Advanced Forward',
  'ST Poacher',
  'ST False 9',
  'ST Target Forward',
  'GK Ball-Playing Keeper',
  'RB Inverted Wingback',
  'LB Inverted Wingback',
  'CB Wide Back',
  'CDM Box Crasher',
] as const;

const ROLE_NAMES_ZH: Record<string, string> = {
  Goalkeeper: '门将',
  'Sweeper Keeper': '清道夫门将',
  Fullback: '边后卫',
  Falseback: '内收边后卫',
  Wingback: '翼卫',
  'Attacking Wingback': '进攻翼卫',
  Defender: '中后卫',
  Stopper: '上抢中卫',
  'Ball-Playing Defender': '出球中卫',
  Holding: '拖后防守',
  'Centre-Half': '回撤中卫',
  'Deep-Lying Playmaker': '拖后组织',
  'Wide Half': '边路后腰',
  'Box-to-Box': '全能中场',
  Playmaker: '组织核心',
  'Half-Winger': '边路型中场',
  Winger: '边锋',
  'Wide Midfielder': '边前卫',
  'Wide Playmaker': '边路组织',
  'Inside Forward': '内切前锋',
  'Shadow Striker': '影锋',
  'Classic 10': '传统十号',
  'Advanced Forward': '突前前锋',
  Poacher: '抢点前锋',
  'False 9': '伪九号',
  'Target Forward': '支点前锋',
  'Ball-Playing Keeper': '出球门将',
  'Inverted Wingback': '内切进攻翼卫',
  'Wide Back': '拉边中卫',
  'Box Crasher': '插上后腰',
};

export function roleLabel(
  code: number,
  version: number,
  language?: string,
): string | null {
  const base = code > 100 ? code - 100 : code;
  const maximum = version === 25 ? 44 : 49;
  if (version < 25 || base < 1 || base > maximum) return null;
  const label = PLAYER_ROLES[base];
  if (!label) return null;
  const [position, ...parts] = label.split(' ');
  const translated =
    language === 'zh' ? ROLE_NAMES_ZH[parts.join(' ')] : undefined;
  return `${translated ? `${position} ${translated}` : label} ${code > 100 ? '++' : '+'}`;
}

export const FEATURE_NAMES_ZH: Record<string, string> = {
  Finesse_Shot: '搓射',
  Chip_Shot: '挑射',
  Power_Shot: '强力射门',
  Dead_Ball: '定位球专家',
  Power_Header: '强力头球',
  Precision_Header: '精准头球',
  Incisive_Pass: '精准直塞',
  Pinged_Pass: '快速传球',
  Long_Ball_Pass: '长传专家',
  Tiki_Taka: '传控大师',
  Whipped_Pass: '弧线传中',
  Jockey: '贴身盯防',
  Block: '封堵',
  Intercept: '拦截',
  Anticipate: '预判',
  Slide_Tackle: '滑铲',
  Bruiser: '强硬防守',
  Technical: '技术盘带',
  Rapid: '快速盘带',
  Flair: '花式技巧',
  First_Touch: '第一脚触球',
  Trickster: '花式高手',
  Press_Proven: '抗压控球',
  Quick_Step: '快速启动',
  Relentless: '不知疲倦',
  Trivela: '外脚背',
  Acrobatic: '杂技射门',
  Long_Throw: '大力界外球',
  Aerial: '制空能力',
  Far_Throw: '门将远距离手抛球',
  Footwork: '门将脚下扑救',
  Cross_Claimer: '门将处理传中',
  '1v1_Close_Down': '门将一对一',
  Rush_Out: '门将出击',
  Far_Reach: '远距离扑救',
  Deflector: '门将挡球',
  Quick_Reflexes: '门将快速反应',
  Low_Driven_Shot: '低平射门',
  Gamechanger: '非常规终结',
  Inventive: '创造性传球',
  Aerial_Fortress: '空中堡垒',
  Enforcer: '强力护球',
  Long_Shot_Taker_CPU: '偏好远射（AI）',
  Early_Crosser_CPU: '提前传中（AI）',
  Solid_Player: '稳健球员',
  Team_Player: '团队球员',
  One_Club_Player: '一人一城',
  Injury_Prone: '容易受伤',
  Leadership: '领导力',
};

export function featureLabel(id: string, language?: string): string {
  const plus = id.endsWith('_');
  const base = plus ? id.slice(0, -1) : id;
  const label =
    language === 'zh_CN' || language === 'zh'
      ? FEATURE_NAMES_ZH[base]
      : undefined;
  return `${label || base.replace(/_/g, ' ')}${plus ? '+' : ''}`;
}
