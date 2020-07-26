function registerEvents() {
    var linkCopy = document.getElementById('link-copy');

    linkCopy.addEventListener('click', function () {
        navigator.clipboard.writeText(linkCopy.previousElementSibling.text).then(function (res) {
            linkCopy.innerHTML = "Copied!";
            linkCopy.style.background = "#3b3054";
        })
    });
}

function saveLink(url, hash) {

    var links = JSON.parse(window.localStorage.getItem('links'));
    if (links) {
        links.push({ url: url, hash: hash });
        window.localStorage.setItem('links', JSON.stringify(links));
    } else {
        links = [{ url: url, hash: hash }];
        window.localStorage.setItem('links', JSON.stringify(links));

    }
}

function showLinks(linkList) {
    var links = JSON.parse(window.localStorage.getItem('links'));
    if (links) {
        links.forEach(function (element) {
            let div = linkChild(element.url, element.hash);
            linkList.appendChild(div);
            registerEvents();
        });
    }
}

function linkChild(url, hash) {
    var div = document.createElement('div');
    div.classList.add('link-shortener__link__container')
    div.innerHTML = `
    <span class="link-shortener__link__name">${url}</span>
    <div class="link-shortener__link__results">
      <a href="https://rel.ink/${hash}" class="link-shortener__link__short hover--primaryOneText">https://rel.ink/${hash}</a
        href="#">
      <button id="link-copy" class="link-shortener__link__copy-btn btn btn--cyan btn--rounded btn--big">
        Copy
      </button>
    </div>
  `
    return div;
}

(function () {


    var navButton = document.getElementById('nav-button');
    var navMenu = document.getElementById('nav-menu');
    var hamburgerMenu = document.getElementById('hamburger-menu');

    navButton.addEventListener('click', function (event) {
        event.preventDefault();

        if (navMenu.classList.contains('header__nav--open')) {
            hamburgerMenu.classList.remove('header__menu-button--open');
            navMenu.classList.add('header__nav--slide-out');
            setTimeout(function () {
                navMenu.classList.remove('header__nav--open', 'header__nav--slide-in');
            }, 200);
        } else {
            hamburgerMenu.classList.add('header__menu-button--open');
            navMenu.classList.remove('header__nav--slide-out');
            navMenu.classList.add('header__nav--open', 'header__nav--slide-in');
        }
    })




    var linkInput = document.getElementById('link-input');
    var linkShortenButton = document.getElementById('link-shorten-button');
    var linkList = document.getElementById('link-list');
    var linkError = document.getElementById('link-error');


    showLinks(linkList);

    linkShortenButton.addEventListener('click', function (event) {
        event.preventDefault();


        var linkVal = linkInput.value;
        if (linkVal.startsWith('http://') || linkVal.startsWith('https://')) {
            if (linkInput.classList.contains('link-shortener__input--danger')) {
                linkInput.classList.remove('link-shortener__input--danger');
                linkError.classList.remove('link-shortener__error--active');
            }

            axios.post('https://rel.ink/api/links/', {
                url: linkVal
            }).then((res) => {
                var div = document.createElement('div');
                div.classList.add('link-shortener__link__container')
                div.innerHTML = `
                <span class="link-shortener__link__name">${linkVal}</span>
                <div class="link-shortener__link__results">
                  <a href="https://rel.ink/${res.data.hashid}" class="link-shortener__link__short hover--primaryOneText">https://rel.ink/${res.data.hashid}</a
                    href="#">
                  <button id="link-copy" class="link-shortener__link__copy-btn btn btn--cyan btn--rounded btn--big">
                    Copy
                  </button>
                </div>
              `
                saveLink(res.data.url, res.data.hashid);
                linkList.appendChild(div);
                registerEvents();
            }).catch((err) => {
                console.log(err)
                linkInput.classList.add('link-shortener__input--danger');
                linkError.classList.add('link-shortener__error--active');
            });

        } else {
            linkInput.classList.add('link-shortener__input--danger');
            linkError.classList.add('link-shortener__error--active');
        }

    });
})()
