import styles from './PetSelector.module.css'

export const PetBubble = ({img, name, isActive, setActivePet, index}) => {
	return (
		<div className={styles.petBubble} onClick={() => setActivePet(index)}>
			<img className={[styles.petImg, isActive ? styles.active : ''].join(' ')} src={img} alt={name}/>
			<p className={styles.petName}>{name}</p>
		</div>
	)
}

const PetSelector = ({myMockedPets, activePet, setActivePet}) => {
	return(
		<div className={styles.petSelectorContainer}>
			{
				myMockedPets.map((pet, index) => 
					<PetBubble 
						key={index} 
						{...pet} 
						isActive={activePet === index} 
						setActivePet={setActivePet}
						index={index}
					/>
				)
			}
		</div>
	)
}

export default PetSelector;