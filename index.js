function showModal(id) {
  const modal = document.getElementById(id);
  modal.showModal();
  if (modal) {
    modal.showModal();
  } else {
    console.warn("The provided modal hasn't found .ID:.");
  }
}

const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    showModal("new-project-model");
  });
} else {
  console.warn("New project button was not found.");
}

const projectForm = document.getElementById("new-project-form");
if (projectForm) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(projectForm);
    const project = {
      name: formData.get ("name"),
      description: formData.get ("description"),
      userRole: formData.get ("userRole"),
      status: formData.get ("status"),
      finishDate: formData.get ("finishDate"),
    };
      console.log(project);
  });
} else {
  console.warn("The project form was not found. Check ID.");
}
