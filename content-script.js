chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type == 'toggle') {
            // Simulate Google Meet's default key for mute toggling
            let keypress = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                ctrlKey: true,
                keyCode: 68
            });
            document.dispatchEvent(keypress);

            // isMuted returns the opposite from it's actual status when called
            // from this listener here and I don't know why. Inverting the result
            // is always successful though so.../shrug
            sendResponse({status: !isMuted() ? 'muted' : 'unmuted'});
        } else {
            sendResponse({status: 'acknowledged'});
        }

        return true;
    }
  );

window.addEventListener('load', function() {
    setupPrejoinRoom();
});

function setupPrejoinRoom() {
    if (!isPrejoin()) {
        return;
    }

    let muteElement = getMuteElement();

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                if (mutation.attributeName === 'data-is-muted') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified: ' + mutation.target.dataset.isMuted);
                }
            }
        }
    });

    observer.observe(muteElement, { attributes: true });
}

function getMuteElement() {
    return document.querySelectorAll('[data-is-muted][aria-label*="microphone"]')[0];
}

function isPrejoin() {
    // data-is-green-room works too
    return !!getPrejoinElement();
}

function isPostMeeting() {
    return !!document.querySelector('[data-is-connection-lost]')
}

function isMuted() {
    let muteElement = getMuteElement();

    if (muteElement) {
        let muted = muteElement.dataset.isMuted === 'true';
        console.log(`Muted: ${muted}`);

        return muted;
    }

    return false;
}

function getPrejoinElement() {
    return document.querySelector('[data-is-prejoin]');
}