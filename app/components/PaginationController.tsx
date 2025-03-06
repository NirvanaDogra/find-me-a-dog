import { useEffect, useState } from "react";
import styles from "../dashboard/dashboard.module.css";

const PaginationController = ({ totalPages, onPageChange }: { totalPages: number, onPageChange: (num: number) => void }) => {
    const [currentPage, setCurrentPage] = useState(1);
    console.log('totalPages', totalPages);
    useEffect(() => {
        onPageChange(currentPage - 1);
    }, [currentPage]);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className={styles.pagination}>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
                Previous
            </button>
            <span style={{color: "white"}}>Page {currentPage} of {totalPages}</span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
                Next
            </button>
        </div>
    );
};

export default PaginationController;
