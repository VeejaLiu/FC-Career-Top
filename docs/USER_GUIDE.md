# Player guide

[Documentation](README.md) · [Run locally](DEVELOPMENT.md) · [中文介绍](../README.zh-CN.md)

FC Career Top records the squad in your EA FC 24–27 Manager Career Mode and
lets you follow each player's overall rating and potential across seasons.
Use the [hosted dashboard](https://app.fccareer.top), or run your own instance.
Registration requires email and password; your username is generated automatically.

## Requirements

- EA FC 24, 25, 26 or 27 on a Windows PC.
- A Live Editor version compatible with your game build:
  [FC 24](https://github.com/xAranaktu/FC-24-Live-Editor),
  [FC 25](https://github.com/xAranaktu/FC-25-Live-Editor),
  [FC 26](https://github.com/xAranaktu/FC-26-Live-Editor) or
  [FC 27](https://github.com/xAranaktu/FC-27-Live-Editor).
- An accessible FC Career Top dashboard and backend.
- FC 25 v25.2.9 and later provide native HTTP uploads. The script detects this
  capability at runtime. FC 24 and editors without it require Windows `curl`
  and write permission in the Windows temporary directory.

Follow the Live Editor project's own installation and compatibility instructions.

## Connect your career

1. Open the dashboard. A local installation uses `http://localhost:3000`.
2. Register with an email and password. Sign in with email and password; verification is disabled.
3. Select **FC 24**, **FC 25**, **FC 26** or **FC 27** using the game-version selector.
4. Start the matching game through Live Editor and load your Manager Career Mode save.
5. Open **Get Started** in the dashboard and copy the generated Lua script.
6. Open Live Editor's **Lua engine**, paste the script, and execute it.
7. Check the **Players** page for the initial snapshot. Further snapshots are
   uploaded after in-game weeks pass while the script's event handler is registered.

The generated script contains your personal API secret key and the upload URL.
Keep it private. If you refresh your API key in Settings, copy the newly generated
script and run that version in Live Editor.

When upgrading from the older tracking script, restart the game before running
the new script once. Older listeners cannot be identified safely. Later executions
of the new script replace only its own listener.

If the game and backend run on different computers, the upload URL must be
reachable from the Windows game PC. See [network configuration](DEVELOPMENT.md#game-and-backend-on-different-computers).

## Explore the data

| Page | What to look for |
| --- | --- |
| Players | Squad overview, search, sorting, overall/potential, and position-ranking badges |
| Players Trends | Overall and potential curves grouped by playing position |
| Player Detail | Current attributes, available PlayStyles, and an individual growth chart |
| Notifications | Rating, potential, skill-move, and weak-foot changes |
| Settings | Username, email, password, API key, and notification preferences |

Choose the notification types you want in Settings. FC 24–27 data are
selected separately through the game-version setting.

Player Detail also shows recorded role familiarity, hidden traits, profile,
contract data, and current-season statistics when the editor provides them.
Missing values appear as a dash. FC 27 database OVR is shown separately from
Dynamic OVR, which is not estimated. See the [version and field support
guide](PLAYER_DATA_SUPPORT.md) for game differences and API limitations.

## Current limitations and troubleshooting

| Symptom or question | Explanation / next step |
| --- | --- |
| A black command window appears | Editors without native HTTP use Windows `curl`. The window can briefly take focus; let the upload finish. Temporary files are removed after the request. |
| File creation reports `Permission denied` | The curl fallback needs write permission in the Windows temporary directory. Native HTTP does not need upload files. |
| An upload is skipped | Check the Live Editor log. Empty or incomplete rosters are not uploaded, and unsuccessful requests are not reported as saved. |
| Dates look wrong in FC 24 | The FC 24 script retains a day-event date workaround. Run it after loading the career and check the recorded dates. |
| Get Started is unavailable | Sign in again and check API connectivity. Email verification is not required. |
| Players do not appear | Check the selected game version, load Manager Career Mode, check Live Editor's logs, and confirm the upload URL is reachable. |
| A refreshed API key no longer works in-game | Copy the current script from Get Started and replace the older script. |
| Tracking different saves | There is no multi-save selector. Use one career per account/game version to avoid mixing snapshots. |
| Full historical attributes | Growth charts track overall rating and potential; detailed attributes show the current snapshot. |
| Using other career-mode Lua scripts | The tracking script manages only its own listener; other career-mode listeners are preserved. |

If you need help, open a [GitHub issue](https://github.com/VeejaLiu/FC-Career-Top/issues)
with the game version, the page or step involved, and relevant logs with API keys removed.
