import React from 'react'
import styled from 'styled-components'
import { projects } from '../../data'
import ProjectItem from './ProjectItem'
import {useTranslation} from 'react-i18next'

const Title = styled.h2`
    text-align: center;
    margin: 80px auto 30px;
`

const Projects = () => {
  const { t } = useTranslation()

    return(
        <section id='projects'>
            <Title>{t('myProjects')}</Title>
            {
                projects.map(project => (
                    <ProjectItem key={project.id} project={project} />
                ))
            }
        </section>
    )
}

export default Projects
