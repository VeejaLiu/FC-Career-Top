-- Keep each secret's random suffix intact. The API accepts both historical and
-- canonical prefixes so existing Live Editor scripts continue to work.
UPDATE user_secret_key SET secret_key='fct-' || substr(secret_key,5)
WHERE substr(secret_key,1,4)='fcd-';
