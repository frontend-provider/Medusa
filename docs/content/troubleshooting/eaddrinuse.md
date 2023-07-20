---
title: 'EADDRINUSE Error'
---

When you run your backend you may run to an error similar to the following:

```bash
code: 'EADDRINUSE',
errno: -48,
syscall: 'Listen',
address: '::',
port: 9000
```

This means that there's another process running at port `9000`. You need to either:

- Change the default port used by the Medusa backend. You can do that by setting the `PORT` environment variable to a new port. When you do this, make sure to change the port used in other apps that interact with your Medusa backend, such as in your [admin](../admin/quickstart.mdx#build-command-options) or [storefront](../starters/nextjs-medusa-starter.mdx#changing-medusa-backend-url).
- Terminate other processes running on port `9000`.
