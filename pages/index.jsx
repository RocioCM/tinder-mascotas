import { useState } from 'react';
import Carousel, { CarouselItem } from '../components/Carousel/Carousel';
import WelcomeBar from '../components/WelcomeBar/WelcomeBar';
import { MatchTabNavigator } from '../components/TabNavigator';
import styles from '../styles/Home.module.css';
import { mockedPets, myMockedPets } from '../services/constants';
import PetSelector from '../components/PetSelector/PetSelector';

function Home() {
	const [activePet, setActivePet] = useState(0);

	return (
		<main className={styles.container}>
			<WelcomeBar username='Eren' />
			<Carousel>
				{mockedPets.map(
					(pet, index) => 
					<CarouselItem 
						key={index}
						{...pet}
					/>)
				}
			</Carousel>
			<PetSelector 
				myMockedPets={myMockedPets} 
				activePet={activePet} 
				setActivePet={setActivePet} 
			/>
		</main>
	);
}

Home.TabNavigator = MatchTabNavigator;

export default Home;
