"""Verify legacy rows survive the career migration without fabricated attributes."""
import sqlite3
from pathlib import Path
db=sqlite3.connect(':memory:')
root=Path(__file__).resolve().parents[1]/'db/d1-migrations'
for migration in sorted(root.glob('*.sql')):
    if migration.name.startswith('0011'): break
    db.executescript(migration.read_text())
db.executescript("""
INSERT INTO user(id,username,email,password) VALUES (1,'fixture','fixture@example.test','test');
INSERT INTO player(user_id,game_version,player_id,player_name,overallrating,potential) VALUES (1,27,100,'Legacy',72,90);
INSERT INTO player_status_history(user_id,game_version,player_id,in_game_date,overallrating,potential) VALUES (1,27,100,'2026-10-01',70,90),(1,27,100,'2026-10-08',72,90);
INSERT INTO user_notification(user_id,game_version,in_game_date,message_type,message_subtype,player_id) VALUES(1,27,'2026-10-08','PlayerUpdate','PlayerUpdate.Overall',100);
""")
before={table:db.execute(f'SELECT * FROM {table}').fetchall() for table in ['user','player','player_status_history','user_notification']}
db.executescript((root/'0011_careers_and_history.sql').read_text())
# Simulate an old script's in-flight request during the API deployment.
db.execute('UPDATE player SET save_id=NULL')
db.execute('UPDATE player_status_history SET save_id=NULL')
db.execute('UPDATE user_notification SET save_id=NULL')
db.executescript((root/'0012_career_index_cutover.sql').read_text())
career=db.execute('SELECT id FROM career WHERE user_id=1 AND game_version=27 AND is_legacy=1').fetchone()[0]
for table,rows in before.items():
    assert db.execute(f'SELECT count(*) FROM {table}').fetchone()[0]==len(rows)
    if table!='user': assert db.execute(f'SELECT count(*) FROM {table} WHERE save_id=?',(career,)).fetchone()[0]==len(rows)
assert db.execute('SELECT count(*) FROM player_status_history WHERE details IS NOT NULL').fetchone()[0]==0
assert db.execute('SELECT overallrating FROM player').fetchone()[0]==72
assert db.execute('SELECT count(*) FROM career_upload').fetchone()[0]==0
print('PASS: nonempty legacy migration preserves users, players, history and notifications; no invented history or upload events.')
