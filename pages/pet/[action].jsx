import {useRouter} from 'next/router';
import {useEffect, useState, useRef} from 'react';
import {useLoginContext, withAuth} from '../../utils/auth';
import MessageBar from '../../components/MessageBar/MessageBar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PetsServices from '../../services/PetsServices';
import {TYPE_OPTIONS, SEX_OPTIONS} from '../../services/config';
import firebase from '../../services/firebase/firebase';
// import {getFirestore, collection, getDocs} from 'firebase/firestore/lite';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import styles from '../../styles/pet-actions.module.css';
import Dropdown from '../../components/Dropdown';

const MyPetAction = ({action, token}) => {
	const [pet, setPet] = useState({
		name: '',
		image: '',
		type: '',
		sex: '',
		description: '',
	});
	const [currentImage, setCurrentImage] = useState(pet.image);
	const [errors, setErrors] = useState([]);
	const inputRef = useRef(null);
	const imgRef = useRef(null);
	const {pets: myPets, updatePets, user} = useLoginContext();
	const router = useRouter();

	const actions = {
		add: 'Agregar',
		edit: 'Editar',
	};

	const buttonLabels = {
		add: 'Añadir',
		edit: 'Actualizar',
	};

	// const database = getFirestore(firebase);
	const storage = getStorage(firebase);

	useEffect(() => {
		if (!['add', 'edit'].includes(action)) router.push('/');
		if (action === 'edit') {
			const pet = myPets.find((pet) => pet.token === token);
			if (!pet) {
				router.push('/');
				return;
			}
			setPet(pet);
			setCurrentImage(pet.image);
		}
	}, []);

	const selectImg = () => {
		inputRef.current.click();
	};

	const uploadImage = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (!file.type.startsWith('image/')) {
				console.log('The picked file is not an image');
				return;
			}
			imgRef.current.file = file;

			const reader = new FileReader();
			reader.onload = (e) => {
				const image = e.target.result;
				imgRef.current.src = image;
				imgRef.current.style.padding = '0';
				setCurrentImage(image);
			};
			reader.readAsDataURL(file);
		}
	};

	const inputHandler = ({target: {value, name}}) => {
		if (name === 'name') {
			const errorIndex = errors.findIndex((e) => e !== 'nameField');
			errors.splice(errorIndex, 1);
			setErrors(errors);
		}

		setPet({...pet, [name]: value});
	};

	const dropdownHandler = ({target: {value, name}}) =>
		setPet({...pet, [name]: value});

	const hasErrors = (field) => errors.includes(field);

	const validateErrors = () => {
		const auxErrors = [];

		if (pet.name === '' && !errors.includes('nameField')) {
			auxErrors = [...errors, 'nameField'];
		}

		return auxErrors;
	};

	const savePet = async () => {
		const currentErrors = validateErrors();

		if (currentErrors.length === 0) {
			let success;
<<<<<<< Updated upstream
			if (action === 'edit') {
				success = await PetsServices.update(token, pet);
			} else {
				success = await PetsServices.create(pet);
			}
			if (success) {
				await updatePets();
				router.push('/pets');
			} else alert('¡Oops! Hubo un error.');
=======
			const imageRef = ref(
				storage,
				`${user.token}-${pet.name.replaceAll(' ', '+')}.jpg`
			);

			uploadBytes(imageRef, currentImage).then((snapshot) => {
				console.log('Uploaded to storage');
				getDownloadURL(imageRef).then(async (url) => {
					if (action === 'edit') {
						success = await PetsServices.update(user.token, {
							...pet,
							image: url,
						});
					} else {
						success = await PetsServices.create({
							...pet,
							image: url,
						});
					}
					if (success) {
						await updatePets();
						router.push('/pets');
					} else alert('¡Oops! Hubo un error.');
				});
			});
>>>>>>> Stashed changes
		} else {
			setErrors(currentErrors);
		}
	};

	return (
		<div className={styles.petActionContainer}>
			<MessageBar message={`${actions[action]} mascota`} />
			<img
				ref={imgRef}
				className={[
					styles.addImg,
					action === 'add' ? styles.plusIcon : '',
				].join(' ')}
				onClick={selectImg}
				src={action === 'add' ? '/assets/plus.svg' : currentImage}
				alt="Imagen de mascota"
			/>
			<input
				ref={inputRef}
				type="file"
				onChange={uploadImage}
				accept="image/*"
				hidden
			/>
			<Input
				name="name"
				type="text"
				value={pet.name}
				placeholder="Nombre de tu mascota"
				handleChange={(e) => inputHandler(e)}
				size="medium"
			/>
			{hasErrors('nameField') && (
				<span className={styles.error}>Debe ingresar un nombre</span>
			)}
			<Dropdown
				name="type"
				defaultValue={pet.type}
				options={TYPE_OPTIONS}
				handleChange={(e) => dropdownHandler(e)}
				size="medium"
			/>
			<Dropdown
				name="sex"
				defaultValue={pet.sex}
				options={SEX_OPTIONS}
				handleChange={(e) => dropdownHandler(e)}
				size="medium"
			/>
			<textarea
				name="description"
				value={pet.description}
				placeholder={`Contanos sobre ${pet.name || 'tu mascota'}`}
				className={styles.descriptionArea}
				maxLength={100}
				onChange={(e) => inputHandler(e)}
			/>
			<Button
				label={`¡${buttonLabels[action]} mascota!`}
				handleClick={savePet}
				size="medium"
				className={styles.buttonAnimation}
			/>
		</div>
	);
};

export async function getServerSideProps({query}) {
	const {action, id} = query;
	return {props: {action, token: id || ''}};
}

const Component = withAuth(MyPetAction);
Component.goBack = '/pets';

export default Component;
