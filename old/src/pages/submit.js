import React from 'react'
import PageContainer from '../components/PageContainer/PageContainer'
import MessageContainer from '../components/MessageContainer/MessageContainer'
import '../i18n';
import {useTranslation} from 'react-i18next'

const ContactSubmitPage = () => {
  const { t } = useTranslation()

  return (
    <PageContainer>
      <MessageContainer
        title={t('submitTitle')}
        message={t('submitText')}
      />
    </PageContainer>
  )
}

export default ContactSubmitPage
