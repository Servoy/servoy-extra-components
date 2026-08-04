import type { Plugin } from "@opencode-ai/plugin"

const JIRA_KEY_PATTERN = /^(SVY|SVYX|SERVOY)-\d+/
const AI_SUFFIX = "[ai]"

interface CommitLintOptions {
  requireJiraKey?: boolean
}

function validateCommitMessage(message: string, options: CommitLintOptions = {}): string[] {
  const errors: string[] = []
  const subject = message.split("\n")[0]

  if (options.requireJiraKey && !JIRA_KEY_PATTERN.test(subject)) {
    errors.push(
      "Commit subject must start with a Jira case number (e.g. SVY-21080, SVYX-456, SERVOY-293)"
    )
  }

  if (!subject.trimEnd().endsWith(AI_SUFFIX)) {
    errors.push("Commit subject must end with [ai] when code is AI-generated")
  }

  if (subject.length > 100) {
    errors.push(`Commit subject is ${subject.length} chars — keep it under 100`)
  }

  return errors
}

let requireJiraKey = false

export default (async () => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "skill" && output.args?.name === "sdd") {
        requireJiraKey = true
        return
      }

      if (input.tool !== "bash") return

      const args = output.args as Record<string, string>
      const command = args.command
      if (!command || !command.includes("git commit")) return

      const messageMatch = command.match(/-m\s+"([^"]+)"/) || command.match(/-m\s+'([^']+)'/)
      if (!messageMatch) return

      const message = messageMatch[1]
      const errors = validateCommitMessage(message, { requireJiraKey })

      if (errors.length > 0) {
        throw new Error(
          `Commit message validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}\n\n` +
            (requireJiraKey
              ? `Expected format: <JIRA_KEY> <short description> [ai]\n` +
                `Example: SVY-21080 add embedded sidenav collapse animation [ai]`
              : `Expected format: <short description> [ai]\n` +
                `Example: update sidenav collapse animation [ai]`)
        )
      }
    },
  }
}) satisfies Plugin
