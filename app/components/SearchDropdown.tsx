import { useEffect, useState } from "react";
import styles from './SearchDropdown.module.css';
import Chips from "./chips";

interface SearchDropdownProps {
    search: string;
    availableBreeds: string[];
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBreedChange: (selectedBreed: string) => void;
}

const SearchDropdown = ({
    search,
    availableBreeds,
    onInputChange,
    onBreedChange,
}: SearchDropdownProps) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredBreeds, setFilteredBreeds] = useState<string[]>(availableBreeds);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

    useEffect(() => {
        setFilteredBreeds(availableBreeds);
    }, [availableBreeds]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange(event);
        const value = event.target.value.toLowerCase();
        setFilteredBreeds(
            availableBreeds.filter((breed) => breed.toLowerCase().includes(value))
        );
        setShowDropdown(true);
    };

    const handleBreedClick = (breed: string) => {
        const updatedSelectedBreeds = selectedBreeds.includes(breed)
            ? selectedBreeds.filter(selectedBreed => selectedBreed !== breed)
            : [...selectedBreeds, breed];
        setSelectedBreeds(updatedSelectedBreeds);
        onBreedChange(breed); 
        setShowDropdown(false);
    };

    const handleChipRemove = (breed: string) => {
        setSelectedBreeds(selectedBreeds.filter((selectedBreed) => selectedBreed !== breed));
        onBreedChange(breed); 
    };

    return (
        <div className={styles.searchContainer}>
            <div className={styles.inputWrapper}>
                {selectedBreeds.map((breed, index) => (
                    <Chips key={index} name={breed} onRemove={handleChipRemove} />
                ))}
                <input
                    className={styles.search}
                    type="text"
                    placeholder="Search for dogs in your area"
                    value={search}
                    onChange={handleSearch}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={(e) => {
                        if (!e.relatedTarget?.closest(`.${styles.dropdown}`)) {
                            setShowDropdown(false);
                        }
                    }}
                />
            </div>
            {showDropdown && filteredBreeds.length > 0 && (
                <ul className={styles.dropdown}>
                    {filteredBreeds.map((breed, index) => (
                        <li
                            key={index}
                            onMouseDown={() => handleBreedClick(breed)}
                            tabIndex={-1}
                        >
                            {selectedBreeds.includes(breed) && <span className={styles.tick}>✔</span>}
                            {breed}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchDropdown;