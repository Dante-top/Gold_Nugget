import "./index.scss";
import Img_TronToken from "../../assets/images/TronToken.jpg";

const Faq = () => {
	const faqData = {
		items: [
			{
				title: "Tokenomics",
				desc: "Gold Nugget has a total supply of 1,000,000. There is only one way to mine 1, you must have a Meme Chicks NFT staked and get lucky! The token supply will take over 19 years to be totally mined out, so there's enough time for everyone to earn Gold Nuggets.",
			},
			{
				title: "Why Stake?",
				desc: "We are creating a platform that revolves around all Tron NFT collections, Once this is built, users will take Gold Nugget and they will receive a 15% share of the platform's Jackpot payouts. These Jackpots are distributed whenever a player successfully rolls the number 777 in a dice roll ranging from 1 to 1000. This presents a significant opportunity for passive income.",
			},
			{
				title: "Proof of Meme",
				desc: "Our system operates by rewarding 1 user who has staked Meme Chicks Nft's. Every 6 hours there is a new opportunity to mine 36 new Gold Nugget tokens. The more NFTs you have staked, the higher your chances of successfully mining the elusive Gold Nugget tokens. The selection of the winning address for each batch of Gold Nugget tokens is determined through a random number generator.",
			},
			{
				title: "Staking Fee",
				desc: "The fee's collected over time will allow for us to keep the project running and continue to build. We will be adding to swap liquidity, paying the running cost, artist and developers. The Fee will also incentivize keeping the NFTs staked, increasing the scarcity of finding a Meme Chick on a NFT marketplace. (The Staking Fee is 10 Tron per NFT)",
			},
		],
	};
	return (
		<div className="p-3 mb-2">
			<div className="faq-content d-flex flex-column">
				<h3 className="faq-title">Lets get the Full Picture...</h3>
				{faqData.items.map((item, index) => (
					<div
						className="faq-col d-flex mb-3 gap-3 align-items-center"
						key={index}
					>
						<img
							src={Img_TronToken}
							className="img-tron"
							alt="Tron Token Img"
						/>
						<div className="faq-desc d-flex flex-column">
							<h5>{item.title}</h5>
							<p className="faq-text">{item.desc}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Faq;
