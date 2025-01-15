import { defineStore } from 'pinia';
import { login, verifyToken } from '@/api/login';
import {
  getSurvey,
  getSurveys,
  getDraftSurvey,
  createDraftSurvey,
  updateDraftSurvey,
  deleteDraftSurvey,
  deleteSurvey,
  updateSurveyStatus,
} from '@/api/surveys';
import { createExpert, updateExpert } from '@/api/experts';
import { updatePassword, getUser } from '@/api/users';
import { toast } from 'vue-sonner';
import {
  tidyAgenda,
  mergeSections,
  unMergeSections,
  tidyQuestions,
  expertToLineStyleMapper,
  SURVEY_STATUS,
  MESSAGE_CODES,
} from '@/lib/utils';
import { initDraftSurvey, extractIntoOutro } from '@/lib/addAgendaItemUtils';

export const useAdminStore = defineStore('adminStore', {
  state: () => ({
    // app state
    initilised: false,
    loading: false,
    error: null,
    loginError: null,
    loginSuccess: null,
    persistentStorageDate: null,
    anonymiseExperts: false,
    draftingSurvey: false,
    isSavingDraft: false,
    isPretendingToSaveDraft: false, // show spinner before actually saving
    draftSavingError: false,
    // User data
    username: '',
    name: '',
    token: '',
    tenantId: '',
    tenant: '',
    role: '',
    firstTimePassword: '',
    // draft survey data
    draftSurveys: [],
    draftSurveyData: {},
    lastSavedDraft: '',
    // Survey data
    surveys: [],
    currentSurveyId: '',
    currentSurveyData: {},
    currentExpertsData: [],
    currentSurveyQuestions: [],
    currentSurveyAgenda: [],
    //expert data
    currentExpert: {},
    // results dashboard data
    currentResultsByExpert: {},
    pooledResults: {},

    // cached data
    cachedData: {},

    // dashboard display data
    selectedIndividualExpert: {},
    togglePooled: false,
  }),
  actions: {
    async login(username, password) {
      this.loading = true;
      this.loginError = null;
      let response;
      try {
        response = await login(username, password);
        if (
          response &&
          response.success &&
          response.messageCode === MESSAGE_CODES.PASSWORD_RESET_REQUIRED
        ) {
          // first time login - password change is necessary
          this.username = username;
          this.tenantId = response.tenantId;
          this.firstTimePassword = password;
          this.$router.push({ name: 'ChangePasswordPage' });
          return;
        } else if (response && response.success) {
          this.token = response.idToken;
          this.tenantId = response.tenantId;
          this.username = response.username;
          this.name = response.name;
          this.tenant = response.tenant;
          this.role = response.role;
          this.firstTimePassword = '';
          this.loginSuccess = 'Welcome back!';
          localStorage.setItem('token', this.token);
          localStorage.setItem('tenantId', this.tenantId);
          setTimeout(() => {
            this.loginSuccess = null;
            this.$router.push({ name: 'SurveyOverview' });
          }, 500);
        } else {
          throw new Error(response?.error || 'An error occurred');
        }
      } catch (error) {
        console.error(error);
        this.loginError =
          error?.response?.data?.message ||
          error?.message ||
          'An error occurred';
        this.clearLoginError();
        this.clearLoginError();
      } finally {
        this.loading = false;
      }
    },
    async clearLoginError() {
      setTimeout(() => {
        this.loginError = null;
      }, 10000);
    },

    async updateExpertData() {
      let surveyId = this.currentSurveyId;
      let tenantId = this.tenantId;
      let response;
      try {
        response = await getSurvey(tenantId, surveyId);
      } catch (error) {
        console.error('Error getting survey data', error);
        return;
      }
      if (response.success && response.survey && response.survey.experts) {
        this.currentSurveyData = response.survey;
        this.currentExpertsData = response.survey.experts;
      }
    },

    async selectDraftSurvey(surveyId, returnSurvey = false) {
      let tenantId = this.tenantId;
      let response;
      try {
        response = await getDraftSurvey(tenantId, surveyId);
      } catch (error) {
        console.error('Error getting survey data', error);
        return;
      }

      if (response.error || !response.success) {
        console.error('Error getting survey data', response.error);
        this.$router.push({ name: 'Error404Page' });
        return;
      }
      let studyContact = response.survey?.studyContact;
      let lockedScreen = response.survey?.lockedScreen;
      let agenda = response.survey?.agenda;
      if (!agenda || !agenda.length)
        throw new Error('Draft data not found: no agenda items');
      agenda = unMergeSections(agenda);
      let { introPage, submitPage, newAgenda } = extractIntoOutro(agenda);

      let draftSurveyData = {
        ...response.survey,
        introPage: introPage,
        agenda: newAgenda,
        submitPage: submitPage,
        lockedScreen: lockedScreen,
        studyContact: studyContact,
      };
      if (returnSurvey) return draftSurveyData;
      this.draftSurveyData = draftSurveyData;
      this.$router.push({
        name: 'AddSurveyPage',
        params: { surveyId: surveyId },
      });
    },

    async deleteDraftSurvey(id) {
      let tenantId = this.tenantId;
      let surveyId;
      if (!id) surveyId = this.draftSurveyData.id;
      else surveyId = id;

      if (!surveyId) {
        alert('Something went wrong.');
        return false;
      }

      let response;
      try {
        this.loading = true;
        response = await deleteDraftSurvey(tenantId, surveyId);

        if (response.error || !response.success) {
          console.error('Error deleting survey data', response.error);
          return false;
        }
        this.draftSurveys = this.draftSurveys.filter(
          (survey) => survey.id !== surveyId
        );
        this.draftingSurvey = false;
        setTimeout(() => {
          this.draftSurveyData = {};
          this.lastSavedDraft = '';
        }, 100);
        /*
        if (this.$router.currentRoute.value.name != 'SurveyOverview')
          this.$router.push({ name: 'SurveyOverview' })
        else this.$router.go()
        */
        toast.success('Draft survey deleted');
        this.loading = false;
        return true;
      } catch (error) {
        this.loading = false;
        console.error('Error deleting survey data', error);
        return false;
      }
    },

    async deleteSurvey(surveyId) {
      let tenantId = this.tenantId;
      try {
        this.loading = true;
        const response = await deleteSurvey(tenantId, surveyId);
        if (response.error || !response.success) {
          console.error('Error deleting survey data', response.error);
          return false;
        }
        this.surveys = this.surveys.filter((survey) => survey.id !== surveyId);
        this.loading = false;
        return true;
      } catch (error) {
        this.loading = false;
        console.error('Error deleting survey data', error);
        return false;
      }
    },

    async fetchSurvey(surveyId) {
      let tenantId = this.tenantId;
      try {
        const response = await getSurvey(tenantId, surveyId);
        if (response.error || !response.success) {
          console.error('Error getting survey data', response.error);
          return { success: false, error: response.error };
        }
        return { success: true, survey: response.survey };
      } catch (error) {
        console.error('Error getting survey data', error);
        return { success: false, error };
      }
    },

    async selectSurvey(surveyId) {
      this.currentSurveyId = surveyId;

      const response = await this.fetchSurvey(surveyId);
      if (!response.success) {
        this.$router.push({ name: 'Error404Page' });
        return;
      }

      this.currentSurveyData = response.survey;
      this.currentSurveyQuestions = tidyQuestions(response.survey);
      this.currentSurveyAgenda = tidyAgenda(response.survey);
      this.currentExpertsData = response.survey?.experts || [];

      if (
        this.$router.currentRoute.value.name !== 'ExpertsPage' &&
        this.$router.currentRoute.value.name !== 'ResultsPage'
      ) {
        this.$router.push({
          name: 'ExpertsPage',
          params: { surveyId: surveyId },
        });
      }
    },

    async updateSurveyStatus(surveyId, status) {
      try {
        this.loading = true;
        await updateSurveyStatus(this.tenantId, surveyId, status);
        toast.success('Survey status updated');
        this.loading = false;
        return true;
      } catch (error) {
        toast.error(
          'Error updating survey status. Try again or contact support.',
          {
            style: { background: '#fda4af' },
          }
        );
        this.loading = false;
        return false;
      }
    },

    async initialiseAdminStore() {
      const token = this.token || localStorage.getItem('token') || '';
      const tenantId = this.tenantId || localStorage.getItem('tenantId') || '';
      let tokenValid;
      if (token && tenantId) {
        try {
          tokenValid = await verifyToken(token);
        } catch (error) {
          console.error('Could not verify token', error);
        }
      }
      if (tokenValid) {
        this.token = tokenValid.idToken;
        this.tenantId = tokenValid.tenantId;
        this.username = tokenValid.username;
        this.name = tokenValid.name;
        this.tenant = tokenValid.tenant;
        this.role = tokenValid.role;
        this.loginSuccess = 'Welcome back!';
        try {
          const surveysResponse = await getSurveys(this.tenantId);
          this.surveys = surveysResponse.surveys || [];
          this.draftSurveys = surveysResponse.drafts || [];
        } catch (error) {
          console.error('Error getting surveys', error);
        }
        setTimeout(() => {
          this.loginSuccess = null;
        }, 500);
        localStorage.setItem('token', this.token);
        localStorage.setItem('tenantId', this.tenantId);
        if (this.$router.currentRoute.value.path === '/login') {
          this.$router.push({ name: 'SurveyOverview' });
        }
        return;
      } else {
        return this.logout();
      }
    },

    async createDraftSurvey(data) {
      if (!data || Object.keys(data).length === 0) {
        return alert('Something went wrong. No survey data.');
      }
      const surveyDataRaw = {
        name: data.name,
        description: data.description,
        id: data.id,
        type: data.type,
        tenantId: this.tenantId,
        agenda: data.agenda,
        lockedScreen: data.lockedScreen || undefined,
        status: SURVEY_STATUS.DRAFT,
        studyContact: {
          name: data?.studyContact?.name,
          email: data?.studyContact?.email,
          organisation: data?.studyContact?.organisation,
        },
      };

      const surveyData = await initDraftSurvey(surveyDataRaw);

      try {
        this.isSavingDraft = true;
        const res = await createDraftSurvey(this.tenantId, surveyData);
        if (!res.success || !res.survey) {
          this.lastSavedDraft = oldDraft;
          this.draftSavingError = true;
        } else {
          let newSurvey = res.survey;
          const { introPage, submitPage, newAgenda } = extractIntoOutro(
            newSurvey.agenda
          );
          newSurvey.agenda = newAgenda;
          newSurvey.introPage = introPage;
          newSurvey.submitPage = submitPage;
          this.draftSurveyData = newSurvey;
          this.draftSavingError = false;
        }
      } catch (error) {
        this.lastSavedDraft = oldDraft;
        this.draftSavingError = true;
        console.error('Error creating draft survey', error);
      } finally {
        this.isSavingDraft = false;
      }
    },

    checkDraftSync() {
      // show loading spinner if draft survey data has changed
      // check draft sync has 1 second interval
      // save draft interval is 5 seconds
      if (!this.draftSurveyData) return;
      if (Object.keys(this.draftSurveyData).length === 0) return;
      const currentDraft = this.draftSurveyData;
      let draftAsString = JSON.stringify(currentDraft);
      if (!draftAsString) draftAsString = '';
      const noChange = this.lastSavedDraft === draftAsString;
      if (noChange) return;
      if (!noChange) this.isPretendingToSaveDraft = true;
    },

    async saveDraftSurvey() {
      this.isPretendingToSaveDraft = false;
      if (!this.draftSurveyData) return;
      if (Object.keys(this.draftSurveyData).length === 0) return;

      // check if draft survey data has changed
      const currentDraft = this.draftSurveyData;
      let draftAsString = JSON.stringify(currentDraft);
      if (!draftAsString) draftAsString = '';
      const noChange = this.lastSavedDraft === draftAsString;
      if (noChange) return;
      const oldDraft = this.lastSavedDraft;
      this.lastSavedDraft = draftAsString;

      // update draft survey
      let agenda = [
        currentDraft.introPage,
        ...currentDraft.agenda,
        currentDraft.submitPage,
      ];
      agenda = mergeSections(agenda);
      const lockedScreen = currentDraft.lockedScreen;
      const surveyData = {
        name: currentDraft.name,
        description: currentDraft.description,
        id: currentDraft.id,
        tenantId: this.tenantId,
        agenda: agenda,
        type: currentDraft.type,
        lockedScreen: lockedScreen,
        studyContact: {
          name: currentDraft?.studyContact?.name,
          email: currentDraft?.studyContact?.email,
          organisation: currentDraft?.studyContact?.organisation,
        },
      };

      try {
        this.isSavingDraft = true;
        const res = await updateDraftSurvey(this.tenantId, surveyData);
        if (!res.success) {
          this.lastSavedDraft = oldDraft;
          this.draftSavingError = true;
        } else {
          this.draftSavingError = false;
        }
      } catch (error) {
        this.lastSavedDraft = oldDraft;
        this.draftSavingError = true;
        console.error('Error saving draft survey', error);
      } finally {
        this.isSavingDraft = false;
      }
    },

    async previewDraftSurvey(id, saveDraftBeforePreview = false) {
      if (saveDraftBeforePreview) {
        try {
          await this.saveDraftSurvey();
        } catch (error) {
          console.error('Error saving draft survey', error);
          return alert('Something went wrong.');
        }
      }
      let tenantId = this.tenantId;
      let surveyId;
      if (!id) surveyId = this.draftSurveyData.id;
      else surveyId = id;
      let host = window.location.host;
      // let token = adminStore.token
      if (!surveyId || !tenantId) return alert('Something went wrong.');
      window.open(`http://${host}/${tenantId}-${surveyId}?draftsurvey=true`);
    },

    viewTestSurvey(id) {
      let surveyId;
      if (!id) surveyId = this.draftSurveyData.id;
      else surveyId = id;
      const host = window.location.host;
      const tenantId = this.tenantId;
      const expertId = 'test';
      const token = this.token;
      if (!surveyId || !token)
        return alert('Something went wrong. Please try again.');
      window.open(
        `http://${host}/${tenantId}-${surveyId}?id=${expertId}&token=${token}`
      );
    },

    async clearCacheAndUpdate() {
      this.loading = true;
      await Promise.all([
        this.updateExpertData(),
        new Promise((resolve) => setTimeout(resolve, 250)),
      ]);
      this.loading = false;
    },

    async publishSurvey(surveyId) {
      if (!surveyId) return console.error('No survey ID provided');
      if (
        !confirm(
          'Once a survey is published, the content cannot be changed. Do you want to proceed?'
        )
      )
        return;
      

      try {
        const response = await updateSurveyStatus(
          this.tenantId,
          surveyId,
          SURVEY_STATUS.PUBLISHED
        );
        if (!response.success) {
          console.error('Error publishing survey', response);
          throw new Error('Error publishing survey');
        }
        this.draftingSurvey = false;
        this.draftSurveyData = {};
        const surveysResponse = await getSurveys(this.tenantId);
        this.surveys = surveysResponse.surveys || [];
        this.draftSurveys = surveysResponse.drafts || [];
        return true;
      } catch (error) {
        console.error('Error publishing survey', error);
        return false;
      }
    },

    async updatePasswordFirstTime(newPassword) {
      try {
        const response = await updatePassword(
          this.tenantId,
          this.username,
          this.firstTimePassword,
          newPassword
        );
        if (!response.error) {
          this.firstTimePassword = '';
        }
        return response;
      } catch (error) {
        console.error('Error updating first-time password', error);
        this.loading = false;
        return { error, username: this.username };
      }
    },

    async updatePassword(oldPassword, newPassword) {
      try {
        this.loading = true;
        const { success, error } = await updatePassword(
          this.tenantId,
          this.username,
          oldPassword,
          newPassword
        );
        this.loading = false;
        if (success) {
          return { username: this.username };
        } else {
          throw error;
        }
      } catch (error) {
        console.error('Error updating password', error);
        this.loading = false;
        return { error, username: this.username };
      }
    },

    async createNewExpert(surveyId, expert) {
      if (this.anonymiseExperts)
        return alert('Changes cannot be saved in "Anonymise" mode.');

      try {
        await createExpert(this.tenantId, surveyId, expert);
        await this.selectSurvey(this.currentSurveyId);
        toast.success(expert.name + ' added.');
        return true;
      } catch (error) {
        console.error('Error creating expert', error);
        toast.error('Error creating expert', {
          description:
            'There was an error creating the expert. Please try again.',
          style: { background: '#fda4af' },
        });
        return false;
      }
    },

    async updateCurrentExpert(expert) {
      try {
        await updateExpert(expert.tenantId, expert.id, expert.surveyId, expert);
        await this.selectSurvey(this.currentSurveyId);
        toast.success('Expert data updated');
        return true;
      } catch (error) {
        console.error('Error updating expert data', error);
        toast.error('Error updating expert data', {
          description:
            error?.response?.data?.error?.codeName ||
            error?.response?.data?.message ||
            error?.message ||
            'An error occurred',
          style: { background: '#fda4af' },
        });
        return false;
      }
    },

    async getUserData() {
      try {
        this.loading = true;
        const response = await getUser(this.tenantId, this.username);
        this.loading = false;
        return response;
      } catch (error) {
        console.error('Error getting user data', error);
        this.loading = false;
        return { error };
      }
    },

    logout() {
      this.token = '';
      this.tenant = '';
      this.tenantId = '';
      this.username = '';
      this.name = '';
      localStorage.removeItem('token');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('see-tools-data');
      this.$router.push('/admin/login');
    },
  },

  getters: {
    surveyType() {
      return this.draftSurveyData?.type || '';
    },
    currentExperts() {
      if (this.anonymiseExperts) {
        return this.currentExpertsData.map((expert, i) => {
          return {
            ...expert,
            name: 'Expert ' + (i + 1),
            email: '******@****.***',
          };
        });
      } else {
        return this.currentExpertsData;
      }
    },
    currentActiveExperts() {
      return this.currentExperts.filter(
        (expert) => expert.status !== 'archived'
      );
    },
    expertColorMap() {
      // use consistent colours for each expert across the app
      return expertToLineStyleMapper(
        this.currentExperts.map((expert) => expert._id)
      );
    },

    isLoggedIn() {
      return this.token !== '';
    },
  },
  persist: {
    enabled: true,
    key: 'see-tools-data',
    // only keep data for the session
    storage: window.sessionStorage,
  },
});
