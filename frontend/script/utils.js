//Выделение активной вкладки
export function setNavLinkActiveState(navLinks) {
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.setAttribute('data-active', 'true');
        } else {
            link.setAttribute('data-active', 'false');
        }
    });
}