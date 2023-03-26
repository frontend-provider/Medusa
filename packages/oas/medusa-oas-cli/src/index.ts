#! /usr/bin/env node

import { Command } from "commander"
import { getCommand as oasGetCommand } from "./command-oas"
import { getCommand as clientGetCommand } from "./command-client"

const run = async () => {
  const program = getBaseCommand()

  /**
   * Alias to command-oas.ts
   */
  program.addCommand(oasGetCommand())

  /**
   * Alias to command-client.ts
   */
  program.addCommand(clientGetCommand())

  /**
   * Run CLI
   */
  await program.parseAsync()
}

export function getBaseCommand() {
  const command = new Command()
  command.name("medusa-oas")
  command.action(async () => {
    console.log("No command provided.")
    command.outputHelp({ error: true })
  })
  command.showHelpAfterError(true)
  command.helpOption(false)
  return command
}

void (async () => {
  await run()
})()
