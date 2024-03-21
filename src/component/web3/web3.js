import TronWeb from "tronweb";

const FullNode = "https://api.shasta.trongrid.io";
const SolidityNode = "https://api.shasta.trongrid.io";
const EventServer = "https://api.shasta.trongrid.io";
const privateKey = process.env.REACT_APP_PRIVATE_KEY;

const tronWeb = new TronWeb({
	fullHost: "https://api.shasta.trongrid.io",
});

const nftContractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS || "";
const stakeContractAddress = process.env.REACT_APP_STAKE_CONTRACT_ADDRESS || "";

const getNFTContract = async () => {
	if (window) {
		try {
			if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
				const nftContract = await window.tronWeb
					.contract()
					.at(nftContractAddress);
				return nftContract;
			}
		} catch (error) {}
	}
};

const getStakeContract = async () => {
	if (window) {
		try {
			if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
				const stakeContract = await window.tronWeb
					.contract()
					.at(stakeContractAddress);
				return stakeContract;
			}
		} catch (error) {}
	}
};

export const getOwnersAddress = async () => {
	let ownersList = [];
	try {
		const stakeContract = await getStakeContract();
		if (stakeContract) {
			try {
				const goldTokenOwnersList = await stakeContract
					.getAllMeowTokenOwners()
					.call();
				if (goldTokenOwnersList) {
					console.log("tokenOwner: ", goldTokenOwnersList[0][1]);
					for (let i = 0; i < goldTokenOwnersList[0].length; i++) {
						const owner = tronWeb.address.fromHex(goldTokenOwnersList[0][i]);
						const tokenAmount = goldTokenOwnersList[1][i].toString();
						ownersList.push({ owner, tokenAmount });
					}
					// Sort the list by tokenAmount in descending order
					ownersList.sort(
						(a, b) => parseInt(b.tokenAmount) - parseInt(a.tokenAmount)
					);

					return { isSuccess: true, ownersList: ownersList };
				} else {
					return { isSuccess: false };
				}
			} catch (error) {
				return { isSuccess: false, error: error };
			}
		}
	} catch (error) {
		return { isSuccess: false, error: error };
	}
};

export const stakeNFT = async (tokenId) => {
	try {
		const nftContract = await getNFTContract();
		if (nftContract) {
			try {
				// eslint-disable-next-line
				const approveTx = await nftContract
					.approve(stakeContractAddress, tokenId)
					.send({ callValue: 0 });
				console.log("tokenId: ", tokenId);
				try {
					const stakeContract = await getStakeContract();
					if (stakeContract) {
						try {
							const stakeTx = await stakeContract
								.stakeNFT(tokenId)
								.send({ from: nftContractAddress, callValue: 0 });
							console.log("stakeTx: ", stakeTx);
							return { isSuccess: true, tokenId: tokenId };
						} catch (error) {
							console.log("stakeError: ", error);
							return { isSuccess: false, error: error };
						}
					}
				} catch (error) {
					console.log("error: ", error);
					return { isSuccess: false, error: error };
				}
			} catch (error) {
				console.log("error: ", error);
				return { isSuccess: false, error: error };
			}
		}
	} catch (error) {}
};

export const unStakeNFT = async (tokenId) => {
	try {
		const stakeContract = await getStakeContract();
		if (stakeContract) {
			try {
				// eslint-disable-next-line
				const unStakeTx = await stakeContract
					.unStakeNFT(tokenId)
					.send({ callValue: 0 });
				return { isSuccess: true, tokenId: tokenId };
			} catch (error) {
				return { isSuccess: false, error: error };
			}
		}
	} catch (error) {
		console.log("error: ", error);
		return { isSuccess: false, error: error };
	}
};

export const claimNFT = async () => {
	const tronWeb = new TronWeb(FullNode, SolidityNode, EventServer, privateKey);

	if (tronWeb && tronWeb.defaultAddress.base58) {
		try {
			const stakeContract = await tronWeb.contract().at(stakeContractAddress);
			if (stakeContract) {
				try {
					const claimTX = await stakeContract
						.claimNFT()
						.send({ from: stakeContractAddress, callValue: 0 });
					console.log("claimTX: ", claimTX);
					if (claimTX) {
						return { isSuccess: true };
					} else {
						return { isSuccess: false };
					}
				} catch (error) {
					if (error.message) {
						return { isSuccess: false, error: error.message };
					} else {
						return { isSuccess: false };
					}
				}
			}
		} catch (error) {
			return { isSuccess: false };
		}
	}
};

export const getMintedList = async () => {
	let mintedList = [];
	try {
		const nftContract = await getNFTContract();

		if (nftContract) {
			try {
				const balance = await nftContract
					.balanceOf(window.tronWeb.defaultAddress.base58)
					.call();
				if (balance.toString()) {
					for (let i = 0; i < balance.toString(); i++) {
						try {
							const mintedNFT = await nftContract
								.tokenOfOwnerByIndex(window.tronWeb.defaultAddress.base58, i)
								.call();
							mintedList.push({ tokenId: mintedNFT.toString() });
						} catch (error) {
							console.log("error: ", error);
							return { isSuccess: false, error, mintedList: [] };
						}
					}
					return { isSuccess: true, mintedList };
				}
			} catch (error) {
				console.log("error: ", error);
				return { isSuccess: false, error, mintedList: [] };
			}
		}
	} catch (error) {
		return { isSuccess: false, error, mintedList: [] };
	}
};

export const getStakingList = async () => {
	let stakingList = [];
	try {
		const stakingContract = await getStakeContract();
		if (stakingContract) {
			try {
				const stakedTokenIdLength = await stakingContract
					.stakingBalance(window.tronWeb.defaultAddress.base58)
					.call();
				if (stakedTokenIdLength.toString() !== 0) {
					for (let i = 0; i < stakedTokenIdLength.toString(); i++) {
						try {
							const stakedTokenIds = await stakingContract
								.tokenIdbyOwners(window.tronWeb.defaultAddress.base58, i)
								.call();
							const stakedNFTData = await stakingContract
								.stakings(stakedTokenIds.toString())
								.call();
							const stakedId = stakedNFTData.tokenId.toString();
							const stakedTime = stakedNFTData.startTime.toString();
							const formattedTime = convertTimestampToCustomFormat(stakedTime);
							stakingList.push({
								stakedId,
								date: formattedTime.formattedDate,
								time: formattedTime.formattedTime,
							});
						} catch (error) {
							return { isSuccess: false, error, stakingList: [] };
						}
					}
					return { isSuccess: true, stakingList };
				} else {
					return { isSuccess: false, stakingList: [] };
				}
			} catch (error) {
				console.log("error: ", error);
			}
		}
	} catch (error) {
		return { isSuccess: false, error, stakingList: [] };
	}
};

export const getAvailableStake = async () => {
	try {
		const stakeContract = await getStakeContract();
		if (stakeContract) {
			try {
				const stakingBalance = await stakeContract
					.stakingBalance(window.tronWeb.defaultAddress.base58)
					.call();
				if (stakingBalance) {
					return { isSuccess: true, stakingBalance };
				} else {
					return { isSuccess: false };
				}
			} catch (error) {
				console.log("error: ", error);
				return { isSuccess: false };
			}
		} else {
			return { isSuccess: false };
		}
	} catch (error) {
		return { isSuccess: false, error };
	}
};

const convertTimestampToCustomFormat = (timestamp) => {
	const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds

	// Configure date format
	const dateFormat = new Intl.DateTimeFormat("en-US", {
		month: "short", // Abbreviated month name
		day: "2-digit",
		year: "numeric",
	});

	// Configure time format
	const timeFormat = new Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true, // 24-hour format
	});

	const formattedDate = dateFormat.format(date);
	const formattedTime = timeFormat.format(date);

	return { formattedDate, formattedTime };
};
