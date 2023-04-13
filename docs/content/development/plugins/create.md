---
description: 'Learn how to create a plugin in Medusa. This guide explains how to develop, configure, and test a plugin.'
addHowToData: true
---

# How to Create a Plugin

In this document, you’ll learn how to create a plugin and some tips for develoment. If you’re interested to learn more about what plugins are and where to find available official and community plugins, check out the [overview document](./overview.mdx).

## Prerequisites

This guide uses the Medusa CLI throughout different steps. If you don’t have the Medusa CLI installed you can install it with the following command:

```bash npm2yarn
npm install @medusajs/medusa-cli -g
```

:::note

If you run into any errors while installing the CLI tool, check out the [troubleshooting guide](../../troubleshooting/cli-installation-errors.mdx).

:::

---

## Initialize Project

The recommended way to create a plugin is using the Medusa CLI. Run the following command to create a new Medusa project:

```bash
medusa new medusa-plugin-custom
```

Where `medusa-plugin-custom` is the name of the plugin you’re creating. In Medusa, plugins are named based on their functionalities.

By convention, all plugin names start with `medusa` followed by a descriptive name of what the plugin does. For example, the Stripe plugin is named `medusa-payment-stripe`.

---

## Changes to package.json

### Change Dependencies

A basic Medusa backend installed with the `medusa new` command has dependencies similar to this:

```json title=package.json
"dependencies": {
    "@babel/preset-typescript": "^7.21.4",
    "@medusajs/cache-inmemory": "^1.8.0",
    "@medusajs/cache-redis": "^1.8.0",
    "@medusajs/event-bus-local": "^1.8.0",
    "@medusajs/event-bus-redis": "^1.8.0",
    "@medusajs/medusa": "^1.8.0",
    "@medusajs/medusa-cli": "^1.3.9",
    "babel-preset-medusa-package": "^1.1.13",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "express": "^4.17.2",
    "medusa-fulfillment-manual": "^1.1.37",
    "medusa-interfaces": "^1.3.7",
    "medusa-payment-manual": "^1.0.23",
    "medusa-payment-stripe": "^2.0.0",
    "typeorm": "^0.3.11"
  },
  "devDependencies": {
    "@babel/cli": "^7.14.3",
    "@babel/core": "^7.14.3",
    "@types/express": "^4.17.13",
    "@types/jest": "^27.4.0",
    "@types/node": "^17.0.8",
    "babel-preset-medusa-package": "^1.1.13",
    "cross-env": "^5.2.1",
    "eslint": "^6.8.0",
    "jest": "^27.3.1",
    "mongoose": "^5.13.14",
    "rimraf": "^3.0.2",
    "ts-jest": "^27.0.7",
    "ts-loader": "^9.2.6",
    "typescript": "^4.5.2"
  },
```

For a plugin, some dependencies are not necessary. For example, can remove the packages `medusa-fulfillment-manual`, `medusa-payment-manual`, and `medusa-payment-stripe` as they are fulfillment and payment plugins necessary for a Medusa backend, but not for a plugin. The same goes for modules like `@medusajs/cache-inmemory`.

Additionally, you can remove `@medusajs/medusa-cli` as you don’t need to use the Medusa CLI while developing a plugin.

Once you’re done making these changes, re-run the install command to update your `node_modules` directory:

```bash npm2yarn
npm install
```

### Recommended: Change Scripts

It's recommended to remove the `seed` and `start` scripts from your `package.json` as they aren't necessary for plugin development.

Furthermore, if you don't have a `watch` command in your `package.json` it's recommended to add it:

```json title=package.json
"scripts": {
  // other scripts...
  "watch": "tsc --watch"
}
```

