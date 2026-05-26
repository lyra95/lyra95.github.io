#!/usr/bin/env node
import { mkdir, readFile, writeFile, access, readdir } from 'node:fs/promises'
import { dirname, resolve, join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'

const POSTS_DIR = resolve(fileURLToPath(new URL('../src/posts', import.meta.url)))
const TEMPLATE = fileURLToPath(new URL('./post-template.mdx', import.meta.url))

const ESC = String.fromCharCode(27)
const CTRL_C = String.fromCharCode(3)

// posts/ 기준 표시용 경로 (예: "posts/General Relativity")
function display(dir) {
  const rel = relative(POSTS_DIR, dir).replace(/\\/g, '/')
  return rel ? `posts/${rel}` : 'posts/'
}

// 화살표 키로 고르는 단일 선택 메뉴
function select(message, choices) {
  return new Promise((resolvePromise, reject) => {
    const { stdin, stdout } = process
    let index = 0

    function render(first) {
      if (!first) stdout.write(`${ESC}[${choices.length}A`)
      for (let i = 0; i < choices.length; i++) {
        const active = i === index
        const line = active
          ? `${ESC}[36m> ${choices[i].label}${ESC}[0m`
          : `  ${choices[i].label}`
        stdout.write(`${ESC}[2K${line}\n`)
      }
    }

    function cleanup() {
      stdin.setRawMode(false)
      stdin.pause()
      stdin.removeListener('data', onData)
    }

    function onData(key) {
      if (key === CTRL_C || key === ESC) {            // Ctrl-C / Esc
        cleanup()
        stdout.write('\n')
        reject(new Error('cancelled'))
      } else if (key === '\r' || key === '\n') {        // Enter
        cleanup()
        resolvePromise(choices[index].value)
      } else if (key === `${ESC}[A`) {                  // ↑
        index = (index - 1 + choices.length) % choices.length
        render(false)
      } else if (key === `${ESC}[B`) {                  // ↓
        index = (index + 1) % choices.length
        render(false)
      }
    }

    stdout.write(`${message}\n`)
    render(true)
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    stdin.on('data', onData)
  })
}

async function prompt(message) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await rl.question(message)
  rl.close()
  return answer.trim()
}

async function pickDirectory() {
  let current = POSTS_DIR
  for (;;) {
    const entries = await readdir(current, { withFileTypes: true })
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort()

    const choices = [
      { label: `[이 폴더에 만들기]  (${display(current)})`, value: { type: 'select' } },
      ...dirs.map(name => ({ label: `${name}/`, value: { type: 'enter', name } })),
      { label: '[+ 새 폴더 만들기]', value: { type: 'new' } },
    ]

    const choice = await select(`폴더 선택 — 현재: ${display(current)}`, choices)

    if (choice.type === 'select') return current
    if (choice.type === 'enter') {
      current = join(current, choice.name)
    } else if (choice.type === 'new') {
      const name = await prompt('새 폴더 이름: ')
      if (name) {
        current = join(current, name)
        await mkdir(current, { recursive: true })
      }
    }
  }
}

async function main() {
  const dir = await pickDirectory()

  let fileName = await prompt('파일 이름 (.mdx): ')
  if (!fileName) {
    console.error('파일 이름이 비어 있어 취소했습니다.')
    process.exit(1)
  }
  if (extname(fileName) !== '.mdx') fileName += '.mdx'

  const target = join(dir, fileName)

  try {
    await access(target)
    console.error(`이미 존재합니다: ${display(target)}`)
    process.exit(1)
  } catch {
    // 없으면 진행
  }

  // 템플릿을 읽어 date만 오늘 날짜로 채운다 (예: 'June 12, 2026')
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const content = (await readFile(TEMPLATE, 'utf8')).replace("date: ''", `date: '${today}'`)

  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content, 'utf8')
  console.log(`\n생성됨: ${display(target)}`)
}

main().catch(err => {
  if (err?.message === 'cancelled') {
    console.error('취소했습니다.')
    process.exit(130)
  }
  console.error(err)
  process.exit(1)
})
