import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

export const StarRating = ({ rating, setRating, onRatingComplete }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex justify-center gap-3 md:gap-4 my-8">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hover || rating) >= star;
        return (
          <div
            key={star}
            className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => {
              setRating(star);
              if (onRatingComplete) onRatingComplete(star);
            }}
          >
            <Star
              size={48}
              className={cn(
                "transition-all duration-300",
                isFilled ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" : "text-gray-300"
              )}
            />
          </div>
        );
      })}
    </div>
  );
};
