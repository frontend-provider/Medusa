# Common Create-React-App Errors

## TypeError: cmd is not a function

This error typically occurs when you set up a Medusa project with `create-medusa-app` and try to run the Medusa backend.

To resolve this issue, make sure you change into the `backend` directory of the Medusa project you created before trying to start the Medusa backend:

```bash npm2yarn
cd backend
npm run start
```

## Other Errors

If you ran into another error, please try to search through [our GitHub issues](https://github.com/medusajs/medusa/issues) to see if there's a solution for your issue. If not, please [create an issue on GitHub](https://github.com/medusajs/medusa/issues/new?assignees=olivermrbl&labels=status:+needs+triaging,+type:+bug&template=bug_report.md&title=) and our team will help you resolve it soon.
