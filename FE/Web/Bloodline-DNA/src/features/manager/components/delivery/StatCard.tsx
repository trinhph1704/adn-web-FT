interface Props {
  label: string;
  count: number;
  color: string;
}

const StatCard = ({ label, count, color }: Props) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className={`text-2xl font-bold ${color}`}>{count}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

export default StatCard;
