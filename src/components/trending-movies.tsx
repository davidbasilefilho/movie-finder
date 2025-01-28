import type { Movie } from "@/lib/schema";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

export function TrendingMovies({
  movie,
  index,
}: {
  movie: Movie;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.li
      key={movie.id}
      className="min-w-[140px] md:min-w-[180px] flex flex-row items-center"
      layout
    >
      <p className="fancy-text mt-[22px] text-nowrap select-none pointer-events-none -ml-2 md:-ml-3">
        {index + 1}
      </p>
      <div className="relative overflow-hidden rounded">
        <Link
          to="/movie/$movieId"
          params={{ movieId: movie.id.toString() }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1.0 }}
            animate={{ scale: isHovered ? 1.1 : 1.0 }}
            transition={{ duration: 0.15, ease: "linear" }}
          >
            <motion.img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : "/no-poster.png"
              }
              alt={movie.title}
              className="w-[127px] aspect-[3/4] object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.h3
              className="text-base font-semibold text-center"
              initial={{ y: 10 }}
              animate={{ y: isHovered ? 0 : 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {movie.title}
            </motion.h3>
          </motion.div>
        </Link>
      </div>
    </motion.li>
  );
}
