function loadPage(page) {
    let xhttp = new XMLHttpRequest();

    xhttp.addEventListener('progress', function (event) {
        let progressBar = document.getElementById('progressBar');

        if (event.lengthComputable) {
            let percent = event.loaded / event.total;
            progressBar.style.width = parseInt(getComputedStyle(progressBar).maxWidth) * percent + "px";
        } else {
            // There is no information about total size
            progressBar.style.animationName = 'progressBouncing';
        }
    }, false);

    xhttp.addEventListener('load', function (event) {
        let progressBar = document.getElementById('progressBar');
        progressBar.style.animationIterationCount = '1';

        progressBar.addEventListener('animationend', function () {
            if (progressBar.style.animationName != '') {
                progressBar.style.animationName == '';
            }

            let htmlDoc = new DOMParser().parseFromString(xhttp.responseText, 'text/html');

            window.history.pushState('Object', htmlDoc.head.title, page);
            document.head.innerHTML = htmlDoc.head.innerHTML;
            document.body = htmlDoc.body;
        });
    }, false);

    xhttp.addEventListener('error', function (event) {
        console.error('An error occoured during the AJAX request');
    }, false);

    xhttp.addEventListener('abort', function (event) {
        console.log('Transfer aborted');
    }, false);


    xhttp.open('get', page, true);
    xhttp.send();
}
