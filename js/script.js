
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 150
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createParticles();
}

function createParticles() {
    particles = [];

    const particleCount = Math.floor(
        (canvas.width * canvas.height) / 12000
    );

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,

            // Mostly cyan, with occasional violet
            color: Math.random() > 0.8
                ? "167, 139, 250"
                : "34, 211, 238"
        });
    }
}


function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap particles around the screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Calculate mouse proximity
        let brightness = 0;
        let glow = 0;
        let sizeBoost = 0;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const intensity = 1 - distance / mouse.radius;

                // Stronger brightness and glow
                brightness = intensity;
                glow = intensity * 55;

                // Larger particle expansion
                sizeBoost = intensity * 5;

                // Push particles away from the mouse
                if (distance > 0) {
                    particle.x += (dx / distance) * intensity * 2;
                    particle.y += (dy / distance) * intensity * 2;
                }
            }
        }

        // Smoothly fade brightness and glow
        particle.brightness =
            (particle.brightness || 0) +
            (brightness - (particle.brightness || 0)) * 0.12;

        particle.glow =
            (particle.glow || 0) +
            (glow - (particle.glow || 0)) * 0.12;

        // Smooth particle expansion
        particle.sizeBoost =
            (particle.sizeBoost || 0) +
            (sizeBoost - (particle.sizeBoost || 0)) * 0.12;

        // Add a gentle pulse while illuminated
        const pulse = particle.brightness > 0.1
            ? Math.sin(Date.now() / 100) * particle.brightness * 1.5
            : 0;

        // Draw glowing particle
        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size + particle.sizeBoost + pulse,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(${particle.color}, ${0.75 + particle.brightness * 0.25})`;

        ctx.shadowColor = `rgba(${particle.color}, 1)`;
        ctx.shadowBlur = 8 + particle.glow;

        ctx.shadowColor = `rgba(${particle.color}, 1)`;
        ctx.shadowBlur = 5 + particle.glow;

        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = index + 1; j < particles.length; j++) {
            const other = particles[j];

            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const opacity = 1 - distance / 120;

                const lineColor =
                    particle.color === "167, 139, 250" ||
                        other.color === "167, 139, 250"
                        ? "167, 139, 250"
                        : "34, 211, 238";

                ctx.beginPath();
                ctx.strokeStyle =
                    `rgba(${lineColor}, ${opacity * 0.22})`;

                ctx.lineWidth = 1;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(drawParticles);
}


window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) {
        mouse.x = null;
        mouse.y = null;
    }
});

resizeCanvas();
drawParticles();

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
