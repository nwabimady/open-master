import * as THREE from "three"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { IProject, ProjectStatus, UserRole } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

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

//ThreeJS Viewer
const scene = new THREE.Scene()
/* scene.background = new THREE.Color("#e8f4f8") */

const viewerContainer = document.getElementById("viewer-container") as HTMLElement

const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
viewerContainer.append(renderer.domElement)

function resizeViewer() {
  const containerDimensions = viewerContainer.getBoundingClientRect()
  renderer.setSize(containerDimensions.width , containerDimensions.height)
  const aspectRatio = containerDimensions.width / containerDimensions.height
  camera.aspect = aspectRatio
  camera.updateProjectionMatrix()
}

window.addEventListener("resize", resizeViewer)

resizeViewer();

const boxGeometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(boxGeometry, material)

const directionalLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.4

scene.add( directionalLight, ambientLight)

const cameraControls = new OrbitControls(camera, viewerContainer) 

function renderScene() {
  renderer.render(scene, camera)
  requestAnimationFrame(renderScene)
}
renderScene();

const axes = new THREE.AxesHelper( );
const grid = new THREE.GridHelper( );
grid.material.transparent = true;
grid.material.opacity = 0.4;
grid.material.color = new THREE.Color("808080");
scene.add( axes, grid );

const gui = new GUI()
/* gui.close() */
gui.title("Scene Controls")

const cubeControls = gui.addFolder("Cube")
cubeControls.add( cube.position, "x", -10, 10, 1)
cubeControls.add( cube.position, "y", -10, 10, 1)
cubeControls.add( cube.position, "z", -10, 10, 1)
cubeControls.add( cube, "visible")
cubeControls.addColor( cube.material, "color")

const spotLight = new THREE.SpotLight( 0xffffff );
scene.add(spotLight);
spotLight.position.set( 10, 10, 10 );
const spotLightHelper = new THREE.SpotLightHelper( spotLight );
scene.add( spotLightHelper );

const  spotLightControls = gui.addFolder("Spot Light");
spotLightControls.add( spotLight.position, "x", -10, 10, 0.1);
spotLightControls.add( spotLight.position, "y", -10, 10, 0.1);
spotLightControls.add( spotLight.position, "z", -10, 10, 0.1);
spotLightControls.add(spotLight, "visible");
spotLightControls.addColor(spotLight, "color");
spotLightControls.add( spotLight, "intensity", 0, 1, 0.1);


const helperLight = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( helperLight );

const  lightingControls = gui.addFolder("Light");
lightingControls.add( directionalLight.position, "x", -10, 10, 0.1)
lightingControls.add( directionalLight.position, "y", -10, 10, 0.1)
lightingControls.add( directionalLight.position, "z", -10, 10, 0.1)
lightingControls.add(directionalLight, "visible")
lightingControls.addColor( directionalLight, "color");
lightingControls.add( directionalLight, "intensity", 0, 1, 0.1)

function renderLight() {
  directionalLight.target.position.x = 0;
  directionalLight.target.position.y = 0;
  directionalLight.target.position.z = 0;
  helperLight.update()
  renderer.render (scene, camera)
  requestAnimationFrame(renderLight)
}

renderLight()

const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

mtlLoader.load("assets/Gear/Gear/Gear1.mtl", (materials) => {
  materials.preload()
  objLoader.setMaterials(materials)
  objLoader.load("../assets/Gear/Gear/Gear1.obj", (mesh) => {
    scene.add(mesh)
  }), undefined, (error) => {
    console.log('Error loading obj model: ', error);
  }
})

