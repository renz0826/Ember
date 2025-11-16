document.addEventListener("DOMContentLoaded", () => {
  const headers = [
    {
      title: "Home",
      description:
        "A warm overview of your active capsules, upcoming unseals, and recent memories.",
    },
    {
      title: "Preserve a Moment",
      description:
        "Create a new capsule — write, upload, and set a future unseal date.",
    },
    {
      title: "Edit Your Moment",
      description:
        "Edit capsule content, change unlock date, or update attachments before sealing.",
    },
    {
      title: "My Moments",
      description:
        "Access your saved and sealed capsules — view, edit, or reopen.",
    },
    {
      title: "Moments Last",
      description: "Look back on the memories you’ve held close.",
    },
  ];

  function renderHeaderInfo(title) {
    const container = document.getElementById("pageHeader");
    const page = headers.find((c) => c.title === title);

    if (page) {
      container.innerHTML = `
      <h2>${page.title}</h2>
      <p style="color: var(--color-gray)">${page.description}</p>
    `;
    } else {
      container.innerHTML = `<p>Info not found</p>`;
    }
  }

  const titleFromPHP = document.documentElement.dataset.title;
  renderHeaderInfo(titleFromPHP);
});
