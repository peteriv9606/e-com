import styles from '../styles/accountPersonalBlock.module.scss'
import { useEffect, useState } from "react"

export default function Personal({ssr_user}) {
  const [user, setUser] = useState(ssr_user)
  return (
    <div className={styles.Wrapper}>
      <div className={styles.Inner}>
        <p>UUID: {user?.id}</p>
        <p>Username: {user?.username}</p>
      </div>
    </div>
  )
}