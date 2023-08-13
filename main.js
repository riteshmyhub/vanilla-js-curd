import UserDataBase from "./js/db.js";

class App extends UserDataBase {
   form = document.getElementsByTagName("form")[0];
   #ul = document.getElementById("ul-box");
   status = document.querySelector(`[name="status"]`);
   resetAppBtn = document.getElementById("reset-app-btn");
   navtabs = document.getElementById("nav-tabs");

   constructor() {
      super();
      this.refresher = this.render;
   }

   model_container = (width) => {
      let modal = document.getElementById("modal");
      let btn = document.querySelectorAll('[type="submit"]')[0];
      if (width <= 767) {
         modal.classList.add("offcanvas", "offcanvas-bottom", "h-auto");
         modal.setAttribute("tabindex", -1);
         modal.setAttribute("aria-labelledby", "modalLabel");
      } else {
         modal.classList.remove("offcanvas", "offcanvas-bottom", "h-auto");
         modal.removeAttribute("tabindex");
         modal.removeAttribute("aria-labelledby");
      }
   };

   isActive = (status) => {
      if (!status) {
         if (location.hostname === "riteshmyhub.github.io") {
            location.replace("/vanilla-js-curd/#/all");
         }else{
            location.replace("#/all");
         }
      }
      for (let index = 0; index < this.navtabs.children.length; index++) {
         const element = this.navtabs.children[index];
         let linkStatus = element.getAttribute("data-active-link");
         if (linkStatus === status) {
            element.children[0].classList.add("active");
         } else {
            element.children[0].classList.remove("active");
         }
      }
   };
   addUser = (user) => {
      this._createUser(user);
   };

   resetApp = () => {
      this._deleteUsersList();
   };

   deleteUser = (event) => {
      if (event.target.getAttribute("data-event-mode") === "delete") {
         let id = event.target.getAttribute("data-id");
         this._deleteById(id);
      }
   };

   onSubmit = (event) => {
      event.preventDefault();
      let data = new FormData(event.target);

      let user = {
         id: `task-id-${Date.now()}`,
         title_task: data.get("title_task"),
         discription: data.get("discription"),
         category: data.get("category"),
         status: "pending",
      };

      if (this.form.getAttribute("data-form-id")) {
         delete user.id;
         this._updateById(this.form.getAttribute("data-form-id"), user);
      } else {
         this.addUser(user);
         location.replace("/#/all");
      }
      this.form.removeAttribute("data-form-id");
      event.target.reset();
   };

   edit = (event) => {
      if (event.target.getAttribute("data-event-mode") === "edit") {
         let id = event.target.getAttribute("data-id");
         this.taskList.forEach((task) => {
            if (task?.id === id) {
               this.form.setAttribute("data-form-id", task?.id);
               document.getElementById("title_task").value = task.title_task;
               document.getElementById("discription").value = task.discription;
               if (task.category === "personal") {
                  document.querySelectorAll(`[value="personal"]`)[0].checked = true;
               }
               if (task.category === "teams") {
                  document.querySelectorAll(`[value="teams"]`)[0].checked = true;
               }
            }
         });
      }
   };

   onStatusChange = (event) => {
      if (event.target.checked) {
         this._updateStatusById(event.target.getAttribute("data-status-id"), "done");
      } else {
         this._updateStatusById(event.target.getAttribute("data-status-id"), "pending");
      }
   };

   render = () => {
      let filterList = this.taskList.filter((task) => {
         let status = this.status ? this.status : location.hash.replace("#/", "");
         return status === "all" ? this.taskList : task.status === status;
      });

      this.isActive(location.hash.replace("#/", ""));
      this.#ul.innerHTML = this.loading
         ? `<div class="d-flex justify-content-center my-5">
            <div class="spinner-border" role="status">
               <span class="visually-hidden">Loading...</span>
            </div>
         </div>`
         : filterList?.length //
         ? filterList
              .map(
                 (task, idx) =>
                    `<div class="card mt-2 p-3 position-relative">
                    <div class="row align-items-center">
                        <div class="col-12 col-md-12">
                            <div class="row">
                                <div class="col-12 col-md-6 order-1 order-md-0">id : ${task?.id}</div>
                                <div class="col-12 col-md-6 order-0  order-md-1 text-end text-uppercase">
                                    <span class="badge rounded-pill bg-${task?.category === "teams" ? "primary" : "danger"}">${task?.category}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-8 col-lg-9 order-1 order-md-0">
                            <span class="fs-4">
                                Title : ${task?.title_task}
                            </span>
                            <div class="text-muted my-2">
                                ${task?.discription}
                            </div>
                            <button data-event-mode="edit" data-id="${task.id}"
                                class="btn btn-sm btn-outline-primary text-uppercase">
                                edit
                            </button>
                            <button data-event-mode="delete" data-id="${task.id}"
                                class=" btn btn-sm btn-outline-danger text-uppercase">
                                delete
                            </button>
                        </div>
                        <div class="col-12 col-md-4 col-lg-3 order-0 order-md-1 py-2">
                            <div class="form-check form-switch">
                                <input class="form-check-input" ${task.status === "done" && "checked"}
                                    data-status-id=${task.id} type="checkbox" role="switch" id="${idx + 1}">
                                <label class="form-check-label" for="${idx + 1}">
                                    ${task.status}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>`
              )
              .join("")
         : `<div class="alert alert-primary d-flex align-items-center my-3" role="alert">
            <i class="bi bi-info-circle-fill me-2"></i>
            <div>you don't have task in ${location.hash.replace("#/", "")}</div>
         </div>`;

      this.#ul.addEventListener("click", this.deleteUser);
      this.#ul.addEventListener("click", this.edit);
      this.#ul.addEventListener("change", this.onStatusChange);
   };
}

let app = new App();
app.render();
app.form.addEventListener("submit", app.onSubmit);
app.resetAppBtn.addEventListener("click", app.resetApp);

window.addEventListener("load", (e) => app.model_container(window.innerWidth));
window.addEventListener("resize", (e) => app.model_container(e.target.innerWidth));
