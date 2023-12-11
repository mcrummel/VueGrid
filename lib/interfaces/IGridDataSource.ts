import { IDataSet } from '../interfaces/IDataSet'
import { IColumn } from '../interfaces/IColumn'
import { IFilter } from '../interfaces/IFilter'
import { IPager } from '../interfaces/IPager'
import { ISorter } from '../interfaces/ISorter'

export interface IGridDataSource {
    type?: string,
    getData: (
        columns?: IColumn[], 
        pager?: IPager,
        sorter?: ISorter,
        filters?: IFilter[]
    ) => Promise<IDataSet>
}