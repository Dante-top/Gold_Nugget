import TronWeb from "tronweb";

const FullNode = "https://api.shasta.trongrid.io";
const SolidityNode = "https://api.shasta.trongrid.io";
const EventServer = "https://api.shasta.trongrid.io";
const privateKey = process.env.REACT_APP_PRIVATE_KEY;

const tronWeb = new TronWeb(FullNode, SolidityNode, EventServer, privateKey);

const tokenContractAddress = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || "";
const nftContractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS || "";
const stakeContractAddress = process.env.REACT_APP_STAKE_CONTRACT_ADDRESS || "";

const getTokenContract = async () => {
	if (tronWeb && tronWeb.defaultAddress.base58) {
		const tokenContract = await tronWeb.contract().at(tokenContractAddress);
		return tokenContract;
	}
};

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

const getTotalSupply = async () => {
	try {
		const nftContract = await getNFTContract();

		if (nftContract) {
			try {
				const result = await nftContract.totalSupply().call();
				return { isSuccess: true, totalSupply: result.toString() };
			} catch (error) {
				return { isSuccess: false, error: error };
			}
		}
	} catch (error) {}
};

export const getOwnersAddress = async () => {
	let ownersList = [];
	try {
		const nftContract = await getNFTContract();
		if (nftContract) {
			try {
				const resTotal = await getTotalSupply();
				if (resTotal) {
					const totalSupply = resTotal.totalSupply;
					for (let i = 0; i < totalSupply; i++) {
						try {
							const tokenId = await nftContract.tokenByIndex(i).call();
							const ownerAddress = await nftContract.ownerOf(tokenId).call();
							if (ownerAddress.toString()) {
								ownersList.push({
									owner: tronWeb.address.fromHex(ownerAddress),
									tokenId: tokenId,
								});
							}
						} catch (error) {
							return { isSuccess: false, error: error };
						}
					}
					return { isSuccess: true, ownersList: ownersList };
				}
			} catch (error) {
				return { isSuccess: false, error: error };
			}
		}
	} catch (error) {}
};

export const stakeNFT = async (tokenId) => {
	try {
		const nftContract = await getNFTContract();
		if (nftContract) {
			try {
				const approveTx = await nftContract
					.approve(stakeContractAddress, tokenId)
					.send({ callValue: 0 });
				console.log("approveTx: ", approveTx);
				const stakeContract = await getStakeContract();
				if (stakeContract) {
					try {
						// eslint-disable-next-line
						const stakeTx = await stakeContract
							.stakeNFT(tokenId)
							.send({ callValue: 0 });
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
		}
	} catch (error) {}
};

export const unStakeNFT = async (tokenId) => {
	try {
		const stakeContract = await getStakeContract();
		if (stakeContract) {
			// eslint-disable-next-line
			const unStakeTx = await stakeContract
				.unStakeNFT(tokenId)
				.send({ callValue: 0 });

			return { isSuccess: true, tokenId: tokenId };
		}
	} catch (error) {
		console.log("error: ", error);
		return { isSuccess: false, error: error };
	}
};

export const claimNFT = async () => {
	try {
		const stakeContract = await getStakeContract();
		if (stakeContract) {
			try {
				const rewardAddress = await stakeContract.getRewardAddress().call();
				if (rewardAddress) {
					try {
						const tokenContract = await getTokenContract();
						if (tokenContract) {
							const rewardRate = 36;
							const transferToken = await tokenContract
								.transfer(rewardAddress, rewardRate)
								.send({ from: tronWeb.defaultAddress.base58, callValue: 0 });
							if (transferToken) {
								return { isSuccess: true };
							}
							// }
						}
					} catch (error) {
						if (error.message) {
							console.log("error: ", error.message);
							return { isSuccess: false, error: error.message };
						} else {
							return { isSuccess: false };
						}
					}
				}
			} catch (error) {
				console.log("error: ", error);
				return { isSuccess: false };
			}
		}
	} catch (error) {}
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
							return { isSuccess: false, error };
						}
					}
					return { isSuccess: true, mintedList };
				}
			} catch (error) {
				console.log("error: ", error);
				return { isSuccess: false, error };
			}
		}
	} catch (error) {}
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
					try {
						for (let i = 0; i < stakedTokenIdLength.toString(); i++) {
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
						}
						return { isSuccess: true, stakingList };
					} catch (error) {
						console.log("error: ", error);
					}
				} else {
					return { isSuccess: false };
				}
			} catch (error) {
				console.log("error: ", error);
			}
		}
	} catch (error) {}
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
				}
			} catch (error) {
				console.log("error: ", error);
				return { isSuccess: false };
			}
		}
	} catch (error) {}
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
