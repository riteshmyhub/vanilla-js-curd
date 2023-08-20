export const config = {
   server_url: "https://riteshmyhub.github.io",
   get baseurl() {
      let url = new URL(location.href.replace("/#/", "/"));
      return url.origin === this.server_url ? this.server_url : url.origin;
   },
   location: new URL(location.href.replace("/#/", "/")),
   view_engine_url(pageName) {
      return `${this.baseurl}/src/pages/${pageName}/page.hbs`;
   },
};
