import React from 'react'
import styled from 'styled-components'
import { projects } from '../../data'
import ProjectItem from './ProjectItem'

const Title = styled.h2`
    text-align: center;
    margin: 80px auto 30px;
`

const Projects = () => {

    return(
        <section id='projects'>
            <Title>Wybrane projekty</Title>
            {
                projects.map(project => (
                    <ProjectItem key={project.id} project={project} />
                ))
            }
        </section>
    )
}

export default Projects