'use client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { fetchDogDetails, matchDogs } from '../api/dogService';
import AboutDogCard, { Dog } from '../components/AboutDogCard';
import Modal from '../components/Modal';
import styles from './selectdog.module.css';

const SelectedDogsPage = () => {
    const router = useRouter();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SelectedDogsContent router={router} />
        </Suspense>
    );
};

const SelectedDogsContent = ({ router }: { router: AppRouterInstance }) => {
    const searchParams = useSearchParams();
    const selectedDogs = searchParams.get('selectedDogs');

    const dogs: Dog[] = selectedDogs ? JSON.parse(selectedDogs) : [];
    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirm = async () => {
        try {
            const dogIds = dogs.map(dog => dog.id);
            const matchResponse = await matchDogs(dogIds);
            const matchedDogDetails = await fetchDogDetails([matchResponse.match]);
            setMatchedDog(matchedDogDetails[0]);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to send liked dogs:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        router.push('/dashboard');
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center', padding: "40px" }}>Selected Dogs</h2>
            <div className={styles.grid}>
                {dogs.map((dog) => (
                    <AboutDogCard dog={dog} key={dog.id} onSelect={() => { }} isSelected={true} />
                ))}
            </div>
            <button className={styles.confirmButton} onClick={handleConfirm}>
                Confirm
            </button>
            {isModalOpen && matchedDog && (
                <Modal onClose={closeModal} showCloseButton={true}>
                    <h2 style={{ textAlign: 'center', color: "black", marginBottom: "30px" }}>You Matched!</h2>
                    <AboutDogCard dog={matchedDog} key={matchedDog.id} onSelect={() => { }} isSelected={true} />
                </Modal>
            )}
        </div>
    );
};

export default SelectedDogsPage;
