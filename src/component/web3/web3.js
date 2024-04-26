import TronWeb from "tronweb";
import { ToastErrMsg } from "../Toast";

const FullNode = "https://api.trongrid.io";
const SolidityNode = "https://api.trongrid.io";
const EventServer = "https://api.trongrid.io";
const privateKey = process.env.REACT_APP_PRIVATE_KEY;

// Initialize TronWeb
// const tronWeb = new TronWeb({
// 	fullHost: FullNode,
// 	headers: { "TRON-PRO-API-KEY": apiKey }, // This is a hypothetical example; adjust based on actual API requirements
// });

const tronWeb = new TronWeb(FullNode, SolidityNode, EventServer);

const tokenContractAddress = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || "";
const nftContractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS || "";
const stakeContractAddress = process.env.REACT_APP_STAKE_CONTRACT_ADDRESS || "";

const getTokenContract = async () => {
	if (window) {
		try {
			if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
				const tokenContract = await window.tronWeb
					.contract()
					.at(tokenContractAddress);
				return tokenContract;
			}
		} catch (error) {}
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

export const getAvailableToken = async () => {
	let balance = 0;
	try {
		const tokenContract = await getTokenContract();
		if (tokenContract) {
			try {
				balance = await tokenContract
					.balanceOf(window.tronWeb.defaultAddress.base58)
					.call();
				if (balance) {
					return { isSuccess: true, balance: balance.toString() };
				}
			} catch (error) {
				return { isSuccess: false, balance: 0 };
			}
		}
	} catch (error) {
		return { isSuccess: false, balance: 0 };
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
					for (let i = 0; i < goldTokenOwnersList[0].length; i++) {
						const owner = tronWeb.address.fromHex(goldTokenOwnersList[0][i]);
						const tokenAmount = goldTokenOwnersList[1][i].toString();
						const rewardTime = convertTimestampToFormattedDate(
							goldTokenOwnersList[2][i].toString()
						);
						ownersList.push({ owner, tokenAmount, rewardTime });
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
				try {
					const stakeContract = await getStakeContract();
					if (stakeContract) {
						try {
							// eslint-disable-next-line
							const stakeTx = await stakeContract
								.stakeNFT(tokenId)
								.send({ from: nftContractAddress, callValue: 0 });
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
	} catch (error) {
		return { isSuccess: false, error: error };
	}
};

export const unStakeNFT = async (tokenId) => {
	const unStakingFee = 10000000;

	try {
		const stakeContract = await getStakeContract();
		const address = window.tronWeb.defaultAddress.base58;
		const balance = await window.tronWeb.trx.getBalance(address);
		if (balance > unStakingFee) {
			if (stakeContract) {
				try {
					// eslint-disable-next-line
					const unStakeTx = await stakeContract
						.unStakeNFT(tokenId)
						.send({ from: stakeContractAddress, callValue: unStakingFee });
					return { isSuccess: true, tokenId: tokenId };
				} catch (error) {
					return { isSuccess: false, error: error };
				}
			}
		} else {
			ToastErrMsg("Insufficient funds for unstaking!");
			return { isSuccess: false };
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
				if (balance.toString() !== 0) {
					for (let i = 0; i < balance.toString(); i++) {
						try {
							const mintedNFT = await nftContract
								.tokenOfOwnerByIndex(window.tronWeb.defaultAddress.base58, i)
								.call();
							if (mintedNFT) {
								const metaData = await getMintedNFTData(mintedNFT.toString());
								mintedList.push({
									tokenId: metaData.tokenId,
									tokenURI: metaData.tokenURI,
									// nftImage: metaData.nftImage,
									// rarityData: metaData.rarityData,
								});
							}
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
							const nftMetadata = await getMintedNFTData(stakedId);
							stakingList.push({
								stakedId,
								tokenURI: nftMetadata.tokenURI,
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

const getMintedNFTData = async (tokenId) => {
	try {
		const nftContract = await getNFTContract();
		if (nftContract) {
			const tokenURI = await nftContract.tokenURI(tokenId).call();
			if (tokenURI != null) {
				return { tokenId, tokenURI };
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

const convertTimestampToFormattedDate = (timestamp) => {
	const date = new Date(timestamp * 1000); // Assuming timestamp is in seconds
	const months = date.getMonth() + 1; // getMonth() returns month from 0-11
	const days = date.getDate();
	let hours = date.getHours();
	const minutes = date.getMinutes();

	const minutesStr = minutes < 10 ? "0" + minutes : minutes;
	const monthsStr = months < 10 ? "0" + months : months;
	const daysStr = days < 10 ? "0" + days : days;

	return `${monthsStr}/${daysStr}, ${hours}:${minutesStr}`;
};
