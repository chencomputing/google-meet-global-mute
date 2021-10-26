chrome.commands.onCommand.addListener((command) => {
    getGoogleMeetTabs().then((tabs) => {
        if (!tabs) {
            return;
        }

        chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle' }, (response) => {
            if (response.status === 'muted') {
                setMutedIcon();
            } else if (response.status === 'unmuted') {
                setUnmutedIcon();
            }
        });
    });
  });

async function getGoogleMeetTabs() {
    let queryOptions = { url: 'https://meet.google.com/*' };
    let results = await chrome.tabs.query(queryOptions);

    return results;
}

function setMutedIcon() {
    chrome.action.setIcon({
        path: {
            "16": "images/mic-red-16.png",
            "24": "images/mic-red-24.png",
            "32": "images/mic-red-32.png"
          }
    });
}

function setUnmutedIcon() {
    chrome.action.setIcon({
        path: {
            "16": "images/mic-green-16.png",
            "24": "images/mic-green-24.png",
            "32": "images/mic-green-32.png"
          }
    });
}
