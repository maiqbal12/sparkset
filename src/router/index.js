import Vue from "vue";
import VueRouter from "vue-router";
import AV from "leancloud-storage";
Vue.use(VueRouter);
async function isLoggedIn() {
  try {
    const user = AV.User.current();
    if (user) {
      const result = await user.isAuthenticated();
      if (result) {
        await user.fetch();
      } else {
        await AV.User.logOut();
      }
      return result;
    }
    return false;
  } catch (error) {
    alert(error);
  }
}
const routes = [
  {
    path: "/",
    components: {
      authWrapper: () => import("../components/TheAuthWrapper.vue")
    },
    children: [
      {
        path: "/reset",
        component: () => import("../views/ResetPage.vue")
      },
      {
        path: "/",
        component: () => import("../views/AuthPage.vue"),
        beforeEnter: (to, from, next) => {
          isLoggedIn().then(result => {
            if (result) {
              next("/overview");
            } else {
              next();
            }
          });
        }
      }
    ]
  },
  {
    path: "/",
    components: {
      sideNav: () => import("../components/TheSideNav.vue"),
      sideNavToggle: () => import("../components/TheSideNavToggle.vue"),
      topNav: () => import("../components/TheTopNav.vue"),
      basicWrapper: () => import("../components/TheBasicWrapper.vue"),
      globalSearch: () => import("../components/TheGlobalSearch.vue")
    },
    children: [
      {
        path: "/settings",
        component: () => import("../views/SettingsPage.vue")
      },
      {
        path: "/overview",
        component: () => import("../views/OverviewPage.vue")
      },
      {
        path: "/clients",
        component: () => import("../views/ClientsPage.vue")
      },
      {
        path: "/clients/add",
        component: () => import("../views/ClientsAddPage.vue")
      },
      {
        path: "/notes",
        component: () => import("../views/NotesPage.vue")
      }
    ],
    beforeEnter: (to, from, next) => {
      isLoggedIn().then(result => {
        if (result) {
          next();
        } else {
          next({ path: "/", query: { return: to.fullPath } });
        }
      });
    }
  },
  {
    path: "*",
    redirect: "/"
  }
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
export default router;
