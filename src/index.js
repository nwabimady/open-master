import { Project } from "./class/Project";

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
      const myProject = new Project(formData.get("name"))
      console.log(myProject)
  });
} else {
  console.warn("The project form was not found. Check ID.");
}
