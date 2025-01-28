import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { API_BASE_URL, API_OPTIONS } from "@/lib/const";
import { movieSchema, type MovieSchema } from "@/lib/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { formatDate, parse as parseDate } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  Globe,
  Star,
  TrendingUp,
} from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const formatReleaseDate = (date: string | undefined) => {
  return date
    ? formatDate(parseDate(date, "y-MM-d", new Date()), "y/MM/d")
    : "N/A";
};

const createParamsQueryOptons = ({ movieId }: { movieId: string }) =>
  queryOptions({
    queryKey: ["movie", movieId],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/movie/${movieId}`,
        API_OPTIONS
      );

      if (!response.ok)
        throw new Error(`Failed to fetch movie with id ${movieId}`);

      const data = await response.json();
      const zodData = movieSchema.parse(data) as MovieSchema;
      return zodData;
    },
  });

export const Route = createFileRoute("/movie/$movieId")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(createParamsQueryOptons(params)),
});

function RouteComponent() {
  const { movieId } = Route.useParams();
  const { data: movie } = useSuspenseQuery(
    createParamsQueryOptons({ movieId })
  );

  const goBack = () => window.history.back();

  if (movie === null) return <div>Movie not found</div>;

  return (
    <motion.div
      className="min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-[50vh]">
        <motion.img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="object-cover w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-8">
          <div className="bg-background rounded-full p-2 w-fit hover:scale-[110%] transition-transform duration-200">
            <ArrowLeft
              className="w-6 h-6 text-foreground pointer-events-auto cursor-pointer"
              onClick={goBack}
            />
          </div>
        </div>
      </div>

      <motion.div
        className="container mx-auto px-4 py-8 -mt-32 relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="md:col-span-2 space-y-8"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
              <p className="text-xl text-gray-300 italic">{movie.tagline}</p>
            </motion.div>

            <motion.div
              className="bg-gray-900 rounded-lg p-4 space-y-4 block md:hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400">{movie.vote_count} votes</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <Progress value={movie.vote_average * 10} className="h-2" />
              </motion.div>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="text-gray-300 text-base">{movie.overview}</p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h2 className="text-2xl font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-primary" />
                  <span>{formatReleaseDate(movie.release_date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="text-primary" />
                  <span>{movie.original_language.toUpperCase()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="text-primary" />
                  <span>Popularity: {movie.popularity.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="text-primary" />
                  <span>Budget: {formatCurrency(movie.budget)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="text-primary" />
                  <span>Revenue: {formatCurrency(movie.revenue)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {movie.adult && <Badge variant="destructive">Adult</Badge>}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h2 className="text-2xl font-semibold mb-4">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <motion.div
                    key={genre.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge variant="secondary" className="text-sm py-1 px-3">
                      {genre.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h2 className="text-2xl font-semibold mb-4">
                Production Companies
              </h2>
              <div className="flex flex-wrap gap-4">
                {movie.production_companies.map((company) => (
                  <motion.div
                    key={company.id}
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Building2 className="text-primary" />
                    <span>{company.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-6 w-fit hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              className="relative h-[400px]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className="object-cover h-full rounded"
              />
            </motion.div>

            <motion.div
              className="bg-gray-900 rounded-lg p-4 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400">{movie.vote_count} votes</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <Progress value={movie.vote_average * 10} className="h-2" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
