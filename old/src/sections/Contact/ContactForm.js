import React from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'

const CONTACT_EMAIL_API = 'https://formsubmit.co/53a196e933c0eb7206126e31ba18fd5d'
const SUBMIT_RETURN_URL = 'https://danielalberski.adanit.pl/submit'

const Form = styled.form`
    background-color: #f2f2f2;
    border: 6px #dfdfdf solid;
    padding: 16px 8px;
`

const Label = styled.div`
    font-size: 0.8rem;
    margin: 8px auto 2px;
    width: 90%;
    max-width: 600px;
`

const Input = styled.input`
    display: block;
    width: 90%;
    max-width: 600px;
    height: 30px;
    line-height: 30px;
    padding: 5px 8px;
    margin: 8px auto 12px;
    border: 2px #3e3e3e solid;
`

const Textarea = styled.textarea`
    display: block;
    width: 90%;
    max-width: 600px;
    height: 100px;
    padding: 8px;
    margin: 8px auto 12px;
    border: 2px #3e3e3e solid;
`

const SubmitButton = styled.input`
    display: block;
    text-decoration: none;
    background-color: ${props => props.theme.accentColor};
    color: #fff;
    font-size: 0.9rem;
    min-width: 150px;
    margin: 15px auto 8px;
    padding: ${props => props.theme.isMobile ? '10px' : '12px'};
    position: relative;
    left: 0;
    bottom: 0;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.6);
    border: none;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        left: 5px;
        bottom: 5px;
        box-shadow: -5px 5px 10px 2px rgba(0,0,0,0.6);
    }
`

const ContactForm = () => {
  const { t } = useTranslation()

    return(
        <Form action={CONTACT_EMAIL_API} method='POST'>
            <Label>{t('nameField')}</Label>
            <Input type='text' name='name' required />
            <Label>{t('emailField')}</Label>
            <Input type='email' name='email' required />
            <Label>{t('messageField')}</Label>
            <Textarea name='message'></Textarea>
            <Input type='hidden' name='_subject' value='Formularz kontaktowy portfolio' />
            <Input type='hidden' name='_next' value={SUBMIT_RETURN_URL} />
            <Input type='hidden' name='_honey' value='' />
            <SubmitButton type='submit' value={t('sendButton')} />
        </Form>
    )
}

export default ContactForm
