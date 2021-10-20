import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.span`
    position: relative;
    display: inline-block;
    background-color: #cfcfcf;
    font-size: 0.65rem;
    padding: 0 15px;
    margin: 0px 15px 8px;
    height: 25px;
    line-height: 25px;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        transform: translateX(-100%);
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 0 25px 15px;
        border-color: transparent transparent #cfcfcf transparent;
    }

    &::after {
        content: '';
        position: absolute;
        right: 0;
        transform: translateX(100%);
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 25px 15px 0 0;
        border-color: #cfcfcf transparent transparent transparent;
    }
`

const Tag = ({ children }) => {

    return(
        <Container>
            {children}
        </Container>
    )
}

Tag.propTypes = {
    children: PropTypes.string.isRequired,
}

export default Tag