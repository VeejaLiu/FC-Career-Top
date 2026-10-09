import Sequelize, { ModelAttributes, Model } from 'sequelize';
import { sequelize } from '../db-config-mysql';
import { Defaultconfig } from '../db-config-mysql';

/*
CREATE TABLE `player` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `game_version` int DEFAULT NULL,
  `save_id` int DEFAULT NULL,
  `player_id` int DEFAULT NULL,
  `player_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `birthdate` int DEFAULT NULL,
  `age` int DEFAULT NULL,
  `overallrating` int DEFAULT NULL,
  `potential` int DEFAULT NULL,
  `nationality` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `height` int DEFAULT NULL,
  `weight` int DEFAULT NULL,
  `preferredfoot` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `preferredposition1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `preferredposition2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `preferredposition3` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `preferredposition4` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `skillmoves` int DEFAULT NULL,
  `weakfootabilitytypecode` int DEFAULT NULL,
  `attackingworkrate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `defensiveworkrate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `acceleration` int DEFAULT NULL,
  `sprintspeed` int DEFAULT NULL,
  `positioning` int DEFAULT NULL,
  `finishing` int DEFAULT NULL,
  `shotpower` int DEFAULT NULL,
  `longshots` int DEFAULT NULL,
  `volleys` int DEFAULT NULL,
  `penalties` int DEFAULT NULL,
  `vision` int DEFAULT NULL,
  `crossing` int DEFAULT NULL,
  `freekickaccuracy` int DEFAULT NULL,
  `shortpassing` int DEFAULT NULL,
  `longpassing` int DEFAULT NULL,
  `curve` int DEFAULT NULL,
  `agility` int DEFAULT NULL,
  `balance` int DEFAULT NULL,
  `reactions` int DEFAULT NULL,
  `ballcontrol` int DEFAULT NULL,
  `dribbling` int DEFAULT NULL,
  `composure` int DEFAULT NULL,
  `interceptions` int DEFAULT NULL,
  `headingaccuracy` int DEFAULT NULL,
  `defensiveawareness` int DEFAULT NULL,
  `standingtackle` int DEFAULT NULL,
  `slidingtackle` int DEFAULT NULL,
  `jumping` int DEFAULT NULL,
  `stamina` int DEFAULT NULL,
  `strength` int DEFAULT NULL,
  `aggression` int DEFAULT NULL,
  `gkdiving` int DEFAULT NULL,
  `gkhandling` int DEFAULT NULL,
  `gkkicking` int DEFAULT NULL,
  `gkpositioning` int DEFAULT NULL,
  `gkreflexes` int DEFAULT NULL,
  `play_styles` varchar(2000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_archived` int DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_player_id` (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
 */
const PlayerSchema: ModelAttributes = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    game_version: {
        type: Sequelize.INTEGER,
    },
    save_id: {
        type: Sequelize.INTEGER,
    },
    player_id: {
        type: Sequelize.INTEGER,
    },
    player_name: {
        type: Sequelize.TEXT,
    },
    birthdate: {
        type: Sequelize.INTEGER,
    },
    age: {
        type: Sequelize.INTEGER,
    },
    overallrating: {
        type: Sequelize.INTEGER,
    },
    potential: {
        type: Sequelize.INTEGER,
    },
    nationality: {
        type: Sequelize.TEXT,
    },
    height: {
        type: Sequelize.INTEGER,
    },
    weight: {
        type: Sequelize.INTEGER,
    },
    preferredfoot: {
        type: Sequelize.TEXT,
    },
    preferredposition1: {
        type: Sequelize.TEXT,
    },
    preferredposition2: {
        type: Sequelize.TEXT,
    },
    preferredposition3: {
        type: Sequelize.TEXT,
    },
    preferredposition4: {
        type: Sequelize.TEXT,
    },
    skillmoves: {
        type: Sequelize.INTEGER,
    },
    weakfootabilitytypecode: {
        type: Sequelize.INTEGER,
    },
    attackingworkrate: {
        type: Sequelize.TEXT,
    },
    defensiveworkrate: {
        type: Sequelize.TEXT,
    },
    acceleration: {
        type: Sequelize.INTEGER,
    },
    sprintspeed: {
        type: Sequelize.INTEGER,
    },
    positioning: {
        type: Sequelize.INTEGER,
    },
    finishing: {
        type: Sequelize.INTEGER,
    },
    shotpower: {
        type: Sequelize.INTEGER,
    },
    longshots: {
        type: Sequelize.INTEGER,
    },
    volleys: {
        type: Sequelize.INTEGER,
    },
    penalties: {
        type: Sequelize.INTEGER,
    },
    vision: {
        type: Sequelize.INTEGER,
    },
    crossing: {
        type: Sequelize.INTEGER,
    },
    freekickaccuracy: {
        type: Sequelize.INTEGER,
    },
    shortpassing: {
        type: Sequelize.INTEGER,
    },
    longpassing: {
        type: Sequelize.INTEGER,
    },
    curve: {
        type: Sequelize.INTEGER,
    },
    agility: {
        type: Sequelize.INTEGER,
    },
    balance: {
        type: Sequelize.INTEGER,
    },
    reactions: {
        type: Sequelize.INTEGER,
    },
    ballcontrol: {
        type: Sequelize.INTEGER,
    },
    dribbling: {
        type: Sequelize.INTEGER,
    },
    composure: {
        type: Sequelize.INTEGER,
    },
    interceptions: {
        type: Sequelize.INTEGER,
    },
    headingaccuracy: {
        type: Sequelize.INTEGER,
    },
    defensiveawareness: {
        type: Sequelize.INTEGER,
    },
    standingtackle: {
        type: Sequelize.INTEGER,
    },
    slidingtackle: {
        type: Sequelize.INTEGER,
    },
    jumping: {
        type: Sequelize.INTEGER,
    },
    stamina: {
        type: Sequelize.INTEGER,
    },
    strength: {
        type: Sequelize.INTEGER,
    },
    aggression: {
        type: Sequelize.INTEGER,
    },
    gkdiving: {
        type: Sequelize.INTEGER,
    },
    gkhandling: {
        type: Sequelize.INTEGER,
    },
    gkkicking: {
        type: Sequelize.INTEGER,
    },
    gkpositioning: {
        type: Sequelize.INTEGER,
    },
    gkreflexes: {
        type: Sequelize.INTEGER,
    },
    play_styles: {
        type: Sequelize.STRING,
    },
    is_archived: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    create_time: {
        type: Sequelize.DATE,
    },
    update_time: {
        type: Sequelize.DATE,
    },
};

