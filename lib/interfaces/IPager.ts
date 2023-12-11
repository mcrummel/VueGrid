interface IPage {
    pageNumber: number,
    start: number,
    selected: boolean
}

interface IPager {
    pageSize: number,
    total: number,
    index: number,
    pages: IPage[]
}

export type { IPage, IPager }