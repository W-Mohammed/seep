import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { sendEmail } from '@/api/experts'
import { toast } from 'vue-sonner'
import { useAdminStore } from './adminStore'

export const useEmailStore = defineStore('emailStore', () => {
  const adminStore = useAdminStore()
  const emailSubject = ref({})
  const emailBody = ref({})
  const loading = ref(false)

  const { name, username, tenant, currentExpert, currentSurveyData } = storeToRefs(adminStore)

  const createEmailTemplate = (expertName, surveyUrl) => {
    return `Dear ${expertName},
  
You have been invited to participate in an expert survey. 

You can access the survey using the following link:
${surveyUrl}
      
The link is unique to you and should not be shared with others. 

If you have any questions or need assistance, please contact the survey administrator:
${name.value}
${username.value}
${tenant.value}


Many thanks and best regards,
SEE Platform Team
`
  }

  const createDefaultEmailMessage = (expert, reset = false) => {
    if (expert == null || expert.surveyUrl == null) return
    const surveyUrl = expert.surveyUrl

    if (emailBody.value[expert._id] === undefined || reset) {
      emailSubject.value[expert?._id] = 'Invitation to participate in an expert survey'
      emailBody.value[expert?._id] = createEmailTemplate(expert.name,surveyUrl)
    }
  }

  const sendInvitationEmail = async (expert) => {
    try {
      if (expert.email === undefined || expert.email === '' || expert.email === null || expert.email === ' ') throw new Error('No email address provided')
      
      function validateEmail(email) {
          var re = /\S+@\S+\.\S+/;
          return re.test(email);
        }
        

      if (!validateEmail(expert.email))
        throw new Error('Invalid email address')  
  
      const emailPayload = {
        email: expert.email,
        subject: emailSubject.value[expert._id],
        emailBody: emailBody.value[expert._id]
      }

      const response = await sendEmail(expert.tenantId, expert.id, expert.surveyId, emailPayload)

      if(!response.success) throw new Error('Something went wrong - email could not be sent')
      toast.success('Email sent to ' + expert.email)
      return true
    } catch (error) {
      toast.error('Error sending email', {
        description: error.message || error,
        style: { background: '#fda4af' }
      })
      return false
    } 
  }

  return {
    createDefaultEmailMessage,
    sendInvitationEmail,
    emailSubject,
    emailBody
  }
})
