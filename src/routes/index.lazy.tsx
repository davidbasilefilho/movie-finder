import MovieCard from "@/components/movie-card";
import { QueryInput } from "@/components/query-input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { API_BASE_URL, API_OPTIONS } from "@/lib/const";
import {
  MovieSchema,
  movieSchema,
  SearchSchema,
  searchSchema,
} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Clapperboard } from "lucide-react";
import { useForm } from "react-hook-form";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const form = useForm<SearchSchema>({
    defaultValues: { query: "" },
    resolver: zodResolver(searchSchema),
  });

  const useGetMoviesQuery = useQuery({
    queryKey: ["movies"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, { ...API_OPTIONS });
      const data = await response.json();
      const zodData = movieSchema.parse(data) as MovieSchema;

      return zodData;
    },
  });

  const onSubmit = (values: SearchSchema) => {
    console.log(values);
  };

  return (
    <div className="container mx-auto md:py-8 py-4 px-4">
      <div className="p-8 md:p-0">
        <div className="flex w-full items-center justify-center flex-col">
          <h1 className="text-center inline-block">
            Find{" "}
            <div className="inline-block mx-1">
              <Clapperboard className="w-12 h-12 leading-16 align-bottom text-primary inline-block mr-0.5" />
              <span className="text-gradient-purple">Movies</span>
            </div>{" "}
            without a hassle
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-80 md:w-96 mt-4 md:mt-10"
            >
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <QueryInput
                        placeholder="Search through hundreds of movies..."
                        className="border-background"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      <section className="mt-6">
        <h2>Popular movies</h2>
        {useGetMoviesQuery.isLoading && <p>Loading...</p>}
        {useGetMoviesQuery.isError && (
          <p>Error fetching movies: {useGetMoviesQuery.error.message}</p>
        )}

        {useGetMoviesQuery.isSuccess && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {useGetMoviesQuery.data!.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
