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

  const searchInput = document.querySelector("[role=combobox][aria-controls=job-search-suggestions]");
  if (searchInput) {
    const suggestionList = document.getElementById(searchInput.getAttribute("aria-controls"));
    const suggestions = searchInput.parentElement.querySelector("[data-job-suggestions]");
    const options = Array.from(suggestionList.querySelectorAll("[data-job-suggestion]"));
    const emptyMessage = suggestions.querySelector("[data-suggestion-empty]");
    const heading = suggestions.querySelector("[data-suggestion-heading]");
    let activeIndex = -1;
    let closeTimer;

    const closeSuggestions = () => {
      suggestions.hidden = true;
      searchInput.setAttribute("aria-expanded", "false");
      searchInput.removeAttribute("aria-activedescendant");
      options.forEach((option) => option.setAttribute("aria-selected", "false"));
      activeIndex = -1;
    };

    const updateSuggestions = () => {
      const query = searchInput.value.trim().toLowerCase();
      const terms = query.split(/\s+/).filter(Boolean);
      let shownCount = 0;

      options.forEach((option) => {
        const matches = terms.length === 0 || terms.every((term) => option.dataset.search.toLowerCase().includes(term));
        option.hidden = !matches || shownCount >= 6;
        if (!option.hidden) shownCount += 1;
      });

      emptyMessage.hidden = shownCount > 0;
      heading.textContent = terms.length ? "Suggested jobs" : "Popular demo jobs";
      suggestions.hidden = false;
      searchInput.setAttribute("aria-expanded", "true");
      searchInput.removeAttribute("aria-activedescendant");
      options.forEach((option) => option.setAttribute("aria-selected", "false"));
      activeIndex = -1;
    };

    const selectSuggestion = (option) => {
      searchInput.value = option.dataset.title;
      closeSuggestions();
      searchInput.form.requestSubmit();
    };

    searchInput.addEventListener("focus", updateSuggestions);
    searchInput.addEventListener("click", updateSuggestions);
    searchInput.addEventListener("input", updateSuggestions);
    searchInput.addEventListener("keydown", (event) => {
      const visibleOptions = options.filter((option) => !option.hidden);
      if (event.key === "Escape") {
        closeSuggestions();
      } else if (event.key === "ArrowDown" && !suggestions.hidden && visibleOptions.length) {
        event.preventDefault();
        activeIndex = (activeIndex + 1) % visibleOptions.length;
        searchInput.setAttribute("aria-activedescendant", visibleOptions[activeIndex].id);
        options.forEach((option) => option.setAttribute("aria-selected", String(option === visibleOptions[activeIndex])));
      } else if (event.key === "ArrowUp" && !suggestions.hidden && visibleOptions.length) {
        event.preventDefault();
        activeIndex = activeIndex <= 0 ? visibleOptions.length - 1 : activeIndex - 1;
        searchInput.setAttribute("aria-activedescendant", visibleOptions[activeIndex].id);
        options.forEach((option) => option.setAttribute("aria-selected", String(option === visibleOptions[activeIndex])));
      } else if (event.key === "Enter" && activeIndex >= 0 && !suggestions.hidden) {
        event.preventDefault();
        selectSuggestion(visibleOptions[activeIndex]);
      }
    });

    options.forEach((option, index) => {
      option.id = `job-suggestion-${index + 1}`;
      option.addEventListener("pointerdown", (event) => event.preventDefault());
      option.addEventListener("click", () => selectSuggestion(option));
    });

    searchInput.addEventListener("focusout", (event) => {
      if (suggestions.contains(event.relatedTarget)) return;
      closeTimer = window.setTimeout(() => {
        if (!suggestions.contains(document.activeElement)) closeSuggestions();
      }, 120);
    });
    suggestions.addEventListener("focusin", () => window.clearTimeout(closeTimer));
    suggestions.addEventListener("focusout", () => {
      closeTimer = window.setTimeout(() => {
        if (!suggestions.contains(document.activeElement) && document.activeElement !== searchInput) closeSuggestions();
      }, 120);
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
