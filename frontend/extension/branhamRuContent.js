const showSlide = (text, title) => {
    chrome.runtime.sendMessage({ action: "show_free_slide", data: { text, title }}, response => {
        if (response.status !== 'success') {
            console.error(response);
        }
    });
}

const addIconsToParagraphs = () => {
    const spans = document.querySelectorAll('span.tdbranh');

    spans.forEach(span => {
        const button = document.createElement('img');

        button.src = chrome.runtime.getURL("icon128.png");

        button.style.marginLeft = '5px';
        button.style.cursor = 'pointer';
        button.style.position = 'absolute';
        button.style.top = '0';
        button.style.left= '-40px';
        button.style.height = '30px';
        button.style.background = 'powderblue';
        button.style.borderRadius = '50%';
        button.style.padding = '3px';
        span.parentNode.style.position = 'relative';

        button.addEventListener('click', () => {
            const paragraphNumber = span.querySelector('span').textContent;
            const paragraphText = span.querySelector('.p-text').textContent;
            const year = document.querySelector('span.my-1').textContent.replace('-', '');
            const sermonTitle = document.querySelector('h4.mt-3').textContent.toUpperCase();
            const slideText = paragraphNumber.trim() + '. ' + paragraphText.trim();
            const slideTitle = year.trim() + ' ' + sermonTitle.trim();
            showSlide(slideText, slideTitle);
        });

        span.parentNode.insertBefore(button, span.nextSibling);
    });
}

addIconsToParagraphs()