import React from 'react'
import styled from 'styled-components'
import { faCat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Container = styled.div`
    width: 100%;
    height:100vh;
`

const ListOfElements = styled.ul`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
`

const Element = styled.li`
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(0, 0, 0, 0.15);
    animation: animate 25s linear infinite;
    bottom: -150px;

    @keyframes animate {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
        }

        100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
        }
    }

    &:nth-child(1) {
        left: 25%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
    }


    &:nth-child(2) {
        left: 10%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
    }

    &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
    }

    &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
    }

    &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
    }

    &:nth-child(6) {
        left: 75%;
        width: 110px;
        height: 110px;
        animation-delay: 3s;
        background-color: ${props => props.theme.accentColor + '33'};
    }

    &:nth-child(7) {
        left: 35%;
        width: 150px;
        height: 150px;
        animation-delay: 7s;
    }

    &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
    }

    &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
    }

    &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 15s;
    }
`

const EasterEgg = styled(Element)`
    left: 48%;
    width: ${props => props.size ? `${props.size}px` : '150px'};
    height: ${props => props.size ? `${props.size}px` : '150px'};
    display: flex;
    align-items: center;

    /* EASTER EGG VALUES */
    animation-delay: 18s;
    animation-duration: 35s;

    /* TEST VALUES */
    /* animation-delay: 0;
    animation-duration: 5s; */

    svg {
        color: #fff;
        font-size: ${props => props.size ? `${props.size * 0.66}px` : '100px'};
        display: block;
        margin: 0 auto;
        flex: 1;
    }
`

const BackgroundAnimation = () => (
    <Container>
        <ListOfElements>
            <Element />
            <Element />
            <Element />
            <Element />
            <Element />
            <Element />
            <Element />
            <Element />
            <Element />
            <Element />
            <EasterEgg size={120}>
                <FontAwesomeIcon icon={faCat} />
            </EasterEgg>
        </ListOfElements>
    </Container>
)

export default BackgroundAnimation