import React from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, showCloseButton = false }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {showCloseButton && <button className={styles.closeButton} onClick={onClose}>&times;</button>}
                <div className={styles.cardContent}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
