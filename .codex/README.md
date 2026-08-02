# Codex project configuration

`config.toml` keeps Codex writes inside the workspace and asks before operations that
need broader authority. Network access remains off by default; dependency downloads
can be approved explicitly when needed.

Durable engineering and content conventions live in the repository-root
`AGENTS.md`. Keep product rules there instead of duplicating them in this directory.

The learning-project workflow is documented in
`docs/CODEX_LEARNING_PROJECT_GUIDE.md`; `AGENTS.md` requires it to be read before
learning-project content changes.

Project-scoped Codex configuration is only applied after the repository is marked as
trusted. Personal model, provider, authentication, notification, and telemetry
preferences belong in the user's global Codex configuration, not this repository.
