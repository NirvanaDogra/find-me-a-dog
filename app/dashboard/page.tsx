'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { logoutUser } from '../api/auth';
import { fetchBreeds, fetchDogDetails, fetchDogs } from '../api/dogService';
import AboutDogCard, { Dog } from '../components/AboutDogCard';
import PaginationController from '../components/PaginationController';
import SearchDropdown from '../components/SearchDropdown';
import styles from '../dashboard/dashboard.module.css';

interface SearchFormState {
    search: string;
    from: number;
    breeds: string[];
    sort: 'asc' | 'desc';
}

interface ScreenState {
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    error?: string;
    data?: Dog[] | null;
    availableBreed?: string[] | null;
}

const Dashboard = () => {
    const router = useRouter();
    const [screenState, setScreenState] = useState<ScreenState>({ isError: false, isSuccess: false, isLoading: true, data: null, availableBreed: [] });
    const [formState, setFormState] = useState<SearchFormState>({ search: '', from: 0, breeds: [], sort: "asc" });
    const [selectedDogs, setSelectedDogs] = useState<Dog[]>([]);

    const fetchResults = async () => {
        setScreenState((prev) => ({ ...prev, isLoading: true }));
        try {
            const searchResult = await fetchDogs(formState.from, formState.breeds, formState.sort);
            const dogsResult = await fetchDogDetails(searchResult.resultIds);
            setScreenState((prev) => ({ ...prev, isLoading: false, isSuccess: true, isError: false, data: dogsResult }));
        } catch (error) {
            console.error('Fetch failed:', error);
            setScreenState((prev) => ({ ...prev, isLoading: false, isSuccess: false, isError: true, error: error instanceof Error ? error.message : String(error), data: null }));
        }
    }

    useEffect(() => {
        fetchBreedsList();
        fetchResults();
    }, [formState.from, formState.sort, formState.breeds]);

    const fetchBreedsList = async () => {
        try {
            const breeds = await fetchBreeds();
            setScreenState((prev) => ({
                ...prev,
                availableBreed: breeds
            }));
        } catch (error) {
            console.error('Failed to fetch breeds:', error);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({ ...formState, search: event.target.value });
    };

    const handleBreedChange = (selectedBreed: string) => {
        setFormState((prev) => {
            const breeds = prev.breeds.includes(selectedBreed)
                ? prev.breeds.filter(breed => breed !== selectedBreed)
                : [...prev.breeds, selectedBreed];
            return { ...prev, breeds, search: "" };
        });
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormState({ ...formState, sort: event.target.value as 'asc' | 'desc' });
    };

    const handleSelectDog = (dog: Dog) => {
        setSelectedDogs((prev) => {
            if (prev.includes(dog)) {
                return prev.filter(d => d.id !== dog.id);
            } else {
                return [...prev, dog];
            }
        });
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            router.replace('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            <header className={styles.header}>
                <SearchDropdown
                    search={formState.search}
                    availableBreeds={screenState.availableBreed || []}
                    onInputChange={handleInputChange}
                    onBreedChange={handleBreedChange}
                />
                <label className={styles.label} htmlFor="sortByBreed">Sort By Breed</label>
                <select id="sortByBreed" className={styles.select} value={formState.sort} onChange={handleSortChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            </header>
            <main className={styles.main}>
                {screenState.isLoading && <div className={styles.loadingScreen}>Loading...</div>}
                {screenState.isError && <div className={styles.errorScreen}>Error: {screenState.error}</div>}
                {screenState.isSuccess && <DogResults data={screenState.data || null} onSelectDog={handleSelectDog} selectedDogs={selectedDogs} />}
            </main>
            <footer>
                <PaginationController
                    totalPages={100}
                    onPageChange={(it) => {
                        setFormState({ ...formState, from: it * 24 });
                    }}
                />
                {selectedDogs.length > 0 && (
                    <Link href={{ pathname: '/selected-dogs', query: { selectedDogs: JSON.stringify(selectedDogs) } }}>
                        <button className={styles.stickyButton}>
                            Send Selected Dogs
                        </button>
                    </Link>
                )}
            </footer>
        </>
    );
};

const DogResults = ({ data, onSelectDog, selectedDogs }: { data: Dog[] | null, onSelectDog: (dog: Dog) => void, selectedDogs: Dog[] }) => (
    <section>
        <h2 style={{ textAlign: 'center', padding: "10px" }}>Find Dogs in Area</h2>
        <div className={styles.grid}>
            {data && data.length > 0 ? data.map((dog) => {
                const isSelected = selectedDogs.filter(d => d.id === dog.id).length > 0;
                return <AboutDogCard dog={dog} key={dog.id} onSelect={onSelectDog} isSelected={isSelected} />;
            }) : <div>No dogs found.</div>}
        </div>
    </section>
);

export default Dashboard;