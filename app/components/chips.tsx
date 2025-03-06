import style from "../components/Chips.module.css";

interface ChipsProps {
    name: string;
    onRemove?: (name: string) => void;
}

const Chips = ({ name, onRemove }: ChipsProps) => {
    return (
        <span className={style.chip}>
            {name}
            {onRemove && (
                <button className={style.removeButton} onClick={() => onRemove(name)}>
                    &times;
                </button>
            )}
        </span>
    );
};

export default Chips;