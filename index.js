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
    let fieldMap = {
      name: "Name",
      description: "Description",
      userRole: "User Role",
      status: "Status",
      finishDate: "Finish Date",
    };

    for (let field in fieldMap) {
      console.log(`${fieldMap[field]}:`, formData.get(field));
    }
  });
} else {
  console.warn("The project form was not found. Check ID.");
}
