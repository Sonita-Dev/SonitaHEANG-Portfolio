// Shared interactivity for the portfolio site
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  // Theme toggle: toggles 'dark' class on <html>
  const themeToggle = $("#theme-toggle");
  function setTheme(isDark) {
    const html = document.documentElement;
    if (isDark) html.classList.add("dark");
    else html.classList.remove("dark");
    try {
      localStorage.setItem("prefersDark", isDark ? "1" : "0");
    } catch (e) {}
    if (themeToggle) {
      themeToggle.textContent = isDark ? "☀️" : "🌙";
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );
    }
  }
  // init from storage or system
  try {
    const pref = localStorage.getItem("prefersDark");
    if (pref !== null) setTheme(pref === "1");
    else setTheme(document.documentElement.classList.contains("dark"));
  } catch (e) {
    if (themeToggle) {
      themeToggle.textContent = document.documentElement.classList.contains(
        "dark",
      )
        ? "☀️"
        : "🌙";
    }
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      setTheme(isDark);
    });
  }

  // Mobile menu toggle
  const mobileBtn = $("#mobile-menu-btn");
  if (mobileBtn) {
    const navSelector = () =>
      document.getElementById("main-nav") ||
      document.querySelector("nav .hidden.md\\:flex, nav .hidden.md\\:flex");
    mobileBtn.setAttribute("aria-controls", "main-nav");
    mobileBtn.setAttribute("aria-expanded", "false");
    mobileBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const nav = navSelector();
      if (!nav) return;
      const opened = !nav.classList.contains("hidden");
      nav.classList.toggle("hidden", opened);
      nav.classList.toggle("flex", !opened);
      mobileBtn.setAttribute("aria-expanded", String(!opened));
    });

    // Close menu on mobile when a nav link is selected
    const mobileNavLinks = document.querySelectorAll("#main-nav a");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const nav = navSelector();
        if (!nav || nav.classList.contains("hidden")) return;
        nav.classList.add("hidden");
        nav.classList.remove("flex");
        mobileBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const nav = navSelector();
      if (!nav) return;
      if (nav.classList.contains("hidden")) return;
      const target = e.target;
      if (target === mobileBtn || nav.contains(target)) return;
      nav.classList.add("hidden");
      nav.classList.remove("flex");
      mobileBtn.setAttribute("aria-expanded", "false");
    });
  }

  // Contact form handling with optional endpoint POST
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = (
        form.querySelector('[name="name"]') || { value: "" }
      ).value.trim();
      const email = (
        form.querySelector('[name="email"]') || { value: "" }
      ).value.trim();
      const msg = (
        form.querySelector('[name="message"]') || { value: "" }
      ).value.trim();
      function validEmail(em) {
        return /\S+@\S+\.\S+/.test(em);
      }
      if (!name) {
        alert("Please enter your name.");
        return;
      }
      if (!email || !validEmail(email)) {
        alert("Please enter a valid email.");
        return;
      }
      if (!msg) {
        alert("Please enter a message.");
        return;
      }

      const endpoint = form.getAttribute("data-endpoint") || "";
      if (endpoint) {
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message: msg }),
          });
          if (res.ok) {
            showToast("Message sent — thank you!");
            form.reset();
          } else {
            console.warn("Form POST failed", res.status);
            showToast("Failed to send message (server)");
          }
        } catch (err) {
          console.error("Form POST error", err);
          showToast("Failed to send message (network)");
        }
      } else {
        console.log("Contact form (local) submitted", { name, email, msg });
        showToast("Message queued — thank you!");
        form.reset();
      }
    });
  }

  // Small toast helper
  function showToast(text, timeout = 3000) {
    const t = document.createElement("div");
    t.textContent = text;
    t.style.position = "fixed";
    t.style.right = "20px";
    t.style.bottom = "20px";
    t.style.padding = "10px 14px";
    t.style.background = "rgba(138,43,226,0.95)";
    t.style.color = "#fff";
    t.style.borderRadius = "6px";
    t.style.zIndex = 9999;
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.transition = "opacity 300ms";
      t.style.opacity = "0";
      setTimeout(() => t.remove(), 300);
    }, timeout);
  }

  // Small progressive enhancement: highlight clickable cards
  document
    .querySelectorAll(".terminal-card, .terminal-border")
    .forEach((el) => {
      el.addEventListener("click", () => el.classList.add("opacity-90"));
    });

  // Active navigation highlighting: adds styles to nav links matching current page/hash
  (function highlightActive() {
    const navLinks = document.querySelectorAll("#main-nav a[href]");
    if (!navLinks || navLinks.length === 0) return;
    const page = location.pathname.split("/").pop() || "index.html";
    const currentPage = page === "" ? "index.html" : page;
    function mark(el) {
      el.classList.add(
        "text-primary",
        "font-bold",
        "border-b-2",
        "border-primary",
        "pb-1",
      );
    }
    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const [base, hash] = href.split("#");
      const normalizedHref = base === "" ? "index.html" : base;
      if (normalizedHref === currentPage) {
        mark(a);
      }
      if (hash && location.hash && `#${hash}` === location.hash) {
        mark(a);
      }
    });
  })();
})();
