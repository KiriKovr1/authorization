import React from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { updateLogin, updatePassword, signin } from "../../../redux/reducers/auth"


const LoginForm = () => {
    const login = useSelector((s) => s.auth.email)
    const password = useSelector((s) => s.auth.password)
    const data = useSelector((s) => s.auth)
    console.log({redux: data})
    const dispatch = useDispatch()
    return (
        <div>
            <form className="loginForm">
                <h1 className="loginForm__title">
                    ВОЙТИ В АККАУНТ
                </h1>
                <div className="loginForm__input">
                    <label htmlFor="username" className="loginForm__labeltext">
                        Логин
                    </label>
                    <input
                        className="loginForm__inputBody"
                        id="username"
                        value={login}
                        type="text"
                        placeholder="ваш логин"
                        onChange={(e) => {
                            const newLogin = e.target.value
                            dispatch(updateLogin(newLogin))
                        }}
                    />
                </div>
                <div className="loginForm__input">
                    <label htmlFor="password" className="loginForm__labeltext">
                        Пароль
                    </label>
                    <input
                        className="loginForm__inputBody"
                        value={password}
                        id="password"
                        type="password"
                        placeholder="ваш пароль"
                        onChange={(e) => {
                            const newPass = e.target.value
                            dispatch(updatePassword(newPass))
                        }}
                    />
                </div>
                <div className="loginForm__buttonsPennel">
                    <button
                        className="loginForm__button"
                        type="button"
                        onClick={() => {
                            dispatch(signin())
                        }}
                    >
                        войти
                    </button>
                    <Link to='/' className="loginForm__forgotPassword">
                        забыли пароль
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default LoginForm