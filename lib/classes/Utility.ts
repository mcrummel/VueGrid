export class Utility {
    static strIsNullOrWhitespace = (value?: string) => value === null || value === undefined || value.trim() === ''
}