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
            sendResponse({status: isMuted() ? 'muted' : 'unmuted'});
        } else {
            sendResponse({status: 'acknowledged'});
        }

        return true;
    }
  );

window.addEventListener('load', function() {
    setupPrejoinRoom();
    setupRoomTransition();
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

// The room transition is when you click "Join now" and go from
// the prejoin room to the normal Google Meet room. We need to
// know this information because the mute button is different
// and we need to re-attach.
function setupRoomTransition() {
    if (!isPrejoin()) {
        return;
    }

    // This is a really high parent element that catches most of the
    // mutations on the page.
    let meetingElement = document.querySelector('[data-meeting-code]');

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type != 'childList' || mutation.removedNodes.length == 0) {
                continue;
            }

            if (mutation.removedNodes[0].firstChild?.nodeName === "VIDEO") {
                console.log('Transitioning from prejoin to main meeting.');
            }
        }
    });

    observer.observe(meetingElement, { childList: true, subtree: true });
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
        let muted = muteElement.dataset.isMuted === 'false';
        console.log(`Muted: ${muted}`);

        return muted;
    }

    return false;
}

function getPrejoinElement() {
    return document.querySelector('[data-is-prejoin]');
}
