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
 * @file Contains shared functions for the PWA
 *
 * @author Dhiego Cassiano Fogaça Barbosa <modscleo4@outlook.com>
 */

// Get a application public key at https://web-push-codelab.glitch.me/
const appServerPublicKey = 'BGDWRbedRGs85Og4iOkLn1hyGmiZ4q2WSztFe_jPmydQmnBLWuu_uaXbwTaVKMpLE_jKtEyncv_3NbB-rE6hSno';

/**
 * Install the service worker
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.error('ServiceWorker registration failed: ', err);
        });
    });
}

/**
 * urlB64ToUint8Array
 *
 * @param {string} base64String a public vavid key
 */
function urlB64ToUint8Array(base64String) {
    let padding = '='.repeat((4 - base64String.length % 4) % 4);
    let base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    let rawData = window.atob(base64);
    let outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Check the current notification permission status
 */
function checkStatus() {
    if (!('Notification' in window)) {
        console.log("This browser does not support system notifications");
    } else if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
}

/**
 * Create a new notification
 *
 * @param {string} title The notification title
 * @param {string} body The body of notification
 * @param {string} icon The notification icon (default: res/notification-icon.png)
 */
function notify(title, body, icon = 'res/notification-icon.png') {
    if (typeof title === 'string' && typeof body === 'string' && typeof icon === 'string') {
        if (Notification.permission === 'granted') {
            // Do not request permissions here, use checkStatus() at window.onload

            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {body: body, icon: icon});
            });
        }
    }
}

/**
 * Register a new background sync to SW
 *
 * @param {string} syncName
 */
function registerSync(syncName) {
    navigator.serviceWorker.ready.then(registration => {
        registration.sync.register(syncName).then(() => {
            console.log('Sync registered');
        }, () => {
            console.log('Sync registration error');
        });
    });
}
