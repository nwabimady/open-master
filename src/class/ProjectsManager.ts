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
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`Whoops! A project with the name "${data.name}" already exists`)
        }
        const project = new Project(data)
        this.ui.append(project.ui)
        this.list.push(project)
        return project
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

    exportToJSON() {}

    importFromJSON() {};
}