function checkStatus() {
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications");
    } else if (Notification.permission === "granted") {
        // Notify the user
        notify('PWA Notification Example', 'Cirurgia de morfose');
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                // Notify the user
                notify('PWA Notification Example', 'Esfiha de chocolate');
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
