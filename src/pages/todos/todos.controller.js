import { config } from "../../../config.js";
import hbs from "../../functions/hbs.js";
import Storage from "../../storage/storage.js";

export default class TodoComponent extends Storage {
   constructor() {
      super();
      this.ul = document.getElementById("root");
      this.form = document.getElementsByTagName("form")[0];
      this.status = document.querySelector(`[name="status"]`);
      this.clearListBtn = document.getElementById("reset-app-btn");
      this.navtabs = document.getElementById("nav-tabs");
      this.modal = document.getElementById("app-modal");
      this.bootstrapOffcanvas = new bootstrap.Offcanvas(this.modal);
      this.openButton = document.querySelectorAll(`[data-drawer-button]`)[0];
      this.refresher = this.render;
      this.EventListenerHandler();
      this.render();
   }

   EventListenerHandler = () => {
      this.form.addEventListener("submit", this.SubmitHandler);
      this.clearListBtn.addEventListener("click", this._deleteAllList);
      this.ul.addEventListener("click", this.deleteTask);
      this.ul.addEventListener("click", this.EditHandler);
      this.ul.addEventListener("change", this.onStatusChange);
      window.addEventListener("load", (e) => this.onDrawerChange(window.innerWidth));
      window.addEventListener("resize", (e) => this.onDrawerChange(e.target.innerWidth));
      this.openButton?.addEventListener("click", () => {
         this.bootstrapOffcanvas.show();
      });
   };

   onDrawerChange = (width) => {
      if (width <= 767) {
         this.modal.classList.add("offcanvas", "offcanvas-bottom", "h-auto");
         this.modal.setAttribute("tabindex", -1);
         this.modal.setAttribute("aria-labelledby", "modalLabel");
      } else {
         this.modal.classList.remove("offcanvas", "offcanvas-bottom", "h-auto");
         this.modal.removeAttribute("tabindex");
         this.modal.removeAttribute("aria-labelledby");
      }
   };

   redirect = (status) => {
      if (!status) {
         if (location.hostname === config.server_url) {
            location.replace("/vanilla-js-curd/#/todos?status=all");
         } else {
            location.replace("/#/todos?status=all");
         }
      }
   };

   isActive = (status) => {
      this.redirect(status);
      for (let index = 0; index < this.navtabs?.children.length; index++) {
         const element = this.navtabs.children[index];
         let linkStatus = element.getAttribute("data-active-link");
         if (linkStatus === status) {
            element.children[0].classList.add("active");
         } else {
            element.children[0].classList.remove("active");
         }
      }
   };

   deleteTask = (event) => {
      const isDeleteMode = Object.keys(event.target.dataset).includes("deleteId");
      if (isDeleteMode) {
         this._deleteById(event.target.dataset.deleteId);
      }
   };

   SubmitHandler = (event) => {
      event.preventDefault();
      let data = new FormData(event.target);
      let task = {
         id: `task-id-${Date.now()}`,
         title_task: data.get("title_task"),
         discription: data.get("discription"),
         category: data.get("category"),
         status: "pending",
      };

      if (event.target.dataset.formName) {
         delete task.id;
         delete task.id;
         this._updateById(event.target.dataset?.formName, task);
         this.bootstrapOffcanvas?.hide();
      } else {
         this._create(task);
         this.bootstrapOffcanvas?.hide();
         this.redirect(null);
      }
      event.target.dataset.formName = "";
      event.target.reset();
   };

   EditHandler = (event) => {
      const isEditMode = Object.keys(event.target.dataset).includes("editId");
      if (isEditMode) {
         this.bootstrapOffcanvas?.show();
         let id = event.target.dataset.editId;
         this.form.dataset.formName = id;
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

   render = async () => {
      try {
         const url = new URL(location.href.replace("#/", ""));
         let queryParams = url.searchParams.get("status");
         let filterList = this.taskList.filter((task) => {
            let status = this.status ? this.status : queryParams;
            return status === "all" ? this.taskList : task.status === status;
         });
         this.isActive(queryParams);
         hbs({
            path: config.view_engine_url("todos"),
            context: {
               loading: this.loading,
               tasks: filterList,
            },
         });
      } catch (error) {
         this.ul.innerHTML = "component error";
      }
   };
}
