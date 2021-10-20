import React from 'react';
import styled from 'styled-components';

const menuConfig = [
    { id: 'start', text: 'Start' },
    { id: 'aboutme', text: 'O mnie' },
    { id: 'skills', text: 'Umiejętności' },
    { id: 'projects', text: 'Projekty' },
    { id: 'contact', text: 'Kontakt' },
]

const Header = styled.header`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
`

const Navigation = styled.nav`
    float: right;
`

const NavItem = styled.a`
    display: inline-block;
    text-decoration: none;
    color: #000;
    margin: 10px;

    /* &::before {
        display: block;
        content: '';
        width: 40px;
        height: 8px;
        background-color: #aaaaaa;
        position: absolute;
        top: 20px;
        z-index: -1;
    } */
`

const MainMenu = () => {

    return(
        <Header>
            <Navigation>
                {
                    menuConfig.map(({ id, text }) => (
                        <NavItem key={id} href={'#' + id}>{text}</NavItem>
                    ))
                }
            </Navigation>
        </Header>
    )
}

export default MainMenu