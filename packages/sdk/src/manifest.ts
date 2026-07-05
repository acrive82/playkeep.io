import { z } from "zod";

export const PlaykeepManifestSchema = z.object({
  schema: z.literal("playkeep.manifest.v1"),
  gameId: z.string().min(1),
  tokenId: z.string().regex(/^[0-9]+$/),
  title: z.string().min(1),
  version: z.string().min(1),
  platform: z.string().min(1),
  package: z.object({
    uri: z.string().min(1),
    encryptedSha256: z.string().regex(/^[0-9a-f]{64}$/),
    clearSha256: z.string().regex(/^[0-9a-f]{64}$/),
    size: z.number().int().nonnegative(),
    encryptedSize: z.number().int().nonnegative(),
    encryption: z.object({
      alg: z.literal("A256GCM"),
      iv: z.string().min(1),
      tag: z.string().min(1)
    })
  }),
  publisher: z.object({
    address: z.string().optional(),
    signature: z.string().optional()
  }).default({}),
  cache: z.object({
    gateways: z.array(z.string()).default([])
  }).default({ gateways: [] }),
  createdAt: z.string().datetime()
});

export type PlaykeepManifest = z.infer<typeof PlaykeepManifestSchema>;

export function parseManifest(input: unknown): PlaykeepManifest {
  return PlaykeepManifestSchema.parse(input);
}

