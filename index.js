const core = require('@actions/core');
const { App } = require("@octokit/app");
const { Octokit } = require("@octokit/core");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const appId = core.getInput('app_id');
    const privateKey = core.getInput('private_key');
    const baseUrl = core.getInput('base_url');

    
    const app = new App({
      appId: appId,
      privateKey: privateKey,
      Octokit: Octokit.defaults({
        baseUrl: baseUrl,
      }),
    });

    let installationTokens = []

    for await (const { octokit, installation } of app.eachInstallation.iterator()) {
      core.info('retrieving token for installation: ' + installation.id)
      const resp = await octokit.auth({
        type: 'installation',
        installationId: installation.id
      })
      installationTokens.push(resp.token)
      core.info('retrieved token for installation: ' + installation.id)
    }

    const token = installationTokens[0];

    core.debug('TOKEN: ' + token)

    core.setOutput('token', token);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
