<!--
title: Switching to Claude Code: My VSCode Workflow Without Copilot
slug: switching-to-claude-code
excerpt: I ditched GitHub Copilot and Gemini Code Assist, installed the Claude Code extension, and built a workflow around Claude's web, extension, and CLI tools. Here's what changed.
-->

I had three AI assistants in my editor and none of them were talking to each other.

GitHub Copilot was doing its autocomplete thing — grey text appearing every time I paused to think, sometimes helpful, usually not. Google's Gemini Code Assist was installed too, because I'd tried it out one afternoon and never gotten around to removing it. And then there was Claude, where I was actually doing my real work — pasting in code, describing problems, asking for help with architecture decisions.

I was paying for Copilot. I was paying for Claude Max. The Gemini extension was free but it was still taking up space, competing with Copilot for who got to show me ghost text, and occasionally doing that thing where two inline suggestion providers disagree and your cursor just vibrates between two options. Not great.

So I simplified. I removed everything except Claude, and I haven't looked back.

## Removing Copilot and Gemini

This part was surprisingly satisfying. In VSCode, you open the Extensions panel (Ctrl+Shift+X on Linux), find GitHub Copilot, click Uninstall, and then do the same for Gemini Code Assist. I also removed GitHub Copilot Chat while I was at it — it's a separate extension.

After uninstalling, I went into VSCode's settings (Ctrl+,) and searched for "copilot" and "gemini" to clean up any leftover configuration. There were a few things — Copilot had scattered settings for inline suggestions, chat features, and telemetry. I removed them all.

The immediate difference was noticeable. My editor felt _quieter_. No more grey text flickering in as I type. No more accidentally accepting a suggestion by hitting Tab when I meant to indent. I know some people love autocomplete — and I did find it useful sometimes — but for me, the signal-to-noise ratio was never great. Most of the time I was dismissing suggestions, not accepting them.

And I cancelled my Copilot subscription. One fewer monthly charge.

## Installing the Claude Code Extension

The Claude Code extension is Anthropic's official VSCode integration. You can find it in the marketplace by searching for "Claude Code" — make sure the publisher says "Anthropic", not some third party.

Install it, restart VSCode if it asks, and sign in with your Claude account. Since I have a Max subscription, everything just worked — no API keys to configure, no environment variables to set. The extension picks up your subscription and you're ready to go.

There are a few settings worth tweaking right away. I went to VSCode settings and searched for "claude" to see what was available:

- **Permission mode:** Controls how much the extension can do without asking. I keep mine on "plan" mode, which means Claude describes what it's going to do and waits for me to approve before making changes. You can also set it to auto-accept if you trust it more than I do.
- **Autosave:** I turned this on so files are saved before Claude reads or writes them. Fewer surprises.
- **Model:** You can pick which model to use for new conversations. I leave it on the default, which gives me Opus or Sonnet depending on the task.

One thing that surprised me: installing the extension also gives you the `claude` CLI tool, accessible from VSCode's integrated terminal. So you get the graphical panel _and_ the command line, sharing the same conversation history and configuration.

## How I Actually Use It

My workflow has settled into a few distinct modes depending on what I'm doing. The key insight is that Claude Code isn't just one thing — it's a web app, a VSCode panel, and a CLI, and they all share context.

### Claude Code on the web

This is my primary tool for substantial work. I go to [claude.ai/code](https://claude.ai/code), point it at a GitHub repo, and describe what I want done. Claude clones the repo into a cloud VM, works through the task — reading files, writing code, running tests — and when it's done I can review exactly what changed in a diff view.

I used it to build this very blog post, actually. I described the topic, pointed it at this repo, and let it work.

What I love about the web version is that I can start a task and walk away. Or start it on my phone using the Claude mobile app and check back later on my laptop. The work happens in the cloud, not on my machine, which means my local environment stays clean and I'm not burning battery on builds and tests.

When the work looks good, I can create a PR directly from the web interface, or pull the changes into my local environment to keep working on them.

### The VSCode extension

When I'm already in my editor and want quick help, the extension is right there. The panel opens with Cmd+Esc (or Ctrl+Esc on Linux) and I can ask questions, request edits, or get explanations without leaving my workflow.

The features I use most:

- **Highlighting code and asking about it.** Select some code in the editor and Claude automatically sees the selection. Press Alt+K to insert an @-mention with the file path and line numbers.
- **Inline diffs.** When Claude makes changes, I see them as side-by-side comparisons and can accept, reject, or modify each one.
- **@-mentions.** Type `@` followed by a filename and it does fuzzy matching. So `@auth` matches `auth.js`, `AuthService.ts`, whatever. You can reference specific line ranges too, like `@utils.ts#15-30`.
- **Plan mode.** Claude describes what it's going to do before doing it. I can review the plan, suggest changes, and then let it execute.

### The CLI in the terminal

Sometimes the full CLI experience is what I want, especially for things the extension doesn't expose — like configuring MCP servers or using the `!` bash shortcut. I just open the integrated terminal in VSCode and run `claude`.

I also use `claude --remote "task description"` to kick off a web session from my terminal. This is great when I want to describe something quickly and have it run in the cloud while I keep working locally.

### Moving between them

This is the part that feels like magic. I can start a task on the web, and then run `/teleport` (or `claude --teleport`) in my local terminal to pull that session — full conversation history, all the changes — into my local environment. Or I can open the Past Conversations dropdown in the VSCode extension, switch to the "Remote" tab, and resume a web session right there.

Conversation history is shared between the CLI and the extension too. Start something in the panel, resume it in the terminal with `claude --resume`, or vice versa. It's all one system.

## What I Like About This Setup

**One account, everywhere.** My Claude Max subscription works on the web, in the extension, and in the CLI. No juggling API keys or separate billing.

**Intentional, not interruptive.** The biggest shift from Copilot is that I'm no longer getting unsolicited suggestions. I ask Claude for help when I want it, and the rest of the time my editor is just... an editor. This felt weird for about a day and then felt liberating.

**Shared context across surfaces.** The fact that I can start a conversation in one place and continue it in another is genuinely useful. I've kicked off web sessions from my phone while on the bus, then picked them up on my laptop when I got home.

**The web version is a superpower.** Having Claude work in a cloud VM means it can run tests, check its work, iterate on failures — all without me watching. For multi-file refactors or new features, this is dramatically more useful than autocomplete ever was.

## What Could Be Better

**No inline autocomplete.** This is the obvious one. If you really loved Copilot's ghost text, Claude doesn't offer that. The model is conversational — you describe what you want and it makes the changes — rather than trying to predict the next few characters as you type. I don't miss it, but I know some people will.

**Some features are CLI-only.** MCP server configuration, the `!` bash shortcut, and tab completion only work in the CLI. You can still use the CLI inside VSCode's terminal, so it's not a dealbreaker, but it'd be nice to configure everything from the extension.

**Teleporting has requirements.** To pull a web session into your local environment, you need a clean git state, the correct repo, and the branch pushed to the remote. Reasonable constraints, but worth knowing about.

## Wrapping Up

If you're already paying for Claude, the extension plus the web version gives you something meaningfully different from Copilot — not a replacement in kind, but an upgrade in capability. You're trading autocomplete for an assistant that can read your whole codebase, reason about architecture, run your tests, and hand off work between your phone, your browser, and your editor.

For me, the simplification alone was worth it. One tool, one subscription, and a much quieter editor. That's the setup.
