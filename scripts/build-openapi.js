#!/usr/bin/env node

const fs = require("fs/promises")
const os = require("os")
const path = require("path")
const execa = require("execa")
const yaml = require("js-yaml")
const OpenAPIParser = require("@readme/openapi-parser")

const isDryRun = process.argv.indexOf("--dry-run") !== -1
const basePath = path.resolve(__dirname, `../`)
const docsApiPath = path.resolve(basePath, "docs/api/")

const run = async () => {
  const outputPath = isDryRun ? await getTmpDirectory() : docsApiPath

  await generateOASSources(outputPath)

  for (const apiType of ["store", "admin"]) {
    const inputJsonFile = path.resolve(outputPath, `${apiType}.oas.json`)
    const outputYamlFile = path.resolve(outputPath, `${apiType}.oas.yaml`)

    await jsonFileToYamlFile(inputJsonFile, outputYamlFile)
    await sanitizeOAS(outputYamlFile)
    await circularReferenceCheck(outputYamlFile)
    if (!isDryRun) {
      await generateReference(outputYamlFile, apiType)
    }
  }
}

const generateOASSources = async (outDir, isDryRun) => {
  const params = ["oas", `--out-dir=${outDir}`]
  if (isDryRun) {
    params.push("--dry-run")
  }
  const { all: logs } = await execa("medusa-oas", params, {
    cwd: basePath,
    all: true,
  })
  console.log(logs)
}

const jsonFileToYamlFile = async (inputJsonFile, outputYamlFile) => {
  const jsonString = await fs.readFile(inputJsonFile, "utf8")
  const jsonObject = JSON.parse(jsonString)
  const yamlString = yaml.dump(jsonObject)
  await fs.writeFile(outputYamlFile, yamlString, "utf8")
}

const sanitizeOAS = async (srcFile) => {
  const { all: logs } = await execa(
    "redocly",
    [
      "bundle",
      srcFile,
      `--output=${srcFile}`,
      "--config=docs-util/redocly/config.yaml",
    ],
    { cwd: basePath, all: true }
  )
  console.log(logs)
}

const circularReferenceCheck = async (srcFile) => {
  const parser = new OpenAPIParser()
  await parser.validate(srcFile, {
    dereference: {
      circular: "ignore",
    },
  })
  if (parser.$refs.circular) {
    const fileName = path.basename(srcFile)
    const circularRefs = [...parser.$refs.circularRefs]
    circularRefs.sort()
    console.log(circularRefs)
    throw new Error(
      `🔴 Unhandled circular references - ${fileName} - Please patch in docs-util/redocly/config.yaml`
    )
  }
}

const generateReference = async (srcFile, apiType) => {
  const outDir = path.resolve(docsApiPath, `${apiType}`)
  await fs.rm(outDir, { recursive: true, force: true })
  const { all: logs } = await execa(
    "redocly",
    ["split", srcFile, `--outDir=${outDir}`],
    { cwd: basePath, all: true }
  )
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
