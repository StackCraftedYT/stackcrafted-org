(() => {
  function addCopyButtons() {
    // Target code blocks rendered by Jekyll/Rouge (usually: pre > code)
    const blocks = document.querySelectorAll("pre");

    blocks.forEach((pre) => {
      // Avoid adding twice
      if (pre.querySelector(".copy-code-btn")) return;

      // Create wrapper for positioning
      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "copy-code-btn";
      btn.type = "button";
      btn.textContent = "Copy";

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        const text = code ? code.innerText : pre.innerText;

        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = "Copied!";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "Copy";
            btn.classList.remove("copied");
          }, 1200);
        } catch (e) {
          // Fallback for older browsers
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.top = "-9999px";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);

          btn.textContent = "Copied!";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "Copy";
            btn.classList.remove("copied");
          }, 1200);
        }
      });

      pre.appendChild(btn);
    });
  }

  // Run on load
  document.addEventListener("DOMContentLoaded", addCopyButtons);
})();
