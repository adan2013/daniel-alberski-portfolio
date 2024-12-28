import React from 'react'
import styled from 'styled-components'
import { StaticImage } from 'gatsby-plugin-image'

const Container = styled.div`
    display: flex;
    flex-direction: ${props => props.theme.isMobile ? 'column-reverse' : 'row'};
    background-color: #c7c7c7;
`

const DescriptionCol = styled.div`
    flex: 6;
    padding: 5vw ${props => props.theme.isMobile ? '5vw' : '2vw'} 5vw 5vw;
    margin-top: ${props => props.theme.isMobile ? '10px' : '40px'};
    
    h2 {
        margin-top: 0;
    }
    
    p {
        margin: 0;
    }
`

const ImageCol = styled.div`
    flex: 4;
    text-align: center;
    padding: 0 5vw;
    position: relative;
    min-height: 250px;
`

const ImageShadow = styled.div`
    display: ${props => props.theme.isMobile ? 'block' : 'none'};
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 -8px 20px -6px rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
`

const AboutMe = () => {

    return(
        <section id='about-me'>
            <Container>
                <DescriptionCol>
                    <h2>O mnie</h2>
                    <p>
                        Nazywam się Daniel Alberski i od ponad 10 lat interesuję się programowaniem. Obecnie skupiam się na frontendach napisanych w Reactcie, ale wykonywałem również projekty backendów Node.js i aplikacji w React Native lub C#. W wolnych chwilach tworzę projekty DIY oparte o Raspberry Pi, Arduino oraz wydruki 3D. Poniżej znajdziesz kilka z moich największych prywatnych projektów.
                    </p>
                </DescriptionCol>
                <ImageCol>
                    <StaticImage
                        src='../../images/da.png'
                        alt='Daniel Alberski'
                        placeholder='none'
                        style={{ width: '100%', maxHeight: '100%', position: 'absolute', left: '0', bottom: '0' }}
                        imgStyle={{ objectFit: 'contain', boxShadow: '0 6px 14px -4px rgba(0,0,0,0.7)' }}
                    />
                    <ImageShadow />
                </ImageCol>
            </Container>
        </section>
    )
}

export default AboutMe
