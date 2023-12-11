import { IColumn } from '../interfaces/IColumn'
import { IFilter } from '../interfaces/IFilter'
import { IPager } from '../interfaces/IPager'
import { ISorter } from '../interfaces/ISorter'
import { IDataSet } from '../interfaces/IDataSet'
import { IGridDataSource } from '../interfaces/IGridDataSource'
import { ComputedRef, Ref } from 'vue'

class RawDataSource implements IGridDataSource {
    private _data: Ref<object[]>

    constructor (data: Ref<object[]> | ComputedRef<object[]>) {
        this._data = data
    }

    public getData = async (
        // @ts-expect-error: Required to comply with interface
        columns?: IColumn[], // eslint-disable-line @typescript-eslint/no-unused-vars -- required for interface
        // @ts-expect-error: Required to comply with interface
        pager?: IPager, // eslint-disable-line @typescript-eslint/no-unused-vars -- required for interface
        // @ts-expect-error: Required to comply with interface
        sorter?: ISorter, // eslint-disable-line @typescript-eslint/no-unused-vars -- required for interface
        // @ts-expect-error: Required to comply with interface
        filters?: IFilter[] // eslint-disable-line @typescript-eslint/no-unused-vars -- required for interface
      ) => {
        return <IDataSet>{
            total: this._data?.value?.length || 0,
            data: [...<[]>this._data.value]
          }
      }
}

export { RawDataSource }