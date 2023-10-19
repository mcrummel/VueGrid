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
      format: (value) => value,
      sortDirection: null,
      dataType: String,
      filterable: false
    }

    // properties
    this.namespaced = true
    this.loading = ref([])
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
  sortRecords = async (records, sort) => {
    const compare = sort.direction === 'ASC'
      ? (a, b) => a[sort.field] > b[sort.field] ? 1 : a[sort.field] < b[sort.field] ? -1 : 0
      : (a, b) => a[sort.field] < b[sort.field] ? 1 : a[sort.field] > b[sort.field] ? -1 : 0

    await records.sort(compare)
  }

  sort = async (column) => {
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

    await this.getData()
  }

  clearSorts = () => this.columns.value.forEach(c => {
    c.sortDirection = null
  })

  filterData = async (searchValue) => {
    this._filter = []
    this.pager.value.index = 0

    if (searchValue === undefined || searchValue === null) {
      return await this.getData()
    }

    for (const { filterable, dataType, field } of this.columns.value) {
      if (!filterable) continue

      switch (dataType) {
        case String:
          this._filter.push(`contains(${field}, '${searchValue.replace(/[']/g, "''")}')`)
          break
        case Number:
          if (!isNaN(searchValue)) {
            this._filter.push(`${field} eq ${searchValue}`)
          }
          break
        default:
          break
      }
    }

    await this.getData()
  }

  getData = async () => {
    this.loading.value = true
    await fetch(this._buildUrl(this._rootUrl, this._filter, this.pager.value, this.sorter), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((response) => response.json())
      .then(response => this._loadData(response))
      .catch(console.log)
      .finally(() => {
        this.loading.value = false
      })
  }

  gotoPage = async (page) => {
    const { pageSize, total } = this.pager.value

    this.pager.value.index =
      page.start < 0
        ? 0
        : page.start > total
          ? total - pageSize
          : page.start

    await this.getData()
  }

  nextPage = async () => {
    const { pageSize, index } = this.pager.value

    await this.gotoPage({
      start: index + pageSize
    })
  }

  previousPage = async () => {
    const { pageSize, index } = this.pager.value

    await this.gotoPage({
      start: index - pageSize
    })
  }

  _buildUrl = (root, filters, pager, sort) => {
    const query = {
      $count: true,
      $select: this.columns.value.map(c => c.field).join(',')
    }

    // paging
    if (pager.pageSize) { query.$top = pager.pageSize }
    if (pager.index) { query.$skip = pager.index }

    // sorting
    if (sort.field) { query.$orderby = `${sort.field} ${sort.direction}` }

    // filtering
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
    while (start < total)

    this.pager.value.pages = pages
  }
}

export default Grid
