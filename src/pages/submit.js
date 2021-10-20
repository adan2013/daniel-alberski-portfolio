import React from 'react'
import PageContainer from '../components/PageContainer/PageContainer'
import MessageContainer from '../components/MessageContainer/MessageContainer'

const ContactSubmitPage = () => (
  <PageContainer>
    <MessageContainer
      title='Poszło!'
      message='Twoja wiadomość została pomyślnie wysłana! Wkrótce na nią odpiszę 😉'
    />
  </PageContainer>
)

export default ContactSubmitPage
