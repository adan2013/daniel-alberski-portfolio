import React from 'react'
import styled from 'styled-components'
import ContactForm from './ContactForm'
import {useTranslation} from 'react-i18next'

const Container = styled.div`
    display: flex;
    flex-direction: ${props => props.theme.isMobile ? 'column' : 'row'};
    padding: 40px 0;
`

const TextCol = styled.div`
    flex: 5;
    padding: 0 5vw;
`

const FormCol = styled.div`
    flex: 5;
    padding: 10px 5vw;
`

const Contact = () => {
    const { t } = useTranslation()

    return(
        <section id='contact'>
            <Container>
                <TextCol>
                    <h2>{t('contact')}</h2>
                    <p>{t('contactText')}</p>
                </TextCol>
                <FormCol>
                    <ContactForm />
                </FormCol>
            </Container>
        </section>
    )
}

export default Contact
