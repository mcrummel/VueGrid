export interface IColumn {
    field: string,
    title?: string,
    sortDirection?: string,
    columnType?: string,
    filterable?: boolean,
    hidden?: boolean,
    editable?: boolean,
    readonly?: boolean,
    validator?: {
        assert: (value: unknown) => boolean,
        message: (title: string) => string
    }
    format?: (value:unknown) => unknown,
}