import React from 'react'
import PageContainer from '../components/PageContainer/PageContainer'
import MessageContainer from '../components/MessageContainer/MessageContainer'
import '../i18n';
import {useTranslation} from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <PageContainer>
      <MessageContainer
        title='404'
        message={t('pageNotFound')}
      />
    </PageContainer>
  )
}

export default NotFoundPage