export interface PlayerDB {
    id?: number;
    game_version?: number;
    user_id?: number;
    save_id?: number | null;
    player_id?: number | null;
    player_name?: string | null;
    birthdate?: number | null;
    age?: number | null;
    overallrating?: number | null;
    potential?: number | null;
    nationality?: string | null;
    height?: number | null;
    weight?: number | null;
    preferredfoot?: string | null;
    preferredposition1?: string | null;
    preferredposition2?: string | null;
    preferredposition3?: string | null;
    preferredposition4?: string | null;
    skillmoves?: number | null;
    weakfootabilitytypecode?: number | null;
    attackingworkrate?: string | null;
    defensiveworkrate?: string | null;
    acceleration?: number | null;
    sprintspeed?: number | null;
    positioning?: number | null;
    finishing?: number | null;
    shotpower?: number | null;
    longshots?: number | null;
    volleys?: number | null;
    penalties?: number | null;
    vision?: number | null;
    crossing?: number | null;
    freekickaccuracy?: number | null;
    shortpassing?: number | null;
    longpassing?: number | null;
    curve?: number | null;
    agility?: number | null;
    balance?: number | null;
    reactions?: number | null;
    ballcontrol?: number | null;
    dribbling?: number | null;
    composure?: number | null;
    interceptions?: number | null;
    headingaccuracy?: number | null;
    defensiveawareness?: number | null;
    standingtackle?: number | null;
    slidingtackle?: number | null;
    jumping?: number | null;
    stamina?: number | null;
    strength?: number | null;
    aggression?: number | null;
    gkdiving?: number | null;
    gkhandling?: number | null;
    gkkicking?: number | null;
    gkpositioning?: number | null;
    gkreflexes?: number | null;
    play_styles?: string | null;
    is_archived?: number;
    is_deleted?: boolean;
    create_time?: Date;
    update_time?: Date;
}

export class PlayerModel extends Model<PlayerDB> {
    public id!: number;
    public game_version!: number;
    public user_id!: number;
    public save_id!: number | null;
    public player_id!: number | null;
    public player_name!: string | null;
    public birthdate!: number | null;
    public age!: number | null;
    public overallrating!: number | null;
    public potential!: number | null;
    public nationality!: string | null;
    public height!: number | null;
    public weight!: number | null;
    public preferredfoot!: string | null;
    public preferredposition1!: string | null;
    public preferredposition2!: string | null;
    public preferredposition3!: string | null;
    public preferredposition4!: string | null;
    public skillmoves!: number | null;
    public weakfootabilitytypecode!: number | null;
    public attackingworkrate!: string | null;
    public defensiveworkrate!: string | null;
    public acceleration!: number | null;
    public sprintspeed!: number | null;
    public positioning!: number | null;
    public finishing!: number | null;
    public shotpower!: number | null;
    public longshots!: number | null;
    public volleys!: number | null;
    public penalties!: number | null;
    public vision!: number | null;
    public crossing!: number | null;
    public freekickaccuracy!: number | null;
    public shortpassing!: number | null;
    public longpassing!: number | null;
    public curve!: number | null;
    public agility!: number | null;
    public balance!: number | null;
    public reactions!: number | null;
    public ballcontrol!: number | null;
    public dribbling!: number | null;
    public composure!: number | null;
    public interceptions!: number | null;
    public headingaccuracy!: number | null;
    public defensiveawareness!: number | null;
    public standingtackle!: number | null;
    public slidingtackle!: number | null;
    public jumping!: number | null;
    public stamina!: number | null;
    public strength!: number | null;
    public aggression!: number | null;
    public gkdiving!: number | null;
    public gkhandling!: number | null;
    public gkkicking!: number | null;
    public gkpositioning!: number | null;
    public gkreflexes!: number | null;
    public play_styles!: string | null;
    public is_archived!: number;
    public is_deleted!: boolean;
    public create_time!: Date;
    public update_time!: Date;
}

// Define the model with Sequelize
PlayerModel.init(PlayerSchema, {
    ...Defaultconfig,
    sequelize, // the sequelize instance
    tableName: 'player',
});
