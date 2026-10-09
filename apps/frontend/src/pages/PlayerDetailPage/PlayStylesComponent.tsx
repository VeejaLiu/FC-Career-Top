import ICON_1v1_Close_Down from '../../assets/image/player-styles/25/1v1_Close_Down.png';
import ICON_1v1_Close_Down_ from '../../assets/image/player-styles/25/1v1_Close_Down_.png';
import ICON_Acrobatic from '../../assets/image/player-styles/25/Acrobatic.png';
import ICON_Acrobatic_ from '../../assets/image/player-styles/25/Acrobatic_.png';
import ICON_Aerial from '../../assets/image/player-styles/25/Aerial.png';
import ICON_Aerial_ from '../../assets/image/player-styles/25/Aerial_.png';
import ICON_Anticipate from '../../assets/image/player-styles/25/Anticipate.png';
import ICON_Anticipate_ from '../../assets/image/player-styles/25/Anticipate_.png';
import ICON_Block from '../../assets/image/player-styles/25/Block.png';
import ICON_Block_ from '../../assets/image/player-styles/25/Block_.png';
import ICON_Bruiser from '../../assets/image/player-styles/25/Bruiser.png';
import ICON_Bruiser_ from '../../assets/image/player-styles/25/Bruiser_.png';
import ICON_Chip_Shot from '../../assets/image/player-styles/25/Chip_Shot.png';
import ICON_Chip_Shot_ from '../../assets/image/player-styles/25/Chip_Shot_.png';
import ICON_Cross_Claimer from '../../assets/image/player-styles/25/Cross_Claimer.png';
import ICON_Cross_Claimer_ from '../../assets/image/player-styles/25/Cross_Claimer_.png';
import ICON_Dead_Ball from '../../assets/image/player-styles/25/Dead_Ball.png';
import ICON_Dead_Ball_ from '../../assets/image/player-styles/25/Dead_Ball_.png';
import ICON_Deflector from '../../assets/image/player-styles/25/Deflector.png';
import ICON_Deflector_ from '../../assets/image/player-styles/25/Deflector_.png';
import ICON_Far_Reach from '../../assets/image/player-styles/25/Far_Reach.png';
import ICON_Far_Reach_ from '../../assets/image/player-styles/25/Far_Reach_.png';
import ICON_Far_Throw from '../../assets/image/player-styles/25/Far_Throw.png';
import ICON_Far_Throw_ from '../../assets/image/player-styles/25/Far_Throw_.png';
import ICON_Finesse_Shot from '../../assets/image/player-styles/25/Finesse_Shot.png';
import ICON_Finesse_Shot_ from '../../assets/image/player-styles/25/Finesse_Shot_.png';
import ICON_First_Touch from '../../assets/image/player-styles/25/First_Touch.png';
import ICON_First_Touch_ from '../../assets/image/player-styles/25/First_Touch_.png';
import ICON_Flair from '../../assets/image/player-styles/25/Flair.png';
import ICON_Flair_ from '../../assets/image/player-styles/25/Flair_.png';
import ICON_Footwork from '../../assets/image/player-styles/25/Footwork.png';
import ICON_Footwork_ from '../../assets/image/player-styles/25/Footwork_.png';
import ICON_Incisive_Pass from '../../assets/image/player-styles/25/Incisive_Pass.png';
import ICON_Incisive_Pass_ from '../../assets/image/player-styles/25/Incisive_Pass_.png';
import ICON_Intercept from '../../assets/image/player-styles/25/Intercept.png';
import ICON_Intercept_ from '../../assets/image/player-styles/25/Intercept_.png';
import ICON_Jockey from '../../assets/image/player-styles/25/Jockey.png';
import ICON_Jockey_ from '../../assets/image/player-styles/25/Jockey_.png';
import ICON_Long_Ball_Pass from '../../assets/image/player-styles/25/Long_Ball_Pass.png';
import ICON_Long_Ball_Pass_ from '../../assets/image/player-styles/25/Long_Ball_Pass_.png';
import ICON_Long_Throw from '../../assets/image/player-styles/25/Long_Throw.png';
import ICON_Long_Throw_ from '../../assets/image/player-styles/25/Long_Throw_.png';
import ICON_Pinged_Pass from '../../assets/image/player-styles/25/Pinged_Pass.png';
import ICON_Pinged_Pass_ from '../../assets/image/player-styles/25/Pinged_Pass_.png';
import ICON_Power_Header from '../../assets/image/player-styles/25/Power_Header.png';
import ICON_Power_Header_ from '../../assets/image/player-styles/25/Power_Header_.png';
import ICON_Power_Shot from '../../assets/image/player-styles/25/Power_Shot.png';
import ICON_Power_Shot_ from '../../assets/image/player-styles/25/Power_Shot_.png';
import ICON_Press_Proven from '../../assets/image/player-styles/25/Press_Proven.png';
import ICON_Press_Proven_ from '../../assets/image/player-styles/25/Press_Proven_.png';
import ICON_Quick_Step from '../../assets/image/player-styles/25/Quick_Step.png';
import ICON_Quick_Step_ from '../../assets/image/player-styles/25/Quick_Step_.png';
import ICON_Rapid from '../../assets/image/player-styles/25/Rapid.png';
import ICON_Rapid_ from '../../assets/image/player-styles/25/Rapid_.png';
import ICON_Relentless from '../../assets/image/player-styles/25/Relentless.png';
import ICON_Relentless_ from '../../assets/image/player-styles/25/Relentless_.png';
import ICON_Slide_Tackle from '../../assets/image/player-styles/25/Slide_Tackle.png';
import ICON_Slide_Tackle_ from '../../assets/image/player-styles/25/Slide_Tackle_.png';
import ICON_Technical from '../../assets/image/player-styles/25/Technical.png';
import ICON_Technical_ from '../../assets/image/player-styles/25/Technical_.png';
import ICON_Tiki_Taka from '../../assets/image/player-styles/25/Tiki_Taka.png';
import ICON_Tiki_Taka_ from '../../assets/image/player-styles/25/Tiki_Taka_.png';
import ICON_Trickster from '../../assets/image/player-styles/25/Trickster.png';
import ICON_Trickster_ from '../../assets/image/player-styles/25/Trickster_.png';
import ICON_Trivela from '../../assets/image/player-styles/25/Trivela.png';
import ICON_Trivela_ from '../../assets/image/player-styles/25/Trivela_.png';
import ICON_Whipped_Pass from '../../assets/image/player-styles/25/Whipped_Pass.png';
import ICON_Whipped_Pass_ from '../../assets/image/player-styles/25/Whipped_Pass_.png';
import { Popover } from '@douyinfe/semi-ui';

