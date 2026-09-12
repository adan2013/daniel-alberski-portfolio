import React from 'react'
import styled, {keyframes} from 'styled-components'
import BackgroundAnimation from './BackgroundAnimation'
import {Trans, useTranslation} from 'react-i18next'
import LanguageSwitch from '../../components/LanguageSwitch/LanguageSwitch'

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

const glow = keyframes`
  0% {
    opacity: 0.1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
  }
`;

const ArrowsWrapper = styled.div`
  position: absolute;
  right: 60px;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: -10px;
  height: 100px;
`;

const Arrow = styled.div`
  width: 20px;
  height: 20px;
  border-left: 4px solid #000;
  border-bottom: 4px solid #000;
  transform: rotate(-45deg);
  opacity: 0.2;
  animation: ${glow} 1.5s infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

const Hero = () => {
    const { t } = useTranslation()

    return(
        <section id='start'>
            <Container>
                <LanguageSwitch />
                <BackgroundAnimation />
                <CenterContent>
                    <Title>
                        {t('hero1')}
                        <br />
                        <Trans i18nKey='hero2'>
                            <Accent>Daniel Alberski</Accent>
                        </Trans>
                        <br />
                        {t('hero3')}
                    </Title>
                </CenterContent>
                <ArrowsWrapper>
                    <Arrow delay={0} />
                    <Arrow delay={0.3} />
                    <Arrow delay={0.6} />
                </ArrowsWrapper>
            </Container>
        </section>
    )
}

export default Hero
