const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwfkLDu6_IhmvMn2S-yXNAkUqpWvlSLS6Avfq0xYGajI8PqzqNuyVyMyj9m8NKGWWs/exec";
const TRANSITION_DURATION = 3000;

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-menu a").forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });
}

const style = document.createElement("style");

style.textContent = `
    #page-transition {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(
            circle at center,
            #8A2A1B 0%,
            #6A2017 50%,
            #421410 100%
        );
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition:
            opacity 0.5s ease,
            visibility 0.5s ease;
    }

    #page-transition.active {
        opacity: 1;
        visibility: visible;
        pointer-events: all;
    }

    .transition-content {
        text-align: center;
        opacity: 0;
        transform: translateY(30px) scale(0.95);
        transition:
            opacity 0.7s ease,
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }

    #page-transition.active .transition-content {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    .transition-logo {
        width: 180px;
        height: 180px;
        margin: 0 auto 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 1.5s ease-in-out infinite;
    }

    .transition-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    }

    .transition-title {
        color: white;
        font-size: 38px;
        font-weight: 900;
        letter-spacing: 5px;
        margin-bottom: 8px;
    }

    .transition-subtitle {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        letter-spacing: 2px;
    }

    .transition-skip {
        position: absolute;
        right: 35px;
        bottom: 35px;
        padding: 12px 22px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 30px;
        background: rgba(255, 255, 255, 0.08);
        color: white;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1px;
        cursor: pointer;
        backdrop-filter: blur(10px);
        transition: 0.3s ease;
    }

    .transition-skip:hover {
        background: rgba(255, 255, 255, 0.18);
        border-color: white;
        transform: translateY(-2px);
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
        }

        50% {
            transform: scale(1.06);
        }
    }

    @media (max-width: 768px) {
        .transition-logo {
            width: 130px;
            height: 130px;
        }

        .transition-title {
            font-size: 25px;
            letter-spacing: 3px;
        }

        .transition-subtitle {
            font-size: 11px;
        }

        .transition-skip {
            right: 20px;
            bottom: 25px;
            padding: 10px 18px;
            font-size: 12px;
        }
    }
`;

document.head.appendChild(style);

const transition = document.createElement("div");

transition.id = "page-transition";

transition.innerHTML = `
    <div class="transition-content">
        <div class="transition-logo">
            <img src="assets/Logo Magang.png" alt="logo">
        </div>

        <div class="transition-title">
            KELOMPOK 5
        </div>

        <div class="transition-subtitle">
            MAGANG OSIS 26/27
        </div>
    </div>

    <button
        class="transition-skip"
        id="transition-skip"
        type="button"
    >
        SKIP
    </button>
`;

document.body.appendChild(transition);

let transitionTimer = null;
let nextPage = null;
let transitionRunning = false;

function showTransition(destination = null) {
    if (transitionRunning) {
        return;
    }

    transitionRunning = true;
    nextPage = destination;

    transition.classList.add("active");

    transitionTimer = setTimeout(() => {
        finishTransition();
    }, TRANSITION_DURATION);
}

function finishTransition() {
    if (transitionTimer) {
        clearTimeout(transitionTimer);
        transitionTimer = null;
    }

    transition.classList.remove("active");

    const destination = nextPage;

    nextPage = null;
    transitionRunning = false;

    if (destination) {
        sessionStorage.setItem(
            "pageTransitionNavigation",
            "true"
        );

        window.location.href = destination;
    }
}

const skipButton = document.getElementById("transition-skip");

if (skipButton) {
    skipButton.addEventListener("click", () => {
        finishTransition();
    });
}

window.addEventListener("load", () => {
    const comingFromNavigation = sessionStorage.getItem(
        "pageTransitionNavigation"
    );

    if (comingFromNavigation === "true") {
        sessionStorage.removeItem(
            "pageTransitionNavigation"
        );
        return;
    }

    showTransition();
});

document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function(event) {
        const target = this.getAttribute("href");

        if (!target) {
            return;
        }

        if (target === "#") {
            return;
        }

        if (target.startsWith("#")) {
            return;
        }

        if (this.target === "_blank") {
            return;
        }

        if (
            target.startsWith("mailto:") ||
            target.startsWith("tel:")
        ) {
            return;
        }

        let destination;

        try {
            destination = new URL(
                target,
                window.location.href
            );
        } catch {
            return;
        }

        if (
            destination.origin !==
            window.location.origin
        ) {
            return;
        }

        if (
            destination.pathname ===
                window.location.pathname &&
            destination.search ===
                window.location.search
        ) {
            return;
        }

        event.preventDefault();

        showTransition(destination.href);
    });
});

const form = document.querySelector(
    ".registration-box form"
);

if (form) {
    form.addEventListener("submit", async event => {
        event.preventDefault();

        const lombaElement = document.querySelector(
            ".registration-content h1"
        );

        const teamClassInput = document.querySelector(
            '[name="team-class"]'
        );

        const lomba = lombaElement
            ? lombaElement.textContent.trim()
            : "Tidak diketahui";

        const kelasTim = teamClassInput
            ? teamClassInput.value.trim()
            : "";

        const data = {
            lomba: lomba,
            kelasTim: kelasTim,
            anggota1:
                document.querySelector(
                    '[name="nama1"]'
                )?.value.trim() || "",
            anggota2:
                document.querySelector(
                    '[name="nama2"]'
                )?.value.trim() || "",
            anggota3:
                document.querySelector(
                    '[name="nama3"]'
                )?.value.trim() || "",
            anggota4:
                document.querySelector(
                    '[name="nama4"]'
                )?.value.trim() || "",
            anggota5:
                document.querySelector(
                    '[name="nama5"]'
                )?.value.trim() || ""
        };

        if (!kelasTim) {
            alert(
                "Silakan isi Kelas Tim terlebih dahulu."
            );
            return;
        }

        const button = form.querySelector(
            ".register-button"
        );

        const originalText = button
            ? button.textContent
            : "DAFTAR SEKARANG";

        if (button) {
            button.disabled = true;
            button.textContent = "MENGIRIM...";
        }

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(data)
            });

            alert(
                "Pendaftaran berhasil dikirim!"
            );

            form.reset();
        } catch (error) {
            console.error(error);

            alert(
                "Pendaftaran gagal dikirim. Silakan coba lagi."
            );
        }

        if (button) {
            button.disabled = false;
            button.textContent = originalText;
        }
    });
}