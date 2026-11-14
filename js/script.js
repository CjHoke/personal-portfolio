/* =================================
   FLOATING PAGE NAVIGATION
================================= */

document.addEventListener("DOMContentLoaded", () => {

    const pageSections = Array.from(
        document.querySelectorAll(
            ".hero, .about-section, .skills-section, .projects-section, .resume-section, .education-section, .contact-section"
        )
    );

    const scrollUpButton = document.getElementById("scroll-up");
    const scrollDownButton = document.getElementById("scroll-down");

    if (!scrollUpButton || !scrollDownButton || pageSections.length === 0) {
        console.error("Page navigation: Buttons or sections not found.");
        return;
    }

    function getCurrentSectionIndex() {
        const scrollPosition = window.scrollY + window.innerHeight * 0.35;

        let activeIndex = 0;

        pageSections.forEach((section, index) => {
            if (section.getBoundingClientRect().top + window.scrollY <= scrollPosition) {
                activeIndex = index;
            }
        });

        return activeIndex;
    }

    function jumpToSection(index) {
        if (index < 0 || index >= pageSections.length) return;

        const targetPosition =
            pageSections[index].getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });
    }

    scrollUpButton.addEventListener("click", () => {
        jumpToSection(getCurrentSectionIndex() - 1);
    });

    scrollDownButton.addEventListener("click", () => {
        jumpToSection(getCurrentSectionIndex() + 1);
    });

    console.log("Page navigation initialized:", pageSections.length, "sections found.");

});
