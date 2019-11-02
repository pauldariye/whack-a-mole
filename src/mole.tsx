import { h } from "preact";
import { useContext, useState } from "preact/hooks";
import styled, { keyframes } from "styled-components";
import { GameContext } from ".";
import MoleSprite from "./mole-sprite";
import { setRandomNumberByRange, useInterval } from "./_utils";

const Mole = (props: IProps) => {
	const [isActive, setActiveState] = useState(true), // default should be false
		[delay, setDelay] = useState(setRandomNumberByRange(1500, 3000)),
		[isRunning, setIsRunning] = useState(true),
		[context] = useContext(GameContext),
		{ timeRemaining, playerScore, updateScore, setCountdownState, isMuted } = context,
		{ id } = props;

	useInterval(
		() => {
			// setActiveState(!isActive);
			setCountdownState(true);
		},
		isRunning ? delay : null
	);

	// Hide all moles for good when time is up
	if (timeRemaining === 0) {
		// setIsRunning(false);
		// setActiveState(false);

		// Play game over sound (just the once, not once per mole)
		if (id === "mole-1" && !isRunning && !isMuted) {
			setTimeout(() => {
				const gameoverAudio = document.getElementById(`gameover-sfx${setRandomNumberByRange(1, 5)}`) as HTMLAudioElement;
				if (gameoverAudio) {
					gameoverAudio.currentTime = 0;
					gameoverAudio.play();
				}
			}, 300);
		}
	}

	// Player has successfully whacked a mole
	function moleHit(e: MouseEvent | TouchEvent) {
		// Prevent click/tap spamming
		if (isActive) {
			// Visual feedback to user they hit a mole
			showStars(e);

			// Audio feedback to the user they hit a mole
			if (!isMuted) {
				const hitAudio = document.getElementById(`hit-sfx${setRandomNumberByRange(1, 16)}`) as HTMLAudioElement;
				hitAudio.currentTime = 0;
				hitAudio.play();
			}

			// Increase player's score
			updateScore(playerScore + 1);

			// Have mole descend back underground
			setActiveState(false);

			// For each successful whack, make this mole faster
			const newDelay = 1 - 0.015 * playerScore;

			// Update time taken for mole to re-appear
			setDelay(setRandomNumberByRange(1800 * newDelay, 3300 * newDelay));
		}
	}

	// Show stars when a mole is hit
	function showStars(e: MouseEvent | TouchEvent) {
		const starsElement = document.getElementById(id),
			posX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX, // clientX is handled differently on MouseEvent & TouchEvent
			posY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY; // clientY is handled differently on MouseEvent & TouchEvent

		if (starsElement) {
			// Position stars where user hit the mole
			starsElement.setAttribute("style", `left: calc(${posX}px - 4rem); top: calc(${posY}px - 2rem); z-index: ${playerScore + 1}`);
			starsElement.setAttribute("data-active", "");

			// Reset ability to animate once animation is complete
			starsElement.addEventListener("animationend", () => {
				starsElement.removeAttribute("data-active");
			});
		}
	}

	return (
		<MoleLabel>
			<MoleCheckbox type="checkbox" checked={!isActive} disabled={!isActive} />
			<MoleBody onMouseDown={e => moleHit((e as unknown) as MouseEvent)} onTouchStart={e => moleHit((e as unknown) as TouchEvent)}>
				<MoleSprite isHit={!isActive} />
			</MoleBody>
			<SeeingStars id={id} angle={setRandomNumberByRange(-20, 20)}>
				<Star type="left">
					<svg xmlns="http://www.w3.org/2000/svg" width="86.639" height="75.699" viewBox="0 0 86.639 75.699">
						<g>
							<path
								fill="#fffc00"
								d="M69.945 37.565c-2.105-1.452-4.395-2.245-6.96-2.88-1.521-.376-2.619-1.643-3.841-2.4-1.433.026-1.788-.096-2.64-.24.005-1.083-2.108-1.661-.72-2.64-.873-.118-.837-.718-.96-1.2-1.518-5.947-2.536-13.564-5.28-19.44-2.47 2.971-4.5 6.38-6.72 9.6-.043-.15-.141-.251-.24 0-1.246 3.134-5.62 6.975-8.16 10.08-.283.276-.849.271-1.439.24-.557.284.505 1.52 0 1.68-2.011 1.204-5.941.582-8.16.24-.002.418-.104.404-.48.48-4.864.979-9.35.765-13.92 2.88 2.83 1.25 4.461 3.7 8.16 4.08 1.108 1.352 2.859 1.7 4.32 2.64 2.362 1.52 4.078 3.67 6.479 5.04 1.537.877 2.627 1.766 2.88 3.6-1.814 1.705-3.069 3.97-5.04 5.52.313.948-.88.581-.239 1.2-1.496 1.32-3.258 3.823-4.561 5.76-.359.535-1.352 1.479-.72 1.92.925-1.012 2.219-1.659 3.36-2.4 1.221-.793 2.385-1.643 3.6-2.4.688-.429 1.725-.624 2.16-1.44 2.456-.902 3.931-1.902 6.479-3.84 1.953-.296 3.374-2.229 5.28-2.16 1.247.045 1.426 1.027 2.64 1.2.049.912 1.01.911.96 1.92 3.689 2.533 7.409 6.728 12 9.12-1.374-5.586-2.678-11.242-5.04-15.84.77-.191.543-1.378 1.2-1.68 3.114-.366 6.192-2.125 9.84-2.88 3.661-.757 7.481-1.498 11.04-2.4-.653-.816-1.744-1.204-2.64-1.68-.974-.518-1.729-1.053-2.638-1.68z"
							/>
							<path d="M85.305 42.125c-.663-.937-1.504-1.696-2.16-2.64-3.573-1.626-6.825-3.575-10.56-5.04-2.405-2.714-6.358-3.881-10.32-5.04-.585-.67-1.424.582-1.92 0-1.173-7.143-3.476-14.813-5.76-21.6-1.328-1.655-1.962-3.171-2.64-5.04-1.83-.302-2.141-1.168-4.08-.96-.438.909-1.828 1.921-1.44 2.88-3.149 3.01-5.601 6.719-7.68 10.8-1.746 1.704-3.009 3.853-4.561 5.76-1.54 1.894-3.015 3.876-4.56 5.76-2.052.045-4.219-.094-5.76-.24-6.396-.604-12.043 2.315-17.521 2.88-1.66.171-3.09-.021-3.84.48-.747.498-.944.951-1.2 1.68.28 1 1.354 1.206 1.44 2.4 3.92 1.925 6.806 3.381 9.359 5.76 4.985 1.895 9.479 4.282 12.48 8.16-.669.973-1.607 1.862-2.4 2.88-.734.943-1.802 2.001-1.68 3.12-1.298.125-1.489 1.822-2.16 3.36-2.706 2.139-3.299 5.295-6 7.68.158.877-.52.92-.479 1.68-1.491.989-2.386 2.575-3.36 4.08.39-.072.647.324.24.48.02-.374-.698-.167-.24 0 1.364.707.233 1.314.96 2.399.603.629 1.792-.723 1.68.72 2.516.023 3.712-.479 5.761-1.439 3.289-1.542 6.468-3.493 8.88-5.483C30.161 65.271 36.188 61 40.425 59h1.44c.627 0 .735-.901 1.439-.997 2.519 1.824 5.684 4.076 7.92 5.981 2.533 2.157 5.63 4.192 8.16 5.991.844.599 1.9 1.717 2.641 1.916.316.085.059.373.239.477 1.144.664 2.807.278 4.08-.001.931-2.247-.932-4.161-1.68-6-1.008-2.477-1.754-5.38-2.4-7.44-.848-2.703-1.298-5.293-2.16-7.92 2.338-1.71 5.653-1.885 8.881-2.64 5.337-1.248 11.007-3.145 16.08-4.32-.053-.775.424-1.017.24-1.922zm-21.12 1.2c-3.647.755-6.726 2.514-9.84 2.88-.657.302-.431 1.489-1.2 1.68 2.362 4.598 3.666 10.254 5.04 15.84-4.591-2.392-8.311-6.586-12-9.12.05-1.009-.911-1.008-.96-1.92-1.214-.173-1.393-1.155-2.64-1.2-1.906-.069-3.327 1.864-5.28 2.16-2.549 1.938-4.023 2.938-6.479 3.84-.436.816-1.473 1.011-2.16 1.44-1.215.757-2.379 1.607-3.6 2.4-1.142.741-2.436 1.388-3.36 2.4-.632-.441.36-1.385.72-1.92 1.303-1.937 3.064-4.439 4.561-5.76-.641-.619.552-.252.239-1.2 1.971-1.55 3.226-3.815 5.04-5.52-.253-1.834-1.343-2.723-2.88-3.6-2.401-1.37-4.117-3.521-6.479-5.04-1.461-.939-3.212-1.288-4.32-2.64-3.699-.38-5.33-2.83-8.16-4.08 4.57-2.115 9.056-1.901 13.92-2.88.376-.076.479-.062.48-.48 2.219.341 6.149.964 8.16-.24.505-.161-.557-1.396 0-1.68.591.032 1.156.037 1.439-.24 2.54-3.105 6.914-6.946 8.16-10.08.1-.251.197-.15.24 0 2.22-3.22 4.25-6.629 6.72-9.6 2.744 5.876 3.763 13.494 5.28 19.44.123.481.087 1.082.96 1.2-1.389.979.725 1.557.72 2.64.852.144 1.207.266 2.64.24 1.222.757 2.32 2.024 3.841 2.4 2.565.635 4.854 1.429 6.96 2.88.909.627 1.664 1.161 2.64 1.68.896.477 1.986.864 2.64 1.68-3.561.902-7.381 1.643-11.042 2.4z" />
						</g>
					</svg>
				</Star>
				<Star type="middle">
					<svg xmlns="http://www.w3.org/2000/svg" width="86.639" height="75.699" viewBox="0 0 86.639 75.699">
						<g>
							<path
								fill="#fffc00"
								d="M60 29.887v-.002l-.043.002c-.052-.829-.99-.785-1.214-1.44-1.457.087-1.658-1.271-2.61-1.285a1.37 1.37 0 00-.465.085c.061-.7-.667-.828-.667-1.2v-1.68c-2-2.25-3.234-4.387-4.855-6.48-1.671-2.157-3.028-4.688-5.314-6.224-.701 2.229-2.005 3.985-3.128 5.744-1.176 1.842-2.065 3.704-3.127 5.76-.465.9-.887 3.25-1.923 4.32-6.463.402-15.6 1.463-22.561 2.88 2.102.975 4.56 2.514 7.438 3.84 2.589 1.193 5.657 2.364 7.68 3.84 1.498 1.094 3.594 3.347 4.08 4.56.763 1.91-1.24 2.519-.24 4.32-3.244 4.642-5.57 8.863-8.4 13.68 2.074-.925 4.638-1.79 6.48-2.88.49-.29.891-1.059 1.439-1.44 3.088-2.146 6.167-4.033 9.12-6 2.075-1.382 3.859-3.183 6.48-2.4 3.073 4.926 9.79 6.209 13.68 10.32 1.696-5.296-2.914-11.986-.48-16.32.457.45.604.026 1.2 0 .752-.975 1.44-2.485 2.4-3.6.105-.123.411.309.479.24.111-.111-.311-.426-.239-.48.298-.228.483.043.72-.24.982-1.177 2.125-2.898 3.6-4.56 1.332-1.5 2.746-3.087 4.108-4.56-5.701.233-9.638.611-13.638 1.2z"
							/>
							<path d="M82.968 24.606c-.883-.683-1.809-1.617-2.4-1.92-3.961.453-8.959.955-12.72 1.2-3.162.206-6.218-.144-8.16.72-.856-2.411-2.802-5.262-5.04-8.16-2.048-2.651-4.515-5.309-6-7.44-.678-.972-1.19-2.958-2.16-3.6-1.722-1.141-3.043.458-4.08.24-2.401 4.098-4.535 6.767-6.239 10.08-.389.988-1.18 1.965-1.681 3.12-.448.427.195.61 0 1.44-.946.414-.978 1.742-1.68 2.4-6.476 1.042-14.445 1.813-21.36 3.12-1.068.811-.889 1.964-2.88 2.16-.268.692-.446 1.474-1.2 1.68 1.976 3.035 5.076 4.682 8.16 6.48 1.584.923 3.218 1.649 4.8 2.4 3.134 1.487 6.771 2.873 8.641 5.76-.799.081-.78.98-1.68.96-3.274 5.137-7.084 9.717-9.36 15.6-.808.333-1.265 1.017-.96 2.16.853.373.145-.815.72-.72-.416 1.233-.01 2.347-.96 2.64 1.378.938 2.248 2.513 4.08 2.64 1.94.134 3.715-1.864 5.52-1.44 2.863-1.886 6.819-3.383 9.841-5.28 1.091-.685 2.655-2.407 3.12-1.92 2.335-2.065 5.175-3.625 7.92-5.28 3.673 3.606 9.174 5.386 12.479 9.36 3.162.238 4.581 2.83 7.44.96 1.26-5.987-.287-12.961-1.44-18.96 1.14-.094 1.174-.049 2.16-.48 2.688-3.408 5.406-7.567 8.88-11.04 2.544-2.544 7.312-4.511 6.239-8.88zm-72.48 3.361h-.479v-.48h.479v.48zm59.04 5.436c-1.475 1.662-2.617 3.305-3.6 4.481-.236.283-.422-.027-.72.201-.071.054.351.35.239.461-.068.069-.374-.373-.479-.25-.96 1.115-1.648 2.621-2.4 3.595-.597.026-.743.447-1.2-.002-2.434 4.333 2.177 11.023.48 16.319-3.89-4.11-10.606-5.395-13.68-10.321-2.621-.783-4.405 1.018-6.48 2.4-2.953 1.967-6.032 3.853-9.12 6-.549.381-.949 1.15-1.439 1.44-1.843 1.09-4.406 1.955-6.48 2.88 2.83-4.816 5.156-9.038 8.4-13.68-1-1.802 1.003-2.41.24-4.32-.485-1.213-2.582-3.466-4.08-4.56-2.023-1.476-5.092-2.647-7.681-3.84-2.879-1.326-5.338-2.865-7.439-3.84 6.961-1.417 16.097-2.478 22.56-2.88 1.036-1.07 1.455-3.42 1.92-4.32 1.063-2.056 1.944-3.918 3.12-5.76 1.126-1.763 2.421-3.523 3.12-5.76l.022.017c2.286 1.536 3.644 4.067 5.314 6.224C51.766 19.98 53 22.116 55 24.367v1.68c0 .372.725.5.664 1.2.173-.061.324-.086.461-.085.959.013 1.203 1.373 2.66 1.285.225.655 1.215.612 1.215 1.438v.002c4-.589 7.908-.887 13.607-.887h.007c-1.363 1-2.754 2.903-4.086 4.403z" />
						</g>
					</svg>
				</Star>
				<Star type="right">
					<svg xmlns="http://www.w3.org/2000/svg" width="86.639" height="75.699" viewBox="0 0 86.639 75.699">
						<g>
							<path
								fill="#fffc00"
								d="M62.465 28.847c-1.116.267-2.279.988-3.36.96-1.605-.043-3.972-1.401-3.119-3.6-2.922-2.597-4.428-6.449-7.2-9.121-2.182-2.101-4.583-3.788-6.721-6-.307-.013-.332-.307-.72-.239-.702 2.114-1.747 3.651-2.399 5.76-.727 2.346-1.596 5.347-2.16 6.96-.54 1.541-1.188 2.763-1.681 4.08-.628 1.678-.686 4.094-2.64 4.8-1.591-.554-2.373-.614-3.12-2.159-4.91-1.059-10.878-1.287-16.56.479.601.882 1.779 1.054 2.64 1.44 4.941 2.218 9.314 4.878 11.521 9.6-.218 1.637.489 3.175.239 4.56-.226 1.25-1.191 2.036-1.68 3.12-.381.846-.593 1.963-.96 2.88a265.351 265.351 0 00-3.36 8.88c3.285-1.953 5.764-4.092 8.88-6 1.723-1.054 3.588-1.787 5.761-2.88 1.59-.8 4.257-2.895 5.76-2.88-.137-.002.29.432.479.48 1.896.486 2.627.867 4.08 1.439 5.488 2.164 11.073 4.057 15.36 7.2 1.78 1.306 3.124 3.255 5.28 3.84.123-1.503.382-3.392 0-5.04-.252-1.086-1.031-2.256-1.44-3.359-1.376-3.713-2.114-7.627-3.359-10.801.516-1.028.156-1.73.479-2.64 1.292-2.192 3.007-4.849 5.521-6.479.903-2.311 3.854-3.805 4.079-6-4.15-.037-7.202.147-9.6.72z"
							/>
							<path d="M80.225 23.567c-1.083-.141-2.07-.9-3.359-.96-.775-.036-1.608.417-2.4.479-3.538.283-7.611-.422-11.04 0-.741.092-1.49.414-2.16.48-.511.051-.441-.473-.72-.48-.61-.017-1.077 1.127-1.68.48-.406-2.553-1.466-3.767-2.88-5.76-2.538-3.576-5.062-5.536-8.16-8.4-2.639-2.438-5.079-5.379-7.92-4.56-.014-.146-.036-.284-.24-.24-.414.786-.942 1.458-1.68 1.92-2.603 6.212-4.192 12.513-7.2 18.96-4.09-.355-7.724-1.296-11.761-.96-4.538.378-8.246 2.662-12.239 2.88-.769 1.296-2.46 1.165-2.88 2.4-.62 1.819.736 3.155 1.68 3.84 2.272 1.648 5.981 2.285 9.36 3.84.548.252 1.033.846 1.68 1.2.573.315 1.42.382 1.92.72 1.153.781 4.477 4.051 4.56 5.28.085 1.237-1.881 3.996-2.159 5.04-.07.264-.43.117-.48.24-.895 2.143-1.3 4.354-2.16 6.479-.894 2.21-1.996 4.334-2.64 6.72.888 1.744 1.483 3.732 3.359 4.08 1.296.24 1.978-.313 3.36-.959 3.169-1.484 6.274-3.507 8.64-5.041 4.349-2.819 8.251-4.555 11.521-6.479 6.375 3.222 13.689 5.349 18.479 9.6.961.853 2.207 1.606 3.12 2.16.158.096.371.662.48.72.61.324 1.649-.264 1.68.721 1.784-.87 2.688-.242 4.08-.24 1.3-1.4 1.424-3.4 2.16-5.76-1.053-4.463-2.189-9.025-4.32-12.961.771.08.088-.883 0-1.199-.461-1.672-.968-3.688-1.68-4.801 1.75-.49 1.732-2.747 3.6-3.119 1.984-3.021 5.16-6.7 7.681-9.6 1.061-1.221 2.427-2.141 2.64-3.361.212-1.229-1.018-2.173-.242-3.359zm-12.24 10.56c-2.514 1.631-4.229 4.287-5.521 6.479-.323.909.036 1.611-.479 2.64 1.245 3.174 1.983 7.088 3.359 10.801.409 1.104 1.188 2.273 1.44 3.359.382 1.648.123 3.537 0 5.04-2.156-.585-3.5-2.534-5.28-3.84-4.287-3.144-9.872-5.036-15.36-7.2-1.453-.572-2.185-.953-4.08-1.439-.189-.049-.616-.482-.479-.48-1.503-.015-4.17 2.08-5.76 2.88-2.173 1.093-4.038 1.826-5.761 2.88-3.116 1.908-5.595 4.047-8.88 6a269.807 269.807 0 013.36-8.88c.367-.917.579-2.034.96-2.88.488-1.084 1.454-1.87 1.68-3.12.25-1.385-.457-2.923-.239-4.56-2.206-4.722-6.579-7.382-11.521-9.6-.86-.387-2.039-.559-2.64-1.44 5.682-1.767 11.649-1.538 16.56-.479.747 1.545 1.529 1.605 3.12 2.159 1.954-.706 2.012-3.122 2.64-4.8.493-1.317 1.141-2.539 1.681-4.08.564-1.613 1.434-4.614 2.16-6.96.652-2.108 1.697-3.646 2.399-5.76.388-.067.413.227.72.239 2.138 2.212 4.539 3.899 6.721 6 2.772 2.672 4.278 6.524 7.2 9.121-.853 2.198 1.514 3.557 3.119 3.6 1.081.028 2.244-.693 3.36-.96 2.398-.573 5.45-.757 9.6-.72-.224 2.196-3.175 3.69-4.079 6z" />
						</g>
					</svg>
				</Star>
			</SeeingStars>
			<MolehillWrapper>
				<Molehill />
			</MolehillWrapper>
		</MoleLabel>
	);
};

