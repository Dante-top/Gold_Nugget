import "./index.scss";
import { useEffect, useState } from "react";
import { getMintedList, getStakingList } from "../web3/web3";
import MintedCard from "../MintedCard";
import StakedCard from "../StakedCard";

const Stake = ({ tronLinkStatus, address }) => {
	const [isMintedDataLoading, setIsMintedDataLoading] = useState(false);
	const [isStakedDataLoading, setIsStakedDataLoading] = useState(false);
	const [mintedLoadMoreItems, setMintedLoadMoreItems] = useState(5);
	const [stakedLoadMoreItems, setStakedLoadMoreItems] = useState(5);
	const [isLoadMoreDataLoading, setIsLoadMoreDataLoading] = useState(false);
	const [isLoadMoreStakedDataLoading, setIsLoadMoreStakedDataLoading] =
		useState(false);
	const [mintedCardList, setMintedCardList] = useState([]);
	const [stakedCardList, setStakedCardList] = useState([]);
	const [totalStaked, setTotalStaked] = useState(0);
	const [totalMinted, setTotalMinted] = useState(0);

	useEffect(() => {
		if (tronLinkStatus.installed && tronLinkStatus.unlocked) {
			const setAllData = async () => {
				await setMintedNFTData(address, 5);
				await setStakedNFTData(address, 5);
			};
			setAllData();
		}
	}, [tronLinkStatus]);

	const setStakedNFTData = async (address, limit) => {
		setIsStakedDataLoading(true);
		const resData = await getStakingList(address, limit);
		if (resData.isSuccess) {
			setIsStakedDataLoading(false);
			setTotalStaked(resData.countItem);
			setStakedCardList([
				...stakedCardList,
				{ id: stakedCardList.length + 1 },
				{ stakedData: resData.stakingList },
			]);
		} else {
			setIsStakedDataLoading(false);
		}
	};

	const setMintedNFTData = async (address, limit) => {
		setIsMintedDataLoading(true);
		const resData = await getMintedList(address, limit);
		if (resData.isSuccess) {
			setIsMintedDataLoading(false);
			setTotalMinted(resData.countItem);
			setMintedCardList([
				...mintedCardList,
				{ id: mintedCardList.length + 1 },
				{ mintedData: resData.mintedList },
			]);
		} else {
			setIsMintedDataLoading(false);
		}
	};

	const loadMoreMintedItems = async () => {
		const newMintedItems = mintedLoadMoreItems + 5;
		setIsLoadMoreDataLoading(true);
		const resData = await getMintedList(address, newMintedItems);
		if (resData.isSuccess) {
			setIsLoadMoreDataLoading(false);
			setMintedCardList([
				...mintedCardList,
				{ id: mintedCardList.length + 1 },
				{ mintedData: resData.mintedList },
			]);
		} else {
			setIsLoadMoreDataLoading(false);
		}
		setMintedLoadMoreItems(newMintedItems);
	};

	const loadMoreStakedItems = async () => {
		const newStakedItems = stakedLoadMoreItems + 5;
		setIsLoadMoreStakedDataLoading(true);
		const resData = await getStakingList(address, newStakedItems);
		if (resData.isSuccess) {
			setIsLoadMoreStakedDataLoading(false);
			setStakedCardList([
				...stakedCardList,
				{ id: stakedCardList.length + 1 },
				{ stakedData: resData.stakingList },
			]);
		} else {
			setIsLoadMoreStakedDataLoading(false);
		}
		setStakedLoadMoreItems(newStakedItems);
	};

	return (
		<div className="p-3">
			<div className="stake-content d-flex flex-column">
				<div className="d-flex justify-content-between align-items-center text-white p-2 stake-title">
					<h1 className="stake-title">Available NFT's</h1>
					<div className="d-flex flex-column justify-content-center align-items-end">
						<h2 className="title-remain">Total Available: {totalMinted}</h2>
						<h2 className="title-remain">Total Staked: {totalStaked}</h2>
					</div>
				</div>
				<div className="stake-main-content d-flex flex-column">
					{isMintedDataLoading ? (
						<div className="text-center p-5">
							<div
								className="spinner-border text-white nftdata-spinner"
								role="status"
							>
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : (
						<>
							{mintedCardList.map((component, index) => (
								<MintedCard
									key={index}
									id={component.id}
									mintedData={component.mintedData}
								/>
							))}

							{mintedLoadMoreItems < totalMinted && (
								<div className="w-100 text-center my-5">
									{!isLoadMoreDataLoading ? (
										<button
											className="btn-load-more"
											onClick={() => loadMoreMintedItems()}
										>
											Load More
										</button>
									) : (
										<button className="btn-load-more">
											<div className="spinner-border text-white" role="status">
												<span className="visually-hidden">Loading...</span>
											</div>
										</button>
									)}
								</div>
							)}
						</>
					)}
					<hr className="divide-line" />
					{isStakedDataLoading ? (
						<div className="text-center p-5">
							<div
								className="spinner-border text-white nftdata-spinner"
								role="status"
							>
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : (
						<>
							{stakedCardList.map((component, index) => (
								<StakedCard
									key={index}
									id={component.id}
									stakedData={component.stakedData}
								/>
							))}

							{stakedLoadMoreItems < totalStaked && (
								<div className="w-100 text-center my-5">
									{!isLoadMoreStakedDataLoading ? (
										<button
											className="btn-load-more"
											onClick={() => loadMoreStakedItems()}
										>
											Load More
										</button>
									) : (
										<button className="btn-load-more">
											<div className="spinner-border text-white" role="status">
												<span className="visually-hidden">Loading...</span>
											</div>
										</button>
									)}
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Stake;
