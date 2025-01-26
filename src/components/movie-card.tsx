import { getLanguageName } from "@/lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";

export default function MovieCard({
  movie,
}: {
  movie: {
    id: number;
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  };
}) {
  return (
    <div
      className="rounded bg-card text-card-foreground shadow p-4"
      key={movie.id}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path!}`}
        alt={movie.title}
        className="rounded"
      />
      <div className="mt-2 flex flex-col justify-start">
        <p className="text-lg font-semibold">{movie.title}</p>
        <div className="inline-block *:inline-block space-x-0.5">
          <StarFilledIcon className="w-4 h-4 text-amber-400" />
          <span className="text-base font-semibold mr-2">
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </span>
          <span className="mr-2">•</span>
          <span className="text-sm text-muted-foreground">
            {getLanguageName(movie.original_language)}
          </span>
          <span className="mr-2">•</span>
        </div>
      </div>
    </div>
  );
}