The `watch` command makes the [testing of the plugin](#test-your-plugin) easier.

:::tip

The `watch` command outputs the files in the destination specified in the value of `outDir` in `tsconfig.json`, and the same goes for the `build` command. If you made changes to `tsconfig.json`, make sure the destination is either the `dist` directory or the root of the plugin. You can learn more in the [plugin structure section](#plugin-structure).

:::

---

## Develop your Plugin

Now, You can start developing your plugin. This can include adding services, endpoints, entities, or anything that's relevant to your plugin.

### Plugin Structure

While developing your plugin, you can create your TypeScript or JavaScript files under the `src` directory. This includes creating services, endpoints, migrations, and other resources.

However, before you test the changes on a Medusa backend or publish your plugin, you must transpile your files and move them either to a `dist` directory or to the root of the plugin's directory.

For example, if you have an endpoint in `src/api/index.js`, after running the `build` or `watch` commands [as defined earlier](#recommended-change-scripts), the file should be transpiled into `dist/api/index.js` in your plugin's root. You can alternative transpile them into the `api/index.js` in your plugin's root.

:::note

It was previously required to output your files into the root of the plugin's directory (for example, `api/index.js` instead of `dist/api/index.js`). As of v1.8, you can either have your files in the root of the directory or under the `dist` directory.

:::

### Development Resources

This guide doesn't cover how to create different files and components. If you’re interested in learning how to do that, you can check out these guides:

- How to [create endpoints](../endpoints/create.md)
- How to [create a service](../services/create-service.md)
- How to [create a subscriber](../events/create-subscriber.md)
- How to [create an entity](../entities/create.md)
- How to [create a migration](../entities/migrations/create.md)

---

## Add Plugin Configuration

Plugins often allow developers that will later use them to enter their own configuration. For example, you can allow developers to specify the API key of a service you’re integrating.

To pass a plugin its configurations on a Medusa backend, you have to add it to the `plugins` array in `medusa-config.js`:

```jsx title=medusa-config.js
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-custom`,
    options: {
      name: "My Store",
    },
  },
]
```

Then, you can have access to your plugin configuration in the constructor of services in your plugin:

```jsx title=src/service/test.ts
  // In a service in your plugin
class MyService extends TransactionBaseService {
  constructor(container, options) {
    super(container)
    // options contains plugin configurations
    this.name = options.name
  }
  // ...
}
```

You can also have access to the configurations in endpoints in your plugin:

```jsx title=src/api/index.ts
// in an endpoint in your plugin
export default (rootDirectory, options) => {
  // options contain the plugin configurations
  const router = Router()

  router.get("/hello-world", (req, res) => {
    res.json({
      message: 
      `Welcome to ${options.name ? options.name : "Medusa"}!`,
    })
  })

  return router
}
```

:::tip

Make sure to include in the README of your plugin the configurations that can be passed to a plugin.

:::

---

## Test Your Plugin

While you develop your plugin, you’ll need to test it on an actual Medusa backend. This can be done by using the [npm link](https://docs.npmjs.com/cli/v8/commands/npm-link) command.

In the root of your plugin directory, run the following command:

```bash npm2yarn
npm link
```

Then, change to the directory of the Medusa backend you want to test the plugin on and run the following command:

```bash npm2yarn
npm link medusa-plugin-custom
```

Where `medusa-plugin-custom` is the package name of your plugin.

After linking to your plugin in a local Medusa backend, either run the `build` or `watch` commands in your plugin directory:

```bash npm2yarn
# in the directory of the plugin
npm run watch
```

:::tip

If you’re running the `watch` command, you don’t need to run the `build` command every time you make a change to your plugin.

:::

Then, add your plugin into the array of plugins in `medusa-config.js`:

```js title=medusa-config.js
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-custom`,
    // if your plugin has configurations
    options: {
      name: "My Store",
    },
  },
]
```

:::note

If your plugin has migrations, you must run them before you start the backend. Check out the [Migrations guide](../entities/migrations/overview.mdx#migrate-command) for more details.

:::

Finally, start your backend and test your plugin’s functionalities:

```bash npm2yarn
npm run start
```

### Troubleshoot Errors

#### Error: The class must be a valid service implementation

Please make sure that your plugin is following the correct structure. If the error persists then please try the following fix:

```bash npm2yarn
cd <BACKEND_PATH>/node_modules/medusa-interfaces
npm link
cd <BACKEND_PATH>/node_modules/@medusajs/medusa
npm link
cd <PLUGIN_PATH>
rm -rf node_modules/medusa-interfaces
rm -rf node_modules/@medusajs/medusa
npm link medusa-interfaces
npm link @medusajs/medusa
npm link
cd <BACKEND_PATH>
npm link your-plugin
```

Where `<BACKEND_PATH>` is the path to your Medusa backend and `<PLUGIN_PATH>` is the path to your plugin.

This links the `medusa-interfaces` and `@medusajs/medusa` packages from your `medusa-backend` to your plugin directory and then links your plugin to your `medusa-backend`.

#### APIs not loading

If the APIs you added to your Medussa backend are not loading then please try the following steps:

```bash npm2yarn
cd <PLUGIN_PATH>
rm -rf node_modules
cd <BACKEND_PATH>/node_modules/<PLUGIN_NAME>
npm install
cd <PLUGIN_PATH>
npm run build
cd <BACKEND_PATH>
npm run start
```

Where `<BACKEND_PATH>` is the path to your Medusa backend, `<PLUGIN_PATH>` is the path to your plugin and `<PLUGIN_NAME>` is the name of your plugin as it is in your plugin `package.json` file.

:::note

It is safe to ignore any `cross-env: command not found` error you may receive.

:::

---

## Publish Plugin

Once you're done with the development of the plugin, you can publish it to NPM so that other Medusa developers and users can use it.

Please refer to [this guide on required steps to publish a plugin](./publish.md).
