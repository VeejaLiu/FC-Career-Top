# Player guide

[Documentation](README.md) · [Run locally](DEVELOPMENT.md) · [中文介绍](../README.zh-CN.md)

FC Career Top records the squad in your EA FC 24/25 Manager Career Mode and
lets you follow each player's overall rating and potential across seasons.
Use the [hosted dashboard](https://app.fccareer.top), or run your own instance.
Registration requires email and password; your username is generated automatically.

## Requirements

- EA FC 24 or EA FC 25 on a Windows PC.
- A Live Editor version compatible with your game build:
  [FC 24](https://github.com/xAranaktu/FC-24-Live-Editor) or
  [FC 25](https://github.com/xAranaktu/FC-25-Live-Editor).
- An accessible FC Career Top dashboard and backend.
- Windows `curl` and write permission in the directory used by the Lua engine.

Follow the Live Editor project's own installation and compatibility instructions.

## Connect your career

1. Open the dashboard. A local installation uses `http://localhost:3000`.
2. Register with an email and password. Sign in with email and password; verification is disabled.
3. Select **FC 24** or **FC 25** using the game-version selector.
4. Start the matching game through Live Editor and load your Manager Career Mode save.
5. Open **Get Started** in the dashboard and copy the generated Lua script.
6. Open Live Editor's **Lua engine**, paste the script, and execute it.
7. Check the **Players** page for the initial snapshot. Further snapshots are
   uploaded after in-game weeks pass while the script's event handler is registered.

The generated script contains your personal API secret key and the upload URL.
Keep it private. If you refresh your API key in Settings, copy the newly generated
script and run that version in Live Editor.

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

Choose the notification types you want in Settings. FC 24 and FC 25 data are
selected separately through the game-version setting.

## Current limitations and troubleshooting

| Symptom or question | Explanation / next step |
| --- | --- |
| A black command window appears | The Lua script writes a JSON file and runs Windows `curl` to upload it. The window can briefly take focus; let the upload finish. |
| File creation reports `Permission denied` | Give the script write permission in its working directory, typically the game directory. |
| Get Started is unavailable | Sign in again and check API connectivity. Email verification is not required. |
| Players do not appear | Check the selected game version, load Manager Career Mode, check Live Editor's logs, and confirm the upload URL is reachable. |
| A refreshed API key no longer works in-game | Copy the current script from Get Started and replace the older script. |
| Tracking different saves | There is no multi-save selector. Use one career per account/game version to avoid mixing snapshots. |
| Full historical attributes | Growth charts track overall rating and potential; detailed attributes show the current snapshot. |
| Using other career-mode Lua scripts | The generated tracking scripts remove existing career-mode event handlers before adding their own. Check handler registration when combining scripts. |

If you need help, open a [GitHub issue](https://github.com/VeejaLiu/FC-Career-Top/issues)
with the game version, the page or step involved, and relevant logs with API keys removed.
