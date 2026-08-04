const gallery = document.getElementById('gallery');
const nav = document.querySelector('nav');
const swap = document.getElementById('swap');
const fabPopup = document.getElementById('fabPopup');

const outformat = "png";
const base_url = "https://www.furaffinity.net/view/"

var count = 0;

var files = fetch('/_data/images.json')
    .then(response => response.json())
    .then(data => {
        data.files.sort(compareById).reverse().forEach(file => {
            const container = document.createElement('div');

            var name = file.image.replace(/\_/g, ' ').replace('~', '?');
            const img = document.createElement('img');
            img.src = `/media/gallery/thumbs/${file.fa_id}-${file.image}.${outformat}`;
            img.alt = name;
            img.title = `Published ${file.date}`
            img.loading = 'lazy'
            container.appendChild(img);

            const overlay = document.createElement('div');
            overlay.classList.add('overlay');

            const textcont = document.createElement('div');
            textcont.classList.add('textcont');
            const text = document.createElement('a');
            text.textContent = name;
            text.title = name;
            text.href = base_url + file.fa_id;
            if (name.length > 19) { text.classList.add('scrolling'); }

            textcont.appendChild(text);
            overlay.appendChild(textcont);
            container.appendChild(overlay);

            const link = document.createElement('a');
            link.title = base_url + file.fa_id;
            link.id = file.fa_id;
            link.textContent = 'Share!';

            link.addEventListener('click', () => {
                clearTimeout(link.id); // Clear any previous timeout
                navigator.clipboard.writeText(base_url + file.fa_id);
                link.textContent = 'Copied!';
                setTimeout(() => link.textContent = 'Share!', 1000);
            });

            overlay.appendChild(link);

            const preloader = document.createElement("link");
            preloader.rel = (count <= 12) ? "preload" : "prefetch";
            preloader.href = `/media/gallery/fullres/${file.fa_id}-${file.image}.${outformat}`;
            if (count <= 12) preloader.as = "image";
            if (count <= 12) preloader.type = "image/png";
            document.head.appendChild(preloader);
            count++;

            img.addEventListener('click', () => {
                if ((!document.startViewTransition) || (window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
                    createOverlay(file, img);
                    return;
                }
                img.style.viewTransitionName = 'image' + file.fa_id;
                document.startViewTransition(() => {
                    img.style.viewTransitionName = '';
                    createOverlay(file, img);
                    nav.classList.add('hidden');
                    document.body.classList.add('fix');
                });
            });
            gallery.appendChild(container);
        });
    })
    .catch(error => console.error('Error fetching images:', error)
    );

let compareByDate = (a, b) => {
    if (a.ts < b.ts) {
        return -1;
    }
    if (a.ts > b.ts) {
        return 1;
    }
    return 0;
};

let compareById = (a, b) => {
    if (a.fa_id < b.fa_id) {
        return -1;
    }
    if (a.fa_id > b.fa_id) {
        return 1;
    }
    return 0;
};

function createOverlay(file, thumb) {
    const container = document.createElement('div');
    container.classList.add('backdrop');

    const image = document.createElement('img');
    image.src = `/media/gallery/fullres/${file.fa_id}-${file.image}.png`;
    image.style.viewTransitionName = 'image' + file.fa_id;

    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = file.image.replace(/\_/g, ' ').replace('~', '?');

    const date = document.createElement('h2');
    date.classList.add('date');
    date.textContent = file.date;

    const buttons = addButtons(file);

    container.appendChild(buttons);
    container.appendChild(title);
    container.appendChild(date);
    container.appendChild(image);

    document.body.appendChild(container);

    container.addEventListener('click', async () => {
        if ((!document.startViewTransition) || (window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
            document.body.removeChild(container);
            return;
        }
        const trans = document.startViewTransition(() => {
            thumb.style.viewTransitionName = 'image' + file.fa_id;
            image.style.viewTransitionName = '';

            document.body.removeChild(container);

            nav.classList.remove('hidden');
            document.body.classList.remove('fix');
        });
        try {
            await trans.finished;
        } finally {
            thumb.style.viewTransitionName = '';
        }
    });
}

function addButtons(file) {
    const buttonOverlay = document.createElement('div');
    buttonOverlay.classList.add('overlay_buttons');
    buttonOverlay.classList.add('vc');

    // Open button
    const open = document.createElement('a');
    open.classList.add("fab")
    open.href = base_url + file.fa_id;
    const open_icon = document.createElement('i');
    open_icon.classList.add('fa-solid');
    open_icon.classList.add('fa-arrow-up-right-from-square');
    open.appendChild(open_icon);
    // Share button
    const share = document.createElement('a');
    share.classList.add("fab")
    share.addEventListener("click", () => {
        navigator.clipboard.writeText(base_url + file.fa_id);
    })
    const share_icon = document.createElement('i');
    share_icon.classList.add('fa-solid');
    share_icon.classList.add('fa-share');
    share_icon.id = "shareButton"
    share.appendChild(share_icon);

    buttonOverlay.appendChild(open);
    buttonOverlay.appendChild(share);
    return buttonOverlay;
}

swap.addEventListener('click', async (e) => {
    resetAnimation(fabPopup)

    if (e.target.title === 'Newest first') {
        e.target.title = 'Oldest first';
        fabPopup.textContent = "Newest first"
    } else {
        e.target.title = 'Newest first';
        fabPopup.textContent = "Oldest first"
    }

    if ((!document.startViewTransition) || (window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        for (var i = 0; i < gallery.childNodes.length; i++) {
            gallery.insertBefore(gallery.childNodes[i], gallery.firstChild);
        }
        return;
    }
    for (var i = 0; i < gallery.children.length; i++) {
        gallery.children[i].style.viewTransitionName = 'image' + i;
    }
    let trans = document.startViewTransition(() => {
        for (var i = 0; i < gallery.children.length; i++) {
            gallery.insertBefore(gallery.children[i], gallery.firstChild);
        }
    });
    try {
        await trans.finished;
    } finally {
        for (var i = 0; i < gallery.children.length; i++) {
            gallery.children[i].style.viewTransitionName = '';
        }
        startAnimation(fabPopup)
    }
});
