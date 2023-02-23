export const ConnectWallet = (props) => {
	if (props.walletConnected) {
		return (
			<div>
				<button>Wallet Connected</button>
			</div>
		);
	} else {
		return (
			<div>
				<button onClick={props.connectWallet}>Connect Wallet</button>
			</div>
		);
	}
};
