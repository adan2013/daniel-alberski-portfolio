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
    padding: 2vw ${props => props.theme.isMobile ? '5vw' : '2vw'} 2vw 5vw;
    margin-top: ${props => props.theme.isMobile ? '10px' : '40px'};
`

const ImageCol = styled.div`
    flex: 4;
    text-align: center;
    padding: 0 5vw;
    position: relative;
    text-align: center;
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
                        Nazywam się Daniel Alberski i od prawie 10 lat interesuję się programowaniem. Obecnie pracuję jako JavaScript Frontend Developer oraz tworzę proste backendy przy użyciu Node.js i usług Firebase. W przeszłości zajmowałem się programowaniem w C#. Obecnie skupiam się na poznawaniu ekosystemu Reacta w tym Gatsby.js oraz React Native. W wolnych chwilach koduje swoje prywatne projekty, w których testuje nowe technologie i poznaję świat elektroniki dzięki wykorzystaniu Raspberry Pi oraz Arduino. Poniżej znajdziesz moje najlepsze projekty z każdej dziedziny, jaką się zajmowałem.
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