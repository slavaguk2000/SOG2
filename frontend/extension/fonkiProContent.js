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
            const coupletTitle = div.querySelector('b').textContent.trim();
            const coupletText = div.textContent.trim().replace(RegExp(`^${coupletTitle}`), '').trim().replace(/\n{2,}.*$/m, '').trim()
            const songTitle = document.querySelector('h1.entry-title.text-truncate').textContent.trim();
            showSlide(coupletText, songTitle);
        });

        div.insertBefore(button, div.children[0]);
    });
}

addIconsToCouplets()