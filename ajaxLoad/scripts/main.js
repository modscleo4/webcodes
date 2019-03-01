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
 * @file The main script of the page
 *
 * @author Dhiego Cassiano Fogaça Barbosa <modscleo4@outlook.com>
 */

function loadPage(page) {
    let progressBar = document.getElementById('progressBar');
    let lengthComputable;
    let xhttp = new XMLHttpRequest();

    xhttp.addEventListener('progress', (event) => {
        lengthComputable = event.lengthComputable;

        if (lengthComputable) {
            progressBar.classList.add('progressContinuous');

            let percent = event.loaded / event.total * 100;
            progressBar.style.width = percent + "%";
        } else {
            // There is no information about total size
            progressBar.classList.add('progressBouncing');
        }
    }, false);

    xhttp.addEventListener('load', (event) => {
        let htmlDoc = new DOMParser().parseFromString(xhttp.responseText, 'text/html');

        function load() {
            window.history.pushState('Object', htmlDoc.head.title, page);
            document.head.innerHTML = htmlDoc.head.innerHTML;
            document.body = htmlDoc.body;

            window.location.reload(false); // Make sure the JS will reload
        }

        if (lengthComputable) {
            setTimeout(() => {
                load()
            }, 750);
        } else {
            progressBar.style.animationIterationCount = '1';

            progressBar.addEventListener('animationend', () => {
                progressBar.classList.remove('progressBouncing');

                load();
            });
        }
    }, false);

    xhttp.addEventListener('error', (event) => {
        console.error('An error occoured during the AJAX request');
    }, false);

    xhttp.addEventListener('abort', (event) => {
        console.log('Transfer aborted');
    }, false);


    xhttp.open('get', page, true);
    xhttp.send();
}

window.addEventListener('load', () => {
    let a = document.getElementsByTagName('a');
    for (let i = 0; i < a.length; i++) {
        a[i].addEventListener('click', (e) => {
            let link = a[i].href;
            if (document.location.host === a[i].host) {
                loadPage(link);

                e.preventDefault();
                return false;
            }
        });
    }
});
