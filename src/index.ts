import { IProject, ProjectStatus, UserRole } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";

function toggleModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    if (modal.open) {
      modal.close();
    } else {
      modal.showModal();
    }
  } else {
    console.warn("The provided modal hasn't found .ID:.");
  }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    toggleModal("new-project-model");
  });
} else {
  console.warn("New project button was not found.");
}

const projectForm = document.getElementById("new-project-form");
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(projectForm);
    const projectData: IProject = {
      name: formData.get ("name") as string,
      description: formData.get ("description") as string,
      userRole: formData.get ("userRole") as UserRole,
      status: formData.get ("status") as ProjectStatus,
      finishDate: formData.get("finishDate") ? new Date(formData.get("finishDate") as string) : new Date(),
    };

try {
  const project = projectsManager.newProject(projectData)
  projectForm.reset();
  toggleModal("new-project-model"); // Close the modal after form submission
} catch (error) {
  alert(error)
}
});
} else {
  console.warn("The project form was not found. Check ID.");
}

// Get the cancel button
const cancelButton = document.querySelector(".btn-secondary[type='button']");
if (cancelButton) {
  cancelButton.addEventListener("click", () => {
    toggleModal("new-project-model");
  });
} else {
  console.warn("Cancel button was not found.");
}

const exportProjectBtn = document.getElementById("export-projects-btn")
if (exportProjectBtn) {
  exportProjectBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
})
}

const importProjectBtn = document.getElementById("import-projects-btn")
if (importProjectBtn) {
  importProjectBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

