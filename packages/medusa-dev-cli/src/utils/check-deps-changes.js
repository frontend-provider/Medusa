const fs = require(`fs-extra`);
const _ = require(`lodash`);
const {
  getMonorepoPackageJsonPath,
} = require(`./get-monorepo-package-json-path`);
const got = require(`got`);

function difference(object, base) {
  function changes(object, base) {
    return _.transform(object, function (result, value, key) {
      if (!_.isEqual(value, base[key])) {
        result[key] =
          _.isObject(value) && _.isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  }
  return changes(object, base);
}

/**
 * Compare dependencies of installed packages and monorepo package.
 * It will skip dependencies that are removed in monorepo package.
 *
 * If local package is not installed, it will check unpkg.com.
 * This allow medusa-dev to skip publishing unnecesairly and
 * let install packages from public npm repository if nothing changed.
 */
exports.checkDepsChanges = async ({
  newPath,
  packageName,
  monoRepoPackages,
  root,
  isInitialScan,
  ignoredPackageJSON,
}) => {
  let localPKGjson;
  let packageNotInstalled = false;
  try {
    localPKGjson = JSON.parse(fs.readFileSync(newPath, `utf-8`));
  } catch {
    packageNotInstalled = true;
    // there is no local package - so we still need to install deps
    // this is nice because devs won't need to do initial package installation - we can handle this.
    if (!isInitialScan) {
      console.log(
        `'${packageName}' doesn't seem to be installed. Restart medusa-dev to publish it`
      );
      return {
        didDepsChanged: false,
        packageNotInstalled,
      };
    }

    // if package is not installed, we will do http GET request to
    // unkpg to check if dependency in package published in public
    // npm repository are different

    // this allow us to not publish to local repository
    // and save some time/work
    try {
      const response = await got(
        `https://unpkg.com/${packageName}/package.json`
      );
      if (response?.statusCode !== 200) {
        throw new Error(`No response or non 200 code`);
      }
      localPKGjson = JSON.parse(response.body);
    } catch {
      console.log(
        `'${packageName}' doesn't seem to be installed and is not published on NPM.`
      );
      return {
        didDepsChanged: true,
        packageNotInstalled,
      };
    }
  }

  const monoDir = packageName.startsWith("@medusajs")
    ? packageName.split("/")[1]
    : packageName;

  const monoRepoPackageJsonPath = getMonorepoPackageJsonPath({
    packageName: monoDir,
    root,
  });
  const monorepoPKGjsonString = fs.readFileSync(
    monoRepoPackageJsonPath,
    `utf-8`
  );
  const monorepoPKGjson = JSON.parse(monorepoPKGjsonString);
  if (ignoredPackageJSON.has(packageName)) {
    if (ignoredPackageJSON.get(packageName).includes(monorepoPKGjsonString)) {
      // we are in middle of publishing and content of package.json is one set during publish process,
      // so we need to not cause false positives
      return {
        didDepsChanged: false,
        packageNotInstalled,
      };
    }
  }

  if (!monorepoPKGjson.dependencies) monorepoPKGjson.dependencies = {};
  if (!localPKGjson.dependencies) localPKGjson.dependencies = {};

  const areDepsEqual = _.isEqual(
    monorepoPKGjson.dependencies,
    localPKGjson.dependencies
  );

  if (!areDepsEqual) {
    const diff = difference(
      monorepoPKGjson.dependencies,
      localPKGjson.dependencies
    );

    const diff2 = difference(
      localPKGjson.dependencies,
      monorepoPKGjson.dependencies
    );

    let needPublishing = false;
    let isPublishing = false;
    const depChangeLog = _.uniq(Object.keys({ ...diff, ...diff2 }))
      .reduce((acc, key) => {
        if (monorepoPKGjson.dependencies[key] === `medusa-dev`) {
          // if we are in middle of publishing to local repository - ignore
          isPublishing = true;
          return acc;
        }

        if (localPKGjson.dependencies[key] === `medusa-dev`) {
          // monorepo packages will restore version, but after installation
          // in local site - it will use `medusa-dev` dist tag - we need
          // to ignore changes that
          return acc;
        }

        if (
          localPKGjson.dependencies[key] &&
          monorepoPKGjson.dependencies[key]
        ) {
          // Check only for version changes in packages
          // that are not from medusa repo.
          // Changes in medusa packages will be copied over
          // from monorepo - and if those contain other dependency
          // changes - they will be covered
          if (!monoRepoPackages.includes(key)) {
            acc.push(
              ` - '${key}' changed version from ${localPKGjson.dependencies[key]} to ${monorepoPKGjson.dependencies[key]}`
            );
            needPublishing = true;
          }
        } else if (monorepoPKGjson.dependencies[key]) {
          acc.push(
            ` - '${key}@${monorepoPKGjson.dependencies[key]}' was added`
          );
          needPublishing = true;
        } else {
          acc.push(` - '${key}@${localPKGjson.dependencies[key]}' was removed`);
          // this doesn't need publishing really, so will skip this
        }
        return acc;
      }, [])
      .join(`\n`);

    if (!isPublishing && depChangeLog.length > 0) {
      console.log(`Dependencies of '${packageName}' changed:\n${depChangeLog}`);
      if (isInitialScan) {
        console.log(
          `Will ${!needPublishing ? `not ` : ``}publish to local npm registry.`
        );
      } else {
        console.warn(
          `Installation of dependencies after initial scan is not implemented`
        );
      }
      return {
        didDepsChanged: needPublishing,
        packageNotInstalled,
      };
    }
  }
  return {
    didDepsChanged: false,
    packageNotInstalled,
  };
};
