chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);

    getGoogleMeetTabs().then((tabs) => {
        if (!tabs) {
            return;
        }

        tabs.forEach((tab) => {
            // chrome.tabs.sendMessage(tab.id, { test: 'test' }, () => console.log('message sent'));
        });
    });
  });

async function getGoogleMeetTabs() {
    let queryOptions = { url: 'https://meet.google.com/*', title: 'Meet*' };
    let results = await chrome.tabs.query(queryOptions);

    return results;
}