import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from "../views/Register.vue";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkExactActiveClass: "exact-active-class",
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login

    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: '/',
      name: 'dashboard',
      component: Home,
      meta: {
        auth
      }
    },
    {
      path: "/create",
      name: "create",
      component: () => import("../views/Create.vue"),
      meta: {
        auth
      }
    },
    {
      path: "/tasks",
      name: "tasks",
      component: () => import("../views/Tasks.vue"),
      meta: {
        auth
      }
    },
    {
      path: "/projects",
      name: "projects",
      component: () => import("../views/Projects.vue"),
      meta: {
        auth
      }
    },
    {
      path: "/message",
      name: "message",
      component: () => import("../views/Message.vue"),
      meta: {
        auth
      }
    },
  ]
});

const currentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    },
    reject
    )
  })
};

router.beforeEach( async (to,from,next) => {
  if(to.matched.some((record) => record.meta.auth)) {
    if(await currentUser()) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router
