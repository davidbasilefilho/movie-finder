import { z } from "zod";

export const searchSchema = z.object({
  query: z.string(),
  include_adult: z.boolean().default(false),
  primary_release_year: z.string().optional(),
  page: z.number().int().positive().default(1),
  region: z.string().optional(),
  year: z.string().optional(),
});

export type SearchSchema = z.infer<typeof searchSchema>;

export const moviesSchema = z.object({
  page: z.number().int().positive(),
  results: z.array(
    z.object({
      adult: z.boolean().default(true),
      backdrop_path: z.string(),
      genre_ids: z.array(z.number().int().positive()),
      id: z.number().int().positive(),
      original_language: z.string(),
      original_title: z.string(),
      overview: z.string(),
      popularity: z.number(),
      poster_path: z.string(),
      release_date: z.string(),
      title: z.string(),
      video: z.boolean().default(true),
      vote_average: z.number(),
      vote_count: z.number().int().positive(),
    })
  ),
  total_pages: z.number().int().positive(),
  total_results: z.number().int().positive(),
});

export type MoviesSchema = z.infer<typeof moviesSchema>;
export type Movie = MoviesSchema["results"][number];

export const findMovieSchema = z.object({
  movie_results: z.array(
    z.object({
      adult: z.boolean().default(true),
      backdrop_path: z.string(),
      genre_ids: z.array(z.number().int().positive()),
      id: z.number().int().positive(),
      original_language: z.string(),
      original_title: z.string(),
      overview: z.string(),
      popularity: z.number(),
      poster_path: z.string(),
      release_date: z.string(),
      title: z.string(),
      video: z.boolean().default(true),
      vote_average: z.number(),
      vote_count: z.number().int().positive(),
    })
  ),
});

export type FindMovieSchema = z.infer<typeof moviesSchema>;

export const movieSchema = z.object({
  adult: z.boolean().default(true),
  backdrop_path: z.string().nullable(),
  belongs_to_collection: z
    .object({
      id: z.number().int().positive().default(0),
      name: z.string(),
      poster_path: z.string().nullable(),
      backdrop_path: z.string().nullable(),
    })
    .nullable(),
  budget: z.number(),
  genres: z.array(z.object({ id: z.number().int(), name: z.string() })),
  homepage: z.string(),
  id: z.number().int(),
  imdb_id: z.string(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  production_companies: z.array(
    z.object({
      id: z.number().int(),
      logo_path: z.string().nullable(),
      name: z.string(),
      origin_country: z.string(),
    })
  ),
  production_countries: z.array(
    z.object({ iso_3166_1: z.string(), name: z.string() })
  ),
  revenue: z.number().int(),
  spoken_languages: z.array(
    z.object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    })
  ),
  status: z.string(),
  tagline: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean().default(true),
  vote_average: z.number(),
  vote_count: z.number().int(),
});

export type MovieSchema = z.infer<typeof movieSchema>;
