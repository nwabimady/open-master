import { IProject, ProjectStatus, UserRole } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";

function showModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal();
  } else {
    console.warn("The provided modal hasn't found .ID:.");
  }
}

function closeModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close();
  } else {
    console.warn("The provided modal hasn't found .ID:.");
  }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    showModal("new-project-model");
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
      finishDate: new Date (formData.get("finishDate") as string),
    };
      const project = projectsManager.newProject(projectData)
      projectForm.reset()
  });
} else {
  console.warn("The project form was not found. Check ID.");
}