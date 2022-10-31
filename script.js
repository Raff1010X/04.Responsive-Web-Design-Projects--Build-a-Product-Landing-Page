const header = document.getElementById("header");
const cart = document.getElementById("header-cart");
const nav = document.getElementById("nav-bar");
const hamburger = document.getElementById("hamburger-img");
const video = document.getElementById("video");
const videoHide = document.getElementById("welcome-div");
const cakes = document.querySelectorAll(".cake");
const href = document.querySelectorAll(".href");
const navLink = document.querySelectorAll(".nav-link");


// hamburger menu
let isMenuOpen = false;

hamburger.addEventListener("click", () => {
    if (!isMenuOpen) {
        showMenu();
    } else {
        hideMenu();
    }
});

function showMenu() {
    header.style.transition = "0.5s";
    header.style.height = "100%";
    cart.style.visibility = "visible";
    nav.style.visibility = "visible";
    hamburger.src = "hamburgerx.svg"
    isMenuOpen = true;
}

function hideMenu() {
    header.style.height = "4.5rem";
    cart.style.visibility = "hidden";
    nav.style.visibility = "hidden";
    hamburger.src = "hamburger.svg"
    isMenuOpen = false;
}

const navLinks = document.querySelector("#nav-bar-menu");
navLinks.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.classList.contains("nav-link")) {
    if (window.innerWidth < 1100) {
        hideMenu();
        resetLinks();
        e.target.classList.add("active");
    }
    const id = e.target.getAttribute('href');
    // const element = document.querySelector(id);
    // const rems = 4.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    // const y = element.getBoundingClientRect().top + window.pageYOffset - rems;
    // window.scrollTo({top: y, behavior: 'smooth'});
    document.querySelector(id).scrollIntoView();
  }
});


//show burger menu button on resize
const observerBurger = new ResizeObserver((entries) => {
    const [entry] = entries;
    if (!isMenuOpen) header.style.transition = "0s";
    if (entry.contentRect.width >= 1100) {
        header.style.height = "4.5rem";
        cart.style.visibility = "visible";
        nav.style.visibility = "visible";
        isMenuOpen = false;
    }
});

observerBurger.observe(header);

// const media1100 = window.matchMedia("(max-width: 1100px)");

// if (!media1100.matches) {
//     header.style.height = "4.5rem";
//     cart.style.visibility = "visible";
//     nav.style.visibility = "visible";
//     isMenuOpen = false;
// } else {
//     hideMenu();
// }

// animate cakes sections - fade in
const obsCakeCallback = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
    } else {
        entry.target.style.opacity = 0;
    }
};

const obsCakeOptions = {
    root: null,
    threshold: 0.36
};

const observerCakes = new IntersectionObserver(obsCakeCallback, obsCakeOptions);

cakes.forEach(el => {
    observerCakes.observe(el);
    el.style.opacity = 0;
    let pos = findPos(el)[1];
    if (pos >= window.scrollY && pos < (window.scrollY + window.innerHeight)) {
        el.style.opacity = 1; 
    }
});

// hide video on scroll
const obsVideoHideCallback = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
        video.visibility = "visible";
        video.style.opacity = 1;
        video.play();
        resetLinks();
    } else {
        video.visibility = "hidden";
        video.pause();
        video.style.opacity = 0;
    }
};
const obsVideoOptions = {
    root: null,
    threshold: 0.8
};

const observerHideVideo = new IntersectionObserver(obsVideoHideCallback, obsVideoOptions);

observerHideVideo.observe(videoHide);

if (window.scrollY > window.innerHeight/2) {
    video.visibility = "hidden";
    video.style.opacity = 0;
}    

// alternative find position of element
function findPos(obj) {
    let curleft = 0;
    let curtop = 0;
    if(obj.offsetLeft) curleft += parseInt(obj.offsetLeft);
    if(obj.offsetTop) curtop += parseInt(obj.offsetTop);
    if(obj.scrollTop && obj.scrollTop > 0) curtop -= parseInt(obj.scrollTop);
    if(obj.offsetParent) {
        let pos = findPos(obj.offsetParent);
        curleft += pos[0];
        curtop += pos[1];
    } else if(obj.ownerDocument) {
        let thewindow = obj.ownerDocument.defaultView;
        if(!thewindow && obj.ownerDocument.parentWindow)
            thewindow = obj.ownerDocument.parentWindow;
        if(thewindow) {
            if(thewindow.frameElement) {
                let pos = findPos(thewindow.frameElement);
                curleft += pos[0];
                curtop += pos[1];
            }
        }
    }

    return [curleft,curtop];
}

// animate header bar on scroll
const obsMenuCallback = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
        resetLinks();
        navLink.forEach(el => {
            if (el.getAttribute("href").includes(entry.target.dataset.href)) {
                el.classList.add("active");
            }
        });
    }
}

const obsMenuOptions = {
    root: null,
    threshold: 0.3
};

const observerMenus = new IntersectionObserver(obsMenuCallback, obsMenuOptions);

href.forEach(el => observerMenus.observe(el));

function resetLinks() {
    navLink.forEach(el => el.classList.remove("active"));
}
