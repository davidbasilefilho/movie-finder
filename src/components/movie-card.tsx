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
      className="rounded-3xl bg-card text-card-foreground shadow p-5"
      key={movie.id}
    >
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : "/no-poster.png"
        }
        alt={`Poster of "${movie.title}"`}
        className="rounded text-sm text-muted-foreground"
      />
      <div className="mt-2 flex flex-col justify-start space-y-1.5">
        <p className="text-[1.2rem] font-semibold">{movie.title}</p>
        <div className="*:inline-block space-x-0.5">
          <span className="*:inline-block space-x-0.5">
            <StarFilledIcon className="w-4 h-4 text-amber-400" />
            <span className="text-base font-semibold">
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </span>
          <span className="mx-1">•</span>
          <span className="text-sm text-muted-foreground">
            {getLanguageName(movie.original_language)}
          </span>
          <span className="mx-1">•</span>
          <span className="text-sm text-muted-foreground">
            {movie.release_date}
          </span>
        </div>
      </div>
    </div>
  );
}
