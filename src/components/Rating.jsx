import { Star } from "lucide-react";

function Rating({ value, onChange }) {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={star <= value ? "star active" : "star"}
          onClick={() => onChange(star)}
          title={`${star} stars`}
        >
          <Star size={18} />
        </button>
      ))}
    </div>
  );
}

export default Rating;