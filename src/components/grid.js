import { ref } from 'vue'

class Grid {
  #_dataSource
  #_mapResponse
  #_filters

  constructor (dataSource, columns, mapResponse, pageSize) {
    this.#_dataSource = dataSource
    this.#_mapResponse = mapResponse || ((data) => data)
    this.#_filters = []

    const _columnTemplate = {
      field: '',
      title: null,
      format: (value) => value,
      sortDirection: null,
      columnType: String,
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
    this.#_filters = []
    this.pager.value.index = 0

    if (searchValue !== undefined && searchValue !== null) {
      for (const { filterable, columnType, field } of this.columns.value) {
        if (!filterable) continue

        switch (columnType) {
          case String:
            this.#_filters.push({
              field,
              searchValue,
              operator: 'contains'
            })
            break
          case Number:
            if (!isNaN(searchValue)) {
              this.#_filters.push({
                field,
                searchValue,
                operator: 'eq'
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

    const dataSourceType = this.#_dataSource.type || 'raw'

    if (dataSourceType.toLowerCase() === 'odata') {
      await fetch(this.#_buildOdataUrl(this.#_dataSource.rootUrl, this.pager.value, this.sorter), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
        .then((response) => response.json())
        .then(response => {
          const mappedResponse = this.#_mapResponse(response)
          this.loadData(mappedResponse)
        })
        .catch(console.log)
        .finally(() => {
          this.loading.value = false
        })
    } else if (dataSourceType.toLowerCase() === 'raw') {
      this.loadData({
        total: this.#_dataSource.data.length,
        data: [...this.#_dataSource.data]
      })

      this.loading.value = false
    }
  }

  loadData = (dataSet) => {
    this.data.value = []
    let data = dataSet.data

    if (this.#_dataSource.type === 'raw') {
      data = this.#_sortData(data)
      data = this.#_applyFilter(data)
      dataSet.total = data.length

      data = this.#_applyPaging(data)
    }

    for (const record of data) {
      this.data.value.push(record)
    }
    this.#_getPages(dataSet.total)
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

  #_buildOdataUrl = (root, pager, sort) => {
    const query = {
      $count: true,
      $select: this.columns.value
        .filter(c => !this.#_strIsNullOrWhitespace(c.field))
        .map(c => c.field)
        .join(',')
    }

    // paging
    if (pager.pageSize) { query.$top = pager.pageSize }
    if (pager.index) { query.$skip = pager.index }

    // sorting
    if (sort.field) { query.$orderby = `${sort.field} ${sort.direction}` }

    // filtering
    if (this.#_filters.length > 0) {
      query.$filter = this.#_filters.map(({ field, searchValue, operator }) => {
        let filter

        switch (operator) {
          case 'contains':
            filter = `contains(${field}, '${searchValue.replace(/[']/g, "''")}')`
            break
          case 'eq':
            filter = `${field} eq ${searchValue}`
            break
        }

        return filter
      }).join(' or ')
    }

    const strQuery = Object.entries(query)
      .map(([key, value]) => {
        return `${key}=${value}`
      })
      .join('&')

    return `${root}?${strQuery}`
  }

  #_applyFilter = (data) => {
    if (this.#_filters.length === 0) { return data }

    return data.filter(row => {
      let isMatch = false
      for (const { field, searchValue, operator } of this.#_filters) {
        const value = (row[field] || '').toString()

        switch (operator) {
          case 'contains':
            isMatch = value.includes(searchValue)
            break
          case 'eq':
            isMatch = value === searchValue.toString()
            break
        }

        if (isMatch) break
      }

      return isMatch
    })
  }

  #_applyPaging = (data) => {
    const { index, pageSize } = this.pager.value
    return data.slice(index, index + pageSize)
  }

  #_getPages = (totalRecordsCount) => {
    this.pager.value.total = totalRecordsCount
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

  #_sortData = (data) => {
    const { field, direction } = this.sorter

    if (field && direction) {
      data = data.sort((a, b) => {
        switch (direction) {
          case 'ASC':
            return a[field] < b[field] ? -1 : 1
          case 'DESC':
            return b[field] < a[field] ? -1 : 1
        }

        return 0
      })
    }

    return data
  }

  #_strIsNullOrWhitespace = (value) => value === null || value === undefined || value.trim() === ''
}

export default Grid
