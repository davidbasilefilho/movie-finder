import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_BASE_URL, API_OPTIONS } from "@/lib/const";
import { SearchSchema, searchSchema } from "@/lib/schema";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import MovieCard from "@/components/movie-card";

// Query options factory function
const createSearchQueryOptions = (search: SearchSchema) =>
  queryOptions({
    queryKey: ["search", search],
    queryFn: async () => {
      const params = new URLSearchParams({
        query: search.query || "",
        page: search.page.toString(),
        sort_by: "popularity.desc",
      });

      const response = await fetch(
        `${API_BASE_URL}/search/movie?${params}`,
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
  const search = Route.useSearch(); // Get validated search params
  const { data } = useSuspenseQuery(createSearchQueryOptions(search)); // Access preloaded data

  return (
    <div className="px-10 py-4 container mx-auto">
      <div className="">
        <h2 className="text-2xl leading-6 align-baseline font-bold inline-block *:inline-block w-full">
          <Link to="/" className="mr-2 *:inline-block">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          Search results for "{decodeURI(search.query ?? "")}"
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
