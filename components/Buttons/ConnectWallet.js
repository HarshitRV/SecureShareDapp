import styles from '../../styles/Button.module.css'
export const ConnectWallet = (props) => {
	if (props.walletConnected) {
		return (
			<div>
				<button style={{'--clr':'#39FF14'}} className={styles.connectBtn} ><span>Wallet Connected</span><i></i></button>
			</div>
		);
	} else {
		return (
			<div>
				<button style={{'--clr':'#39FF14'}} onClick={props.connectWallet} className={styles.connectBtn} ><span>Connect Wallet</span><i></i></button>
			</div>
		);
	}
};
