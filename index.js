function showModal(id) {
  const modal = document.getElementById(id);
  modal.showModal();
}

const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    showModal("new-project-model");
  });
} else {
  console.warn("New project button was not found.");
}
