/* Humans of English — progressive enhancement. The site works without JS;
   this adds the mobile menu, accordions, tabs, filters and form handling. */
(function () {
  "use strict";

  var CONFIG = window.HOE_CONFIG || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Opened from disk (file://): folder links need an explicit index.html ---------- */
  if (location.protocol === "file:") {
    $$("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (/^[a-z]+:/i.test(href) || href.charAt(0) === "#") return;
      a.setAttribute("href", href.replace(/\/(?=$|[?#])/, "/index.html"));
    });
  }

  /* ---------- Hand-drawn lines and scroll reveals ---------- */
  var revealTargets = ".section-head, .why-intro, .faq-intro, .split-head, .pathway-card, .feature, .skill-item, " +
    ".resource-card, .case-card, .course-card, .study-plan li, .includes-grid li, .info-card, .steps li, .level-selector, .accordion-item, .form-card, .about-copy";
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var drawables = $$("[data-draw]");
  var reveals = $$(revealTargets).filter(function (el) { return !el.closest(".hero"); });

  if (still || !("IntersectionObserver" in window)) {
    drawables.forEach(function (el) { el.classList.add("is-drawn"); });
  } else {
    // Stagger siblings so grids appear one card after another
    reveals.forEach(function (el) {
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--reveal-delay", Math.min(i, 5) * 0.08 + "s");
      el.classList.add("reveal");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(entry.target.hasAttribute("data-draw") ? "is-drawn" : "is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.15 });
    drawables.concat(reveals).forEach(function (el) { io.observe(el); });
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile navigation ---------- */
  var toggle = $(".nav-toggle");
  var navEl = $("#site-nav");
  if (toggle && navEl) {
    var setOpen = function (open, returnFocus) {
      toggle.setAttribute("aria-expanded", String(open));
      navEl.classList.toggle("is-open", open);
      if (!open && returnFocus) toggle.focus();
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
    });
    navEl.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    var desktop = window.matchMedia("(min-width: 1280px)");
    var onChange = function () { if (desktop.matches) setOpen(false); };
    desktop.addEventListener ? desktop.addEventListener("change", onChange) : desktop.addListener(onChange);
  }

  /* ---------- Accordions ---------- */
  $$("[data-accordion]").forEach(function (acc) {
    var triggers = $$(".accordion-trigger", acc);
    triggers.forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      panel.hidden = btn.getAttribute("aria-expanded") !== "true";
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      });
    });
    // Open the item a link points at (e.g. /#faq-3-trigger)
    if (location.hash) {
      var target = acc.querySelector(location.hash.replace(/[^#\w-]/g, ""));
      if (target && target.classList.contains("accordion-trigger")) target.click();
    }
  });

  /* ---------- Tabs (level selector) ---------- */
  $$("[data-tabs]").forEach(function (wrap) {
    var tabs = $$('[role="tab"]', wrap);
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
    var current = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    if (current) select(current);
  });

  /* ---------- Resource search & filters ---------- */
  var library = $("[data-resource-library]");
  if (library) {
    var cards = $$(".resource-card", library);
    var buttons = $$(".filter-btn", library);
    var search = $("#resource-search", library);
    var count = $("[data-results-count]", library);
    var empty = $("[data-empty-state]", library);
    var active = "all";

    var params = new URLSearchParams(location.search);
    if (params.get("category") && buttons.some(function (b) { return b.dataset.filter === params.get("category"); })) {
      active = params.get("category");
    }
    if (params.get("q") && search) search.value = params.get("q");

    var apply = function () {
      var q = (search ? search.value : "").trim().toLowerCase();
      var terms = q ? q.split(/\s+/) : [];
      var shown = 0;
      cards.forEach(function (card) {
        var inCat = active === "all" || card.dataset.category === active;
        var text = card.dataset.search || "";
        var match = terms.every(function (t) { return text.indexOf(t) !== -1; });
        card.hidden = !(inCat && match);
        if (!card.hidden) shown++;
      });
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.filter === active)); });
      if (count) count.textContent = shown === 1 ? "Showing 1 resource" : "Showing " + shown + " resources";
      if (empty) empty.hidden = shown !== 0;

      var p = new URLSearchParams();
      if (active !== "all") p.set("category", active);
      if (q) p.set("q", q);
      var qs = p.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
    };

    buttons.forEach(function (b) {
      b.addEventListener("click", function () { active = b.dataset.filter; apply(); });
    });
    if (search) search.addEventListener("input", apply);
    var reset = $("[data-reset-filters]", library);
    if (reset) reset.addEventListener("click", function () {
      active = "all";
      if (search) search.value = "";
      apply();
      if (search) search.focus();
    });
    apply();
  }

  /* ---------- Contact form ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  $$("[data-contact-form]").forEach(function (form) {
    var status = $("[data-form-status]", form);
    var modeNote = $("[data-form-mode] span", form);
    var submit = $("[data-submit-label]", form);
    var mode = CONFIG.formEndpoint ? "endpoint" : CONFIG.contactEmail ? "email" : "demo";

    if (mode === "endpoint" && modeNote) {
      modeNote.textContent = "Your message is sent securely through our form provider. We only use your details to reply to you.";
      $("[data-form-mode]", form).hidden = true;
    } else if (mode === "email" && modeNote) {
      modeNote.textContent = "Sending opens your email app with your details filled in, addressed to " + CONFIG.contactEmail + ". Just press send there.";
      if (submit) submit.firstChild.textContent = "Send email ";
    } else if (modeNote) {
      modeNote.textContent = "Demo form: this form is not connected to an inbox yet, so nothing you enter is sent or stored. You can still try it to check your details.";
      if (submit) submit.firstChild.textContent = "Try the form ";
    }

    var fields = {
      name: form.elements.name,
      email: form.elements.email,
      goal: form.elements.goal,
    };

    // Arriving from a course page (?course=<slug>) pre-selects that course's goal
    var courseSlug = new URLSearchParams(location.search).get("course");
    var courseGoal = courseSlug && CONFIG.courseGoals && CONFIG.courseGoals[courseSlug];
    if (courseGoal) {
      Array.prototype.forEach.call(fields.goal.options, function (opt) {
        if (opt.text === courseGoal) fields.goal.value = opt.value || opt.text;
      });
    }

    var messages = {
      name: function (v) { return v.trim().length < 2 ? "Please enter your full name." : ""; },
      email: function (v) {
        if (!v.trim()) return "Please enter your email address.";
        return EMAIL_RE.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com.";
      },
      goal: function (v) { return v ? "" : "Please choose your main learning goal."; },
    };

    var showError = function (key) {
      var input = fields[key];
      var err = document.getElementById(input.getAttribute("aria-describedby"));
      var msg = messages[key](input.value);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) { err.textContent = msg; err.hidden = !msg; }
      return !msg;
    };

    Object.keys(fields).forEach(function (key) {
      var input = fields[key];
      input.addEventListener("blur", function () { if (input.value) showError(key); });
      input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") showError(key); });
      input.addEventListener("change", function () { if (input.getAttribute("aria-invalid") === "true") showError(key); });
    });

    var setStatus = function (kind, html) {
      status.className = "form-status is-" + kind;
      status.innerHTML = html;
      status.hidden = false;
      status.focus();
    };

    var escapeHtml = function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;
      Object.keys(fields).forEach(function (key) {
        if (!showError(key) && !firstInvalid) firstInvalid = fields[key];
      });
      if (firstInvalid) {
        status.hidden = true;
        firstInvalid.focus();
        return;
      }

      var data = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        goal: fields.goal.value,
        format: form.elements.format ? form.elements.format.value : "",
        message: form.elements.message.value.trim(),
      };
      var firstName = escapeHtml(data.name.split(/\s+/)[0]);

      if (mode === "endpoint") {
        submit.disabled = true;
        fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        })
          .then(function (res) {
            if (!res.ok) throw new Error("Request failed");
            form.reset();
            setStatus("success", "<strong>Thank you, " + firstName + ". Your message has been sent.</strong>We'll reply to the email address you gave us.");
          })
          .catch(function () {
            setStatus("error", "<strong>Sorry, your message couldn't be sent.</strong>Please check your connection and try again.");
          })
          .then(function () { submit.disabled = false; });
        return;
      }

      if (mode === "email") {
        var body = [
          "Hello Humans of English,",
          "",
          data.message || "I'd like to find out more about learning with you.",
          "",
          "Name: " + data.name,
          "Email: " + data.email,
          "Learning goal: " + data.goal,
          "Preferred format: " + (data.format || "No preference"),
        ].join("\r\n");
        var href = "mailto:" + CONFIG.contactEmail +
          "?subject=" + encodeURIComponent("Enquiry: " + data.goal + " (" + data.name + ")") +
          "&body=" + encodeURIComponent(body);
        window.location.href = href;
        var mail = escapeHtml(CONFIG.contactEmail);
        var dm = CONFIG.instagram
          ? ", or DM us on Instagram <a href=\"https://www.instagram.com/" + escapeHtml(CONFIG.instagram) + "/\" rel=\"noopener\">@" + escapeHtml(CONFIG.instagram) + "</a>"
          : "";
        setStatus("info", "<strong>Almost done, " + firstName + ". Your email app should now be open.</strong>Your details are filled in. Press <em>send</em> there to reach us. If no email app opened, write to <a href=\"mailto:" +
          mail + "\">" + mail + "</a>" + dm + ".");
        return;
      }

      var navLink = $('.nav-list a[href*="learning-resources"]');
      var resourcesHref = escapeHtml(navLink ? navLink.getAttribute("href") : "/learning-resources/");
      setStatus("info", "<strong>Thanks, " + firstName + ". Your details look good.</strong>This form isn't connected to an inbox yet, so your message has <em>not</em> been sent and nothing has been stored. Please check back soon. In the meantime, our <a href=\"" + resourcesHref + "\">free learning resources</a> are open to everyone.");
    });
  });
})();