const MoleLabel = styled.label`
	height: 100%;
	place-self: end center;
`;

const MoleCheckbox = styled.input`
	opacity: 0;
	position: absolute;
	z-index: -1;

	&::before {
		background: red;
		bottom: 0;
		content: "";
		display: block;
		height: 100px;
		position: absolute;
		width: 200px;
	}
`;

const MoleBody = styled.div`
	background: radial-gradient(#767676, #525252);
	border-radius: 5rem 5rem 0 0;
	cursor: pointer;
	height: 100%;
	max-width: 12rem;
	min-width: 8rem;
	overflow: hidden;
	width: calc(15vw + 5rem);

	input + & {
		transform: translate3d(0, 0, 0);
		transition: transform 150ms;
	}

	input:checked + & {
		/* transform: translate3d(0, 100%, 0); */
	}
`;

const hit = keyframes`
	from {
		opacity: 1;
	}

	to {
		opacity: 0;
	}
`;

const SeeingStars = styled.div<ISeeingStars>`
	align-items: center;
	display: flex;
	height: 3rem;
	justify-content: center;
	opacity: 0;
	pointer-events: none;
	position: absolute;
	width: 9rem;

	&[data-active] {
		animation: ${hit} 0.3s linear;
		transform: rotate(${(props: ISeeingStars) => props.angle}deg);
	}
`;

