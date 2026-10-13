(() => {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("nav-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const open = panel.classList.toggle("hidden") === false;
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("overflow-hidden", open);
    });
    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        panel.classList.add("hidden");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("overflow-hidden");
      });
    });
  }

  document.querySelectorAll("[data-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
      }
      if (form.dataset.ajax === "false") return;
      event.preventDefault();
      const submit = form.querySelector("[type=submit]");
      const status = form.querySelector("[data-form-status]");
      submit.disabled = true;
      const body = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body,
          headers: { Accept: "application/json" }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Please check the form and try again.");
        }
        form.reset();
        if (status) {
          status.textContent = data.message;
          status.classList.remove("text-red-700");
          status.classList.add("text-green-dark");
        }
      } catch (err) {
        if (status) {
          status.textContent = err.message;
          status.classList.add("text-red-700");
        }
      } finally {
        submit.disabled = false;
      }
    });
  });
})();
