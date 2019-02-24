// Get a application public key at https://web-push-codelab.glitch.me/
const appServerPublicKey = 'BGDWRbedRGs85Og4iOkLn1hyGmiZ4q2WSztFe_jPmydQmnBLWuu_uaXbwTaVKMpLE_jKtEyncv_3NbB-rE6hSno';
let pushSubscription = false;

/**
 * urlB64ToUint8Array
 *
 * @param {string} base64String a public vavid key
 */
function urlB64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function notify(title, body, icon = 'res/notification-icon.png') {
    if (typeof title === 'string' && typeof body === 'string' && typeof icon === 'string') {
        if (Notification.permission === "granted") {
            // Do not request permissions here, use checkStatus() at window.onload

            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {body: body, icon: icon});
            });
        }
    }
}

function registerSync(syncName) {
    navigator.serviceWorker.ready.then(registration => {
        registration.sync.register(syncName).then(() => {
            console.log('Sync registered');
        }, () => {
            console.log('Sync registration error');
        });
    });
}

window.addEventListener('load', () => {
    // Get initial state of push notifications
    navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
            pushSubscription = !(subscription === null);

            if (pushSubscription) {
                console.log('User IS subscribed to push notifications');
            } else {
                console.log('User is NOT subscribed to push notifications');
            }

            updatePushButton();
        });
    });

    function subscribeUser() {
        const applicationServerKey = urlB64ToUint8Array(appServerPublicKey);
        navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            }).then(function(subscription) {
                console.log('User is subscribed:', subscription);

                updateSubscriptionOnServer(subscription);

                pushSubscription = true;

                updatePushButton();
            }).catch(function(err) {
                console.log('Failed to subscribe the user: ', err);
                updatePushButton();
            });
        });
    }

    function updateSubscriptionOnServer(subscription) {
        // TODO: Send subscription to application server
        console.log(JSON.stringify(subscription));
    }

    // Button to enable/disable push notifications
    let btnSubscribePush = document.querySelector('#subscribePush');

    function updatePushButton() {
        if (Notification.permission === 'denied') {
            btnSubscribePush.textContent = 'Push notifications blocked';
            btnSubscribePush.disabled = true;
            updateSubscriptionOnServer(null);
            return;
          }

        if (pushSubscription) {
            btnSubscribePush.textContent = 'Unubscribe to push notifications';
        } else {
            btnSubscribePush.textContent = 'Subscribe to push notifications';
        }

        btnSubscribePush.disabled = false;
    }

    btnSubscribePush.addEventListener('click', e => {
        btnSubscribePush.disabled = true;

        if (pushSubscription) {
            // TODO: Unsubscribe user
          } else {
            subscribeUser();
          }
    });

    // Check notification status
    if (!("Notification" in window)) {
        console.log("This browser does not support system notifications");
    } else if (Notification.permission === "granted") {
        registerSync('syncTest');
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(permission => {
            if (permission === "granted") {
                registerSync('syncTest');
            }
        });
    }

    let standalone = false;
    if (window.matchMedia('(display-mode: standalone)').matches) {
        // The user is running the PWA, as display-mode is standalone
        standalone = true;

        let title = 'PWA Notification Example'; // Notification title
        let body = 'Running from launcher'; // Text inside notification (the body)
        let icon = 'res/notification-icon.png'; // Notification icon src (128px) (optional)
        notify(title, body, icon);
    }

    // Button to trigger install PWA
    let btnInstallPWA = document.querySelector('#installPWA');

    // Remove the install button if is running standalone
    if (standalone) {
        document.body.removeChild(btnInstallPWA);
    }

    window.addEventListener('beforeinstallprompt', (beforeinstallprompt) => {
        beforeinstallprompt.preventDefault();

        btnInstallPWA.addEventListener('click', e => {
            btnInstallPWA.setAttribute('disabled', 'disabled');

            // After declined, the installation cannot be prompted again
            beforeinstallprompt.prompt();
            beforeinstallprompt.userChoice.then( (choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                    btnInstallPWA.innerText = 'Installed';
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
            });
        });
    });

    window.addEventListener('appinstalled', (e) => {
        console.log('A2HS installed');
    });
});
