function checkStatus() {
    if (!("Notification" in window)) {
        console.log("This browser does not support system notifications");
    } else if (Notification.permission === "granted") {
        // Notify the user
        notify('PWA Notification Example', 'Cirurgia de morfose');
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission( (permission) => {
            if (permission === "granted") {
                // Notify the user
                notify('PWA Notification Example', 'Esfiha de chocolate');
            }
        });
    }
}

function notify(title, body, icon = 'res/notification-icon.png') {
    if (Notification.permission === "granted") {
        // Do not request permissions here, use checkStatus()

        navigator.serviceWorker.ready.then( (registration) => {
            registration.showNotification(title, {body: body, icon: icon});
        });
    }
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

window.addEventListener('load', () => {
    checkStatus();

    // Button to trigger install PWA
    let btnInstallPWA = document.getElementById('installPWA');

    // Remove the install button if is running standalone
    if (standalone) {
        document.body.removeChild(btnInstallPWA);
    }

    window.addEventListener('beforeinstallprompt', (beforeinstallprompt) => {
        beforeinstallprompt.preventDefault();

        btnInstallPWA.addEventListener('click', (e) => {
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
