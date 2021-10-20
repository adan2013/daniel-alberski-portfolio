import React from 'react'
import styled from 'styled-components'
import ContactForm from './ContactForm'

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

    return(
        <section id='contact'>
            <Container>
                <TextCol>
                    <h2>Kontakt</h2>
                    <p>
                        Chcesz się ze mną skontaktować? Skorzystaj z formularza
                        obok lub odezwij się na jednym z social mediów dostępnych
                        w stopce. Znajdziesz tam również link do mojego
                        konta <b>GitHub</b> oraz profilu na <b>LinkedIn</b>.
                    </p>
                </TextCol>
                <FormCol>
                    <ContactForm />
                </FormCol>
            </Container>
        </section>
    )
}

export default Contact