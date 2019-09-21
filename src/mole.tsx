import { h } from "preact";
import { useContext, useState } from "preact/hooks";
import styled, { keyframes } from "styled-components";
import { GameContext } from ".";
import { audioFilePanning, setRandomNumberByRange, useInterval } from "./_utils";

interface IProps {
	id: string;
}

const Mole = (props: IProps) => {
	const [isActive, setActiveState] = useState(false),
		[delay, setDelay] = useState(setRandomNumberByRange(1500, 3000)),
		[isRunning, setIsRunning] = useState(true),
		[context] = useContext(GameContext),
		{ timeRemaining, playerScore, updateScore, setCountdownState } = context;

	useInterval(
		() => {
			setActiveState(!isActive);
			setCountdownState(true);
		},
		isRunning ? delay : null
	);

	// Hide all moles for good when time is up
	if (timeRemaining === 0) {
		setIsRunning(false);
		setActiveState(false);
	}

	// Player has successfully whacks a mole
	function moleHit(e: MouseEvent) {
		// Prevent click/tap spamming
		if (isActive) {
			// Visual feedback to user they hit a mole
			showStars(e);

			// Audio feedback to the user they hit a mole
			const hitAudio = document.getElementById(`hit-sfx${setRandomNumberByRange(1, 2)}`) as HTMLAudioElement;
			audioFilePanning(hitAudio, props.id);

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
	function showStars(e: MouseEvent) {
		const starsElement = document.getElementById(props.id);

		// Position stars where user hit the mole
		starsElement.setAttribute("style", `left: calc(${e.clientX}px - 4rem); top: calc(${e.clientY}px - 2rem); z-index: ${playerScore + 1}`);
		starsElement.setAttribute("data-active", "");

		// Reset ability to animate once animation is complete
		starsElement.addEventListener("animationend", () => {
			starsElement.removeAttribute("data-active");
		});
	}

	return (
		<MoleLabel>
			<MoleCheckbox type="checkbox" checked={!isActive} disabled={!isActive} />
			<MoleSprite onMouseDown={e => moleHit(e as MouseEvent)} onTouchStart={e => moleHit(e as MouseEvent)} />
			<SeeingStars id={props.id} />
		</MoleLabel>
	);
};

const MoleLabel = styled.label`
	height: 100%;
	overflow: hidden;
	place-self: end center;
`;

const MoleCheckbox = styled.input`
	opacity: 0;
	position: absolute;
	z-index: -1;
`;

const MoleSprite = styled.div`
	background: red;
	cursor: pointer;
	height: 100%;
	max-width: 12rem;
	min-width: 8rem;
	width: calc(15vw + 5rem);

	input + & {
		transform: translate3d(0, 0, 0);
		transition: transform 150ms;
	}

	input:checked + & {
		background: blue;
		transform: translate3d(0, 100%, 0);
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

const SeeingStars = styled.div`
	background: green;
	height: 4rem;
	opacity: 0;
	pointer-events: none;
	position: absolute;
	width: 8rem;

	&[data-active] {
		animation: ${hit} 0.3s linear;
	}
`;

export default Mole;
