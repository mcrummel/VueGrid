import { ref } from 'vue'

class Grid {
  #_rootUrl
  #_mapResponse
  #_filter

  constructor (rootUrl, columns, mapResponse, pageSize) {
    this._rootUrl = rootUrl
    this._mapResponse = mapResponse || ((data) => data)
    this._filter = []

    const _columnTemplate = {
      field: '',
      title: null,
      formatter: (value) => value,
      sortDirection: null,
      dataType: String,
      filterable: false
    }

    // properties
    this.namespaced = true
    this.columns = ref([])
    this.data = ref([])
    this.sorter = {}
    this.pager = ref({
      pageSize: pageSize || 10,
      total: 0,
      index: 0,
      pages: []
    })

    // init columns
    columns.forEach(c => {
      this.columns.value.push({ ..._columnTemplate, ...c })
    })
  }

  // public methods
  sortRecords = (records, sort) => {
    const compare = sort.direction === 'ASC'
      ? (a, b) => a[sort.field] > b[sort.field] ? 1 : a[sort.field] < b[sort.field] ? -1 : 0
      : (a, b) => a[sort.field] < b[sort.field] ? 1 : a[sort.field] > b[sort.field] ? -1 : 0

    return records.sort(compare)
  }

  sort = (column) => {
    const { sortDirection } = column
    column.sortDirection =
        sortDirection === 'ASC'
          ? 'DESC'
          : sortDirection === 'DESC' ? null : 'ASC'

    this.sorter = column.sortDirection
      ? {
          field: column.field,
          direction: column.sortDirection
        }
      : {}

    this.getData()
  }

  clearSorts = () => this.columns.value.forEach(c => {
    c.sortDirection = null
  })

  filterData = async (searchValue) => {
    this._filter = []

    if (searchValue === undefined || searchValue === null) {
      return await this.getData()
    }

    console.log(searchValue)

    for (const column of this.columns.value) {
      if (!column.filterable) continue

      switch (column.dataType) {
        case String:
          this._filter.push({
            field: column.field,
            operator: 'contains',
            value: searchValue
          })
          break
        case Number:
          this._filter.push({
            field: column.field,
            operator: 'eq',
            value: searchValue
          })
          break
        default:
          break
      }
    }

    await this.getData()
  }

  getData = async () => {
    await fetch(this._getUrl(this._rootUrl, this._filter, this.pager.value, this.sorter), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((response) => response.json())
      .then(response => this._loadData(response))
      .catch(console.log)
  }

  gotoPage = (page) => {
    const { pageSize, total } = this.pager.value

    this.pager.value.index =
      page.start < 0
        ? 0
        : page.start > total
          ? total - pageSize
          : page.start

    this.getData()
  }

  nextPage = () => {
    const { pageSize, index } = this.pager.value

    this.gotoPage({
      start: index + pageSize
    })
  }

  previousPage = () => {
    const { pageSize, index } = this.pager.value

    this.gotoPage({
      start: index - pageSize
    })
  }

  _getUrl = (root, filter, pager, sort) => {
    const query = {
      $count: true
    }

    // paging
    if (pager.pageSize) { query.$top = pager.pageSize }
    if (pager.index) { query.$skip = pager.index }

    // sorting
    if (sort.field) { query.$orderby = `${sort.field} ${sort.direction}` }

    // filtering
    const filters = []
    for (const f of filter) {
      switch (f.operator) {
        case 'contains':
          filters.push(`contains(${f.field}, '${f.value}')`)
          break
        default:
          filters.push(`${f.field} ${f.operator} '${f.value}'`)
      }
    }

    if (filters.length > 0) {
      query.$filter = filters.join(' or ')
    }

    const strQuery = Object.entries(query)
      .map(([key, value]) => {
        return `${key}=${value}`
      })
      .join('&')

    return `${root}?${strQuery}`
  }

  _loadData = (responObj) => {
    const resp = this._mapResponse(responObj)
    this.pager.value.total = resp.total

    this.data.value = []
    const records = resp.data
    for (const record of records) {
      this.data.value.push(record)
    }

    this._getPages()
  }

  _getPages = () => {
    const pages = []
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
    while ((start + pageSize) < total)

    this.pager.value.pages = pages
  }
}

export default Grid
