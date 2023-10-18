import { ref } from 'vue'

class Grid {
  #_rootUrl
  #_mapResponse

  constructor (rootUrl, columns, mapResponse, pageSize) {
    this._rootUrl = rootUrl
    this._mapResponse = mapResponse || ((data) => data)

    const _columnTemplate = {
      field: '',
      title: null,
      formatter: (value) => value,
      sortDirection: null
    }

    // properties
    this.namespaced = true
    this.columns = ref([])
    this.data = ref([])
    this.filter = {}
    this.sorter = {}
    this.pager = ref({
      pageSize: pageSize || 10,
      total: 0,
      index: 0
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

  getData = async (sort) => {
    await fetch(this._getUrl(this._rootUrl, this.filter, this.pager, this.sorter), {
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

  _getUrl = (root, filter, pager, sort) => {
    const query = {
      $count: true,
      $top: this.pager.value.pageSize,
      $skip: this.pager.value.index
    }

    if (sort.field) { query.$orderby = `${sort.field} ${sort.direction}` }

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
  }
}

export default Grid
