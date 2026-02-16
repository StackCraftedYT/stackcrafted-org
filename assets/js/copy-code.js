(() => {
  function addCopyButtons() {
    const blocks = document.querySelectorAll("pre");

    blocks.forEach((pre) => {
      // Find correct container (some themes wrap pre inside div.highlight)
      const container = pre.parentElement.classList.contains("highlight")
        ? pre.parentElement
        : pre;

      if (container.querySelector(".copy-code-btn")) return;

      container.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "copy-code-btn";
      btn.type = "button";
      btn.textContent = "Copy";

      btn.style.position = "absolute";
      btn.style.top = "8px";
      btn.style.right = "8px";
      btn.style.zIndex = "10";

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        const text = code ? code.innerText : pre.innerText;

        await navigator.clipboard.writeText(text);

        btn.textContent = "Copied!";
        btn.classList.add("copied");

        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 1200);
      });

      container.appendChild(btn);
    });
  }

  document.addEventListener("DOMContentLoaded", addCopyButtons);
})();
