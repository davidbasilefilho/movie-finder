import MovieCard from "@/components/movie-card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { API_BASE_URL, API_OPTIONS } from "@/lib/const";
import { SearchSchema, searchSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  queryOptions,
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const createSearchQueryOptions = (search: SearchSchema) =>
  queryOptions({
    queryKey: ["search", search],
    queryFn: async () => {
      const params = new URLSearchParams({
        query: search.query || "",
        page: search.page.toString(),
        include_adult: search.include_adult.toString(),
        primary_release_year: search.primary_release_year ?? "",
        region: search.region || "",
        year: search.year ?? "",
        sort_by: "popularity.desc",
      });

      const response = await fetch(
        `${API_BASE_URL}/search/movie?${params.toString()}`,
        API_OPTIONS
      );
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

export const Route = createFileRoute("/search")({
  component: SearchComponent,
  errorComponent: ({ error }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const queryErrorResetBoundary = useQueryErrorResetBoundary();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      queryErrorResetBoundary.reset();
    }, [queryErrorResetBoundary]);

    return (
      <div className="container p-4 mx-auto">
        <Link to={"/"}>
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="min-h-[600px] max-h-dvh flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Error!</CardTitle>
              <CardDescription>{error.message}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                size={"lg"}
                onClick={() => router.invalidate()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context: { queryClient }, deps: { search } }) => {
    return queryClient.ensureQueryData(createSearchQueryOptions(search));
  },
});

function SearchComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(createSearchQueryOptions(search));
  const form = useForm<SearchSchema>({
    defaultValues: { ...search, query: decodeURI(search.query ?? "") },
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (values: SearchSchema) => {
    console.log(values);
    navigate({
      to: "/search",
      search: { ...values, query: encodeURI(values.query) },
    });
  };

  return (
    <div className="px-10 py-4 container mx-auto">
      <h2 className="text-2xl leading-6 align-baseline font-bold inline-block *:inline-block w-full">
        <Link to="/" className="mr-2 *:inline-block">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        Search results for "{decodeURI(search.query ?? "")}"
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-wrap *:shrink *:grow gap-1 md:gap-4 mt-4 items-center"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-2 mb-2">Movie name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Search through hundreds of movies..."
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primary_release_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-2 mb-2">Year of release</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2021, 1972, etc."
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      form.setValue("year", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="include_adult"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-2 mb-2">Include adult</FormLabel>
                <div className="flex flex-row items-center justify-between bg-background rounded p-4 h-14 shadow gap-3">
                  <FormDescription className="mt-0 text-sm">
                    Include adult films, NSFW, 18+, etc.
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="region"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-2 mb-2">Region</FormLabel>
                <FormControl>
                  <Input placeholder="Teste" className="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size={"lg"} className="*:inline-block mt-4">
            <Search className="w-6 h-6" />
            Search
          </Button>
        </form>
      </Form>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.results.map(
          (movie: {
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
          }) => (
            <MovieCard key={movie.id} movie={movie} />
          )
        )}
      </div>

      <Pagination>
        <PaginationContent className="flex flex-wrap items-center gap-2 m-6">
          <PaginationItem className="">
            <Link
              to="/search"
              className={buttonVariants({
                variant: "outline",
                size: "default",
                className: "gap-1 pl-2.5",
              })}
              aria-label="Go to previous page"
              search={(prev) => ({
                ...prev,
                query: prev.query!,
                include_adult: prev.include_adult ?? false,
                page: prev.page ? prev.page - 1 : 1,
              })}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Link>
          </PaginationItem>
          {Array.from({ length: data.total_pages }, (_, i) => (
            <PaginationItem key={i}>
              <Link
                key={i}
                to="/search"
                className={buttonVariants({
                  variant: search.page === i + 1 ? "default" : "outline",
                  size: "icon",
                })}
                search={(prev) => ({
                  ...prev,
                  query: prev.query!,
                  include_adult: prev.include_adult ?? false,
                  page: i + 1,
                })}
              >
                {i + 1}
              </Link>
            </PaginationItem>
          ))}

          <PaginationItem>
            <Link
              to="/search"
              search={(prev) => ({
                ...prev,
                query: prev.query!,
                include_adult: prev.include_adult ?? false,
                page: prev.page ? prev.page + 1 : 1,
              })}
              aria-label="Go to next page"
              className={buttonVariants({
                variant: "outline",
                size: "default",
                className: "gap-1 pr-2.5",
              })}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
