import { z } from "zod"

export const jobSchema = z
  .object({
    title: z.string().describe("The title of the job"),
    company: z.string().describe("The company of the job"),
    location: z.string().describe("The location of the job"),
    workType: z.enum(["remote", "onsite", "hybrid"]).describe("The work type of the job"),
    salary: z.optional(
      z.object({
        min: z.number().nullable().describe("The minimum salary of the job"),
        max: z.number().nullable().describe("The maximum salary of the job"),
        currency: z.string().nullable().describe("The currency of the salary"),
      })
    ),
    skills: z.array(z.string()).describe("The skills required for the job"),
    description: z.string().nullable().describe("The description of the job")
  })
  .strict()

export type ScrapedJob = z.infer<typeof jobSchema>
