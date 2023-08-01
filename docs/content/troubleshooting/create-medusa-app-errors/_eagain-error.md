When using the `create-medusa-app` npx command, you might run into an NPM `EAGAIN` error. This error can randomly occur due to conflicting processes.

The easiest solution is to start the command over. Alternatively, if your setup crossed the "create database" point, you can manually perform the following steps in the directory of your created project. You can skip any steps that you're sure have been performed by `create-medusa-app`:

1\. Install dependencies:

```bash npm2yarn
npm install
```

2\. Build project:

```bash npm2yarn
npm run build
```

3\. Run migrations:

```bash
npx medusa migrations run
```

4\. Create an admin user:

```bash
npx medusa user -e user@test.com -p supersecret
```

5\. Optionally seed the database:

```bash
npx medusa seed -f ./data/seed.json
```

6\. Start project:

```bash
npx medusa develop
```
