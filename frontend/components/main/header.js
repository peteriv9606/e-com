import Cookies from "js-cookie";
import router from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/header.module.scss"
import { getUser } from "./auth";

function Header() {
    const [ user, setUser ] = useState()
    const route_need_auth = [
        '/account/[slug]',
    ]

    useEffect(async () => {
        let usr = await getUser()

        usr !== undefined && usr?.code !== "token_not_valid" 
        ?   setUser(usr)
        :   route_need_auth.includes(router.pathname) ? router.push('/login') : ""
        
    }, [])

    const handleLogout = () => {
        Cookies.remove('access')
        Cookies.remove('refresh')
        router.reload()
    }
    return (
        <header className={styles.Wrapper}>
            <div className="Shell">
                <div className={styles.Inner}>
                    <a href="/"><span>E</span>com</a>
                    <div className={styles.LinkContainer}>
                    
                        {user != undefined ?
                        <>     
                            <a className={`Button ${styles.Button}`} href={`/account`}>Hello, {user?.username}!</a>
                            <button className={`Button ${styles.Button}`} onClick={handleLogout}>Logout</button>
                        </>
                        :
                        <>
                            <a href="/login">Login</a>
                            <a href="/register">Register</a>
                        </>}
                        
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;
