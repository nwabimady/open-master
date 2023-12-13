import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
}

export class Project implements IProject {
    name: string
    description: string
    status: "pending" | "active" | "finished"
    userRole: "architect" | "engineer" | "developer"
    finishDate: Date
    symbolIcon: string

    ui: HTMLDivElement
    cost: number = 0
    progress: number = 0
    id: string

    constructor(data: IProject) {
        for (const key in data) {
            this[key] = data[key]
        }
        this.symbolIcon = this.name.slice(0, 2).toUpperCase();
        this.id = uuidv4()
        this.setUI()
    }
    
    setUI() {
        if(this.ui) {return}
        this.ui = document.createElement("div")
        this.ui.className = "project-card"

        // Define an array of colors
        const colors = ["blueviolet", "green", "red", "purple", "orange", "dark blue"];

        // Select a random color from the colors array
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        this.ui.innerHTML = ` 
            <div class="card-header">
                <p style="background-color: ${randomColor}; padding: 10px; border-radius: 8px; aspect-ratio: -1;">${this.symbolIcon}</p>
                <div>
                    <h5>${this.name}</h5>
                    <p>${this.description}</p>
                </div>
            </div>
            <ul class="card-content">
                <div class="card-property">
                <p style="color: #969696;">Status:</p><p> ${this.status}</p></div>
                <div class="card-property"><p style="color: #969696;">Role:</p><p>${this.userRole}</p></div>
                <div class="card-property"><p style="color: #969696;">Cost:</p><p>$${this.cost}</p></div>
                <div class="card-property"><p style="color: #969696;">Estimated Progress:</p><p>${this.progress * 100}%</p></div>
            </ul>
            </div>
            `
    }
}
