function toastify(message) {
   Toastify({
      text: message,
      duration: 1000,
      newWindow: true,
      close: false,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
         background: "#28A745",
      },
      onClick: function () {}, // Callback after click
   }).showToast();
}


export default class LocalDataBase {
   #config = Object.freeze({
      dbName: "task",
   });
   refresher;
   status = null;
   loading = false;
   taskList = JSON.parse(localStorage.getItem(this.#config.dbName)) || [];
   constructor() {
      window.addEventListener("hashchange", () => {
         this.status = location.hash.replace("#/", "");
         this.refresher();
      });
   }
   _create = (task) => {
      this.taskList = [...this.taskList, task];
      localStorage.setItem(this.#config.dbName, JSON.stringify(this.taskList));
      this.refresher();
      toastify(`task successfully created!`);
   };
   //
   _deleteById = (id) => {
      this.taskList = this.taskList.filter((item) => item?.id !== id);
      localStorage.setItem(this.#config.dbName, JSON.stringify([...this.taskList]));
      this.refresher();
      toastify(`task successfully deleted!`);
   };
   //
   _deleteAllList = () => {
      this.taskList = [];
      localStorage.setItem(this.#config.dbName, JSON.stringify(this.taskList));
      this.refresher();
      toastify(`removed all task!`);
   };
   //
   _updateById = (id, task) => {
      this.taskList.forEach((item) => {
         if (item?.id === id) {
            item.title_task = task?.title_task;
            item.discription = task?.discription;
            item.category = task?.category;
         }
      });
      localStorage.setItem(this.#config.dbName, JSON.stringify([...this.taskList]));
      this.refresher();
      toastify(`task successfully update!`);
   };
   //
   _updateStatusById = (id, status) => {
      this.taskList.forEach((item) => {
         if (item?.id === id) {
            item.status = status;
         }
      });
      localStorage.setItem(this.#config.dbName, JSON.stringify([...this.taskList]));
      setTimeout(() => {
         this.refresher();
         toastify(`your task status is ${status}`);
      }, 1000);
   };
}
