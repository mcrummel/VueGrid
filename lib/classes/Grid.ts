import { ref } from 'vue'
import { Utility } from './Utility'
import { IGridDataSource } from '../interfaces/IGridDataSource'
import { IColumn } from '../interfaces/IColumn'
import { IDataSet } from '../interfaces/IDataSet'
import { IPage, IPager } from '../interfaces/IPager'
import { ISorter } from '../interfaces/ISorter'
import { Directions, Operators } from './Constants'
import { IFilter } from '../interfaces/IFilter'
import { IGrid } from '../interfaces/IGrid'
import { RawDataSource } from './RawDataSource'


class Grid implements IGrid {
  private _dataSource: IGridDataSource
  private _filters: IFilter[] = []

  // Static properties
  static columnTemplate: IColumn = {
    field: '',
    format: (value: unknown) => value,
    columnType: 'string',
    filterable: false
  }

  // properties
  public namespaced = true
  public loading = ref(false)
  public columns = ref<IColumn[]>([])
  public data = ref<object[]>([])
  public sorter?: ISorter
  public pager = ref<IPager>({
    pageSize: 10,
    total: 0,
    index: 0,
    pages: []
  })

  constructor (
      dataSource: IGridDataSource, 
      columns: IColumn[], 
      pageSize?: number 
    ) {

    this._dataSource = dataSource
    
    if (pageSize) {
      this.pager.value.pageSize = pageSize
    }

    // init columns
    columns.forEach((c: IColumn) => {
      this.columns.value.push({ ...Grid.columnTemplate, ...c })
    })
  }

  // Static methods
  static formatTitle = (column: IColumn) => {
    const { title, field, columnType } = column
    if (!Utility.strIsNullOrWhitespace(title)) {
      return title
    } else if (
      typeof (columnType) === 'string' &&
      !Utility.strIsNullOrWhitespace(columnType) &&
      columnType.toUpperCase() === 'COMMAND') {
      return ''
    } else if (!Utility.strIsNullOrWhitespace(field)) {
      const s = field.replace(/([A-Z])/g, ' $1')
      return s[0].toUpperCase() + s.slice(1)
    } else return field
  }

  

  // public methods
  sort = (column: IColumn) => {
    column.sortDirection =
      column.sortDirection === Directions.ASCENDING
        ? Directions.DESCENDING
        : column.sortDirection === Directions.DESCENDING
          ? undefined
          : Directions.ASCENDING

    this.sorter = column.sortDirection
      ? { field: column.field, direction: column.sortDirection }
      : undefined

    // reset the other columns
    for (const c of this.columns.value) {
      if (c.field !== column.field) {
        c.sortDirection = undefined
      }
    }
  }

  clearSorts = () => this.columns.value.forEach(c => {
    c.sortDirection = undefined
  })

  filterData = async (searchValue: string | number | undefined) => {
    this._filters = []
    this.pager.value.index = 0

    if (searchValue !== undefined && searchValue !== null) {
      for (const { filterable, columnType, field } of this.columns.value) {
        if (!filterable) continue

        switch (columnType) {
          case 'string':
            this._filters.push({
              field,
              searchValue,
              operator: Operators.CONTAINS
            })
            break
          case 'number':
            if (typeof searchValue === 'number' && !isNaN(searchValue)) {
              this._filters.push({
                field,
                searchValue,
                operator: Operators.EQUALS
              })
            }
            break
          default:
            break
        }
      }
    }

    return await this.getData()
  }

  getData = async () => {
    this.loading.value = true

    await this._dataSource.getData(this.columns.value, this.pager.value, this.sorter, this._filters)
            .then(this.loadData)
            .catch(console.log)
            .finally(() => {
              this.loading.value = false
            })
  }

  loadData = (dataSet: IDataSet) => {
    this.data.value = []
    let data = dataSet.data

    if (this._dataSource instanceof RawDataSource) {
      data = this._sortData(data)
      data = this._applyFilter(data)
      dataSet.total = data.length

      data = this._applyPaging(data)
    }

    for (const record of data) {
      this.data.value.push(record)
    }
    this._getPages(dataSet.total)
  }

  gotoPage = async (page: IPage) => {
    const { pageSize, total } = this.pager.value
    const { start: pageStart } = page

    this.pager.value.index =
    pageStart < 0 ? 0 
      : pageStart > total ? total - pageSize
          : pageStart

    await this.getData()
  }

  nextPage = async () => {
    const { pageSize, index } = this.pager.value

    await this.gotoPage(<IPage>{
      start: index + pageSize
    })
  }

  previousPage = async () => {
    const { pageSize, index } = this.pager.value

    await this.gotoPage(<IPage>{
      start: index - pageSize
    })
  }

  _applyFilter = (data: object[]) => {
    if (this._filters.length === 0) { return data }

    return data.filter((row:object) => {
      let isMatch = false
      for (const { field, searchValue, operator } of this._filters) {
        const value: string = (row[field as keyof object] || '')
        const searchStr = searchValue.toString()

        switch (operator) {
          case Operators.CONTAINS:
            isMatch = value.includes(searchStr)
            break
          case Operators.EQUALS:
            isMatch = value === searchStr
            break
        }

        if (isMatch) break
      }

      return isMatch
    })
  }

  _applyPaging = (data: object[]) => {
    const { index, pageSize } = this.pager.value
    return data.slice(index, index + pageSize)
  }

  _getPages = (totalRecordsCount: number) => {
    this.pager.value.total = totalRecordsCount
    const pages: Array<{
      pageNumber: number,
      start: number,
      selected: boolean
    }> = []
    const { pageSize, index, total } = this.pager.value
    let start = 0
    let pageNumber = 1

    do {
      pages.push({
        pageNumber,
        start,
        selected: index === start
      })

      pageNumber++
      start += pageSize
    }
    while (start < total)

    this.pager.value.pages = pages
  }

  _sortData = (data: object[]) => {
    if (!this.sorter)
      return data

    const { field, direction } = this.sorter

    if (field && direction) {
      data = data.sort((a:object, b:object) => {
        switch (direction) {
          case Directions.ASCENDING:
            return a[field as keyof object] < b[field as keyof object] ? -1 : 1
          case Directions.DESCENDING:
            return b[field as keyof object] < a[field as keyof object] ? -1 : 1
        }

        return 0
      })
    }

    return data
  }
}

export { Grid }
