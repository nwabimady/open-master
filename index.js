function showModal() {
  const modal = document.getElementById("new-project-model");
  modal.showModal();
}

const newProjectsBtn = document.getElementById("new-project-model").showModal();
newProjectsBtn.addEventListener("onclick", showModal);
