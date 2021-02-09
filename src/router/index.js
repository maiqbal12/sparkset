import Vue from "vue";
import VueRouter from "vue-router";
import AV from "leancloud-storage";
Vue.use(VueRouter);
async function isLoggedIn() {
  const user = AV.User.current();
  if (user) {
    try {
      const result = await user.isAuthenticated();
      if (result) {
        await user.fetch();
      } else {
        await AV.User.logOut();
      }
      return result;
    } catch (error) {
      alert(error);
    }
  }
  return false;
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
        path: "/users",
        component: () => import("../views/UsersPage.vue"),
        beforeEnter: (to, from, next) => {
          if (AV.User.current().get("allowAddingNewUsers")) {
            next();
          } else {
            next("/overview");
          }
        }
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
        path: "/client/:id",
        component: () => import("../views/ClientPage.vue"),
        children: [
          {
            path: "",
            component: () => import("../components/ClientProfile.vue")
          },
          {
            path: "events",
            component: () => import("../components/ClientEvents.vue")
          },
          {
            path: "preferences",
            component: () => import("../components/ClientPreferences.vue")
          },
          {
            path: "files",
            component: () => import("../components/ClientFiles.vue")
          },
          {
            path: "clientNotes",
            component: () => import("../components/ClientNotes.vue")
          }
        ]
      },
      {
        path: "/companies",
        component: () => import("../views/CompaniesPage.vue")
      },
      {
        path: "/company/:id",
        component: () => import("../views/CompanyPage.vue"),
        children: [
          {
            path: "",
            component: () => import("../components/CompanyProfile.vue")
          },
          {
            path: "clients",
            component: () => import("../components/CompanyClients.vue")
          },
          {
            path: "events",
            component: () => import("../components/CompanyEvents.vue")
          }
        ]
      },
      {
        path: "/event/:id",
        component: () => import("../views/EventPage.vue")
      },
      {
        path: "/notes",
        component: () => import("../views/NotesPage.vue")
      },
      {
        path:"/clientNote/:id",
        component: () => import("../views/ClientNotePage.vue")
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
