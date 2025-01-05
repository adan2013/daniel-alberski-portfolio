import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Tag from '../../components/Tag/Tag'
import CTA from '../../components/CTA/CTA'
import {useTranslation} from 'react-i18next'

const Container = styled.div`
    display: flex;
    flex-direction: ${props => props.theme.isMobile ? 'column' : 'row'};
    margin-bottom: 80px;
`

const ImageCol = styled.div`
    flex: 4;
    padding: ${props => props.theme.isMobile ? '10px 5vw' : '10px 2vw 10px 5vw'};
`

const Image = styled.div`
    border-radius: 20px;
    box-shadow: rgba(0,0,0,0.8) 0 0 10px;
    overflow: hidden;
`

const TextCol = styled.div`
    flex: 6;
    padding: ${props => props.theme.isMobile ? '10px 5vw' : '10px 5vw'};
    align-self: start;
`

const Title = styled.h3`
    margin: 10px 0 20px;
`

const Description = styled.p`
    margin: 20px 0;
`

const imageQuery = graphql`
   query {
        images: allFile(filter: {ext: {in: [".jpg", ".png"]}}) {
            nodes {
                extension
                publicURL
                relativePath
                childImageSharp {
                    gatsbyImageData(
                        width: 800,
                        placeholder: BLURRED,
                        formats: [AUTO, WEBP, AVIF]
                    )
                }
            }
        }
  }
`

const ProjectItem = ({ project }) => {
    const data = useStaticQuery(imageQuery)
    const { t } = useTranslation()
    const imageData = data.images.nodes.find(i => i.relativePath.includes(project.image))

    if(imageData) {
        const imageObject = getImage(imageData)
        return(
            <Container>
                <ImageCol>
                    <Image>
                        <GatsbyImage image={imageObject} alt={project.name} />
                    </Image>
                </ImageCol>
                <TextCol>
                    <Title>{t(project.name)}</Title>
                    {
                        project.tags.map(tag => <Tag key={tag}>{tag}</Tag>)
                    }
                    <Description>{t(project.description)}</Description>
                    {
                        project.buttons.map(({ name, icon, url }) => (
                            <CTA key={name} icon={icon} url={url}>{t(name)}</CTA>
                        ))
                    }
                </TextCol>
            </Container>
        )
    }else{
        console.error(`Image "${project.image}" not found!`)
        return <>Image {project.image} not found!</>
    }
}

ProjectItem.propTypes = {
    project: PropTypes.object.isRequired,
}

export default ProjectItem
