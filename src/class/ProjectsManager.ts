import { getOutputFileNames } from "typescript"
import { IProject, Project } from "./Project"


export class ProjectsManager {
    list: Project[] = []
    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
        this.newProject({
            name: "Default Project",
            description: "Default app project",
            status: "pending",
            userRole: "architect",
            finishDate: new Date()
        })
            }
    newProject(data: IProject) {
        if (data.name.length < 5) {
            throw new Error("Project name must be at least 5 characters long");
        }
    
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`Tisk tisk, A project with the name "${data.name}" already exists`)
        }
        
        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details") 
            if ( !projectsPage || !detailsPage) { return }
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
        })
    
        // Add event listener to "projects-page-btn"
            const projectPageBtn = document.getElementById("projects-page-btn") as HTMLElement;
            projectPageBtn.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectsPage || !detailsPage) { return; }
            projectsPage.style.display = "flex";
            detailsPage.style.display = "none";
        });
        const projectIcon = document.getElementById("project-icon");
        if (projectIcon) {
            projectIcon.textContent = data.name.slice(0, 2).toUpperCase();
        }
        this.ui.append(project.ui)
        this.list.push(project)
        return project        
    }

    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) {return}
    
        const properties = ['name', 'description', 'status', 'userRole', 'cost', 'finishDate', 'symbolIcon']
    
        for (let property of properties) {
            const elements = detailsPage.querySelectorAll(`[data-project-info='${property}']`)
            elements.forEach(element => {
                if (property === 'finishDate') {
                    // Format the date
                    const date = new Date(project[property]);
                    element.textContent = date.toLocaleDateString();
                } else {
                    element.textContent = project[property];
                }
            })
        }  
    }
    

    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }

    deleteProject(id: string) {
        const project = this.getProject(id)
        if (!project) {return}
        project.ui.remove()         
        const remaining = this.list.filter((project) => {
        return project.id !== id
    })
    this.list = remaining
}

    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name === name;
    })
        return project;
    }

    getTotalCost() {
        const totalCost:number = this.list.reduce(
            (sumOfCost, currentProject) => sumOfCost + currentProject.cost,
            0
        );
        return totalCost;
    }

    exportToJSON(fileName: string = "projects") {
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], {type: 'application/json'})
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName + ".json"
        a.click()
        URL.revokeObjectURL(url)
    }

    importFromJSON() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) { return }
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (error) {
                    
                }
            }
        })
        input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsText(filesList[0])
        })
        input.click()
    };
    
}