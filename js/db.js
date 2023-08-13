function toastify(message) {
   Toastify({
      text: message,
      duration: 3000,
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

export default class UserDataBase {
   refresher;
   status = null;
   loading = false;
   taskList = JSON.parse(localStorage.getItem("task")) || [];
   constructor() {
      window.addEventListener("hashchange", () => {
         this.status = location.hash.replace("#/", "");
         this.refresher();
      });
   }
   _createUser = (task) => {
      this.taskList = [...this.taskList, task];
      localStorage.setItem("task", JSON.stringify(this.taskList));
      this.refresher();
      toastify(`task successfully created!`);
   };
   //
   _deleteById = (id) => {
      this.taskList = this.taskList.filter((item) => item?.id !== id);
      localStorage.setItem("task", JSON.stringify([...this.taskList]));
      this.refresher();
      toastify(`task successfully deleted!`);
   };
   //
   _deleteUsersList = () => {
      this.taskList = [];
      localStorage.setItem("task", JSON.stringify(this.taskList));
      this.refresher();
      toastify(`removed all task!`);
   };
   //
   _updateById = (id, task) => {
      this.taskList.forEach((item) => {
         if (task?.id === id) {
            item.title_task = task?.title_task;
            item.discription = task?.discription;
            item.category = task?.category;
         }
      });
      localStorage.setItem("task", JSON.stringify([...this.taskList]));
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
      localStorage.setItem("task", JSON.stringify([...this.taskList]));
      setTimeout(() => {
         this.refresher();
         toastify(`your task status is ${status}`);
      }, 1000);
   };
}
