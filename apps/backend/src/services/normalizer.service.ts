import { Normalizer, NormalizedJob } from "../interfaces/scraper.interface";

export class NormalizerService implements Normalizer {
    normalize(job: any): NormalizedJob {
        const normalizedJob: NormalizedJob = {
            title: job.title,
            company: job.company,
            location: job.location,
            workType: job.workType,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            currency: job.currency,
            skills: job.skills,
            description: job.description,
        }

        return normalizedJob;
    }
}