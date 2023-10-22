const showSlide = (text, title) => {
    chrome.runtime.sendMessage({ action: "show_free_slide", data: { text, title }}, response => {
        if (response.status !== 'success') {
            console.error(response);
        }
    });
};

const getCouplets = () => document.querySelectorAll('div.blocks');

const addButtonInChildren = (el, listner, up) => {
    const button = document.createElement('img');

    button.src = chrome.runtime.getURL("icon128.png");

    button.style.marginLeft = '5px';
    button.style.cursor = 'pointer';
    button.style.position = 'absolute';
    button.style.top = '0';
    if (!up) {
        button.style.left= '-20px';    
    }
    button.style.height = '30px';
    button.style.background = 'powderblue';
    button.style.borderRadius = '50%';
    button.style.padding = '3px';
    el.style.position = 'relative';

    button.addEventListener('click', listner);

    el.insertBefore(button, el.children[0]);
};

const getTextFromCouplet = (el, withChord) => {
    const coupletNumber = el.querySelector('b').textContent.match(/\d+/)?.[0];
    const coupletText = Array.from(el.querySelectorAll(withChord ? 'div>span' : 'div>span.text')).map(({ textContent }) => textContent.trim()).join('\n');
    return (coupletNumber ? coupletNumber.trim() + '. ' : '* ') + coupletText.trim();
};

const getSlideTitle = () => {
    return document.querySelector('h2').textContent.trim();
};

const addIconsToCouplets = () => {
    getCouplets().forEach(div => {
        addButtonInChildren(div, () => {
                const slideText = getTextFromCouplet(div);
                showSlide(slideText, getSlideTitle());
            }
        )
    });
};

const addIconToTitle = () => {
    const header = document.querySelector('h2.t-worship-leader__marquee__headline.mb-0');
    addButtonInChildren(header, () => {
        const slideText = Array.from(getCouplets()).map((div) => getTextFromCouplet(div, true)).join('\n\n');
        showSlide(slideText, getSlideTitle());
    }, true);
};

addIconsToCouplets();
addIconToTitle();
