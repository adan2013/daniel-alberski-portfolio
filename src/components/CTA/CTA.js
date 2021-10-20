import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { navigate } from 'gatsby-link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Button = styled.a`
    display: ${props => props.theme.isMobile ? 'block' : 'inline-block'};
    text-decoration: none;
    background-color: ${props => props.theme.accentColor};
    color: #fff;
    font-size: 0.9rem;
    min-width: 100px;
    max-width: 300px;
    text-align: center;
    margin: ${props => props.theme.isMobile ? '15px auto' : '5px 12px'};
    padding: ${props => props.theme.isMobile ? '12px 15px' : '12px 18px'};
    position: relative;
    left: 0;
    bottom: 0;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.6);
    cursor: pointer;
    transition: 0.2s;

    svg {
        margin-right: 8px;
    }

    &:hover {
        left: 5px;
        bottom: 5px;
        box-shadow: -5px 5px 10px 2px rgba(0,0,0,0.6);
    }
`

const CTA = ({ url, icon, children, useGatsbyNav }) => {

    if(useGatsbyNav) {
        const goToUrl = () => {
            navigate(url)
            return false
        }

        return(
            <Button onClick={goToUrl} title={children}>
                {icon && <FontAwesomeIcon icon={icon} />}
                {children}
            </Button>
        )
    }else{
        return(
            <Button href={url} title={children} target='_blank' rel='noreferrer'>
                {icon && <FontAwesomeIcon icon={icon} />}
                {children}
            </Button>
        )
    }
}

CTA.propTypes = {
    url: PropTypes.string.isRequired,
    icon: PropTypes.object,
    children: PropTypes.string.isRequired,
    useGatsbyNav: PropTypes.bool,
}

CTA.defaultProps = {
    useGatsbyNav: false,
}

export default CTA