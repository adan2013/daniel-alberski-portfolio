import React from 'react'
import PageContainer from '../components/PageContainer/PageContainer'
import MessageContainer from '../components/MessageContainer/MessageContainer'

const NotFoundPage = () => (
  <PageContainer>
    <MessageContainer
      title='404'
      message='Strona nie została znaleziona'
    />
  </PageContainer>
)

export default NotFoundPage