const animateLeftStar = keyframes`
	from {
		opacity: 1;
		transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
	}

	to {
		opacity: 0;
		transform: translate3d(-150%, 0, 0) rotate(270deg) scale(0);
	}
`;

const animateMiddleStar = keyframes`
	from {
		opacity: 1;
		transform: rotate(0deg) scale(1);
	}

	to {
		opacity: 0;
		transform: rotate(270deg) scale(0);
	}
`;

const animateRightStar = keyframes`
	from {
		opacity: 1;
		transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
	}

	to {
		opacity: 0;
		transform: translate3d(150%, 0, 0) rotate(270deg) scale(0);
	}
`;

const Star = styled.span<IStar>`
	display: block;
	height: ${(props: IStar) => (props.type === "middle" ? "4rem" : "2rem")};
	margin: 0 0.25rem;
	width: ${(props: IStar) => (props.type === "middle" ? "4rem" : "2rem")};

	svg {
		height: 100%;
		width: 100%;
	}

	div[data-active] & {
		animation: ${(props: IStar) => {
				if (props.type === "left") {
					return animateLeftStar;
				}

				if (props.type === "middle") {
					return animateMiddleStar;
				}

				if (props.type === "right") {
					return animateRightStar;
				}
			}}
			0.3s linear;
	}
`;

const MolehillWrapper = styled.div`
	position: relative;
`;

// TODO - animate in path/fill
const Molehill = styled.div`
	background: #5e3601;
	bottom: -2px;
	left: -10%;
	padding-top: 25%;
	position: absolute;
	width: 120%;
`;

interface IStar {
	type: string;
}

interface ISeeingStars {
	angle: number;
}

interface IProps {
	id: string;
}

export default Mole;
