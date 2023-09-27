const showSlide = (text, title) => {
    chrome.runtime.sendMessage({ action: "show_free_slide", data: { text, title }}, response => {
        if (response.status !== 'success') {
            console.error(response);
        }
    });
}

const addIconsToCouplets = () => {
    const divs = document.querySelectorAll('div.blocks');

    divs.forEach(div => {
        const button = document.createElement('img');

        button.src = chrome.runtime.getURL("icon128.png");

        button.style.marginLeft = '5px';
        button.style.cursor = 'pointer';
        button.style.position = 'absolute';
        button.style.top = '0';
        button.style.left= '-20px';
        button.style.height = '30px';
        button.style.background = 'powderblue';
        button.style.borderRadius = '50%';
        button.style.padding = '3px';
        div.style.position = 'relative';

        button.addEventListener('click', () => {
            const coupletNumber = div.querySelector('b').textContent.match(/\d+/)?.[0];
            const coupletText = Array.from(div.querySelectorAll('span.text')).map(({ textContent }) => textContent.trim()).join('\n');
            const songTitle = document.querySelector('h2').textContent;
            const slideText = (coupletNumber ? coupletNumber.trim() + '. ' : '* ') + coupletText;
            const slideTitle = songTitle.trim();
            showSlide(slideText, slideTitle);
        });

        div.insertBefore(button, div.children[0]);
    });
}

addIconsToCouplets()