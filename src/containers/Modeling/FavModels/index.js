import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CarouselItem from "@containers/Modeling/FavModels/CarouselItem";
import { makeStyles } from "@material-ui/core/styles";
import { menuSelector } from "@slices/menuToggleSlice";
import { useSelector } from "react-redux";

const responsive = {
	superLargeDesktop: {
		// the naming can be any, depends on you.
		breakpoint: { max: 4000, min: 3000 },
		items: 5,
	},
	desktop: {
		breakpoint: { max: 3000, min: 1024 },
		items: 2,
		slidesToSlide: 2,
	},
	tablet: {
		breakpoint: { max: 1024, min: 464 },
		items: 2,
	},
	mobile: {
		breakpoint: { max: 464, min: 0 },
		items: 1,
	},
};

const ArrowFix = (arrowProps) => {
	const { carouselState, children, ...restArrowProps } = arrowProps;
	return <span {...restArrowProps}> {children} </span>;
};

const useStyles = makeStyles((theme) => ({
	carouselContainer: {
		marginRight: `-10px`,
		padding: `5px 0 0 10px`,
		overflow: "hidden",
		minHeight: 332,
		// marginBottom: `-69px`,

		[theme.breakpoints.down("md")]: {
			paddingTop: 20,
		},

		"& .react-multiple-carousel__arrow::before": {
			display: "none",
		},

		"& .react-multiple-carousel__arrow": {
			display: "flex",
			justifyContent: "center",
		},

		"& .react-multi-carousel-item": {
			transition: "width 0.3s ease-in-out",
		},
	},
}));

function FavModels({ models }) {
	const classes = useStyles();
	const { open } = useSelector(menuSelector);

	return (
		<div className={classes.carouselContainer}>
			<Carousel
				customLeftArrow={
					<ArrowFix>
						<div
							className="react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
							style={{
								fontSize: 0,
								lineHeight: 0,
							}}
						>
							<img
								src="right-arrow.svg"
								style={{
									transform: "scale(-1)",
									marginLeft: "-3px",
								}}
							/>
						</div>
					</ArrowFix>
				}
				customRightArrow={
					<ArrowFix>
						<div
							className="react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
							style={{
								fontSize: 0,
								lineHeight: 0,
							}}
						>
							<img
								src="right-arrow.svg"
								style={{
									marginLeft: "3px",
								}}
							/>
						</div>
					</ArrowFix>
				}
				additionalTransfrom={0}
				showDots={false}
				responsive={responsive}
				customTransition="all .5"
				transitionDuration={500}
				autoPlaySpeed={1000}
				keyBoardControl={true}
				autoPlay={false}
				shouldResetAutoplay={false} // in update version shouldResetAutoplay and autoplaySpeed is required to false so it won't autoplay the carousel
				containerClass="carousel-container"
				removeArrowOnDeviceType={["tablet", "mobile"]}
				dotListClass="custom-dot-list-style"
				itemClass="carousel-item-padding-40-px"
				key={open}
			>
				{(models || []).map((data, i) => (
					<CarouselItem key={i} item={data} />
				))}
			</Carousel>
		</div>
	);
}

export default FavModels;
