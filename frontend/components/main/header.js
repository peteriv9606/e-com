import Cookies from "js-cookie";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/header.module.scss"
import OutsideClickHandler from "react-outside-click-handler"

function Header({user}) {
    const [dropdown, setDropdown] = useState(false)
    const [initRender, setInitRender] = useState(true)

    const dropdown_ref = useRef()

    const handleLogout = () => {
        Cookies.remove('access')
        Cookies.remove('refresh')
        router.reload()
    }

    const handleDropdown = () => {
        setDropdown(!dropdown)
    }

    useEffect(() => {
        if (!initRender) {

            if (!dropdown) {
                // hide
                dropdown_ref.current.classList.add(styles.Hide)
                setTimeout(() => {
                    dropdown_ref.current.classList.remove(styles.Hide)
                    dropdown_ref.current.classList.remove(styles.Active)
                }, 500);
            } else {
                // show
                dropdown_ref.current.classList.add(styles.Show)
                setTimeout(() => {
                    dropdown_ref.current.classList.remove(styles.Show)
                    dropdown_ref.current.classList.add(styles.Active)
                }, 500);
            }
        }
        setInitRender(false)

    }, [dropdown])

    return (
        <header className={styles.Wrapper}>
            <OutsideClickHandler onOutsideClick={() => dropdown ? setDropdown(false) : ""}>
                <div className="Shell">
                    <div className={styles.Inner}>
                        <a href="/"><span>E</span>Com</a>
                        {!user ?
                            <button onClick={handleDropdown} className={styles.Hamburger}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            : <button onClick={handleDropdown} className={styles.Username}>{user?.username}</button>
                        }
                    </div>
                </div>
                <div className={`${styles.Dropdown_wrapper}`} ref={dropdown_ref}>
                    <div className={"Shell"}>
                        <div className={styles.Dropdown}>
                            {/* 
                                // possible future user notifications
                                <p>{user ? `Hello, ${user.username}!` : ""}</p> 
                             */}
                            <div className={styles.LinkContainer}>
                                <div>
                                    {/* left side */}
                                    <a href={`/products`} onClick={() => setDropdown(false)}>Products</a>
                                </div>
                                <div>
                                    {/* right side */}
                                    {
                                        user != undefined ?
                                            <>
                                                <a href={`/account`} onClick={() => setDropdown(false)}>Account</a>
                                                <a href={`/cart`} onClick={() => setDropdown(false)}>Cart</a>
                                                <button onClick={handleLogout}>Logout</button>
                                            </>
                                            :
                                            <>
                                                <a href="/login" onClick={() => setDropdown(false)}>Login</a>
                                                <a href="/register" onClick={() => setDropdown(false)}>Register</a>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </OutsideClickHandler>
        </header>
    )
}

export default Header;