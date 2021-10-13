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

            sendResponse({status: 'success'});
        } else {
            sendResponse({status: 'acknowledged'});
        }

        return true;
    }
  );