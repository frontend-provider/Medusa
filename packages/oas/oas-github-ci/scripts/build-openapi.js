#!/usr/bin/env node

const fs = require("fs/promises")
const os = require("os")
const path = require("path")
const execa = require("execa")

const isDryRun = process.argv.indexOf("--dry-run") !== -1
const basePath = path.resolve(__dirname, `../`)
const repoRootPath = path.resolve(basePath, `../../../`)
const docsApiPath = path.resolve(repoRootPath, "docs/api/")

const run = async () => {
  const oasOutDir = isDryRun ? await getTmpDirectory() : docsApiPath
  for (const apiType of ["store", "admin"]) {
    await generateOASSource(oasOutDir, apiType)
    const oasSrcFile = path.resolve(oasOutDir, `${apiType}.oas.json`)
    const docsOutDir = path.resolve(oasOutDir, apiType)
    await generateDocs(oasSrcFile, docsOutDir, isDryRun)
  }
}

const generateOASSource = async (outDir, apiType) => {
  const { all: logs } = await execa(
    "medusa-oas",
    ["oas", `--type=${apiType}`, `--out-dir=${outDir}`],
    { cwd: basePath, all: true }
  )
  console.log(logs)
}

const generateDocs = async (srcFile, outDir, isDryRun) => {
  const params = [
    "docs",
    `--src-file=${srcFile}`,
    `--out-dir=${outDir}`,
    `--clean`,
    `--split`,
  ]
  if (isDryRun) {
    params.push("--dry-run")
  }
  const { all: logs } = await execa("medusa-oas", params, {
    cwd: basePath,
    all: true,
  })
  console.log(logs)
}

const getTmpDirectory = async () => {
  /**
   * RUNNER_TEMP: GitHub action, the path to a temporary directory on the runner.
   */
  const tmpDir = process.env["RUNNER_TEMP"] ?? os.tmpdir()
  return await fs.mkdtemp(tmpDir)
}

void (async () => {
  try {
    await run()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
