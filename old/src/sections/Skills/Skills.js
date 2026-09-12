import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { skills } from '../../data'
import {useTranslation} from 'react-i18next'

const Title = styled.h2`
    text-align: center;
    margin: 80px auto 50px;
`

const SkillContainer = styled.div`
    margin: 0 auto;
    padding: 0 20px;
    max-width: 1200px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${props => props.theme.isMobile ? '100' : '300'}px, 1fr));
`

const SkillItem = styled.div`
    padding: 12px;
    display: flex;
    align-items: center;
    transition: 0.4s;
    margin: ${props => props.theme.isMobile ? '0 auto' : '0'};

    svg, div {
        margin-right: ${props => props.theme.isMobile ? '0' : '10px'};
        font-size: 2rem;
        transition: 0.4s;
    }

    span {
        display: ${props => props.theme.isMobile ? 'none' : 'inline'};
    }

    &:hover {
        background-color: #f4f4f4;

        svg {
            color: ${props => props.color};
        }

        div {
            background-color: ${props => props.color};
        }
    }
`

const SvgImage = styled.div`
    background-color: #000;
    mask: url(${props => props.src});
    mask-size: cover;
    width: 2rem;
    height: 2rem;
`

const Skills = () => {
  const { t } = useTranslation()

    return(
        <section id='skills'>
            <Title>{t('skills')}</Title>
            <SkillContainer>
                {
                    skills.map(({ id, name, icon, svg, color }) => (
                        <SkillItem key={id} color={color}>
                            {icon && <FontAwesomeIcon icon={icon} />}
                            {svg && <SvgImage src={svg} />}
                            <span>{name}</span>
                        </SkillItem>
                    ))
                }
            </SkillContainer>
        </section>
    )
}

export default Skills
