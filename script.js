
document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);

  const opening = $("opening");
  const title = $("titleReveal");
  const birthday = $("birthday");
  const music = $("music");
  const musicBtn = $("musicBtn");

  let opened = false;
  let musicPlaying = false;
  let growthLevel = 0;

  // ----------------------------------------
  // INITIAL PAGE STATE
  // ----------------------------------------

  opening.classList.remove("hidden");
  title.classList.add("hidden");
  birthday.classList.add("hidden");

  const panels = Array.from(
    document.querySelectorAll(".journey-panel")
  );

  function showPart(index) {
    if (index < 0 || index >= panels.length) return;

    panels.forEach((panel, i) => {
      panel.classList.toggle("journey-active", i === index);
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (index === 2) {
      initializeTree();
    }
  }

  // ----------------------------------------
  // OPENING HEART -> TITLE -> GREETING
  // ----------------------------------------

  function openWebsite() {
    if (opened) return;
    opened = true;

    // Music is optional; it must not stop the animation.
    music.play().then(() => {
      musicPlaying = true;
      updateMusicButton();
    }).catch(() => {
      musicPlaying = false;
      updateMusicButton();
    });

    opening.style.opacity = "0";
    opening.style.transform = "scale(1.04)";

    setTimeout(() => {
      opening.classList.add("hidden");

      title.classList.remove("hidden");
      title.setAttribute("aria-hidden", "false");

      setTimeout(() => {
        title.style.transition = "opacity .8s ease";
        title.style.opacity = "0";

        setTimeout(() => {
          title.classList.add("hidden");
          title.setAttribute("aria-hidden", "true");
          title.style.opacity = "";
          title.style.transition = "";

          birthday.classList.remove("hidden");
          showPart(0);
          createMiniTree();
        }, 850);
      }, 3500);
    }, 700);

    // Safety fallback if a transition is interrupted.
    setTimeout(() => {
      if (birthday.classList.contains("hidden")) {
        opening.classList.add("hidden");
        title.classList.add("hidden");
        birthday.classList.remove("hidden");

        title.style.opacity = "";
        showPart(0);
        createMiniTree();
      }
    }, 6500);
  }

  $("openHeart").addEventListener("click", openWebsite);
  $("openBtn").addEventListener("click", openWebsite);

  // ----------------------------------------
  // STEP-BY-STEP NAVIGATION
  // ----------------------------------------

  document.querySelectorAll(".next-step").forEach(button => {
    button.addEventListener("click", () => {
      const nextIndex = Number(button.dataset.next);

      if (!Number.isInteger(nextIndex)) return;

      showPart(nextIndex);
    });
  });

  // ----------------------------------------
  // MUSIC BUTTON
  // ----------------------------------------

  function updateMusicButton() {
    musicBtn.textContent = musicPlaying
      ? "♫ Music on"
      : "♫ Music off";
  }

  musicBtn.addEventListener("click", async () => {
    try {
      if (musicPlaying) {
        music.pause();
        musicPlaying = false;
      } else {
        await music.play();
        musicPlaying = true;
      }
    } catch (error) {
      musicPlaying = false;
      console.warn("Music could not be played.", error);
    }

    updateMusicButton();
  });

  // ----------------------------------------
  // BIRTHDAY WISH
  // ----------------------------------------

  $("wishBtn").addEventListener("click", () => {
    const wish = $("secretWish");
    const isOpening = wish.classList.contains("hidden");

    wish.classList.toggle("hidden", !isOpening);

    $("wishBtn").textContent = isOpening
      ? "Keep this wish close ♡"
      : "Reveal a little wish ♡";

    if (isOpening) {
      scatterHearts(10);
    }
  });

  // ----------------------------------------
  // SMALL TREE IN THE GREETING
  // ----------------------------------------

  function createMiniTree() {
    const canopy = $("miniTreeCanopy");

    if (!canopy || canopy.children.length > 0) return;

    const colors = [
      "#e85d87", "#f18caf", "#f5b6c9",
      "#d9a0d5", "#c9a3e8", "#f2a69b", "#f4c76b"
    ];

    for (let i = 0; i < 110; i++) {
      const heart = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random());

      heart.className = "mini-heart";
      heart.textContent = Math.random() > .12 ? "♥" : "♡";
      heart.style.left =
        `${50 + Math.cos(angle) * radius * 43}%`;
      heart.style.top =
        `${43 + Math.sin(angle) * radius * 38}%`;
      heart.style.fontSize = `${7 + Math.random() * 10}px`;
      heart.style.color =
        colors[Math.floor(Math.random() * colors.length)];
      heart.style.animationDelay = `${Math.random() * 2}s`;

      canopy.appendChild(heart);
    }
  }

  // ----------------------------------------
  // INTERACTIVE GROWING FRIENDSHIP TREE
  // ----------------------------------------

  const canopy = $("treeCanopy");
  const branchLayer = $("branchLayer");
  const trunk = $("growingTrunk");
  const growButton = $("growTreeBtn");
  const treeMessage = $("treeMessage");

  const colors = [
    "#e85d87",
    "#f18caf",
    "#f5b6c9",
    "#d9a0d5",
    "#c9a3e8",
    "#f2a69b",
    "#f4c76b",
    "#d7b6e8"
  ];

  const treeMessages = [
    "A little more love, a little more growth. 🌱",
    "Every memory adds another beautiful leaf. 💗",
    "Growing stronger through every season. 🌷",
    "May our friendship always find a way to bloom. 🌸",
    "No matter how much life changes, may we keep growing. ♡",
    "Look how far our friendship has grown! 🌳",
    "More memories, more laughter, more years together. 💞",
    "A friendship that keeps reaching for the sky. ✨",
    "May our friendship keep growing forever. ♥"
  ];

  const initialBranches = [
    "M160 330 L160 190",
    "M160 275 L115 235 L85 185",
    "M160 250 L205 215 L245 165",
    "M160 220 L125 180 L110 135",
    "M160 195 L190 155 L210 115",
    "M160 290 L115 270 L85 240",
    "M160 275 L205 245 L235 215",
    "M160 180 L155 135 L170 95"
  ];

  const extraBranches = [
    "M115 235 L90 210 L65 190",
    "M205 215 L230 190 L260 180",
    "M125 180 L100 155 L92 125",
    "M190 155 L205 130 L220 100",
    "M115 270 L90 260 L70 235",
    "M205 245 L235 235 L255 210",
    "M155 135 L145 105 L150 80",
    "M170 115 L190 90 L205 75",
    "M90 210 L70 205 L55 185",
    "M230 190 L250 160 L265 145"
  ];

  let treeInitialized = false;
  let leafCount = 0;

  function addBranch(pathData, delay = 0) {
    const path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    path.setAttribute("d", pathData);
    path.setAttribute("class", "branch");
    path.style.animationDelay = `${delay}s`;

    branchLayer.appendChild(path);
  }

  function addLeaf(x, y, delay = 0) {
    const leaf = document.createElement("span");

    leaf.className = "growing-leaf";
    leaf.textContent = Math.random() > .14 ? "♥" : "♡";
    leaf.style.left = `${Math.max(2, Math.min(98, x))}%`;
    leaf.style.top = `${Math.max(1, Math.min(96, y))}%`;
    leaf.style.fontSize = `${8 + Math.random() * 12}px`;
    leaf.style.color =
      colors[Math.floor(Math.random() * colors.length)];
    leaf.style.animationDelay = `${delay}s`;

    canopy.appendChild(leaf);
    leafCount++;
  }

  function initializeTree() {
    if (treeInitialized) return;
    treeInitialized = true;

    initialBranches.forEach((branch, index) => {
      addBranch(branch, index * .1);
    });

    // Create the first heart-shaped canopy.
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random());

      const x = 50 + Math.cos(angle) * radius * 42;
      const y = 43 + Math.sin(angle) * radius * 38;

      addLeaf(x, y, Math.random() * 1.1);
    }
  }

  function growTree() {
    initializeTree();
    growthLevel++;

    // Add new branches on every click.
    const branchIndex = (growthLevel - 1) % extraBranches.length;
    addBranch(extraBranches[branchIndex], 0);

    // Increase trunk height gradually, with a maximum.
    const height = Math.min(175 + growthLevel * 9, 265);
    trunk.style.height = `${height}px`;

    // Add another group of leaves with each click.
    const newLeaves = 25 + Math.min(growthLevel * 3, 35);
    const spread = Math.min(22 + growthLevel * 2, 44);

    for (let i = 0; i < newLeaves; i++) {
      const x = 50 + (Math.random() * 2 - 1) * spread;
      const y = 43 + (Math.random() * 2 - 1) * spread * .85;

      addLeaf(x, y, Math.random() * .7);
    }

    treeMessage.textContent =
      treeMessages[(growthLevel - 1) % treeMessages.length];

    growButton.textContent = "Keep growing ♡";

    scatterHearts(4);
  }

  growButton.addEventListener("click", growTree);

  // ----------------------------------------
  // PHOTO GALLERY LIGHTBOX
  // ----------------------------------------

  const lightbox = $("lightbox");
  const largePhoto = $("largePhoto");

  document.querySelectorAll(".photo").forEach(button => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");

      if (!image || !image.complete || image.naturalWidth === 0) {
        alert("Please add the correct photo to your assets folder.");
        return;
      }

      largePhoto.src = image.src;
      largePhoto.alt = image.alt;
      lightbox.classList.remove("hidden");
      $("closePhoto").focus();
    });
  });

  function closeLightbox() {
    lightbox.classList.add("hidden");
    largePhoto.src = "";
  }

  $("closePhoto").addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  // ----------------------------------------
  // FLOATING HEARTS
  // ----------------------------------------

  function scatterHearts(amount = 10) {
    const symbols = ["♡", "♥", "✧", "❤"];

    for (let i = 0; i < amount; i++) {
      setTimeout(() => {
        const heart = document.createElement("span");

        heart.className = "floating-heart";
        heart.textContent =
          symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = `${5 + Math.random() * 90}%`;
        heart.style.fontSize = `${14 + Math.random() * 22}px`;
        heart.style.animationDuration = `${2.5 + Math.random() * 2}s`;

        document.body.appendChild(heart);

        heart.addEventListener("animationend", () => {
          heart.remove();
        });
      }, i * 80);
    }
  }

  // ----------------------------------------
  // FINAL CELEBRATION
  // ----------------------------------------

  $("celebrateBtn").addEventListener("click", () => {
    scatterHearts(30);
    launchConfetti();
    $("celebrateBtn").textContent = "Sending you all my love! ♡";
  });

  function launchConfetti() {
    const confettiColors = [
      "#df7898",
      "#f3b9c8",
      "#e7c18c",
      "#c9a3e8",
      "#d5dfc5",
      "#ffffff"
    ];

    const amount = window.innerWidth < 600 ? 60 : 110;

    for (let i = 0; i < amount; i++) {
      const piece = document.createElement("span");

      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor =
        confettiColors[
          Math.floor(Math.random() * confettiColors.length)
        ];
      piece.style.width = `${5 + Math.random() * 7}px`;
      piece.style.height = `${7 + Math.random() * 10}px`;
      piece.style.borderRadius = Math.random() > .5 ? "50%" : "2px";
      piece.style.setProperty(
        "--drift",
        `${-100 + Math.random() * 200}px`
      );
      piece.style.setProperty(
        "--duration",
        `${2.5 + Math.random() * 3}s`
      );

      document.body.appendChild(piece);

      piece.addEventListener("animationend", () => {
        piece.remove();
      });
    }
  }
});
