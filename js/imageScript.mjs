//  let dirContentsConfig = {
//   owner: owner,
//   repo: repo,
//   path: pathToDirectory,
//   ref: branchName,
//   branch: branchName
// }
//
// const dirContentsMetadata = await octokit.repos.getContents(dirContentsConfig);
//
// if (Array.isArray(dirContentsMetadata.data)) {
//   for (let contents of dirContentsMetadata.data) {
//     console.log(contents.name)
//   }
// }

import { Octokit } from "octokit";

const octokit = new Octokit({ 
  // auth: 'YOUR-TOKEN',
});

async function getImages({owner, repo, path, ref, branchName}) {
  let imageList = []

  let dirContentsConfig = {
    owner: owner,
    repo: repo,
    path: pathToDirectory,
    ref: branchName,
    branch: branchName
  }

  try {
    
    const dirContentsMetadata = await octokit.repos.getContents(dirContentsConfig);
  if (Array.isArray(dirContentsMetadata.data)) {
    for (let contents of dirContentsMetadata.data) {
      console.log(contents.name)
    }

    // for await (const {data} of iterator) {
    //   imageList = [...imageList, ...data.map(fileData => fileData.filename)];
    // }
  } 
  //   catch (error) {
  //   if (error.response) {
  //     console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
  //   }
  //   console.error(error)
  // }

  return imageList;
}

async function placeImage({owner, repo, path, ref, branchName}) {
  const listedImages = await getImages({owner, repo, path, ref, branchName});

  const filePathRegex = new RegExp(/\/data\//, "i");
  if (!changedFiles.some(fileName => filePathRegex.test(fileName))) {
    return;
  }

  try {
    const {data: comment} = await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: owner,
      repo: repo,
      issue_number: pullNumber,
      body: `It looks like you changed a data file. These files are auto-generated. \n\nYou must revert any changes to data files before your pull request will be reviewed.`,
      headers: {
        "x-github-api-version": "2022-11-28",
      },
    });

    return comment.html_url;
  } catch (error) {
    if (error.response) {
      console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
  }
}

await commentIfDataFilesChanged({owner: "github", repo: "docs", pullNumber: 191});








// import { Octokit } from "octokit";
//
// const octokit = new Octokit({ 
//   auth: 'YOUR-TOKEN',
// });
//
// async function getChangedFiles({owner, repo, pullNumber}) {
//   let filesChanged = []
//
//   try {
//     const iterator = octokit.paginate.iterator("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", {
//       owner: owner,
//       repo: repo,
//       pull_number: pullNumber,
//       per_page: 100,
//       headers: {
//         "x-github-api-version": "2022-11-28",
//       },
//     });
//
//     for await (const {data} of iterator) {
//       filesChanged = [...filesChanged, ...data.map(fileData => fileData.filename)];
//     }
//   } catch (error) {
//     if (error.response) {
//       console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
//     }
//     console.error(error)
//   }
//
//   return filesChanged
// }
//
// async function commentIfDataFilesChanged({owner, repo, pullNumber}) {
//   const changedFiles = await getChangedFiles({owner, repo, pullNumber});
//
//   const filePathRegex = new RegExp(/\/data\//, "i");
//   if (!changedFiles.some(fileName => filePathRegex.test(fileName))) {
//     return;
//   }
//
//   try {
//     const {data: comment} = await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
//       owner: owner,
//       repo: repo,
//       issue_number: pullNumber,
//       body: `It looks like you changed a data file. These files are auto-generated. \n\nYou must revert any changes to data files before your pull request will be reviewed.`,
//       headers: {
//         "x-github-api-version": "2022-11-28",
//       },
//     });
//
//     return comment.html_url;
//   } catch (error) {
//     if (error.response) {
//       console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
//     }
//     console.error(error)
//   }
// }
//
// await commentIfDataFilesChanged({owner: "github", repo: "docs", pullNumber: 191});
//
