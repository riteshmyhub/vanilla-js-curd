import { config } from "./config.js";
import TodoComponent from "./src/pages/todos/todos.controller.js";
console.log(config.location.pathname);
switch (config.location.pathname) {
   case "/todos":
      if (!config.location.search) {
         location.replace("/#/todos?status=all");
      }
      const todo = new TodoComponent();
      break;
   default:
      break;
}
