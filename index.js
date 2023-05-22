const submit = document.getElementsByTagName("form")[0];
const col = document.getElementById("row-list");

const avatar = document.getElementById("avatar");
let fromObject = {};
const db = {
   user: {
      userId: undefined,
      get get() {
         let list = localStorage.getItem("usersList");
         return list?.length ? JSON.parse(list) : [];
      },
      post: function (data, refresh) {
         let x = this.get;
         x.push(data);
         localStorage.setItem("usersList", JSON.stringify(x));
         refresh();
         this.userId = undefined;
      },
      findByID: function (id) {
         let user = this.get.find((item) => item?.id === id);
         return user;
      },
      update: function (id, data, refresh) {
         let x = this.get;
         x.forEach((item) => {
            if (item?.id === id) {
               item.username = data?.username;
               item.theme = data?.theme;
               item.avatar = data?.avatar;
            }
         });
         localStorage.setItem("usersList", JSON.stringify(x));
         refresh();
         this.userId = undefined;
      },
      remove: function (id, refresh) {
         let x = this.get.filter((item) => item?.id !== id);
         localStorage.setItem("usersList", JSON.stringify(x));
         refresh();
         this.userId = undefined;
      },
   },
};

avatar.addEventListener("change", (event) => {
   const { name } = event.target;
   const reader = new FileReader();
   if (name === "avatar") {
      reader.onload = () => {
         if (reader.readyState === 2) {
            uplaod_box(reader.result);
         }
      };
      reader.readAsDataURL(event.target.files[0]);
   }
});

submit.addEventListener("submit", (e) => {
   e.preventDefault();
   let form = new FormData(e.target);
   fromObject.id = Date.now();
   fromObject.username = form.get("username");
   fromObject.theme = form.get("theme");

   if (db.user.userId) {
      db.user.update(db.user.userId, fromObject, reload);
      console.log("updated");
      fromObject = {};
   } else {
      db.user.post(fromObject, reload);
      fromObject = {};
      console.log("create");
   }
   e.target.reset();
});

function delete_user(id) {
   db.user.remove(id, reload);
}
function edit(id) {
   db.user.userId = id;
   const { username, theme, avatar } = db.user.findByID(id);
   uplaod_box(avatar);
   document.getElementById("username").value = username;
   document.getElementById("theme").value = theme;
}

function uplaod_box(base64Data) {
   fromObject.avatar = base64Data;
   let img = document.getElementById("avatar-img");
   img.src = base64Data;
}
function reload() {
   col.innerHTML = db.user.get?.length
      ? db.user.get
           .map(
              (data) =>
                 `<div class="col-sm-12 col-md-4">
               <div class="card p-2 w-100">
                 <img src=${data.avatar} class="img-fluid my-3 d-block" style="height: 100px;
                 width: 100px;margin: auto;" alt="">
                 <span class="fs-5 my-2 text-center d-block" style="color: ${data.theme}">
                   ${data?.username}
                 </span>
                 <div class="text-end">
                    <button onclick=edit(${data?.id}) class="btn btn-sm btn-text text-success">
                        EDIT
                    </button>
                    <button onclick=delete_user(${data?.id})  class="btn btn-sm btn-text text-danger">
                        DELETE
                    </button>
                 </div>
              </div>
            </div>`
           )
           .join("")
      : `
      <div class="alert alert-primary d-flex align-items-center" role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
      <div>
         please create user!
      </div>
    </div>`;
}
reload();
open(false);
