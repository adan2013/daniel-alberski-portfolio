import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CTA from '../CTA/CTA'
import {useTranslation} from 'react-i18next'

const MainContainer = styled.div`
    background-color: #fff;
    padding: 20px 10px;
    text-align: center;
`

const Title = styled.h1`
    font-size: 3rem;
    margin-bottom: 5px;
`

const Message = styled.div`
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 35px;
`

const MessageContainer = ({ title, message }) => {
    const { t } = useTranslation()

    return(
        <MainContainer>
            {title && <Title>{title}</Title>}
            {message && <Message>{message}</Message>}
            <CTA url='/' useGatsbyNav>{t('backToHome')}</CTA>
        </MainContainer>
    )
}

MessageContainer.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
}

export default MessageContainer
