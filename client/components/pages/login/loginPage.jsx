import React from 'react'
import LoginForm from './loginForm'
import Head from '../../head'
import './login.css'

const LoginPage = () => {
    return (
        <div className="loginPage__bg">
            <Head title='loginPage'/>
            <LoginForm />
        </div>
    )
}

LoginPage.propTypes = {}

export default LoginPage