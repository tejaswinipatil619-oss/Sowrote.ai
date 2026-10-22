"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // UTILITIES
  // ==========================================

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  let toastTimer;

  function showToast(message) {
    const toast = $(".toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function setMessage(element, message) {
    if (!element) return;

    element.textContent = message;
    element.setAttribute("role", "status");
  }

  // ==========================================
  // ANNOUNCEMENT BAR
  // ==========================================

  $(".announcement-close")?.addEventListener("click", () => {
    $("#announcementBar")?.remove();
  });

  // ==========================================
  // RESPONSIVE MOBILE NAVIGATION
  // ==========================================

  const menuToggle = $(".mobile-menu-toggle");
  const navLinks = $("#navLinks");

  function closeMobileMenu() {
    navLinks?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
  }

  menuToggle?.addEventListener("click", () => {
    const open = navLinks?.classList.toggle("active");

    menuToggle.setAttribute(
      "aria-expanded",
      String(Boolean(open))
    );
  });

  $$("#navLinks a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      closeMobileMenu();
    }
  });

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = $(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      closeMobileMenu();
    });
  });

  // ==========================================
  // FEATURE TABS
  // ==========================================

  const featureContent = {
    automation: {
      title: "Automate your repetitive work.",
      description:
        "Turn repetitive tasks into streamlined workflows and spend more time on work that matters.",
      points: [
        "Automate recurring tasks",
        "Connect tools and processes",
        "Monitor workflow activity"
      ]
    },

    content: {
      title: "Create content with more confidence.",
      description:
        "Organize ideas, develop first drafts, and build a smoother content creation process.",
      points: [
        "Brainstorm content ideas",
        "Develop marketing drafts",
        "Organize your writing workflow"
      ]
    },

    analytics: {
      title: "Make sense of your workflow.",
      description:
        "Explore performance indicators and understand how your work is organized.",
      points: [
        "Review key activity metrics",
        "Explore performance trends",
        "Make informed decisions"
      ]
    }
  };

  $$(".feature-tab").forEach(tab => {
    tab.addEventListener("click", () => {

      $$(".feature-tab").forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const key = tab.dataset.feature;
      const content = featureContent[key];

      if (!content) return;

      const section = tab.closest(".features-section");
      if (!section) return;

      const title = $(".feature-copy h3", section);
      const description = $(".feature-copy > p", section);
      const list = $(".feature-list", section);

      if (title) title.textContent = content.title;
      if (description) description.textContent = content.description;

      if (list) {
        list.replaceChildren();

        content.points.forEach(point => {
          const li = document.createElement("li");
          li.textContent = point;
          list.appendChild(li);
        });
      }

    });
  });

  // ==========================================
  // FEATURE WORKFLOW PREVIEW
  // ==========================================

  $(".workflow-run")?.addEventListener("click", event => {

    const button = event.currentTarget;
    const output = $(".demo-output");

    button.disabled = true;
    button.textContent = "Preparing preview...";

    if (output) {
      output.textContent = "Preparing sample workflow...";
    }

    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = "<span>▶</span> Preview workflow";

      if (output) {
        output.textContent =
          "Preview completed. Connect backend integrations to execute real tasks.";
      }
    }, 900);

  });

  // ==========================================
  // HERO PREVIEW INTERACTIONS
  // ==========================================

  $$(".preview-nav").forEach(button => {
    button.addEventListener("click", () => {

      $$(".preview-nav").forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");
    });
  });

  $$(".preview-tool").forEach(button => {
    button.addEventListener("click", () => {
      const tool = button.dataset.demoTool;

      const toolNames = {
        content: "AI Content Creation",
        workflow: "Workflow Builder",
        analytics: "Analytics Workspace",
        ideas: "Idea Generator"
      };

      showToast(
        `${toolNames[tool] || "Workspace"} preview selected`
      );
    });
  });

  // ==========================================
  // AI TOOL MODAL
  // ==========================================

  const toolModal = $("#toolModal");
  const toolModalTitle = $("#toolModalTitle");
  const toolModalDescription = $("#toolModalDescription");
  const toolModalAction = $("#toolModalAction");

  const toolDetails = {
    writer: {
      title: "AI Writer",
      description:
        "Prepare blog ideas, email drafts, and marketing copy in the AI playground.",
      target: "#playground",
      type: "writer"
    },

    ideas: {
      title: "Idea Generator",
      description:
        "Explore ideas and creative directions using the playground preview.",
      target: "#playground",
      type: "ideas"
    },

    summarizer: {
      title: "Text Summarizer",
      description:
        "Prepare concise key takeaways from a sample text prompt.",
      target: "#playground",
      type: "summarizer"
    },

    campaign: {
      title: "Campaign Planner",
      description:
        "Organize a campaign idea into a sample plan.",
      target: "#playground",
      type: "campaign"
    }
  };

  // ==========================================
  // MODALS
  // ==========================================

  let lastFocusedElement = null;

  function openModal(modal) {
    if (!modal) return;

    lastFocusedElement = document.activeElement;

    $$(".modal-backdrop.active").forEach(existing => {
      if (existing !== modal) {
        closeModal(existing, false);
      }
    });

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    $(".modal-close", modal)?.focus();
  }

  function closeModal(modal, restoreFocus = true) {
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    if (!$(".modal-backdrop.active")) {
      document.body.classList.remove("modal-open");
    }

    if (restoreFocus && lastFocusedElement?.focus) {
      lastFocusedElement.focus();
    }
  }

  $$("[data-modal-target]").forEach(button => {
    button.addEventListener("click", () => {
      const selector = button.dataset.modalTarget;
      openModal($(selector));
    });
  });

  $$(".modal-close").forEach(button => {
    button.addEventListener("click", () => {
      closeModal(button.closest(".modal-backdrop"));
    });
  });

  $$(".modal-backdrop").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      $$(".modal-backdrop.active").forEach(modal => {
        closeModal(modal);
      });
    }

    // Basic focus containment for open dialogs.
    if (event.key === "Tab") {
      const modal = $(".modal-backdrop.active");
      if (!modal) return;

      const focusable = $$(
        'button:not(:disabled), a[href], input:not(:disabled), ' +
        'select:not(:disabled), textarea:not(:disabled), ' +
        '[tabindex]:not([tabindex="-1"])',
        modal
      ).filter(element => element.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  $$("[data-open-tool]").forEach(button => {
    button.addEventListener("click", () => {

      const key = button.dataset.openTool;
      const detail = toolDetails[key];

      if (!detail) {
        showToast("Tool preview selected.");
        return;
      }

      if (toolModalTitle) {
        toolModalTitle.textContent = detail.title;
      }

      if (toolModalDescription) {
        toolModalDescription.textContent = detail.description;
      }

      if (toolModalAction) {
        toolModalAction.href = detail.target;
        toolModalAction.dataset.toolType = detail.type;
      }

      openModal(toolModal);
    });
  });

  toolModalAction?.addEventListener("click", () => {
    const type = toolModalAction.dataset.toolType;

    if ($("#toolType")) {
      $("#toolType").value = type || "writer";
    }

    closeModal(toolModal, false);

    setTimeout(() => {
      $("#promptInput")?.focus();
    }, 400);
  });

  // ==========================================
  // PLAYGROUND CHARACTER COUNTER
  // ==========================================

  const promptInput = $("#promptInput");
  const promptCounter = $("#promptCounter");

  function updatePromptCounter() {
    if (!promptInput || !promptCounter) return;

    promptCounter.textContent =
      `${promptInput.value.length} / 2000`;
  }

  promptInput?.addEventListener("input", updatePromptCounter);

  updatePromptCounter();

  // ==========================================
  // PLAYGROUND SAMPLE OUTPUT
  // ==========================================

  const playgroundForm = $("#playgroundForm");
  const playgroundResult = $("#playgroundResult");
  const resultContent = $("#resultContent");
  const generateButton = $("#generateButton");

  let lastGeneratedOutput = "";

  function createSampleOutput(type, prompt) {

    const cleanPrompt = prompt.trim();

    const templates = {

      writer: () => [
        "CONTENT DRAFT",
        "",
        `Topic: ${cleanPrompt}`,
        "",
        "Opening:",
        `Let's explore ${cleanPrompt} and why it matters.`,
        "",
        "Key points:",
        "1. Introduce the main idea.",
        "2. Explain the most important benefits.",
        "3. Include a practical example.",
        "4. Finish with a clear next step.",
        "",
        "Note: This is a sample template, not AI-generated content."
      ].join("\n"),

      ideas: () => [
        "IDEA STARTERS",
        "",
        `Starting point: ${cleanPrompt}`,
        "",
        "1. A simple version focused on one key problem.",
        "2. A premium version with advanced capabilities.",
        "3. A collaborative experience for teams.",
        "4. A personalized experience for individual users.",
        "5. A data-informed approach to improvement.",
        "",
        "Note: These are static sample ideas."
      ].join("\n"),

      summarizer: () => [
        "SUMMARY TEMPLATE",
        "",
        `Source: ${cleanPrompt}`,
        "",
        "Key takeaway:",
        "Identify the central message and supporting details.",
        "",
        "Important points:",
        "• Main subject",
        "• Supporting evidence",
        "• Action items",
        "",
        "Note: Connect an AI provider to summarize actual source text."
      ].join("\n"),

      campaign: () => [
        "CAMPAIGN PLAN",
        "",
        `Campaign idea: ${cleanPrompt}`,
        "",
        "1. Goal: Define the desired outcome.",
        "2. Audience: Identify the intended audience.",
        "3. Message: Choose one clear central message.",
        "4. Channels: Select appropriate marketing channels.",
        "5. Schedule: Plan content and delivery dates.",
        "6. Metrics: Decide how success will be measured.",
        "",
        "Note: This is a static planning template."
      ].join("\n")

    };

    return (
      templates[type] ||
      templates.writer
    )();
  }

  playgroundForm?.addEventListener("submit", async event => {

    event.preventDefault();

    if (!playgroundForm.reportValidity()) return;

    const type = $("#toolType")?.value || "writer";
    const prompt = promptInput?.value || "";

    if (!prompt.trim()) {
      promptInput?.focus();
      return;
    }

    generateButton.disabled = true;
    generateButton.textContent = "Preparing preview...";

    if (playgroundResult) {
      playgroundResult.hidden = false;
    }

    if (resultContent) {
      resultContent.textContent = "Preparing sample output...";
    }

    // Simulated preview only. No external AI API is called.
    await new Promise(resolve => setTimeout(resolve, 500));

    lastGeneratedOutput = createSampleOutput(type, prompt);

    if (resultContent) {
      resultContent.textContent = lastGeneratedOutput;
    }

    generateButton.disabled = false;
    generateButton.textContent = "✧ Generate preview";

    playgroundResult?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  });

  $("#copyResult")?.addEventListener("click", async () => {

    if (!lastGeneratedOutput) {
      showToast("Generate a preview first.");
      return;
    }

    try {

      await navigator.clipboard.writeText(lastGeneratedOutput);
      showToast("Sample output copied.");

    } catch {

      const temporary = document.createElement("textarea");

      temporary.value = lastGeneratedOutput;
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";

      document.body.appendChild(temporary);

      temporary.select();

      try {
        document.execCommand("copy");
        showToast("Sample output copied.");
      } catch {
        showToast("Copy failed. Select and copy the output manually.");
      }

      temporary.remove();

    }

  });

  // ==========================================
  // WORKFLOW BUILDER
  // ==========================================

  const workflowCanvas = $("#workflowCanvas");
  const addWorkflowStep = $("#addWorkflowStep");
  const workflowStepCount = $("#workflowStepCount");
  const workflowStatus = $("#workflowStatus");
  const runWorkflow = $("#runWorkflow");

  let workflowCounter = 0;

  const stepTypes = [
    {
      title: "Review output",
      description: "Check the prepared result",
      icon: "✓",
      color: "green"
    },
    {
      title: "Organize task",
      description: "Prepare task details",
      icon: "▤",
      color: "violet"
    },
    {
      title: "Process information",
      description: "Prepare the next action",
      icon: "✧",
      color: "blue"
    },
    {
      title: "Complete workflow",
      description: "Mark the preview complete",
      icon: "↗",
      color: "pink"
    }
  ];

  function updateWorkflowCount() {

    if (!workflowCanvas || !workflowStepCount) return;

    const count = $$(".builder-node", workflowCanvas).length;

    workflowStepCount.textContent =
      `${count} ${count === 1 ? "step" : "steps"} in this preview`;

    $$(".builder-connector", workflowCanvas).forEach(connector => {
      connector.remove();
    });

    const nodes = $$(".builder-node", workflowCanvas);

    nodes.forEach((node, index) => {

      if (index < nodes.length - 1) {
        const connector = document.createElement("div");
        connector.className = "builder-connector";

        node.after(connector);
      }

    });

  }

  function createWorkflowNode(step) {

    const node = document.createElement("div");
    node.className = "builder-node";

    const icon = document.createElement("span");
    icon.className = `builder-node-icon ${step.color}`;
    icon.textContent = step.icon;

    const content = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = step.title;

    const description = document.createElement("small");
    description.textContent = step.description;

    content.append(title, description);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-step";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Remove ${step.title}`);

    remove.addEventListener("click", () => {
      node.remove();
      updateWorkflowCount();

      setMessage(workflowStatus, "Step removed from the preview.");
    });

    node.append(icon, content, remove);

    return node;
  }

  addWorkflowStep?.addEventListener("click", () => {

    if (!workflowCanvas) return;

    const nodes = $$(".builder-node", workflowCanvas);

    if (nodes.length >= 12) {
      showToast("The preview supports up to 12 steps.");
      return;
    }

    const step = stepTypes[
      workflowCounter % stepTypes.length
    ];

    workflowCounter++;

    workflowCanvas.appendChild(createWorkflowNode(step));

    updateWorkflowCount();

    setMessage(workflowStatus, `${step.title} added to the preview.`);

  });

  workflowCanvas?.addEventListener("click", event => {

    const removeButton = event.target.closest(".remove-step");

    if (!removeButton) return;

    const node = removeButton.closest(".builder-node");

    node?.remove();

    updateWorkflowCount();

  });

  runWorkflow?.addEventListener("click", async () => {

    const nodes = $$(".builder-node", workflowCanvas);

    if (!nodes.length) {
      setMessage(workflowStatus, "Add at least one step first.");
      return;
    }

    runWorkflow.disabled = true;
    runWorkflow.textContent = "Running preview...";

    setMessage(workflowStatus, "Simulating the workflow...");

    for (const [index, node] of nodes.entries()) {

      const title = $("strong", node)?.textContent || "Workflow step";

      setMessage(
        workflowStatus,
        `Preview step ${index + 1} of ${nodes.length}: ${title}`
      );

      await new Promise(resolve => setTimeout(resolve, 350));

    }

    runWorkflow.disabled = false;
    runWorkflow.textContent = "▶ Run preview";

    setMessage(
      workflowStatus,
      "Preview complete. Real workflow execution requires backend integrations."
    );

  });

  updateWorkflowCount();

  // ==========================================
  // DASHBOARD NAVIGATION
  // ==========================================

  $$(".dashboard-nav").forEach(button => {

    button.addEventListener("click", () => {

      $$(".dashboard-nav").forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      const heading = $(".dashboard-topbar h3");

      if (heading) {
        heading.textContent =
          button.dataset.dashboardTitle ||
          button.textContent.trim();
      }

      showToast(
        `${button.dataset.dashboardTitle || "Workspace"} preview selected`
      );

    });

  });

  // ==========================================
  // PRICING TOGGLE
  // ==========================================

  const billingToggle = $("#billingToggle");

  function updatePricing() {

    const yearly = Boolean(billingToggle?.checked);

    $$("[data-monthly][data-yearly]").forEach(price => {

      price.textContent = yearly
        ? price.dataset.yearly
        : price.dataset.monthly;

    });

    $$(".billing-period").forEach(period => {
      period.textContent = yearly ? "/year" : "/month";
    });

    $$(".billing-label").forEach(label => {

      label.classList.toggle(
        "active",
        label.dataset.billing === (
          yearly ? "yearly" : "monthly"
        )
      );

    });

  }

  billingToggle?.addEventListener("change", updatePricing);

  updatePricing();

  // ==========================================
  // FAQ ACCORDION
  // ==========================================

  $$(".faq-question").forEach(question => {

    question.addEventListener("click", () => {

      const item = question.closest(".faq-item");
      if (!item) return;

      const shouldOpen = !item.classList.contains("active");

      $$(".faq-item").forEach(faq => {

        faq.classList.remove("active");

        $(".faq-question", faq)?.setAttribute(
          "aria-expanded",
          "false"
        );

      });

      if (shouldOpen) {

        item.classList.add("active");

        question.setAttribute("aria-expanded", "true");

      }

    });

  });

  // ==========================================
  // LEAD FORM
  // ==========================================

  const leadForm = $("#leadForm");
  const leadFormMessage = $("#leadFormMessage");

  leadForm?.addEventListener("submit", event => {

    event.preventDefault();

    if (!leadForm.reportValidity()) return;

    const formData = new FormData(leadForm);

    const name = String(formData.get("name") || "").trim();

    if (name.length < 2) {
      setMessage(leadFormMessage, "Please enter your name.");
      return;
    }

    setMessage(
      leadFormMessage,
      "Frontend demo successful. Connect a secure backend to receive and save submissions."
    );

    showToast("Demo form validated successfully.");

    // No form data is sent to a server.
    leadForm.reset();

  });

  // ==========================================
  // LOGIN FORM
  // ==========================================

  const loginForm = $("#loginForm");
  const loginMessage = $("#loginMessage");

  loginForm?.addEventListener("submit", event => {

    event.preventDefault();

    if (!loginForm.reportValidity()) return;

    setMessage(
      loginMessage,
      "Frontend preview only. Secure authentication is not connected."
    );

  });

  // ==========================================
  // CURRENT YEAR
  // ==========================================

  $$("[data-current-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  // ==========================================
  // INITIAL ACCESSIBILITY STATE
  // ==========================================

  $$(".modal-backdrop").forEach(modal => {
    modal.setAttribute("aria-hidden", "true");
  });

  // ==========================================
  // INITIALIZATION
  // ==========================================

  console.info(
    "Sowrote.ai frontend initialized. Backend integrations are not connected."
  );

});