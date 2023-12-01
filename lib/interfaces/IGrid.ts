import { Ref } from 'vue'
import { ISorter } from './ISorter'
import { IPage, IPager } from './IPager'
import { IColumn } from './IColumn'
import { IDataSet } from './IDataSet'

interface IGrid {
    namespaced:boolean,
    loading:Ref<boolean>,
    columns:Ref<IColumn[]>,
    data:Ref<object[]>,
    sorter?: ISorter,
    pager: Ref<IPager>,
    sort: (column:IColumn) => void,
    clearSorts: () => void,
    filterData: (searchValue: string | number) => Promise<void>,
    getData: () => Promise<void>,
    loadData: (dataSet: IDataSet) => void,
    gotoPage: (page: IPage) => Promise<void>,
    nextPage: () => Promise<void>,
    previousPage: () => Promise<void>
}

export type { IGrid }