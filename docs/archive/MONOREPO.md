# Repository consolidation — 2026-10-09

[Historical records](README.md) · [Current deployment guide](../DEPLOYMENT.md)

## Sources

The migration preserves the existing FCT-Frontend repository identity and default
branch (`master`), and imports the other two default-branch histories through
merge commits. Original commits keep their original IDs and parent relationships.

| Source repository | Imported default-branch revision | New directory |
| --- | --- | --- |
| FCT-Frontend | `65a832d26bcb69c09dfd39ae2e34accc61fc0485` | `apps/frontend` |
| FCT-Website | `87ddc8420840eb0a2d7a363daf6d5ea1647fb511` | `apps/website` |
| FCT-Backend | `7603ac5fa90d63785a21f79f79d807ec83edbcab` | `apps/backend` |

The root `pnpm-lock.yaml` combines the original application lockfiles. Direct
dependency versions are retained. For shared transitive packages with different
dependency snapshots, the frontend's existing snapshot takes precedence, then
the website's. Required dependency status is retained when a package is optional
in one application and required in another. Future dependency updates use the
single root lockfile.

React 18 in the dashboard and React 19 in the website remain separate. The
applications do not import each other's source code. All app commands run with
the corresponding application as their working directory, preserving environment
file loading and relative paths.

## Removed workflow

On 2026-10-09, the latest commit in each source repository contained a workflow
named `Security Audit` that searched source files and Git history for credentials
and posted matching data to an external IP. These workflows were disabled in all
three repositories and excluded from the consolidated working tree. Their original
commits remain in history for traceability. Do not re-enable those legacy workflows.

The frontend workflow had completed a run before this migration. A successful
workflow result does not establish whether a valid credential was found or delivered.
The backend's committed environment sample was replaced with `.env.example` using
explicit placeholders. Any real credentials previously committed to the original
repositories require separate investigation and rotation; deleting current files
does not remove them from historical commits.
