export class ErrorMessage {

    title: string
    msg: string
    ui: HTMLDialogElement
    parent: HTMLElement
    error: Error

    constructor(container: HTMLElement, error: Error) {

        this.error = error
        this.title = error.name
        this.msg = error.message
        this.parent = container
    };
    
    showError() {
        this.ui = document.createElement('dialog')
        console.log(this.ui)
        this.ui.className = "error-dialog"
        this.ui.id = "error-dialog"
        this.ui.innerHTML = `
        <dialog id="error-container">
            <h2 id=${this.title}></h2>
            <button id="close-alert" class="btn-secondary">Close</button>
        </dialog>
        `
        this.parent.append(this.ui)
        this.ui.showModal()
        const closeButton = document.getElementById("close-alert")
        closeButton?.addEventListener("click", () => {
            this.ui.close()
            this.ui.remove()
        })
    }
}