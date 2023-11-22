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

    ui: HTMLDivElement
    cost: number = 0
    progress: number = 0

    constructor(data: IProject) {
        this.name = data.name
        this.description = data.description
        this.status = data.status
        this.userRole = data.userRole
        this.finishDate = data.finishDate
        this.setUI()
    }
    
    setUI() {
        if(this.ui) {return}
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.ui.innerHTML = ` 
            <div class="card-header">
                <p style="background-color: blueviolet; padding: 10px; border-radius: 8px; aspect-ratio: -1;">HQ</p>
                <div>
                    <h5>${this.name}</h5>
                    <p>${this.description}</p>
                </div>
            </div>
            <ul class="card-content">
                <div class="card-property">
                <p style="color: #969696;">Status:</p><p> ${this.status}:</p></div>
                <div class="card-property"><p style="color: #969696;">Role:</p><p>${this.userRole}:</p></div>
                <div class="card-property"><p style="color: #969696;">Cost:</p><p>$${this.cost}:</p></div>
                <div class="card-property"><p style="color: #969696;">Estimated Progress:</p><p>${this.progress * 100}%</p></div>
            </ul>
            </div>
            `
            }    
}