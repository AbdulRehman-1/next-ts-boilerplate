#!/usr/bin/env node

import * as p from '@clack/prompts'
import chalk from "chalk"
import figlet from 'figlet'
import fs from "fs-extra"
import gradient from 'gradient-string'
import { setTimeout } from 'node:timers/promises'
import ora from "ora"
import path from 'path'
import { fileURLToPath } from "url"

const TITLE_TEXT = 'Create next app'

const poimandresTheme = {
  blue: '#add7ff',
  cyan: '#89ddff',
  green: '#5de4c7',
  magenta: '#fae4fc',
  red: '#d0679d',
  yellow: '#fffac2',
}

export const renderTitle = async () => {
  const gradientText = gradient(Object.values(poimandresTheme))
  const text = await figlet(TITLE_TEXT)
  console.log(gradientText.multiline(text))
}

class Question {
  constructor(question, answersArray, correctAnswerIndex) {
    this.question = question
    this.answersArray = answersArray
    this.correctAnswerIndex = correctAnswerIndex
  }
}

async function main() {
  renderTitle()

  await setTimeout(500)

  const project = await p.group(
    {
      name: () =>
        p.text({
          message: 'What will your project be called?',
        }),
    },
    {
      onCancel() {
        process.exit(1)
      },
    }
  )

  const projectName = project.name || 'next-app'
  const projectDir = path.resolve(process.cwd(), projectName)

  const __filename = fileURLToPath(import.meta.url);
  const distPath = path.dirname(__filename);
  const srcDir = path.join(path.join(distPath, "./"), "template/base");

  const spinner = ora(`Scaffolding in: ${projectDir}...\n`).start()
  spinner.start()
  fs.copySync(srcDir, projectDir)
  fs.renameSync(
    path.join(projectDir, '_gitignore'),
    path.join(projectDir, '.gitignore')
  )

  const scaffoldedName =
    projectName === '.' ? 'App' : chalk.cyan.bold(projectName)

  spinner.succeed(
    `${scaffoldedName} ${chalk.green('scaffolded successfully!')}\n`
  )
}

main().catch(console.error)
