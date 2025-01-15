import { createRouter, createWebHistory } from 'vue-router'
export const surveyRoutes = [
  {
    path: '/:route',
    name: 'LoadingPage',
    component: () => import('../pages/survey/LoadingPage.vue')
  },
  {
    path: '/:route',
    name: 'Error404Page',
    component: () => import('../pages/survey/Error404Page.vue')
  },
  {
    path: '/:route/:pathMatch(.*)*',
    name: 'Error404Page',
    component: () => import('../pages/survey/Error404Page.vue')
  },
  {
    path: '/:route',
    name: 'LockedPage',
    component: () => import('../pages/survey/LockedPage.vue')
  },
  {
    path: '/:route',
    name: 'LockedSelfServe',
    component: () => import('../pages/survey/LockedSelfServe.vue')
  },
  {
    path: '/:route',
    name: 'WelcomePage',
    component: () => import('../pages/survey/WelcomePage.vue')
  },
  {
    path: '/:route',
    name: 'WorkshopWelcome',
    component: () => import('../pages/survey/WorkshopWelcome.vue')
  },
  {
    path: '/:route',
    name: 'WelcomeSelfServe',
    component: () => import('../pages/survey/WelcomeSelfServe.vue')
  },
  {
    path: '/:route',
    name: 'QuestionFormKit',
    component: () => import('../pages/survey/QuestionFormKit.vue')
  },
  {
    path: '/:route',
    name: 'QuestionMatrix',
    component: () => import('../pages/survey/QuestionMatrix.vue')
  },
  {
    path: '/:route',
    name: 'QuestionTable',
    component: () => import('../pages/survey/QuestionTable.vue')
  },
  {
    path: '/:route',
    name: 'QuestionRadioRich',
    component: () => import('../pages/survey/QuestionRadioRich.vue')
  },
  {
    path: '/:route',
    name: 'QuestionCheckbox',
    component: () => import('../pages/survey/QuestionCheckbox.vue')
  },
  {
    path: '/:route',
    name: 'QuestionRadioLikert',
    component: () => import('../pages/survey/QuestionRadioLikert.vue')
  },
  {
    path: '/:route',
    name: 'BackgroundPage',
    component: () => import('../pages/survey/BackgroundPage.vue'),
    
  },
  {
    path: '/:route',
    name: 'QuestionRoulette',
    component: () => import('../pages/survey/QuestionRoulette.vue')
  },
  {
    path: '/:route',
    name: 'QuestionMinMaxBest',
    component: () => import('../pages/survey/QuestionMinMaxBest.vue')
  },
  {
    path: '/:route',
    name: 'WorkshopProbability',
    component: () => import('../pages/survey/WorkshopProbability.vue')
  },
  {
    path: '/:route',
    name: 'ValidateRoulette',
    component: () => import('../pages/survey/ValidateRoulette.vue')
  },
  {
    path: '/:route',
    name: 'ValidateRouletteConditional',
    component: () => import('../pages/survey/ValidateRouletteConditional.vue')
  },
  {
    path: '/:route',
    name: 'ValidateMinMaxBest',
    component: () => import('../pages/survey/ValidateMinMaxBest.vue')
  },
  {
    path: '/:route',
    name: 'ValidateProbabilityMethod',
    component: () => import('../pages/survey/ValidateProbabilityMethod.vue')
  },
  {
    path: '/:route',
    name: 'ValidateProbabilityMethodConditional',
    component: () => import('../pages/survey/ValidateProbabilityMethodConditional.vue')
  },
  {
    path: '/:route',
    name: 'SubmitPage',
    component: () => import('../pages/survey/SubmitPage.vue')
  },
]



const adminRoutes = [
  {
    path: '',
    name: 'SurveyOverview',
    component: () => import('../pages/admin/SurveyOverview.vue')
  },
  // use catch all from survey routes
  // {
    //   path: ':error(.*)?',
    //   name: 'Error404PageAdmin',
    //   component: () => import('../pagesAdmin/Error404Page.vue')
    // },
    {
      path: 'login',
      name: 'Login',
      component: () => import('../pages/admin/LoginScreen.vue')
    },
    {
      path: 'survey/:surveyId/:expertId?',
      name: 'ExpertsPage',
      component: () => import('../pages/admin/ExpertsPage.vue')
    },
    {
      path: 'results/:surveyId/:expertId?',
      name: 'ResultsPage',
      props: true,
      component: () => import('../pages/admin/ResultsPage.vue')
    },
    {
      path: 'add-survey/:surveyId?',
      name: 'AddSurveyPage',
      component: () => import('../pages/admin/AddSurveyPage.vue')
    },
    {
      path: '/profile/change-password',
      name: 'ChangePasswordPage',
      component: () => import('../pages/admin/ChangePasswordPage.vue')
    },
    {
      path: '/profile',
      name: 'ProfilePage',
      component: () => import('../pages/admin/ProfilePage.vue')
    },
    {
      path: '/profile/reset-password',
      name: 'ResetPasswordPage',
      component: () => import('../pages/admin/ResetPasswordPage.vue')
    }
  ]
  
  
  const routes = [
    {
      path: '/',
      name: 'Home',
      component: () => import('../pages/HomePage.vue')
    },
    {
      path: '/',
      component: () => import('../pages/survey/RouterPage.vue'),
    children: surveyRoutes
  },
  {
    path: '/admin',
    component: () => import('../pages/admin/RouterPage.vue'),
    children: adminRoutes
    },
    {
      path: '/privacy',
      name: 'PrivacyPolicy',
      component: () => import('../pages/PrivacyPolicy.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

function hasQueryParams(route) {
  return !!Object.keys(route.query).length
}

router.beforeEach(async (to, from, next) => {
  if (!hasQueryParams(from) || hasQueryParams(to)) {
    return next()
  } else if (!hasQueryParams(to) && hasQueryParams(from)) {  
    return next({ ...to, query: from.query })
  }
})



// after each route change, scroll to top
router.afterEach(() => {
  window.scrollTo(0, 0)
  
})

export default router
