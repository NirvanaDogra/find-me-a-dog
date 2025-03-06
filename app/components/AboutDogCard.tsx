import Image from "next/image";
import style from "../components/AboutDogCard.module.css";

export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

const AboutDogCard = ({ dog, onSelect, isSelected }: { dog: Dog, onSelect: (dog: Dog) => void, isSelected: boolean }) => {
    const handleSelect = () => {
        onSelect(dog);
    };

    return (
        <div className={`${style.card} ${isSelected ? style.selected : ''}`} onClick={handleSelect}>
            <Image className={style.image} alt={dog.name} src={dog.img} width={300} height={450} />
            <div className={style.details}>
                <h3>{dog.name}</h3>
                <p>Breed: {dog.breed}</p>
                <p>Age: {dog.age} years</p>
                <p>Location: {dog.zip_code}</p>
            </div>
        </div>
    )
}

export default AboutDogCard;