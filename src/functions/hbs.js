export default async function hbs({ path, context }) {
   const response = await fetch(path);
   let code = await response.text();
   let template = Handlebars.compile(code);
   let html = template(context);
   document.getElementById("root").innerHTML = html;
}

// ifEquals
Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
   return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
Handlebars.registerPartial("myPartial", "nav bar");
