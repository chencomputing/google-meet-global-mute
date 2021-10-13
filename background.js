chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);

    getGoogleMeetTabs().then((tabs) => {
        if (!tabs) {
            return;
        }

        chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle' }, (response) => {
            console.log(response);
        });
    });
  });

async function getGoogleMeetTabs() {
    let queryOptions = { url: 'https://meet.google.com/*' };
    let results = await chrome.tabs.query(queryOptions);

    return results;
}