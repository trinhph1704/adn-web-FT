import { FaCheckSquare, FaRegSquare } from 'react-icons/fa';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean; // Added disabled prop
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-pressed={checked}
      disabled={disabled}
    >
      {checked ? (
        <FaCheckSquare className="text-blue-600 text-2xl" />
      ) : (
        <FaRegSquare className="text-gray-400 text-2xl" />
      )}
    </button>
    {label && (
      <label
        className={`text-blue-800 font-medium select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => !disabled && onChange(!checked)} // Prevent click when disabled
      >
        {label}
      </label>
    )}
  </div>
);

export default Checkbox;