/*
 * Install the service worker
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js', {'scope': '.'}).then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.error('ServiceWorker registration failed: ', err);
        });
    });
}


function checkStatus() {
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications");
    } else if (Notification.permission === "granted") {
        // Notify the user
        notify('PWA Notification Example', 'Hello again!');
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                // Notify the user
                notify('PWA Notification Example', 'Hello there!');
            }
        });
    }
}

function notify(title, body, icon = 'res/notification-icon.png') {
    if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, {body: body, icon: icon});
        });
    }
}

checkStatus();

if (new URL(window.location.href).searchParams.get('launcher') === 'true') {
    // The user is running the PWA
    console.log('launcher=true');
    let title = 'PWA Notification Example'; // Notification title
    let body = 'Running from launcher'; // Text inside notification (the body)
    let icon = 'res/notification-icon.png'; // Notification icon src (128px) (optional)
    notify(title, body, icon);
}
