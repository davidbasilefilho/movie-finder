import HorizontalLoadingBar from "@/components/horizontal-loading-bar";
import MovieCard from "@/components/movie-card";
import { QueryInput } from "@/components/query-input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { API_BASE_URL, API_OPTIONS } from "@/lib/const";
import {
  MovieSchema,
  movieSchema,
  searchSchema,
  SearchSchema,
} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
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

  const navigate = useNavigate();

  const { data, isLoading, isError, error, isSuccess } = useQuery({
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
    navigate({
      to: "/search",
      search: { ...values, query: encodeURI(values.query ?? "") },
    });
  };

  return (
    <div className="container mx-auto md:py-8 py-4 px-10">
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
        {isLoading && <HorizontalLoadingBar duration={1000} height={6} />}
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