const PLAY_STYLES_LIST: {
  [key: string]: {
    title?: string;
    icon?: any;
    info?: string;
    description?: string;
  };
} = {
  /*
   * Ball control:
   *  - Technical
   *  - Rapid
   *  - Flair
   *  - First Touch
   *  - Trickster
   *  - Press Proven
   *
   * Test code:
   * ["Technical", "Rapid", "Flair", "First_Touch", "Trickster", "Press_Proven"]
   * ["Technical_", "Rapid_", "Flair_", "First_Touch_", "Trickster_", "Press_Proven_"]
   */
  Technical: {
    title: 'Technical',
    icon: ICON_Technical,
    info: 'A player who regularly tries to beat an opponent by using technical dribbling ability (with little to no use of skill moves or little to no physical contact).',
    description:
      'Reaches a higher speed when performing Controlled Sprint and performs wide turns while dribbling with more precision.',
  },
  Technical_: {
    title: 'Technical+',
    icon: ICON_Technical_,
    info: 'A player who regularly tries to beat an opponent by using technical dribbling ability (with little to no use of skill moves or little to no physical contact).',
    description:
      'Reaches even higher speed when performing Controlled Sprint and performs wide turns while dribbling with greater precision.',
  },
  Rapid: {
    title: 'Rapid',
    icon: ICON_Rapid,
    info: 'A player who is known to use speed and knock the ball ahead of their opponent to beat them whilst dribbling.',
    description:
      'Reaches a higher sprint speed while dribbling and has reduced chance of an error when sprinting or performing knock-ons.',
  },
  Rapid_: {
    title: 'Rapid+',
    icon: ICON_Rapid_,
    info: 'A player who is known to use speed and knock the ball ahead of their opponent to beat them whilst dribbling.',
    description:
      'Reaches even higher sprint speed while dribbling and has greatly reduced chance of an error when sprinting or performing knock-ons.',
  },
  Flair: {
    title: 'Flair',
    icon: ICON_Flair,
    info: 'A player who is known to try flamboyant moves (traps, passes, and shots).',
    description:
      'Fancy passes and shots are performed with improved accuracy. Performs Flair animations when contextually appropriate.',
  },
  Flair_: {
    title: 'Flair+',
    icon: ICON_Flair_,
    info: 'A player who is known to try flamboyant moves (traps, passes, and shots).',
    description:
      'Fancy passes and shots are performed with even greater accuracy. Performs Flair animations when contextually appropriate.',
  },
  First_Touch: {
    title: 'First Touch',
    icon: ICON_First_Touch,
    info: 'A player who is known for accurate first touch control in difficult situations.',
    description:
      'Has reduced error when trapping the ball and is able to transition to dribbling faster with greater control.',
  },
  First_Touch_: {
    title: 'First Touch+',
    icon: ICON_First_Touch_,
    info: 'A player who is known for accurate first touch control in difficult situations.',
    description:
      'Has minimal error when trapping the ball and is able to transition to dribbling much faster with greater control.',
  },
  Trickster: {
    title: 'Trickster',
    icon: ICON_Trickster,
    info: 'A player who is known for being able to perform skill moves in 1v1 situations.',
    description: 'Grants the ability to perform unique flick Skill Moves.',
  },
  Trickster_: {
    title: 'Trickster+',
    icon: ICON_Trickster_,
    info: 'A player who is known for being able to perform skill moves in 1v1 situations.',
    description:
      'Grants the ability to perform more unique ground and flick Skill Moves. Is significantly more agile when strafe dribbling.',
  },
  Press_Proven: {
    title: 'Press Proven',
    icon: ICON_Press_Proven,
    info: 'A player who is known for keeping ball possession under physical pressure from the opponent.',
    description:
      'Keeps close control of the ball while dribbling at jog speed and can shield the ball more effectively from stronger opponents.',
  },
  Press_Proven_: {
    title: 'Press Proven+',
    icon: ICON_Press_Proven_,
    info: 'A player who is known for keeping ball possession under physical pressure from the opponent.',
    description:
      'Keeps exceptionally close control of the ball while dribbling at jog speed. Can shield the ball much more effectively from stronger opponents.',
  },

  /**
   * Defending:
   *  - Jockey
   *  - Block
   *  - Intercept
   *  - Anticipate
   *  - Slide Tackle
   *  - Bruiser
   *
   *  Test code:
   *  ["Jockey", "Block", "Intercept", "Anticipate", "Slide_Tackle", "Bruiser"]
   *  ["Jockey_", "Block_", "Intercept_", "Anticipate_", "Slide_Tackle_", "Bruiser_"]
   */
  Jockey: {
    title: 'Jockey',
    icon: ICON_Jockey,
    info: 'A player who is known for being successful in 1v1 situations.',
    description:
      'Increased max speed of Sprint Jockey and improved transition speed from jockey to sprint.',
  },
  Jockey_: {
    title: 'Jockey+',
    icon: ICON_Jockey_,
    info: 'A player who is known for being successful in 1v1 situations.',
    description:
      'Increased max speed of Sprint Jockey and greatly improves transition speed from jockey to sprint.',
  },
  Block: {
    title: 'Block',
    icon: ICON_Block,
    info: 'A player who is known for performing elastic and overreaching blocks.',
    description:
      'Increased reach when performing blocks and improved ability to make a successful block.',
  },
  Block_: {
    title: 'Block+',
    icon: ICON_Block_,
    info: 'A player who is known for performing elastic and overreaching blocks.',
    description:
      'Even greater reach when performing blocks and improved ability to make a successful block.',
  },
  Intercept: {
    title: 'Intercept',
    icon: ICON_Intercept,
    info: 'A player who is known for performing interceptions and keeping ball possession.',
    description:
      'Increased reach and improved chances of retaining possession of the ball when performing interceptions.',
  },
  Intercept_: {
    title: 'Intercept+',
    icon: ICON_Intercept_,
    info: 'A player who is known for performing interceptions and keeping ball possession.',
    description:
      'Even greater reach and improved chances of retaining possession of the ball when performing interceptions.',
  },
  Anticipate: {
    title: 'Anticipate',
    icon: ICON_Anticipate,
    info: 'A player who is known for having a high success rate getting ball possession on tackles with a low fouling rate.',
    description:
      'Improved chances of standing tackle success and grants the ability to stop the ball directly at their feet when performing a standing tackle.',
  },
  Anticipate_: {
    title: 'Anticipate+',
    icon: ICON_Anticipate_,
    info: 'A player who is known for having a high success rate getting ball possession on tackles with a low fouling rate.',
    description:
      'Significantly improved chances of standing tackle success and grants the ability to stop the ball directly at their feet when performing a standing tackle.',
  },
  Slide_Tackle: {
    title: 'Slide Tackle',
    icon: ICON_Slide_Tackle,
    info: 'A player who is known for often performing slide tackles.',
    description:
      'Grants the ability to stop the ball directly at their feet when performing a slide tackle.',
  },
  Slide_Tackle_: {
    title: 'Slide Tackle+',
    icon: ICON_Slide_Tackle_,
    info: 'A player who is known for often performing slide tackles.',
    description:
      'Greatly improved slide tackle coverage. Also grants the ability to stop the ball directly at their feet when performing a slide tackle.',
  },
  Bruiser: {
    title: 'Bruiser',
    icon: ICON_Bruiser,
    info: 'A player who is known for winning possession by physical imposition.',
    description: 'Greater strength when performing physical tackles.',
  },
  Bruiser_: {
    title: 'Bruiser+',
    icon: ICON_Bruiser_,
    info: 'Even greater strength when performing physical tackles.',
    description: 'Even greater strength when performing physical tackles.',
  },

  /**
   * Finishing:
   *  - Finesse Shot
   *  - Chip Shot
   *  - Power Shot
   *  - Dead Ball
   *  - Power Header
   *
   *  Test code:
   *  ["Finesse_Shot", "Chip_Shot", "Power_Shot", "Dead_Ball", "Power_Header"]
   *  ["Finesse_Shot_", "Chip_Shot_", "Power_Shot_", "Dead_Ball_", "Power_Header_"]
   */
  Finesse_Shot: {
    title: 'Finesse Shot',
    icon: ICON_Finesse_Shot,
    info: 'A player who is known to try and place the ball when shooting at goal.',
    description:
      'Performs finesse shots faster with additional curve and improved accuracy.',
  },
  Finesse_Shot_: {
    title: 'Finesse Shot+',
    icon: ICON_Finesse_Shot_,
    info: 'A player who is known to try and place the ball when shooting at goal.',
    description:
      'Performs finesse shots significantly faster with maximum curve and exceptional accuracy.',
  },
  Chip_Shot: {
    title: 'Chip Shot',
    icon: ICON_Chip_Shot,
    info: 'A player who is known to often try to chip the goalkeeper when shooting at goal.',
    description: 'Performs chip shots faster and with greater accuracy.',
  },
  Chip_Shot_: {
    title: 'Chip Shot+',
    icon: ICON_Chip_Shot_,
    info: 'A player who is known to often try to chip the goalkeeper when shooting at goal.',
    description: 'Performs chip shots more quickly with exceptional accuracy.',
  },
  Power_Shot: {
    title: 'Power Shot',
    icon: ICON_Power_Shot,
    info: 'A player who is known for taking powerful shots from outside the box.',
    description: 'Performs power shots faster and with increased speed.',
  },
  Power_Shot_: {
    title: 'Power Shot+',
    icon: ICON_Power_Shot_,
    info: 'A player who is known for taking powerful shots from outside the box.',
    description:
      'Performs power shots much faster and with a significant increase in speed.',
  },
  Dead_Ball: {
    title: 'Dead Ball',
    icon: ICON_Dead_Ball,
    info: 'A player who is known for being a specialist at taking set pieces.',
    description:
      'Set pieces are delivered with increased speed, curve, and accuracy. Ball trajectory preview line is longer.',
  },
  Dead_Ball_: {
    title: 'Dead Ball+',
    icon: ICON_Dead_Ball_,
    info: 'A player who is known for being a specialist at taking set pieces.',
    description:
      ' Set pieces are delivered with exceptional speed, curve, and accuracy. Ball trajectory preview line is at maximum length.',
  },
  Power_Header: {
    title: 'Power Header',
    icon: ICON_Power_Header,
    info: 'A player who is known to strike with power when heading towards goal.',
    description: 'Performs headers with increased power and accuracy.',
  },
  Power_Header_: {
    title: 'Power Header+',
    icon: ICON_Power_Header_,
    info: 'A player who is known to strike with power when heading towards goal.',
    description: 'Performs headers with maximum power and accuracy.',
  },

  /**
   * Goalkeeper:
   *  - Far throw
   *  - Footwork
   *  - Cross Claimer
   *  - 1v1 Close Down
   *  - Far Reach
   *  - Deflector
   *
   *  Test code:
   *  ["Far_Throw", "Footwork", "Cross_Claimer", "1v1_Close_Down", "Far_Reach", "Deflector"]
   *  ["Far_Throw_", "Footwork_", "Cross_Claimer_", "1v1_Close_Down_", "Far_Reach_", "Deflector_"]
   */
  Far_Throw: {
    title: 'Far Throw',
    icon: ICON_Far_Throw,
    info: 'Goalkeeper can target players further away with thrown passes.',
    description:
      'BAG (Be a Goalkeeper) players will have increased reach and handling closer to the end of the match.',
  },
  Far_Throw_: {
    title: 'Far Throw+',
    icon: ICON_Far_Throw_,
    info: 'Goalkeeper can target players further away with thrown passes.',
    description:
      'BAG players will have greatly increased reach and handling closer to the end of the match.',
  },
  Footwork: {
    title: 'Footwork',
    icon: ICON_Footwork,
    info: 'Goalkeeper will perform saves with their feet more frequently.',
    description:
      'BAG players will have increased reactions and speed in 1-on-1 situations',
  },
  Footwork_: {
    title: 'Footwork+',
    icon: ICON_Footwork_,
    info: 'Goalkeeper will perform saves with their feet more frequently.',
    description:
      'BAG players will have greatly increased reactions and speed in 1-on-1 situations',
  },
  Cross_Claimer: {
    title: 'Cross Claimer',
    icon: ICON_Cross_Claimer,
    info: 'Goalkeeper will try to intercept a cross if they can get to it slightly before the opponent.',
    description:
      'BAG players will have increased reflexes and reactions during opposing set pieces.',
  },
  Cross_Claimer_: {
    title: 'Cross Claimer+',
    icon: ICON_Cross_Claimer_,
    info: 'Goalkeeper will try to intercept a cross if they can get to it slightly before the opponent.',
    description:
      'BAG players will have significantly increased reflexes and reactions during opposing set pieces.',
  },
  '1v1_Close_Down': {
    title: '1v1 Close Down',
    icon: ICON_1v1_Close_Down,
    info: 'Goalkeeper is more aggressive when coming out of the box to gather over-the-top balls or long through balls.',
    description: 'BAG players will have increased speed when running.',
  },
  '1v1_Close_Down_': {
    title: '1v1 Close Down+',
    icon: ICON_1v1_Close_Down_,
    info: 'Goalkeeper is more aggressive when coming out of the box to gather over-the-top balls or long through balls.',
    description: 'BAG players will have greatly increased speed when running.',
  },
  Far_Reach: {
    title: 'Far Reach',
    icon: ICON_Far_Reach,
    info: 'BAG exclusive',
    description:
      'BAG players are more effective at saving shots from outside the box with increased reach and jumping.',
  },
  Far_Reach_: {
    title: 'Far Reach+',
    icon: ICON_Far_Reach_,
    info: 'BAG exclusive',
    description:
      'BAG players are significantly more effective at saving shots from outside the box with greatly increased reach and jumping.',
  },
  Deflector: {
    title: 'Deflector',
    icon: ICON_Deflector,
    info: 'A goalkeeper who is known for having great deflection control to safer spaces.',
    description:
      'Performs deflection saves into safer areas with increased ball speed control.',
  },
  Deflector_: {
    title: 'Deflector+',
    icon: ICON_Deflector_,
    info: 'A goalkeeper who is known for having great deflection control to safer spaces.',
    description:
      'Performs deflection saves into safer areas or towards free teammates with greater ball speed control.',
  },

  /**
   * Passing:
   *  - Incisive Pass
   *  - Pinged Pass
   *  - Long Ball Pass
   *  - Tiki Taka
   *  - Whipped Pass
   *
   *  Test code:
   *  ["Incisive_Pass", "Pinged_Pass", "Long_Ball_Pass", "Tiki_Taka", "Whipped_Pass"]
   *  ["Incisive_Pass_", "Pinged_Pass_", "Long_Ball_Pass_", "Tiki_Taka_", "Whipped_Pass_"]
   */
  Incisive_Pass: {
    title: 'Incisive Pass',
    icon: ICON_Incisive_Pass,
    info: 'A player who is known for making defense-splitting passes for a teammate to run onto.',
    description:
      'Through Passes are more accurate, Swerve Passes are delivered with more curve, and Precision Passes travel faster to the destination.',
  },
  Incisive_Pass_: {
    title: 'Incisive Pass+',
    icon: ICON_Incisive_Pass_,
    info: 'A player who is known for making defense-splitting passes for a teammate to run onto.',
    description:
      'Through Passes are far more accurate, Swerve Passes are delivered with maximum curve, and Precision Passes travel at top speed to the destination.',
  },
  Pinged_Pass: {
    title: 'Pinged Pass',
    icon: ICON_Pinged_Pass,
    info: 'A player who is known for making high speed ground passes.',
    description:
      'Passes travel faster along the ground without impacting the trapping difficulty of the receiver.',
  },
  Pinged_Pass_: {
    title: 'Pinged Pass+',
    icon: ICON_Pinged_Pass_,
    info: 'A player who is known for making high speed ground passes.',
    description:
      'Passes travel much faster along the ground without impacting the trapping difficulty of the receiver.',
  },
  Long_Ball_Pass: {
    title: 'Long Ball Pass',
    icon: ICON_Long_Ball_Pass,
    info: 'A player who is known for performing lobbed long passes to teammates.',
    description:
      'Lob and Lofted Through Passes are more accurate, travel faster, and are more difficult to intercept.',
  },
  Long_Ball_Pass_: {
    title: 'Long Ball Pass+',
    icon: ICON_Long_Ball_Pass_,
    info: 'A player who is known for performing lobbed long passes to teammates.',
    description:
      'Lob and Lofted Through Passes are even more accurate, travel faster than ever, and are far more difficult to intercept.',
  },
  Tiki_Taka: {
    title: 'Tiki Taka',
    icon: ICON_Tiki_Taka,
    info: 'A player who is known for making first-time accurate and short passes.',
    description:
      'Executes difficult first-time Ground Passes with high accuracy, using backheels when contextually appropriate. Short distance Ground Passes are highly accurate.',
  },
  Tiki_Taka_: {
    title: 'Tiki Taka+',
    icon: ICON_Tiki_Taka_,
    info: 'A player who is known for making first-time accurate and short passes.',
    description:
      'Executes difficult first-time Ground Passes with even greater accuracy, using backheels when contextually appropriate. Short distance Ground Passes are exceptionally accurate.',
  },
  Whipped_Pass: {
    title: 'Whipped Pass',
    icon: ICON_Whipped_Pass,
    info: 'A player who is known for making high-speed whipped crosses into the box.',
    description:
      'All crosses are highly accurate, travel faster, and with more curve.',
  },
  Whipped_Pass_: {
    title: 'Whipped Pass+',
    icon: ICON_Whipped_Pass_,
    info: 'A player who is known for making high-speed whipped crosses into the box.',
    description:
      'All crosses are highly accurate, travel faster, and with more curve. Performs driven crosses with exceptional power.',
  },

  /**
   * Physical:
   *  - Quick Step
   *  - Relentless
   *  - Trivela
   *  - Acrobatic
   *  - Long Throw
   *  - Aerial
   *
   *  Test code:
   *  ["Quick_Step", "Relentless", "Trivela", "Acrobatic", "Long_Throw", "Aerial"]
   *  ["Quick_Step_", "Relentless_", "Trivela_", "Acrobatic_", "Long_Throw_", "Aerial_"]
   */
  Quick_Step: {
    title: 'Quick Step',
    icon: ICON_Quick_Step,
    info: 'A player who is known to have a quick burst of speed when accelerating on and off the ball.',
    description: 'Accelerates faster during Explosive Sprint.',
  },
  Quick_Step_: {
    title: 'Quick Step+',
    icon: ICON_Quick_Step_,
    info: 'A player who is known to have a quick burst of speed when accelerating on and off the ball.',
    description: 'Accelerates significantly faster during Explosive Sprint.',
  },
  Relentless: {
    title: 'Relentless',
    icon: ICON_Relentless,
    info: 'A player who is known for covering a greater area of the field compared to other players in the same position.',
    description:
      'Reduces fatigue loss during play and increases fatigue recovery during halftime.',
  },
  Relentless_: {
    title: 'Relentless+',
    icon: ICON_Relentless_,
    info: 'A player who is known for covering a greater area of the field compared to other players in the same position.',
    description:
      'Greatly reduces the long-term fatigue effects on attributes, reaction time, and defensive awareness. Reduces fatigue loss during play and significantly increases fatigue recovery during halftime.',
  },
  Trivela: {
    title: 'Trivela',
    icon: ICON_Trivela,
    info: 'A player who is known for passing, crossing, and shooting with the outside of the foot.',
    description:
      'Contextually triggers "outside of the foot" passes and shots. Reduced error on "outside the foot" passes.',
  },
  Trivela_: {
    title: 'Trivela+',
    icon: ICON_Trivela_,
    info: 'A player who is known for passing, crossing, and shooting with the outside of the foot.',
    description:
      'Contextually triggers "outside of the foot" passes and shots. Reduced error on "outside the foot" passes.',
  },
  Acrobatic: {
    title: 'Acrobatic',
    icon: ICON_Acrobatic,
    info: 'A player who tends to perform acrobatic passes, clearances, and shots.',
    description:
      'Performs volleys with improved accuracy and has access to acrobatic volley animations.',
  },
  Acrobatic_: {
    title: 'Acrobatic+',
    icon: ICON_Acrobatic_,
    info: 'A player who tends to perform acrobatic passes, clearances, and shots.',
    description:
      'Performs volleys with significant accuracy and has access to unique acrobatic volley animations.',
  },
  Long_Throw: {
    title: 'Long Throw',
    icon: ICON_Long_Throw,
    info: 'A player who is known to throw the ball further than the average player.',
    description:
      'Performs throw-ins with increased power to cover a greater distance.',
  },
  Long_Throw_: {
    title: 'Long Throw+',
    icon: ICON_Long_Throw_,
    info: 'A player who is known to throw the ball further than the average player.',
    description:
      'Performs throw-ins with more power to cover maximum distance.',
  },
  Aerial: {
    title: 'Aerial',
    icon: ICON_Aerial,
    info: 'A player who is known for having a high success rate winning aerial battles in both offense and defense.',
    description:
      'Performs higher jumps and has improved aerial physical presence.',
  },
  Aerial_: {
    title: 'Aerial+',
    icon: ICON_Aerial_,
    info: 'A player who is known for having a high success rate winning aerial battles in both offense and defense.',
    description:
      'A player who is known for having a high success rate winning aerial battles in both offense and defense.',
  },

  //////////////////////////////////////////////////////////////////////////////////////////
};

export const PlayStylesComponent = ({ playStyle }: { playStyle: string }) => {
  return (
    <div className="inline-block h-14 w-14 m-1 rounded-full bg-gray-600 p-2">
      <Popover
        className="w-80 rounded"
        position={'topLeft'}
        content={
          <div className="bg-gray-100 p-2">
            <div className={`text-lg font-bold mb-1 text-green-700`}>
              {PLAY_STYLES_LIST[playStyle]?.title}
            </div>

            {/* Info */}
            <div className="text-sm italic border-l-4 border-gray-400 p-2 text-gray-700">
              {PLAY_STYLES_LIST[playStyle]?.info}
            </div>
            {/* Description */}
            <div className="text-sm font-mono mt-2">
              {PLAY_STYLES_LIST[playStyle]?.description}
            </div>
          </div>
        }
      >
        {/*<div>{PlayStylesList[playStyle].title}</div>*/}
        {!PLAY_STYLES_LIST[playStyle] && <div>{playStyle}</div>}
        <img
          className="h-10 w-10"
          src={PLAY_STYLES_LIST[playStyle]?.icon}
          alt=""
        />
      </Popover>
    </div>
  );
};
