#!/usr/bin/env node

const { LinearClient } = require("@linear/sdk");
const { Octokit } = require("@octokit/core");
const fs = require('fs');
const path = require('path');

const octokit = new Octokit({
  auth: process.env.GH_TOKEN
});

const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY
});

const repoPath = path.join('docs', 'content');
let freshnessCheckLabelId = "";
let documentationTeamId = "";

async function scanDirectory (startPath) {
  const files = fs.readdirSync(path.join(startPath), {
    withFileTypes: true
  });

  for (const file of files) {
    const filePath = path.join(startPath, file.name);
    if (file.isDirectory()) {
      //if it's references directory, skip
      if (file.name !== 'references' && file.name !== 'upgrade-guides') {
        await scanDirectory(filePath);
      }
      continue;
    }

    //check that the file is a markdown file
    if (file.name.indexOf('.md') === -1 && file.name.indexOf('.mdx') === -1 ) {
      continue;
    }

    //if it is a file, check its commits in GitHub
    const commitResponse = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner: 'medusajs',
      repo: 'medusa',
      path: filePath,
      per_page: 1
    })

    if (!commitResponse.data.length) {
      continue;
    }

    const today = new Date();
    const lastEditedDate = new Date(commitResponse.data[0].commit.committer.date);
    const monthsSinceEdited = getMonthDifference(lastEditedDate, today);
    
    if (monthsSinceEdited > 6) {
      //file was edited more than 6 months ago.
      //check if there's an issue created for this file since the commit date
      const existingIssue = await linearClient.issues({
        filter: {
          createdAt: {
            gte: subtractMonths(monthsSinceEdited - 6, today)
          },
          title: {
            containsIgnoreCase: `Freshness check for ${filePath}`
          },
          labels: {
            some: {
              id: {
                eq: freshnessCheckLabelId
              }
            }
          }
        },
        first: 1
      });

      if (existingIssue.nodes.length) {
        //an issue has been created for the past 6 months. Don't create an issue for it.
        continue;
      }

      console.log(`Creating an issue for ${filePath}...`);

      //there are no issues in the past 6 months. Create an issue
      await linearClient.issueCreate({
        teamId: documentationTeamId,
        title: `Freshness check for ${filePath}`,
        labelIds: [
          freshnessCheckLabelId
        ],
        description: `File \`${filePath}\` was last edited on ${lastEditedDate.toDateString()}.`
      })
    }
  }
}

async function main () {
  //fetch documentation team ID from linear
  const documentationTeam = await linearClient.teams({
    filter: {
      name: {
        eqIgnoreCase: 'Documentation'
      }
    },
    first: 1
  });

  if (!documentationTeam.nodes.length) {
    console.log("Please add Documentation team in Linear first then try again");
    process.exit(1);
  }

  documentationTeamId = documentationTeam.nodes[0].id;

  //fetch freshness check label ID from linear
  const freshnessCheckLabel = await linearClient.issueLabels({
    filter: {
      name: {
        eqIgnoreCase: 'type: freshness-check'
      },
      team: {
        id: {
          eq: documentationTeamId
        }
      }
    }
  });

  if (!freshnessCheckLabel.nodes.length) {
    console.log("Please add freshness check label in Linear under the documentation team first then try again");
    process.exit(1);
  }

  freshnessCheckLabelId = freshnessCheckLabel.nodes[0].id;

  await scanDirectory(repoPath);
}

function getMonthDifference(startDate, endDate) {
  return (
    endDate.getMonth() -
    startDate.getMonth() +
    12 * (endDate.getFullYear() - startDate.getFullYear())
  );
}

function subtractMonths(numOfMonths, date = new Date()) {
  date.setMonth(date.getMonth() - numOfMonths);

  return date;
}

main()