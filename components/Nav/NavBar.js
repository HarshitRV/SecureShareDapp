import Image from "next/image";
import styles from "../../styles/Nav.module.css"
export const NavBar = props => {
    return (
        <>
        <div className={styles.navContainer}>
        <Image style={{opacity: 0.50}}
            src = "/share.png"
            width = "35"
            height = "25"
            alt = "logo"
            /> 
            <h3 className={styles.navTitle} >File Share</h3>
            <ul className={styles.navList}>
                <li className={styles.navButton}><a href="#">Features</a></li>
                <li className={styles.navButton}><a href="#">Services</a></li>
                <li className={styles.navButton}><a href="#">About</a></li>
            </ul>
            <button className={styles.navContact}>Contacts</button>
        </div>
            
        </>
    )
}