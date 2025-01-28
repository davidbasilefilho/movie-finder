import HorizontalLoadingBar from "@/components/horizontal-loading-bar";
import MovieCard from "@/components/movie-card";
import { QueryInput } from "@/components/query-input";
import { TrendingMovies } from "@/components/trending-movies";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { API_BASE_URL, API_OPTIONS } from "@/lib/const";
import {
  MoviesSchema,
  moviesSchema,
  searchSchema,
  SearchSchema,
} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Clapperboard, Search } from "lucide-react";
import { useForm } from "react-hook-form";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const form = useForm<SearchSchema>({
    defaultValues: { query: "" },
    resolver: zodResolver(searchSchema),
  });

  const navigate = useNavigate();

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["movies"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, { ...API_OPTIONS });
      const data = await response.json();
      const zodData = moviesSchema.parse(data) as MoviesSchema;

      return zodData;
    },
  });

  const {
    data: trendingMovies,
    isLoading: trendingIsLoading,
    isError: trendingIsError,
    error: trendingError,
    isSuccess: trendingIsSuccess,
  } = useQuery({
    queryKey: ["trending"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const endpoint = `${API_BASE_URL}/trending/movie/week`;
      const response = await fetch(endpoint, { ...API_OPTIONS });
      const data = await response.json();
      const zodData = moviesSchema.parse(data) as MoviesSchema;

      return zodData;
    },
  });

  const onSubmit = (values: SearchSchema) => {
    console.log(values);
    navigate({
      to: "/search",
      search: { ...values, query: encodeURI(values.query ?? "") },
    });
  };

  return (
    <div className="container mx-auto md:py-8 py-4 px-6">
      <div className="p-8 md:p-0">
        <div className="flex w-full items-center justify-center flex-col">
          <h1 className="text-center inline-block">
            Find{" "}
            <div className="inline-block mx-1">
              <Clapperboard className="lg:w-12 lg:h-12 md:w-10 md:h-10 w-8 h-8 leading-12 md:leading-14 lg:leading-16 align-bottom text-primary inline-block mr-0.5" />
              <span className="text-gradient-purple">Movies</span>
            </div>{" "}
            without a hassle
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-80 md:w-96 mt-8 md:mt-10"
            >
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <QueryInput
                          placeholder="Search through hundreds of movies..."
                          className="w-full py-3 pl-12 pr-4 border rounded-full outline-none bg-white/10 focus:bg-white/20 transition-all duration-300"
                          {...field}
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      <section className="mt-6">
        <h2>Trending movies</h2>
        {trendingIsLoading && (
          <HorizontalLoadingBar
            duration={1000}
            height={6}
            className="bg-primary"
          />
        )}

        {trendingIsError && (
          <p>Error fetching trending movies: {trendingError.message}</p>
        )}

        {trendingIsSuccess && (
          <div className="trending">
            <ul className="flex flex-row overflow-y-auto gap-5 md:gap-1 w-full overflow-scroll pb-4">
              {trendingMovies?.results
                .slice(0, 8)
                .map((movie, index) => (
                  <TrendingMovies movie={movie} index={index} />
                ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2>Popular movies</h2>
        {isLoading && (
          <HorizontalLoadingBar
            duration={1000}
            height={6}
            className="bg-primary"
          />
        )}
        {isError && <p>Error fetching movies: {error.message}</p>}

        {isSuccess && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data?.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
