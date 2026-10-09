# Documentation

[Project overview](../README.md) · [中文介绍](../README.zh-CN.md)

## Start here

| Audience | Guide |
| --- | --- |
| Players using an available instance | [Player guide](USER_GUIDE.md) |
| Running locally or contributing | [Development](DEVELOPMENT.md) |
| Creating or changing the database | [Database migrations](DATABASE.md) |
| Preparing a first deployment | [Deployment](DEPLOYMENT.md) |

Use the [hosted dashboard](https://app.fccareer.top), or start with local development
to run your own instance. Follow the player guide to connect the game.

## Application guides

| Application | Guide | Source |
| --- | --- | --- |
| Player dashboard | [Frontend](components/frontend.md) | [apps/frontend](../apps/frontend) |
| Public website | [Website](components/website.md) | [apps/website](../apps/website) |
| API and notifications | [Backend](components/backend.md) | [apps/backend](../apps/backend) |

Shared setup and commands are documented once in the development guide. The
application guides describe each application's role, source layout, and specific settings.

## Assets and historical material

- [Screenshots](assets/screenshots): application captures used by the root README.
- [Historical records](archive/README.md): the repository consolidation and original media scripts.

D1 migrations and the legacy MySQL/Flyway configuration remain in
[apps/backend/db](../apps/backend/db), next to the backend code.
