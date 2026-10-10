#!/usr/bin/env python3
"""Add one persistent demo squad to an existing account in the local D1 database.

Usage: python3 scripts/seed-local-demo.py --email <local-account-email>
Only reads .wrangler/state; never connects to production or changes credentials.
"""
import argparse
import datetime as dt
import json
from pathlib import Path
import sqlite3

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--email', required=True)
args = parser.parse_args()
backend = Path(__file__).resolve().parents[1]
state = backend / '.wrangler' / 'state' / 'v3' / 'd1' / 'miniflare-D1DatabaseObject'
found = []
for path in state.glob('*.sqlite'):
    connection = sqlite3.connect(f'file:{path}?mode=ro', uri=True)
    if connection.execute("SELECT 1 FROM sqlite_master WHERE name='user'").fetchone():
        row = connection.execute('SELECT id FROM user WHERE lower(email)=lower(?) AND is_deleted=0', (args.email,)).fetchone()
        if row:
            found.append((path, row[0]))
    connection.close()
if len(found) != 1:
    raise SystemExit(f'Expected one local account match; found {len(found)}. No changes made.')
path, user_id = found[0]
connection = sqlite3.connect(path, timeout=30)
seed_id = 20261009
seed_start = 9001001
seed_end = seed_start + 23
expected = 2 * 24 * 18
count = connection.execute('SELECT COUNT(*) FROM player_status_history WHERE user_id=? AND save_id=?', (user_id, seed_id)).fetchone()[0]
if count >= expected:
    print(json.dumps({'status': 'already_seeded', 'userId': user_id, 'players': 48, 'history': count}))
    raise SystemExit(0)
if connection.execute('SELECT COUNT(*) FROM player WHERE user_id=? AND player_id BETWEEN ? AND ?', (user_id, seed_start, seed_end)).fetchone()[0]:
    raise SystemExit('Reserved fixture IDs already exist. No data overwritten.')
backup = backend / '.wrangler' / 'backups' / f'before-demo-user-{user_id}.sqlite'
backup.parent.mkdir(parents=True, exist_ok=True)
if not backup.exists():
    with sqlite3.connect(backup) as destination:
        connection.backup(destination)

names = [
    'Alexander Montgomery-Wellington', 'Mateo Fernández', 'Noah Williams',
    'Gabriel Moreau', 'Luca Rossi', 'Oliver Andersen', 'Thiago Carvalho',
    'Ethan Walker', 'Leon Fischer', 'Hugo Dubois', 'Kai Nakamura',
    'Rafael da Silva', 'Daniel O’Connor', 'Samuel Johnson', 'Émile Laurent',
    'Maximilian von Hohenberg', 'Adrian Castillo', 'Benjamin Scott',
    'Nicolás Gutiérrez', 'Lucas Martins', 'Kenji Tanaka', '陈星宇',
    'Mohammed Al-Hassan', 'Niran Srisuk',
]
positions = [25, 27, 23, 25, 21, 27, 18, 14, 10, 14, 18, 12, 5, 5, 3, 7, 5, 7, 3, 10, 0, 0, 0, 14]
attributes = 'acceleration sprintspeed positioning finishing shotpower longshots volleys penalties vision crossing freekickaccuracy shortpassing longpassing curve agility balance reactions ballcontrol dribbling composure interceptions headingaccuracy defensiveawareness standingtackle slidingtackle jumping stamina strength aggression gkdiving gkhandling gkkicking gkpositioning gkreflexes'.split()
styles = [['Finesse_Shot_', 'Quick_Step', 'Technical', 'First_Touch', 'Power_Shot', 'Trivela'], ['Intercept_', 'Anticipate', 'Block', 'Jockey'], ['Incisive_Pass', 'Long_Ball_Pass_', 'Tiki_Taka'], ['Far_Reach_', 'Footwork', 'Cross_Claimer']]
now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)
with connection:
    for version in [24, 25]:
        for index, name in enumerate(names):
            player_id = seed_start + index
            position = positions[index]
            start_rating = 63 + index % 18
            final_rating = start_rating + 7
            potential = max(final_rating + 4, 88 + index % 7)
            values = dict(user_id=user_id, game_version=version, save_id=seed_id, player_id=player_id,
                player_name=name, birthdate=155000 + index * 180, age=18 + index % 15,
                overallrating=final_rating, potential=potential, nationality=14, height=173 + index % 24,
                weight=65 + index % 20, preferredfoot=1 + index % 2, preferredposition1=position,
                preferredposition2=25 if position > 19 else 14 if position > 8 else 5 if position else -1,
                preferredposition3=-1, preferredposition4=-1,
                skillmoves=2 + index % 3, weakfootabilitytypecode=2 + index % 4,
                attackingworkrate=1 + index % 3, defensiveworkrate=1 + (index + 1) % 3,
                play_styles=json.dumps(styles[3 if position == 0 else 1 if position < 9 else 2 if position < 20 else 0]))
            for offset, field in enumerate(attributes):
                value = 55 + (index * 7 + offset * 3) % 39
                values[field] = 72 + (index + offset) % 18 if position == 0 and field.startswith('gk') else 10 + offset % 10 if field.startswith('gk') else value
            columns = ','.join(values)
            placeholders = ','.join('?' for _ in values)
            connection.execute(f'INSERT INTO player({columns}) VALUES({placeholders})', tuple(values.values()))
            for week in range(18):
                date = (dt.date(2026, 6, 1) + dt.timedelta(days=week * 7)).isoformat()
                rating = start_rating + min(7, week // 2)
                history_potential = potential - 2 + min(2, week // 7)
                connection.execute('INSERT INTO player_status_history(user_id,game_version,save_id,player_id,in_game_date,overallrating,potential) VALUES(?,?,?,?,?,?,?)', (user_id,version,seed_id,player_id,date,rating,history_potential))
            for notification_index in range(3):
                subtype = ['PlayerUpdate.Overall','PlayerUpdate.SkillMove','PlayerUpdate.WeakFoot'][notification_index]
                created = (now - dt.timedelta(hours=index * 3 + notification_index)).isoformat(' ').replace('+00:00', '')
                connection.execute('INSERT INTO user_notification(user_id,game_version,in_game_date,message_type,message_subtype,player_id,old_overall_rating,overall_rating,old_potential,potential,old_skillmoves,skillmoves,old_weakfoot,weakfoot,is_read,create_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    (user_id,version,'2026-09-28','PlayerUpdate',subtype,player_id,final_rating-1,final_rating,potential-1,potential,max(1, values['skillmoves']-1),values['skillmoves'],max(1, values['weakfootabilitytypecode']-1),values['weakfootabilitytypecode'],int(index%4==0),created))
print(json.dumps({'status':'seeded','userId':user_id,'players':48,'history':expected,'notifications':144,'backup':str(backup)}))
