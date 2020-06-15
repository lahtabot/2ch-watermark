function getDollchanAPI() {
    return new Promise((resolve, reject) => {
        const dw = document.defaultView;
        const onmessage = ({ data, ports }) => {
            if (ports && ports.length === 1 && data === 'de-answer-api-message') {
                clearTimeout(to);
                dw.removeEventListener('message', onmessage);
                resolve(ports[0]);
            }
        };
        dw.addEventListener('message', onmessage);
        dw.postMessage('de-request-api-message', '*');
        const to = setTimeout(() => {
            dw.removeEventListener('message', onmessage);
            reject();
        }, 5e3);
    });
}

function runAPI() {
    getDollchanAPI().then(port => {
        port.onmessage = ({ data }) => {
            const result = data.data;
            switch (data.name) {
                case 'registerapi':
                    for (let key in result) {
                        console.log(`API ${key} ${
                            result[key] ? 'зарегистрирован' : 'недоступен'}.`);
                    }
                    break;
                case 'newpost':
                    console.log('Новые посты: ', result);
                    break;
                /* case '...': */

                    

            }
        };
        port.postMessage({ name: 'registerapi', data: ['newpost'] });
        /* port.postMessage({ name: 'registerapi', data: ['...'] }); */
    }).catch(() => console.log('Dollchan API не обнаружен!'));
}

setTimeout(runAPI, 0);

