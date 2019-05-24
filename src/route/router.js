import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";
import Login from "@/components/Login";
import Registration from "@/components/Registration";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/registration",
      name: "registration",
      component: Registration
    }
  ]
});
