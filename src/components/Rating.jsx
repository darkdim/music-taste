import { Star } from "lucide-react";

function Rating({ value, onChange }) {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={
            star <= value
              ? "star active"
              : "star"
          }
          onClick={() =>
            onChange(
              value === star ? 0 : star
            )
          }
          title={
            value === star
              ? "Remove rating"
              : `Rate ${star}/5`
          }
        >
          <Star size={18} />
        </button>
      ))}
    </div>
  );
}

export default Rating;