import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { ThemeProvider } from 'styled-components'
import SEO from '../SEO/SEO'

const defaultTheme = {
    accentColor: '#d40000',
    isMobile: false,
}

const MainContainer = styled.div`
    background-color: #fff;
    margin: 0 auto;
    padding: 0;
    max-width: 2000px;
    box-shadow: 0px 0px 25px 3px #3e3e3e;
    min-height: 100vh;
`

const PageContainer = ({ children }) => {
    const [theme, setTheme] = useState(defaultTheme)

    useEffect(() => {
        const onResize = () => {
            setTheme(rest => ({
                ...rest,
                isMobile: window ? window.innerWidth < 900 : false,
            }))
        }
        if(window) window.addEventListener('resize', onResize)
        onResize()
        console.log('Hello developer! My name is Daniel. Nice to meet you :)')
    }, [])

    return(
        <ThemeProvider theme={theme}>
            <SEO />
            <MainContainer>
                {children}
            </MainContainer>
        </ThemeProvider>
    )
}

PageContainer.propTypes = {
    children: PropTypes.node.isRequired,
}

export default PageContainer