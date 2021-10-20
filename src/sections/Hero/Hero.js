import React from 'react'
import styled from 'styled-components'
import BackgroundAnimation from './BackgroundAnimation'

const Container = styled.div`
    position: relative;
    width: min(100vw, 100%);
    height: 100vh;
`

const CenterContent = styled.div`
    position: absolute;
    left: 5vw;
    bottom: 5vw;
    font-weight: 700;
    font-size: ${props => props.theme.isMobile ? '1.2rem' : '1.5rem'};
    padding-right: 12vw;
`

const Title = styled.h1`
    margin: 0;
`

const Accent = styled.span`
    color: ${props => props.theme.accentColor};
    display: ${props => props.theme.isMobile ? 'inline-block' : 'inline'};
`

const Hero = () => {

    return(
        <section id='start'>
            <Container>
                <BackgroundAnimation />
                <CenterContent>
                    <Title>
                        Witaj!
                        <br />
                        Jestem <Accent>Daniel Alberski</Accent>
                        <br />
                        JavaScript Frontend Developer
                    </Title>
                </CenterContent>
            </Container>
        </section>
    )
}

export default Hero