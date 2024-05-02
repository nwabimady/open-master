import * as THREE from "three"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min"
import { FragmentsGroup } from "bim-fragment";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { IProject, ProjectStatus, UserRole } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import * as OBC from "openbim-components";
import { triplanarTexture } from "three/examples/jsm/nodes/Nodes.js";

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

// Get the "Edit" button
const editButton = document.getElementById("edit-button");
if (editButton) {
  editButton.addEventListener("click", () => {
    // Get the current project
    const project = projectsManager.getCurrentProject();

    // Populate the form with the current project data
    projectsManager.populateFormWithProjectData(project);

    // Show the form
    toggleModal("new-project-model");
  });
}

const projectForm = document.getElementById("new-project-form") as HTMLFormElement;
if (projectForm) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(projectForm);
    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      userRole: formData.get("userRole") as UserRole,
      status: formData.get("status") as ProjectStatus,
      finishDate: formData.get("finishDate")
        ? new Date(formData.get("finishDate") as string)
        : new Date(),
    };

    // Get the current project
    const project = projectsManager.getCurrentProject();

    // Update the project
    project.updateProject(projectData);

    // Update the UI with the updated project data
    // ...

    projectForm.reset();
    toggleModal("new-project-model"); // Close the modal after form submission
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

//OpenBIM-Compnent Viewer
const viewer = new OBC.Components();

const sceneComponent = new OBC.SimpleScene(viewer);
viewer.scene = sceneComponent;
const scene = sceneComponent.get();
sceneComponent.setup();
scene.background = null;

const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement;
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent;

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
viewer.camera = cameraComponent;

const raycasterComponent = new OBC.SimpleRaycaster(viewer);
viewer.raycaster = raycasterComponent;

viewer.init()
cameraComponent.updateAspect()
rendererComponent.postproduction.enabled = true

const fragmentManager = new OBC.FragmentManager(viewer);
function exportFragments(model: FragmentsGroup) {
  const fragmentBinary = fragmentManager.export(model)
        const blob = new Blob([fragmentBinary])
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${model.name.replace(".ifc", "")}.frag`
        a.click()
        URL.revokeObjectURL(url)
}

const ifcLoader = new OBC.FragmentIfcLoader(viewer)
ifcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.43/",
  absolute: true
}

const highlighter = new OBC.FragmentHighlighter(viewer)
highlighter.setup()

const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
highlighter.events.select.onClear.add(() => {
  propertiesProcessor.cleanPropertiesList()
})

const classifier = new OBC.FragmentClassifier(viewer)
const classificationWindow = new OBC.FloatingWindow(viewer)
classificationWindow.visible = false
viewer.ui.add(classificationWindow)
classificationWindow.title = "Model Groups"

const classificationBtn = new OBC.Button(viewer)
classificationBtn.materialIcon = "account_tree"

classificationBtn.onClick.add(() => {
  classificationWindow.visible = !classificationWindow.visible
  classificationBtn.active = classificationWindow.visible
})

async function createModelTree() {
const fragmentTree = new OBC.FragmentTree(viewer)
  await fragmentTree.init()
  await fragmentTree.update(["storeys","entities"])
  fragmentTree.onHovered.add((fragmentMap) => {
    highlighter.highlightByID("hover", fragmentMap)
  })
  fragmentTree.onSelected.add((fragmentMap) => {
    highlighter.highlightByID("select", fragmentMap)})
  const tree = fragmentTree.get().uiElement.get("tree")
  return tree
}

ifcLoader.onIfcLoaded.add(async(model)=> {
  exportFragments(model)
  highlighter.update()

  classifier.byStorey(model)
  classifier.byEntity(model)
  console.log(classifier.get())
  const tree = await createModelTree()
  classificationWindow.slots.content.dispose(true)
 classificationWindow.addChild(tree)

 propertiesProcessor.process(model)
 highlighter.events.select.onHighlight.add((fragmentMap) => {
 const expressID = [...Object.values(fragmentMap)[0]][0]
 propertiesProcessor.renderProperties(model, Number(expressID))
})
})



const toolbar = new OBC.Toolbar(viewer)
toolbar.addChild(
  ifcLoader.uiElement.get("main"),
  classificationBtn,
  propertiesProcessor.uiElement.get("main")
)

viewer.ui.addToolbar(toolbar)