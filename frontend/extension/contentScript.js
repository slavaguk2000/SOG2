(() => {
    const showSlide = (text, title) => {
        chrome.runtime.sendMessage({ action: "show_free_slide", data: { text, title }}, response => {
            if (response.status !== 'success') {
                console.error(response);
            }
        });
    }

    const button = document.createElement('img');

    button.src = chrome.runtime.getURL("icon128.png");

    button.style.marginLeft = '5px';
    button.style.cursor = 'pointer';
    button.style.position = 'absolute';
    button.style.height = '30px';
    button.style.background = 'powderblue';
    button.style.borderRadius = '50%';
    button.style.padding = '3px';

    const body = document.querySelector('body');


    window.addEventListener('mouseup', (e) => {
        let selectedText = window.getSelection().toString();

        if (selectedText) {
            const top = `${e.pageY}px`;
            const left = `${e.pageX}px`;
            button.style.top = top;
            button.style.left = left;
            body.append(button);

            const eventListener = (e) => {
                e.stopPropagation();
                const pageTitle = document.title;
                showSlide(selectedText, pageTitle);
                button.removeEventListener('mousedown', eventListener);
                if (body.contains(button)) {
                    body.removeChild(button);
                }
            };
            button.addEventListener('mousedown', eventListener);
        }
    })

    window.addEventListener('mousedown', () => {
        if (body.contains(button)) {
            body.removeChild(button);
        }
    })
})();