import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().nonempty(),
});

export type SearchSchema = z.infer<typeof searchSchema>;

export const movieSchema = z.object({
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

export type MovieSchema = z.infer<typeof movieSchema>;
