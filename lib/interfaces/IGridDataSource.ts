import { IDataSet } from './IDataSet'
import { IColumn } from './IColumn'
import { IFilter } from './IFilter'
import { IPager } from './IPager'
import { ISorter } from './ISorter'

export interface IGridDataSource {
    type?: string,
    getData: (
        columns?: IColumn[], 
        pager?: IPager,
        sorter?: ISorter,
        filters?: IFilter[]
    ) => Promise<IDataSet>
}