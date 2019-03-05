/**
 * Copyright 2019 Dhiego Cassiano Fogaça Barbosa

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @file Contains functions to handle the page interactivity of the PWA
 *
 * @author Dhiego Cassiano Fogaça Barbosa <modscleo4@outlook.com>
 */

let pushSubscription = false;

window.addEventListener('load', () => {
    // Button to enable/disable push notifications
    let btnSubscribePush = document.querySelector('#subscribePush');

    // Get initial state of push notifications
    navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
            pushSubscription = !(subscription === null);

            if (pushSubscription) {
                console.log('User IS subscribed to push notifications');

                console.log(JSON.stringify(subscription));
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
            }).then(subscription => {
                console.log('User is subscribed: ', subscription);

                updateSubscriptionOnServer(subscription);

                pushSubscription = true;
            }).catch(err => {
                console.log('Failed to subscribe the user: ', err);
            }).finally(() => {
                updatePushButton();
            });
        });
    }

    function unsubscribeUser() {
        navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.getSubscription().then(subscription => {
                subscription.unsubscribe().then(successful => {
                    pushSubscription = false;

                    console.log('User is unsubscribed: ', subscription);
                }).catch(err => {
                    console.log('Failed to unsubscribe the user: ', err);
                }).finally(() => {
                    updatePushButton();
                })
            });
        });
    }

    function updateSubscriptionOnServer(subscription) {
        // @todo: Send subscription to application server
        console.log(JSON.stringify(subscription));
    }

    function updatePushButton() {
        if (Notification.permission === 'denied') {
            btnSubscribePush.textContent = 'Push notifications blocked';
            btnSubscribePush.disabled = true;
            updateSubscriptionOnServer(null);
            return;
        }

        if (pushSubscription) {
            btnSubscribePush.textContent = 'Unsubscribe to push notifications';
        } else {
            btnSubscribePush.textContent = 'Subscribe to push notifications';
        }

        btnSubscribePush.disabled = false;
    }

    btnSubscribePush.addEventListener('click', e => {
        checkStatus();

        btnSubscribePush.disabled = true;

        if (pushSubscription) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    // Send a new sync request to service worker with tag 'syncTest'
    registerSync('syncTest');

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

    window.addEventListener('beforeinstallprompt', beforeinstallprompt => {
        beforeinstallprompt.preventDefault();

        btnInstallPWA.addEventListener('click', e => {
            btnInstallPWA.setAttribute('disabled', 'disabled');

            // After declined, the installation cannot be prompted again
            beforeinstallprompt.prompt();
            beforeinstallprompt.userChoice.then((choiceResult) => {
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
