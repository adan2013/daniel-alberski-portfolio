import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { social } from '../../data'
import {useTranslation} from 'react-i18next'

const FooterContainer = styled.footer`
    background-color: #0f0f0f;
    color: #fff;
    font-weight: 500;
    font-size: 0.8rem;
    text-align: center;
    padding: 30px 20px;
`

const SocialIcons = styled.div`
    padding-top: 15px;;
    padding-bottom: 35px;
`

const IconAnchor = styled.a`
    font-size: 2rem;
    color: #fff;
    margin: 0 15px;
    position: relative;
    bottom: 0;
    transition: 0.4s;

    &:hover {
        color: ${props => props.hoverColor || '#fff'};
        bottom: 5px;
    }
`

const Footer = () => {
  const { t } = useTranslation()

    return(
        <FooterContainer>
            <SocialIcons>
                {
                    social.map(({ id, url, name, icon }) => (
                        <IconAnchor
                            key={id}
                            href={url}
                            title={name}
                            target='_blank'
                            rel='noreferrer'
                        >
                            <FontAwesomeIcon icon={icon} />
                        </IconAnchor>
                    ))
                }
            </SocialIcons>
            © {`${new Date().getFullYear()} ${t('footerRights')}`}
        </FooterContainer>
    )
}

export default Footer
