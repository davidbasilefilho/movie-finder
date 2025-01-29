import type { Movie } from "@/lib/schema";
import { getLanguageName } from "@/lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { formatDate, parse as parseDate } from "date-fns";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MovieCard({ movie }: { movie: Movie }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-3xl bg-card text-card-foreground shadow flex flex-col h-full overflow-hidden"
      key={movie.id}
    >
      <div className="relative overflow-hidden aspect-[2/3] mb-4">
        <Link
          to="/movie/$movieId"
          params={{ movieId: movie.id.toString() }}
          className="block w-full h-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : "/no-poster.png"
              }
              alt={`Poster of "${movie.title}"`}
              className="w-full h-full object-cover rounded-none"
            />
          </motion.div>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.p
                  className="text-base font-semibold text-center line-clamp-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  {movie.title}
                </motion.p>
                <motion.p
                  className="text-sm text-center font-normal px-4 leading-relaxed mt-2 line-clamp-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  {movie.overview}
                </motion.p>
                <motion.h4
                  className="text-base font-semibold mt-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  Click for more details
                </motion.h4>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>
      <div className="flex flex-col justify-center space-y-1.5 flex-grow px-5 pb-5">
        <h3 className="text-xl font-semibold line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="inline-flex items-center space-x-0.5">
            <StarFilledIcon className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </span>

          <span>•</span>

          <span className="text-muted-foreground">
            {getLanguageName(movie.original_language)}
          </span>

          {movie.release_date && (
            <>
              <span>•</span>
              <span className="text-muted-foreground">
                {formatDate(
                  parseDate(movie.release_date, "y-MM-d", new Date()),
                  "y/MM/d"
                )}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
